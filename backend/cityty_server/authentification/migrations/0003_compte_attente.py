# Generated by Django 4.2.3 on 2023-10-22 22:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentification', '0002_rename_product_compte'),
    ]

    operations = [
        migrations.CreateModel(
            name='Compte_attente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=150)),
                ('password', models.CharField(blank=True, max_length=50, null=True)),
                ('code', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
    ]