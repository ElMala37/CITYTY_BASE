from django.db import models
   
class Compte_attente(models.Model):
    email=models.EmailField(max_length=150, null=False, blank=False, unique=True)
    password=models.CharField(max_length=50, null=True, blank=True)
    code=models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name