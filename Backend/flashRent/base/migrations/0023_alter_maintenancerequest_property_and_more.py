# Generated by Django 5.0.6 on 2024-07-23 15:52

import address.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('address', '0003_auto_20200830_1851'),
        ('base', '0022_payment_mpesa_receipt_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='maintenancerequest',
            name='property',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.property'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='property',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='payments', to='base.property'),
        ),
        migrations.AlterField(
            model_name='property',
            name='address',
            field=address.models.AddressField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='address.address'),
        ),
        migrations.AlterField(
            model_name='tenant',
            name='property',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='properties_leased', to='base.property', verbose_name='Property Leased'),
        ),
    ]