# Generated by Django 2.2.10 on 2021-12-22 21:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20211220_2027'),
    ]

    operations = [
        migrations.AddField(
            model_name='adminuser',
            name='license_code',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
