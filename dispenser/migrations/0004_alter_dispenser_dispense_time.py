# Generated by Django 4.2.6 on 2024-06-05 04:15

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("dispenser", "0003_alter_drinkdispensingprocess_dispenser_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="dispenser",
            name="dispense_time",
            field=models.FloatField(default=0.0),
        ),
    ]