# Generated by Django 4.2.3 on 2023-11-12 16:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0014_abonnement_heureslastmsg_abonnement_joursmsg_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='abonnement',
            old_name='joursMsg',
            new_name='joursLastMsg',
        ),
    ]