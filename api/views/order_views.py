from django.shortcuts import render, redirect
from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import *
from api.serializer import ProductSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
import stripe 
from django.conf import settings
from django.urls import reverse
from datetime import datetime


class addOrderItems(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user 
        data = request.data 
        print('data', data)

        # это очень небезопасно доставать напрямую, ловятся ошибки keyError. 
        orderItems = data['orderItems']
        print('len', len(orderItems))
        if not orderItems or len(orderItems) == 0:
            return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)
        else: 
            # create an order 
            order = Order.objects.create(
                user=user, 
                paymentMethod = data['paymentMethod'], 
                taxPrice = data['taxPrice'],
                shippingPrice=data['shippingPrice'], 
                totalPrice = data['totalPrice']
            )

            # create shipping address
            shipping = ShippingAddress.objects.create(
                order=order,
                address=data['shippingAddress']['address'], 
                city=data['shippingAddress']['city'], 
                postalCode=data['shippingAddress']['postalCode'], 
                country=data['shippingAddress']['country']
            )

            # create order items 
            for i in orderItems:
                product = Product.objects.get(_id=i['product'])
                item = OrderItem.objects.create(
                    product = product, 
                    order = order, 
                    name = product.name,
                    qty = i['qty'], 
                    price = i['price'],
                    image = product.image.url
                )

                # update in stock amount
                product.countInStock -= item.qty 
                product.save()

            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)


class getOrderById(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        user = request.user 
        try: 
            order = Order.objects.get(_id=pk)
            if user.is_staff or order.user == user:
                serializer = OrderSerializer(order, many=False)
                return Response(serializer.data)
            else:
                return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'detail': 'Order do not exist'}, status=status.HTTP_400_BAD_REQUEST)


class getMyOrders(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        orders = user.order_set.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class createCheckoutSession(APIView):
    def post(self, request): 
        stripe.api_key = settings.STRIPE_SECRET_KEY

        # wrap in try/catch, return response when error (later)
        order_id = str(request.data.get('order'))

        success_url = 'http://' + request.META['HTTP_HOST'] + reverse('finish-order') + '?order=' + order_id + '&session_id={CHECKOUT_SESSION_ID}'
        fail_url = 'http://' + request.META['HTTP_HOST'] + reverse('finish-order') + '?order=' + order_id + '&session_id={CHECKOUT_SESSION_ID}'

        # wrap in try/catch, return response when error (later)
        order = Order.objects.get(_id=order_id)
        # wrap in try/catch, return response when error (later)
        items = order.orderitem_set.all()

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            # add later taxes and delivery rate
            line_items=[{
              'price_data': {
                'currency': 'usd',
                'product_data': {
                  'name': item.name,
                },
                'unit_amount': int(item.price)*100,
              },
              'quantity': item.qty,
            } for item in items],
            mode='payment',
            success_url=success_url,
            cancel_url=fail_url,
            client_reference_id=order_id, 
        )
                    
        return Response({'id': session.id})


class finishOrder(APIView):
    def get(self, request):
        # wrap in try/catch, return response when error (later)
        session_id = request.GET.get('session_id')
        # wrap in try/catch, return response when error (later)
        order_id = request.GET.get('order')

        if session_id:
            try:
                session = stripe.checkout.Session.retrieve(session_id)
            except Exception as e:  # InvalidRequestError
                return Response({'Invalid Stripe session'}, status=status.HTTP_400_BAD_REQUEST)

            if session.payment_status == 'paid':
                order = Order.objects.get(_id=session.client_reference_id)
                order.isPaid = True 
                order.paidAt = datetime.now()
                order.save()

                # change it later when react + django finaly combined
                return redirect('http://127.0.0.1:3000/order/' + order_id)
            else:
                # add error field to Order model, edir error field here (later)
                return redirect('http://127.0.0.1:3000/order/' + order_id)


class getOrders(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class updateOrderToDelivered(APIView):
    permission_classes = [IsAdminUser]
    def put(self, request, pk):
        order  = Order.objects.get(_id=pk)
        order.isDelivered = True 
        order.deliveredAt = datetime.now()

        order.save() 

        return Response('Order was delivered')







