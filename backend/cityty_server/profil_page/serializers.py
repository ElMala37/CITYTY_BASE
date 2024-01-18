from rest_framework import serializers
from django.contrib.auth.models import User
from .models import City
from chat.models import Abonnement, Message
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ('id', 'latitude', 'longitude','name','pays','ville','code_postal')

class AbonnementSerializer(serializers.ModelSerializer):
    joursLastMsg = serializers.SerializerMethodField()
    heuresLastMsg = serializers.SerializerMethodField()
    minLastMsg = serializers.SerializerMethodField()
    secLastMsg = serializers.SerializerMethodField()

    class Meta:
        model = Abonnement
        fields = ('user_id', 'city_id','name','surname','ville','vue','date_ajout','LastMsg','dateLastMsg','userLastMsg','joursLastMsg','heuresLastMsg','minLastMsg','secLastMsg')

    def get_joursLastMsg(self, obj):
        if(obj.dateLastMsg):
            current_time = timezone.now()
            duration = current_time - obj.dateLastMsg
            return int(duration.days)

    def get_heuresLastMsg(self, obj):
        if(obj.dateLastMsg):
            current_time = timezone.now()
            duration = current_time - obj.dateLastMsg
            return int(duration.total_seconds() // 3600)

    def get_minLastMsg(self, obj):
        if(obj.dateLastMsg):
            current_time = timezone.now()
            duration = current_time - obj.dateLastMsg
            return int(duration.total_seconds() // 60)

    def get_secLastMsg(self, obj):
        if(obj.dateLastMsg):
            current_time = timezone.now()
            duration = current_time - obj.dateLastMsg
            return int(duration.seconds)

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'room', 'user','message','timestamp')