# Generated by Django 2.2.10 on 2021-12-22 22:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0007_holiday'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='taxtable',
            name='company_policy',
        ),
        migrations.AddField(
            model_name='taxtable',
            name='company_policy',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='tax_table_policy', to='company.CompanyPolicy'),
        ),
    ]
