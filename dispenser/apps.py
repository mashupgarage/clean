import os
import sys
import time

from django.apps import AppConfig
from django.conf import settings
from dotenv import load_dotenv

from dispenser.dispenser_controller import DispenserController

load_dotenv()


class DispenserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "dispenser"

    def ready(self):
        # Avoid initialization in the reloader process
        if "runserver" in sys.argv and os.environ.get("RUN_MAIN") != "true":
            return

        print(os.getenv("SERIAL_PORT"))

        # This code will run once when the app is ready
        dispenser_controller = DispenserController(
            # serial_port=os.getenv("SERIAL_PORT"),
            serial_port=os.environ.get("SERIAL_PORT", "COM5"),
            # baudrate=int(os.getenv("BAUDRATE")),
            baudrate=int(os.environ.get("BAUDRATE", "57600")),
            emulation=settings.DISPENSER_EMULATED,
        )

        result = dispenser_controller.open_serial_connection()
        print("Serial connection opened:", result)

        if settings.DISPENSER_EMULATED is False:
            time.sleep(1)  # Important❗ Wait for the dispenser to start up

        dispenser_controller.initialize_dispenser()

        if settings.DISPENSER_EMULATED is False:
            time.sleep(10)  # Important❗ Wait for Weight Readings to stabilize

        # Save the dispenser controller object to the app config
        self.dispenser_controller = dispenser_controller
