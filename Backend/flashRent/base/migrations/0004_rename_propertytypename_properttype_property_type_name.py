# Generated by Django 5.0.6 on 2024-06-28 16:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_alter_user_phone_number'),
    ]

    operations = [
        migrations.RenameField(
            model_name='properttype',
            old_name='propertyTypeName',
            new_name='property_type_Name',
        ),
    ]
