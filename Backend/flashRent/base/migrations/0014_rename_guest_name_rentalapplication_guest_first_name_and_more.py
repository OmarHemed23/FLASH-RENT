# Generated by Django 5.0.6 on 2024-07-03 09:55

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0013_alter_rentalapplication_applicant_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='rentalapplication',
            old_name='guest_name',
            new_name='guest_first_name',
        ),
        migrations.AddField(
            model_name='rentalapplication',
            name='guest_last_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='rentalapplication',
            name='otp_expiry',
            field=models.DateTimeField(default=datetime.datetime(2024, 7, 3, 10, 5, 0, 650080, tzinfo=datetime.timezone.utc)),
        ),
    ]
