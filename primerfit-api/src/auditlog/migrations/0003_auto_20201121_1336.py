# Generated by Django 2.2.10 on 2020-11-21 12:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auditlog', '0002_auto_20201112_2350'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='baselog',
            options={'ordering': ['-timestamp']},
        ),
    ]