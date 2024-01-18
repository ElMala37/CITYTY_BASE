from django.contrib import admin
from django.urls import path, include
from authentification.views import InscriptionView, VerificationCodeView, ForgotPassword, ResetPassword, SignIn
from profil_page.views import map_city, map_city_nearby, Subscription, change_username, addcity
from profil_page.views import User_profile
from chat.views import get_sub, get_msg, Lu

urlpatterns = [
    path("chat/", include("chat.urls")),
    path('admin/', admin.site.urls),
    path('api/inscription/', InscriptionView, name='inscription-api'),
    path('api/verification_code/', VerificationCodeView, name='verification_code-api'),
    path('api/forgotpassword/', ForgotPassword, name='forgotpassword-api'), 
    path('api/resetpassword/', ResetPassword, name='resetpassword-api'),
    path('api/signin/', SignIn, name='signin-api'),
    path('api/user_profil/', User_profile, name='user_profil-api'),
    path('api/city_map/', map_city, name='city_map-api'),
    path('api/city_map_nearby/', map_city_nearby, name='city_map_nearby-api'),
    path('api/city_map/subscribe', Subscription, name='city_map_subscribe-api'),
    path('api/get_sub/',get_sub,name='get_sub'),
    path('api/get_msg/',get_msg,name='get_msg'),
    path('api/change_username/',change_username,name='change_username'),
    path('api/addcity/',addcity,name='addcity'),
    path('api/lu/',Lu,name='lu')
]