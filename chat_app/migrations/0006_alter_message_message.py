# Generated by Django 4.1.2 on 2022-11-01 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_app', '0005_message'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='message',
            field=models.TextField(),
        ),
    ]
