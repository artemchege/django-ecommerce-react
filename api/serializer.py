from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer): 
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    
    class Meta: 
        model = User 
        fields = ['_id', 'username', 'email', 'name', 'isAdmin']

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name 

    def get__id(self, obj): 
        return obj.id

    def get_isAdmin(self, obj): 
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta: 
        model = User
        fields = ['_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):
     class Meta: 
        model = Review 
        fields = '__all__'   


class ProductSerializer(serializers.ModelSerializer): 
    reviews = serializers.SerializerMethodField(read_only=True)
    class Meta: 
        model = Product 
        fields = '__all__'

    def get_reviews(self, obj):
        review = obj.review_set.all()
        serializer = ReviewSerializer(review, many=True)
        return serializer.data


class ShippingAddressSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = ShippingAddress 
        fields = '__all__'


class OrderItemsSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = OrderItem 
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer): 
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta: 
        model = Order 
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemsSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try: 
            address = ShippingAddress.objects.get(order=obj)
            serializer = ShippingAddressSerializer(address, many=False)
            return serializer.data
        except:
            address = False

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data




















