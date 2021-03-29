from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import *
from api.serializer import ProductSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class GetProducts(APIView):
    def get(self, request):
        query = request.query_params.get("keyword")

        if query == None:
            query = ''

        products = Product.objects.filter(name__icontains=query)

        page = request.query_params.get("page")
        paginator = Paginator(products, 8)

        try: 
            products = paginator.page(page)
        except PageNotAnInteger:
            products = paginator.page(1)
        except EmptyPage:
            products = paginator.page(paginator.num_pages)

        if page == None: 
            page = 1 

        try:
            page = int(page)
        except ValueError:
            page = 1

        serializer = ProductSerializer(products, many=True)
        return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})


class GetProduct(APIView):
    def get(self, request, id):

        product = Product.objects.get(_id=id)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)


class CreateProduct(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        user = request.user

        product = Product.objects.create(
            user = user, 
            name = 'Sample name', 
            price = 0, 
            brand = 'sample brand', 
            countInStock = 0, 
            category = 'sample category', 
            description = 'sample discription'
        )

        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)


class updateProduct(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        data = request.data 

        product = Product.objects.get(_id=pk)
        product.name = data['name']
        product.price = data['price']
        product.brand = data['brand']
        product.countInStock = data['countInStock']
        product.category = data['category']
        product.description = data['description']

        product.save()

        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)


class deleteProduct(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        product = Product.objects.get(_id=pk)
        product.delete()
        return Response('product was deleted')


class uploadImage(APIView): 
    def post(self, request):
        data = request.data
        product_id = data['product_id']
        product = Product.objects.get(_id=product_id)
        product.image = request.FILES.get('image')

        product.save()

        return Response('Image was uploaded')

class createProductView(APIView): 
    permission_classes = [IsAuthenticated]
    def post(self, request, id):
        user = request.user
        data = request.data
        product = Product.objects.get(_id=id)

        # review already exists 
        alreadyExists = product.review_set.filter(user=user).exists()
        if alreadyExists: 
            content = {'detail' : 'product already reviewed'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # there is no rating 
        rating = data.get('rating')
        if not rating: 
            content = {'detail' : 'please select a rating'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # create review
        
        review = Review.objects.create(
            user=user, 
            product=product, 
            name=user.first_name, 
            rating=data['rating'],
            comment=data['comment']
            )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0 
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response({'detail': 'Review Added'})

class getTopProducts(APIView): 
    def get(swlf, request): 
        products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)








