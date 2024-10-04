# dispenser\models.py
from django.core.exceptions import ValidationError
from django.db import models

from .validators import (
    validate_dispenser_image_size,
    validate_drink_image_size,
    validate_image_file_extension,
    validate_machine_image_size,
)


# Path for saving background images of vending machines
def machine_image_upload_path(instance, filename):
    return f"machine/image/{filename}"


# Path for saving images of dispensers
def dispenser_image_upload_path(instance, filename):
    return f"dispenser/image/{filename}"


# Path for saving images of drinks
def drink_image_upload_path(instance, filename):
    return f"drink/image/{filename}"


# Validators
def validate_dispense_time(value):
    if not (0 <= value <= 20):
        raise ValidationError("Dispense time must be between 0 and 20 seconds.")


def validate_temperature(value):
    if not (0 <= value <= 100):
        raise ValidationError("Temperature must be between 0 and 100 degrees Celsius.")


# Constants for choices
SMALL = "Small"
LARGE = "Large"
NOT_DETECTED = "Not Detected"
DETECTED = "Detected"
OFF = False
ON = True

DRINK_SIZE_CHOICES = [
    (SMALL, "Small"),
    (LARGE, "Large"),
]

CUP_STATUS_CHOICES = [
    (NOT_DETECTED, "Not Detected"),
    (DETECTED, "Detected"),
]

# Constants for choices
IDLE = "idle"
CLEANING = "cleaning"
SERVING = "serving"
ERROR = "error"
SETUP = "setup"

MACHINE_STATUS_CHOICES = [
    (IDLE, "Idle"),
    (CLEANING, "Cleaning"),
    (SERVING, "Serving"),
    (ERROR, "Error"),
    (SETUP, "Setup"),
]


class Store(models.Model):
    """
    Model representing a store where vending machines are located.
    """

    name = models.CharField(max_length=100, unique=True)
    url = models.CharField(
        max_length=200,
        null=True,
        blank=True,
    )

    address = models.CharField(
        max_length=200,
        null=True,
        blank=True,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.name


class VendingMachine(models.Model):
    """
    Model representing a vending machine.
    """

    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name="machines",
        null=True,
        blank=True,
        help_text="The store where the vending machine is located.",
    )

    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="The name of the vending machine.",
    )

    versionS = models.IntegerField(
        default=0,
        help_text="Software version.",
    )
    versionH = models.IntegerField(
        default=0,
        help_text="Hardware version.",
    )

    port = models.IntegerField(
        default=8000,
        help_text="The IP port number of the machine.",
    )  # Port of the machine

    font_name = models.CharField(
        max_length=100,
        default="Roboto Mono",
        help_text="The font name for the display.",
    )

    background_color = models.CharField(
        max_length=7,
        default="#FFFFFF",
        help_text="The background color of the display.",
    )  # Hex color, e.g., #FFFFFF

    background_image = models.ImageField(
        upload_to=machine_image_upload_path,
        null=True,
        blank=True,
        validators=[validate_machine_image_size, validate_image_file_extension],
        help_text="The background image of the display.",
    )

    is_locked = models.BooleanField(
        default=False,
        help_text="Whether the machine is locked.",
    )  # True (locked), False (unlocked)
    pin_code = models.CharField(
        max_length=6,
        default="123456",
        help_text="The pin code for unlocking the machine.",
    )  # Pin code for the machine

    # Whether to post notifications to the cloud server
    post_notifications = models.BooleanField(
        default=False,
        help_text="Whether to post notifications to the cloud server.",
    )

    # Whether the machine is being set up
    is_setting_up = models.BooleanField(
        default=False,
        help_text="Whether the machine is being set up.",
    )

    status = models.CharField(
        max_length=20,
        choices=MACHINE_STATUS_CHOICES,
        default=IDLE,
        help_text="The status of the vending machine.",
    )

    def __str__(self):
        return f"{self.store.name}-{self.name}"

    def save(self, *args, **kwargs):
        if self.status == "idle" or self.status == "serving":
            self.is_locked = False

        if self.status == "error":
            self.is_locked = True

        super(VendingMachine, self).save(*args, **kwargs)


