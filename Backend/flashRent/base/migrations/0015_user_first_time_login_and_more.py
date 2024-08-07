# Generated by Django 5.0.6 on 2024-07-04 10:31

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0014_rename_guest_name_rentalapplication_guest_first_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='first_time_login',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='rentalapplication',
            name='otp_expiry',
            field=models.DateTimeField(default=datetime.datetime(2024, 7, 4, 10, 41, 0, 5053, tzinfo=datetime.timezone.utc)),
        ),
    ]
