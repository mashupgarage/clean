# Generated by Django 4.2.6 on 2024-06-22 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dispenser', '0008_vendingmachine_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vendingmachine',
            name='port',
            field=models.IntegerField(default=8000, help_text='The IP port number of the machine.'),
        ),
        migrations.AlterField(
            model_name='vendingmachine',
            name='status',
            field=models.CharField(choices=[('idle', 'Idle'), ('cleaning', 'Cleaning'), ('serving', 'Serving'), ('error', 'Error'), ('setup', 'Setup')], default='idle', help_text='The status of the vending machine.', max_length=20),
        ),
        migrations.AlterField(
            model_name='vendingmachine',
            name='versionH',
            field=models.IntegerField(default=0, help_text='Hardware version.'),
        ),
        migrations.AlterField(
            model_name='vendingmachine',
            name='versionS',
            field=models.IntegerField(default=0, help_text='Software version.'),
        ),
    ]
