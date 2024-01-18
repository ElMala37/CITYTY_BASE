from django.db import models
from profil_page.models import City
from django.contrib.auth.models import User

class Message(models.Model):
    room = models.CharField(max_length=255)
    user = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Abonnement(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    city_id=models.ForeignKey(City, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True, null=True)
    surname = models.CharField(max_length=255, blank=True, null=True)
    ville = models.CharField(max_length=255, blank=True, null=True)
    vue = models.BooleanField(default=False)
    date_ajout = models.DateTimeField(auto_now_add=True)
    lastMsg = models.ForeignKey(Message, on_delete=models.DO_NOTHING,blank=True, null=True)
    LastMsg = models.TextField(blank=True, null=True)
    userLastMsg = models.CharField(max_length=255,blank=True, null=True)
    dateLastMsg = models.DateTimeField(blank=True, null=True)


    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.city_id.name
        if not self.surname:
            self.surname = self.city_id.name
        if not self.ville:
            self.ville = self.city_id.ville
        super().save(*args, **kwargs)