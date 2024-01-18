from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
import random
from django.conf import settings
from .models import Compte_attente
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import default_token_generator
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.hashers import make_password,check_password #pour haché le password
from django.contrib.auth import authenticate, login


@api_view(['POST'])
def InscriptionView(request):
    if request.method == 'POST':
        #Recuperation des données
        email = request.data['email']
        password = request.data['password']

        #verifie si un compte n'existe pas déjà
        try:
            user = get_object_or_404(User, email=email)
            if email==user.email:
                return Response('', status=status.HTTP_400_BAD_REQUEST)
        except:
            pass

        # Générez un code de validation
        validation_code = str(random.randint(1000, 9999))
        #print('code :',validation_code)

        #Enregistre dans les comptes en attente et remplace l'ancienne demande de creation de compte
        try:
            compte_attente_old = get_object_or_404(Compte_attente, email=email)
            compte_attente_old.delete()
        except:
            pass
            #print('email non trouvé dans la base')

        # Hacher le mot de passe
        hashed_password = make_password(password)

        compte_attente = Compte_attente(
                    email=email,
                    password=hashed_password,
                    code=validation_code)
        compte_attente.save()

        #Envoie d'un mail:
        sujet = 'Verification code'
        message = 'Hello,\n\nThe verification code is '+validation_code+'\n\nCityty'
        de = 'cityty.france@gmail.com'  # Adresse e-mail expéditeur
        destinataires = [email]

        send_mail(sujet, message, de, destinataires, fail_silently=False)

        return Response({'message': 'Code de validation envoyé par e-mail'}, status=status.HTTP_201_CREATED)
        
@api_view(['POST'])
def VerificationCodeView(request):
    if request.method == 'POST':
        code=request.data['verification_code']
        email=request.data['email']
        compte_attente = Compte_attente.objects.get(email=email)
        if compte_attente.code==code :
            user = User(
                    username=email,
                    email=email,
                    password=compte_attente.password)
            user.save()
            compte_attente_old = get_object_or_404(Compte_attente, email=email)
            compte_attente_old.delete()
            return Response('', status=status.HTTP_201_CREATED)
        else:
            return Response('', status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def ForgotPassword(request):
    if request.method == 'POST':
        email=request.data['email']
        user = get_object_or_404(User, email=email)
        if email==user.email:
            print("cet email à été trouvé dans les comptes")
            # Générez un jeton unique
            token = default_token_generator.make_token(user)
            print(token)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            print(uid)
            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
            # Envoyez l'e-mail avec le lien de réinitialisation
            send_mail(
                'Réinitialisation de mot de passe',
                f'Lien pour réinitialiser le mot de passe : {reset_link}',
                'cityty@gmail.com',
                [email],
                fail_silently=False,
            )
            return Response('', status=status.HTTP_201_CREATED)
        else:
            print("cet email n'est associé à aucun compte")
            return Response('', status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def ResetPassword(request):
    if request.method == 'POST':
        token = request.data['token']
        uidb64 = request.data['uid']
        print('token',token)
        print('uid',uidb64)
        # Décoder uidb64
        uid = urlsafe_base64_decode(uidb64).decode()
        try:
            user = User.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):#checker le token
                # Le jeton est valide, réinitialisez le mot de passe
                password = request.data['new_password']
                # Hacher le mot de passe
                hashed_password = make_password(password)
                user.password=hashed_password#ne pas mettre .set_password() car ça le hash une deuxieme fois
                user.save()
                return Response('', status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            pass
    return Response('', status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def SignIn(request):
    if request.method == 'POST':
        email=request.data['email']
        password=request.data['password']
        try:
            user_potential=User.objects.filter(email=email)[0]
            print(user_potential.username)
            # Authentifiez l'utilisateur
            user = authenticate(request, username=user_potential.username, password=password)#obligé d'utiliser username et password
            if user is not None:
                login(request, user)  # Connectez l'utilisateur
                token, created = Token.objects.get_or_create(user=user)
                #print(created)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Mot de passe incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Mot de passe incorrect.'}, status=status.HTTP_400_BAD_REQUEST)


