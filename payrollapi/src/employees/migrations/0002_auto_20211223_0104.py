# Generated by Django 2.2.10 on 2021-12-23 00:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='hierarchy',
            field=models.ManyToManyField(blank=True, related_name='employee_hierarchy', to='company.Hierarchy'),
        ),
        migrations.AlterField(
            model_name='employee',
            name='leaves',
            field=models.ManyToManyField(blank=True, related_name='employee_hierarchy', to='company.Leave'),
        ),
    ]
