# Generated by Django 3.1.7 on 2021-03-26 17:52

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20210326_1637'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='createdAt',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
