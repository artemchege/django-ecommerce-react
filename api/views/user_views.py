from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import *
from api.serializer import ProductSerializer, UserSerializer, UserSerializerWithToken
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password


class GetUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)


class updateUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user

        data = request.data 

        user.first_name = data['name']
        user.username = data['email']
        user.email = data['email']

        if data['password'] != '':
            user.password = make_password(data['password'])

        user.save()

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)


class registerUser(APIView):
    def post(self, request):
        data = request.data
        print('data', data)
        print('post', request.POST)

        try:
            user = User.objects.create(
                first_name =data['name'],
                username = data['email'],
                email = data['email'],
                password = make_password(data['password'])
            )

            serializer = UserSerializerWithToken(user, many=False)
            return Response(serializer.data)
        except:
            message = {'detail': 'User with this email already exists'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


class GetUsers(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        # print('serializer.data', serializer)

        for key, value in serializer.items():
            data[key] = value

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class deleteUser(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        user = User.objects.get(id=pk)
        user.delete()
        return Response('user was deleted')


class GetUserById(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, id):
        # weak spot, wrap try/catch later
        user = User.objects.get(id=id)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)


class updateUserById(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        print('data', request.data)
        # weak spot, wrap try/catch later
        user = User.objects.get(id=pk)

        data = request.data 

        user.first_name = data['name']
        user.username = data['email']
        user.email = data['email']
        user.is_staff = data['isAdmin']

        user.save()

        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)



