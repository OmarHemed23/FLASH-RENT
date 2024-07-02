# Generated by Django 5.0.6 on 2024-07-02 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_alter_property_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='status',
            field=models.CharField(choices=[('Available', 'Available'), ('Occupied', 'Occupied'), ('Under Renovation', 'Under Renovation')], default='Available', max_length=20),
        ),
    ]
