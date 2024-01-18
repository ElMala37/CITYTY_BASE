from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from .serializers import UserSerializer, CitySerializer, AbonnementSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import City
from chat.models import Abonnement, Message
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.core.mail import send_mail

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def User_profile(request):
    if request.method == 'GET':
        user = request.user  # Récupère l'utilisateur à partir du jeton d'accès
        #print(user)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def map_city(request):
    if request.method == 'GET':
        user = request.user  # Récupère l'utilisateur à partir du jeton d'accès
        departement = request.GET.get('departement')  # Récupérez le paramètre de l'URL
        #print(departement)
        #city = City.objects.all()  # Récupère tous les objets City
        city = City.objects.filter(code_postal__startswith=departement)
        city_serializer = CitySerializer(city, many=True)  # Sérialise la liste d'objets City
        # Récupérer les objets Abonnement
        abonnements = Abonnement.objects.filter(user_id =user)  # Par exemple, récupérez les abonnements de l'utilisateur
        abonnement_serializer = AbonnementSerializer(abonnements, many=True)  # Sérialiser les objets Abonnement
        data = {
            'city': city_serializer.data,
            'abonnements': abonnement_serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def map_city_nearby(request):
    if request.method == 'GET':
        user = request.user  # Récupère l'utilisateur à partir du jeton d'accès
        latitude = float(request.GET.get('lat'))  # Récupérez le paramètre de l'URL
        longitude = float(request.GET.get('lng'))
        distance = float(request.GET.get('dis'))
        #print("latitude : ",latitude)
        #print("longitude : ",longitude)
        #distance vaut 10km ou 20km ou 30km ou 40km
        distance_degrees = distance / 111  # Distance en degrés (approximative)

        # Calcul des valeurs minimales et maximales de latitude et longitude
        min_latitude = latitude - distance_degrees
        max_latitude = latitude + distance_degrees
        min_longitude = longitude - distance_degrees
        max_longitude = longitude + distance_degrees
        cities_in_range = City.objects.filter(
            latitude__range=(min_latitude, max_latitude),
            longitude__range=(min_longitude, max_longitude)
        )
        city_serializer = CitySerializer(cities_in_range, many=True)  # Sérialise la liste d'objets City
        # Récupérer les objets Abonnement
        abonnements = Abonnement.objects.filter(user_id =user)  # Par exemple, récupérez les abonnements de l'utilisateur
        abonnement_serializer = AbonnementSerializer(abonnements, many=True)  # Sérialiser les objets Abonnement
        data = {
            'city': city_serializer.data,
            'abonnements': abonnement_serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)

    # Récupérer le jeton d'accès de l'en-tête Authorization
        #authorization_header = request.META.get('HTTP_AUTHORIZATION')
        #if authorization_header:
            # Extrait le token du header
            #token = authorization_header.split(' ')[1]
            #print('Token d\'accès:', token)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def Subscription(request):
    if request.method == 'POST':
        city_id = request.data['city_id'] #Recuperation des données
        city=get_object_or_404(City, id=city_id)
        user = request.user  # Récupère l'utilisateur à partir du jeton d'accès
        sub = Abonnement.objects.filter(user_id=user, city_id=city)
        #print('sub :',sub,' len :', len(sub))
        if len(sub)>0:
            sub.delete()
            return Response({"Vous n'êtes plus abonné à : "+city.name}, status=status.HTTP_201_CREATED)
        else:
            new_sub = Abonnement(
                        user_id=user,
                        city_id=city
                        )
            new_sub.save()
            try:
                latest_message = Message.objects.filter(room=city_id).order_by('-timestamp').first()
                print(latest_message)
                new_sub.lastMsg=latest_message
                new_sub.LastMsg=latest_message.message
                new_sub.userLastMsg=latest_message.user
                new_sub.dateLastMsg=latest_message.timestamp
            except:
                new_sub.LastMsg="No messages"
                new_sub.dateLastMsg=new_sub.date_ajout
            new_sub.save()
            return Response({"Vous êtes maintenant abonné à : "+city.name}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])   
def change_username(request):
    if request.method=='POST':
        user = request.user
        username = request.data['username'] #Recuperation des données
        users=User.objects.filter(username=username)
        if len(users)>0:
            return Response({"Il y a déjà un utilisateur qui porte ce nom d'utilisateur !"}, status=status.HTTP_201_CREATED)
        else:
            try:
                Message.objects.filter(user=user.username).update(user=username)
                user.username=username
                user.save()#ne pas oublier de sauvegarder le changement
                return Response({"Votre nom d'utilisateur a bien été mis à jour !"}, status=status.HTTP_201_CREATED)
            except:
                return Response({"Votre nom d'utilisateur ne convient pas !"}, status=status.HTTP_201_CREATED)
            

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])   
def addcity(request):
    if request.method=='POST':
        email = request.data['email']
        message_recu = request.data['message']
        try:
            sujet = 'Ajouter un city'
            message = message_recu+'\n\nEnvoyé par :'+email
            de = 'cityty.france@gmail.com'  # Adresse e-mail expéditeur
            destinataires = ['cityty.france@gmail.com']

            send_mail(sujet, message, de, destinataires, fail_silently=False)

            return Response({'Votre demande a été envoyé avec succès !'}, status=status.HTTP_201_CREATED)
        except:
            return Response({'Votre demande a echouée...'}, status=status.HTTP_201_CREATED)
        
    
