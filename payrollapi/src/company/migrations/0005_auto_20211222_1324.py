# Generated by Django 2.2.10 on 2021-12-22 12:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0004_leave_leavecategory'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='leavecategory',
            name='company',
        ),
        migrations.AddField(
            model_name='leavecategory',
            name='company_policy',
            field=models.ManyToManyField(to='company.CompanyPolicy'),
        ),
    ]
