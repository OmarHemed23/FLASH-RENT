# Generated by Django 5.0.6 on 2024-07-02 10:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('address', '0003_auto_20200830_1851'),
        ('base', '0008_alter_property_status_alter_user_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='address',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='address.address'),
        ),
    ]
