from django.db import models

# Create your models here.

class City(models.Model):
    latitude=models.FloatField()
    longitude=models.FloatField()
    name=models.CharField(max_length=50, null=False)
    pays=models.CharField(max_length=30, null=False, default='FRANCE')
    ville=models.CharField(max_length=30, null=False)
    code_postal=models.CharField(max_length=10, null=False)
    adresse=models.CharField(max_length=50, null=True)
    
    def __str__(self):
        return self.name