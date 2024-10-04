import os

from django.core.exceptions import ValidationError
from PIL import Image


# Validate image size
def validate_machine_image_size(image):
    if image:
        with Image.open(image) as img:
            pass


# Validate image size
def validate_dispenser_image_size(image):
    if image:
        with Image.open(image) as img:
            pass


def validate_drink_image_size(image):
    if image:
        with Image.open(image) as img:
            # if img.width > 70 or img.height > 70:
            #     raise ValidationError(
            #         f"The maximum allowed dimensions for the image are 70x70 - size of image you uploaded: {img.size}"
            #     )
            pass


# Validate image file extension
def validate_image_file_extension(value):
    ext = os.path.splitext(value.name)[1]  # [1] returns extension
    valid_extensions = [".jpg", ".jpeg", ".png"]
    if not ext.lower() in valid_extensions:
        raise ValidationError("Unsupported file extension")
