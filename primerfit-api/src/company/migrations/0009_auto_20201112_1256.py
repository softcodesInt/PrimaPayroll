# Generated by Django 2.2.10 on 2020-11-12 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0008_company_staff_used'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='staff_used',
            field=models.IntegerField(default=0, null=True),
        ),
    ]