# Generated by Django 5.0.6 on 2024-07-13 16:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0016_alter_rentalapplication_otp_expiry_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rentalapplication',
            name='otp',
        ),
        migrations.RemoveField(
            model_name='rentalapplication',
            name='otp_expiry',
        ),
        migrations.CreateModel(
            name='MaintenanceRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('issue', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('image1', models.ImageField(blank=True, null=True, upload_to='maintenance_requests/')),
                ('image2', models.ImageField(blank=True, null=True, upload_to='maintenance_requests/')),
                ('reported_date', models.DateTimeField(auto_now_add=True)),
                ('completed_date', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Completed', 'Completed')], default='Pending', max_length=20)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.property')),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.tenant')),
            ],
        ),
    ]
