# Generated by Django 2.2.10 on 2022-01-04 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0009_leaveapplication'),
    ]

    operations = [
        migrations.AddField(
            model_name='leaveapplication',
            name='status',
            field=models.CharField(choices=[('REQUEST', 'Request'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected')], default='APPROVED', max_length=15),
        ),
    ]
