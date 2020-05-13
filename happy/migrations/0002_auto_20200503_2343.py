# Generated by Django 3.0.5 on 2020-05-03 23:43

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('happy', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userhappinessdata',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='userhappinessdata',
            name='exercise',
            field=models.FloatField(verbose_name='Exercise'),
        ),
        migrations.AlterField(
            model_name='userhappinessdata',
            name='happy',
            field=models.IntegerField(verbose_name='Happiness'),
        ),
        migrations.AlterField(
            model_name='userhappinessdata',
            name='metime',
            field=models.FloatField(verbose_name='Alone Time'),
        ),
        migrations.AlterField(
            model_name='userhappinessdata',
            name='sleep',
            field=models.FloatField(verbose_name='Sleep'),
        ),
        migrations.AlterField(
            model_name='userhappinessdata',
            name='social',
            field=models.FloatField(verbose_name='Social'),
        ),
        migrations.AlterField(
            model_name='userhappinessdata',
            name='socialmedia',
            field=models.FloatField(verbose_name='Social Media'),
        ),
        migrations.AlterField(
            model_name='userhappinessdata',
            name='weather',
            field=models.FloatField(verbose_name='Weather'),
        ),
    ]