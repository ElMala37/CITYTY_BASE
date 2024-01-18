from .models import Message
from profil_page.serializers import AbonnementSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Abonnement
from profil_page.views import City
from asgiref.sync import sync_to_async
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from rest_framework.response import Response
from django.db.models import Max
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token

@sync_to_async
def NonLu(room):
    city=get_object_or_404(City, id=room)
    Abonnement.objects.filter(city_id=city).update(vue=False)
    return True

@sync_to_async
def GetTokenUser(token):
    user=Token.objects.get(key=token).user
    return user

@sync_to_async
def save_message(room, user, message):
    # Effectuez ici l'enregistrement des messages dans la base de données
    new_message=Message.objects.create(room=room, user=user, message=message)
    city=get_object_or_404(City, id=room)
    abonnements=Abonnement.objects.filter(city_id=city).update(lastMsg=new_message,LastMsg=new_message.message,userLastMsg=new_message.user,dateLastMsg=new_message.timestamp)
    return new_message.id

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_sub(request):
    if request.method == 'GET':
        user = request.user  # Récupère l'utilisateur à partir du jeton d'accès
        # Récupérer les objets Abonnement
        abonnements = Abonnement.objects.filter(user_id =user)  # Par exemple, récupérez les abonnements de l'utilisateur
        abonnement_serializer = AbonnementSerializer(abonnements, many=True)  # Sérialiser les objets Abonnement
        return Response(abonnement_serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_msg(request):
    if request.method == 'GET':
        user=request.user
        room_name = request.GET.get('room_name')
        city=get_object_or_404(City, id=room_name)
        #print(city)
        abonnement=get_object_or_404(Abonnement, city_id=city, user_id=user)
        abonnement.vue=True
        abonnement.save()
        #print(abonnement.id,abonnement.name,abonnement.vue)
        messages = Message.objects.filter(room=room_name)  # Par exemple, récupérez les abonnements de l'utilisateur
        messages_serializer = MessageSerializer(messages, many=True)  # Sérialiser les objets Abonnement
        return Response(messages_serializer.data, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def Lu(request):
    if request.method == 'POST':
        user=request.user
        room_name = request.data['room_name']
        #print('room_name: ',room_name)
        try:
            city=get_object_or_404(City, id=room_name)
            abo=Abonnement.objects.get(city_id=city,user_id=user)
            abo.vue=True#pour indiquer au notifications qu'on la vue et donc elles vont inverser le True en False
            abo.save()
        except:
            pass
    return Response("", status=status.HTTP_200_OK)    