# Define the Dispenser model
class Dispenser(models.Model):
    """
    Model representing a dispenser in a vending machine.
    """

    # The vending machine that the dispenser belongs to
    vending_machine = models.ForeignKey(
        VendingMachine,
        on_delete=models.CASCADE,
        related_name="dispensers",
    )

    name = models.CharField(max_length=50, unique=True)

    dispense_status = models.BooleanField(
        default=OFF,
        help_text="The status of the dispenser: False (off), True (on).",
    )

    cleaner_mode = models.IntegerField(
        default=1,
        help_text="The mode of the cleaner: 0 (off), 1, 2, or 3.",
    )
    cleaner_status = models.BooleanField(
        default=OFF,
        help_text="The status of the cleaner: False (off), True (on).",
    )

    temperature = models.FloatField(
        default=20.0,
        validators=[validate_temperature],
        help_text="The temperature of the drink in Celsius.",
    )
    target_temperature = models.FloatField(
        default=20.0,
        validators=[validate_temperature],
        help_text="The target temperature of the drink in Celsius.",
    )
    temperature_tolerance = models.FloatField(
        default=4.0,
        help_text="The tolerance of the temperature in Celsius.",
    )
    temperature_regulation = models.BooleanField(
        default=OFF,
        help_text="Whether to do temperature regulation: False (off), True (on).",
    )

    cup_status = models.CharField(
        choices=CUP_STATUS_CHOICES,
        default=NOT_DETECTED,
        max_length=20,
        help_text="The status of the cup.",
    )

    # The inventory of the drink (# of cups) can be calculated from the weight of the thermos and the weight of the current drink
    thermos_weight = models.FloatField(
        default=0,
        help_text="The current weight of the thermos in grams.",
    )
    minimum_thermos_weight = models.FloatField(
        default=0.0,
        help_text="The minimum weight of the thermos in grams.",
    )
    empty_thermos_weight = models.FloatField(
        default=0.0,
        help_text="The weight of the empty thermos in grams.",
    )

    heater_strength = models.IntegerField(
        default=0,
        help_text="The strength of the heater: 0 (off), 1 (25% ON), 2 (50% ON), 3 (100% ON).",
    )
    heater_cycle_time = models.IntegerField(
        default=0,
        help_text="Heating Cycle Time in seconds (N x 4).",
    )
    heater_status = models.BooleanField(
        default=OFF,
        help_text="The status of the heater: False (off), True (on).",
    )

    dispenser_image = models.ImageField(
        upload_to=dispenser_image_upload_path,
        null=True,
        blank=True,
        validators=[validate_dispenser_image_size, validate_image_file_extension],
        help_text="The image of the dispenser.",
    )

    drink_size = models.CharField(
        choices=DRINK_SIZE_CHOICES,
        default=SMALL,
        max_length=10,
        help_text="The size of the drink: 'Small' or 'Large'.",
    )
    drink_name = models.CharField(
        max_length=250,
        default="Coffee",
        help_text="The name of the drink.",
    )
    drink_name2 = models.CharField(
        max_length=250,
        blank=True,
        default="",
        help_text="The secondary name of the drink.",
    )
    price_small = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=1.0,
        help_text="The price of the small drink.",
    )
    price_large = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=1.0,
        help_text="The price of the large drink.",
    )

    dispense_time_small = models.FloatField(
        default=0.0,
        validators=[validate_dispense_time],
        help_text="The duration of dispensing the small drink in seconds (0 to 20).",
    )
    dispense_time_large = models.FloatField(
        default=0.0,
        validators=[validate_dispense_time],
        help_text="The duration of dispensing the large drink in seconds (0 to 20).",
    )

    weight_small = models.FloatField(
        default=0.0,
        help_text="The weight of the small drink in grams.",
    )
    weight_large = models.FloatField(
        default=0.0,
        help_text="The weight of the large drink in grams.",
    )

    min_distance = models.FloatField(
        default=0.0,
        help_text="Minimum distance for sensing.",
    )
    max_distance = models.FloatField(
        default=0.0,
        help_text="Maximum distance for sensing.",
    )

    SKU = models.CharField(
        max_length=120,
        blank=True,
        help_text="The stock keeping unit.",
    )

    drink_image = models.ImageField(
        upload_to=drink_image_upload_path,
        null=True,
        blank=True,
        validators=[validate_drink_image_size, validate_image_file_extension],
        help_text="The image of the drink.",
    )

    temperature_notification_count = models.IntegerField(default=0)
    weight_notification_count = models.IntegerField(default=0)
    last_temperature_notification = models.BooleanField(default=False)  # True if last was out of range
    last_weight_notification = models.BooleanField(default=False)  # True if last was below minimum

    def __str__(self):
        return f"{self.vending_machine}-{self.name}"

    def save(self, *args, **kwargs):
        if self.price_large == 0.0:
            self.price_large = self.price_small

        if self.weight_large == 0.0:
            self.weight_large = self.weight_small

        super(Dispenser, self).save(*args, **kwargs)
