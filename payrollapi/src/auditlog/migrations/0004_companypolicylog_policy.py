# Generated by Django 2.2.10 on 2021-12-22 11:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_companypolicy'),
        ('auditlog', '0003_companypolicylog'),
    ]

    operations = [
        migrations.AddField(
            model_name='companypolicylog',
            name='policy',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='company.CompanyPolicy'),
        ),
    ]