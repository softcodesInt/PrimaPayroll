# Generated by Django 2.2.10 on 2020-11-09 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0005_auto_20201109_1902'),
    ]

    operations = [
        migrations.AlterField(
            model_name='license',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
