# dispenser\views.py
import datetime
import logging
import random
from decimal import Decimal

import requests
from django.apps import apps
from django.conf import settings
from django.utils import timezone
from rest_framework import status, views, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter

from dispenser.models import Dispenser, Store, VendingMachine

from .models import Store, VendingMachine
from .serializer import (DispenserSerializer, MenuItemSerializer,
                         StoreSerializer, VendingMachineAppearanceSerializer,
                         VendingMachineSerializer)

logger = logging.getLogger(__name__)


@api_view(["POST"])
def dispenser_periodic_task(request):
    # logger.info("Running temperature and thermos weight monitoring task...")
    print("Running temperature and thermos weight monitoring task...")

    try:
        dispenser_controller = apps.get_app_config("dispenser").dispenser_controller
        dispensers = Dispenser.objects.all()

        if len(dispensers) < 2:
            # logger.error("Insufficient dispensers found.")
            print("Insufficient dispensers found.")
            return Response({"error": "Insufficient dispensers found"}, status=status.HTTP_400_BAD_REQUEST)

        temperature_A = dispenser_controller.get_temperatureA()
        temperature_B = dispenser_controller.get_temperatureB()
        print(f"Temp A: {temperature_A}")
        print(f"Temp B: {temperature_B}")

        thermos_weight_A = dispenser_controller.get_thermos_weightA() * 10
        thermos_weight_B = dispenser_controller.get_thermos_weightB() * 10
        print(f"Thermos weight A: {thermos_weight_A}")
        print(f"Thermos weight B: {thermos_weight_B}")

        # Update the temperature & thermos weights of the dispensers
        dispensers[0].temperature = temperature_A
        dispensers[1].temperature = temperature_B
        dispensers[0].thermos_weight = thermos_weight_A
        dispensers[1].thermos_weight = thermos_weight_B
        dispensers[0].save()
        dispensers[1].save()

        # Loop through all dispensers
        for dispenser in dispensers:
            current_temp_out_of_range = False
            current_weight_below_minimum = False

            if dispenser.temperature_regulation:
                # Adjust heater settings if temperature regulation is enabled
                adjust_heater_settings(dispenser)

                # Check temperature range and send notification if out of range
                if (
                    dispenser.temperature < dispenser.target_temperature - dispenser.temperature_tolerance
                    or dispenser.temperature > dispenser.target_temperature + dispenser.temperature_tolerance
                ):
                    print(f"Temperature out of range for {dispenser.name}")

                    current_temp_out_of_range = check_and_notify_temperature(dispenser)

                dispenser.last_temperature_notification = current_temp_out_of_range

            # Check if the thermos weight is below the minimum required weight
            if dispenser.thermos_weight < dispenser.minimum_thermos_weight:
                print(f"Thermos weight is below minimum for {dispenser.name}")

                current_weight_below_minimum = check_and_notify_weight(dispenser)

                dispenser.last_weight_notification = current_weight_below_minimum

            # Reset notification counters if conditions are back to normal
            if not current_temp_out_of_range:
                dispenser.temperature_notification_count = 0
            if not current_weight_below_minimum:
                dispenser.weight_notification_count = 0

            dispenser.save()

        # logger.info("Temperature and weight monitoring task completed")
        print("Temperature and weight monitoring task completed")
        return Response({"status": "Task completed successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        # logger.error(f"Unexpected error: {str(e)}")
        print(f"Unexpected error: {str(e)}")
        return Response({"error": "Unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def check_and_notify_weight(dispenser):
    current_weight_below_minimum = True

    if dispenser.last_weight_notification and dispenser.weight_notification_count < 2:
        send_weight_notification(dispenser)
        dispenser.weight_notification_count += 1
    elif not dispenser.last_weight_notification:
        dispenser.weight_notification_count = 1
        send_weight_notification(dispenser)
    return current_weight_below_minimum


def check_and_notify_temperature(dispenser):
    current_temp_out_of_range = True

    if dispenser.last_temperature_notification and dispenser.temperature_notification_count < 2:
        send_temperature_notification(dispenser)
        dispenser.temperature_notification_count += 1
    elif not dispenser.last_temperature_notification:
        dispenser.temperature_notification_count = 1
        send_temperature_notification(dispenser)
    return current_temp_out_of_range


def adjust_heater_settings(dispenser):
    if dispenser.temperature < dispenser.target_temperature - dispenser.temperature_tolerance / 2:
        # Turn heater ON if temperature is below the target minus tolerance/2
        dispenser.heater_strength = 3
        dispenser.heater_status = True
        dispenser.save()
        print(f"Heater turned ON for {dispenser.name}")

    elif dispenser.temperature > dispenser.target_temperature + dispenser.temperature_tolerance / 2:
        # Turn heater OFF if temperature is above the target plus tolerance/2
        dispenser.heater_strength = 0
        dispenser.heater_status = False
        dispenser.save()
        print(f"Heater turned OFF for {dispenser.name}")

        # Set the heater strength for the dispenser
    response_data, response_status, error = send_set_command(dispenser.name, "heater", dispenser.heater_strength)
    # print(f"response_data: {response_data}, response_status: {response_status}, error: {error}")


def send_temperature_notification(dispenser):
    if dispenser.vending_machine.post_notifications:
        notification_data = {
            "store_name": dispenser.vending_machine.store.name,
            "machine_name": dispenser.vending_machine.name,
            "dispenser_name": dispenser.name,
            "notification_type": "alert",
            "time": datetime.datetime.now().isoformat(),
            "description": f"Temperature out of range: {dispenser.temperature}°C",
        }
        send_notification(notification_data)


def send_weight_notification(dispenser):
    if dispenser.vending_machine.post_notifications:
        notification_data = {
            "store_name": dispenser.vending_machine.store.name,
            "machine_name": dispenser.vending_machine.name,
            "dispenser_name": dispenser.name,
            "notification_type": "alert",
            "time": datetime.datetime.now().isoformat(),
            "description": f"Thermos weight is below minimum: {dispenser.thermos_weight}g",
        }
        send_notification(notification_data)


def send_notification(notification_data):
    url = settings.NOTIFICATION_ENDPOINT

    print(f"Sending notification to {url}...")

    try:
        # Make a POST request to the Notification endpoint
        print(f"Sending notification to {url}...")
        response = requests.post(
            url=url,
            json=notification_data,  # Use json to automatically set headers for JSON content type
            # headers={"Authorization": "Token YOUR_API_TOKEN"},  # Include this if API requires authentication
        )

        if response.status_code != 201:
            # logger.error(
            #     f"Failed to send notification to main server, Status code: {response.status_code}, Response: {response.text}"
            # )
            print("Failed to send notification to main server")
        else:
            # logger.info("Notification sent successfully")
            print("Notification sent successfully")

    except requests.exceptions.RequestException as e:
        # logger.error(f"Error sending notification: {str(e)}")
        print(f"Error sending notification: {str(e)}")


@api_view(["POST"])
def report_transaction(request):
    try:
        # Extract the transaction data from the request
        transaction_data = request.data

        # Get the first store and vending machine records
        store = Store.objects.first()
        vending_machine = VendingMachine.objects.first()

        # Add store_name and vending_machine_name to the transaction data
        transaction_data["store_name"] = store.name if store else "Unknown Store"
        transaction_data["vending_machine_name"] = vending_machine.name if vending_machine else "Unknown Machine"

        # print(f"Transaction data: {transaction_data}")

        # url = "http://127.0.0.1:8080/api/transactions/",
        url = settings.TRANSACTION_ENDPOINT

        # Send the transaction data to the cloud server
        cloud_response = requests.post(
            url,
            json=transaction_data,
            headers={"Content-Type": "application/json"},
        )

        # Check if the cloud server response is successful
        if cloud_response.status_code == 200:
            return Response({"message": "Transaction reported successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "Failed to report transaction to cloud server"}, status=cloud_response.status_code
            )

        # return Response(
        #     {"message": "Transaction reported successfully"},
        #     status=status.HTTP_200_OK,
        # )

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Viewset for the Store model - allows for CRUD operations
class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer


# Viewset for the Vending Machine model - allows for CRUD operations
class VendingMachineViewSet(viewsets.ModelViewSet):
    queryset = VendingMachine.objects.all()
    serializer_class = VendingMachineSerializer


@api_view(["GET"])
def get_vending_machine_appearance(request):
    try:
        vending_machine = VendingMachine.objects.first()
        if not vending_machine:
            return Response({"error": "Vending machine not found"}, status=404)

        serializer = VendingMachineAppearanceSerializer(vending_machine, context={"request": request})
        return Response(serializer.data)
    except VendingMachine.DoesNotExist:
        return Response({"error": "Vending machine not found"}, status=404)


@api_view(["GET"])
def get_machine_status(request):
    try:
        machine = VendingMachine.objects.first()  # Assuming there's only one machine record
        response_data = {
            "status": machine.status,
        }
        return Response(response_data, status=status.HTTP_200_OK)
    except VendingMachine.DoesNotExist:
        return Response({"error": "Vending Machine not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def update_machine_status(request):
    try:
        machine = VendingMachine.objects.first()  # Assuming there's only one machine record
        new_status = request.data.get("status")
        message = request.data.get("message")
        dispenser_name = request.data.get("dispenser_name")

        if new_status:
            machine.status = new_status
            # # id status = "idle" or "serving", unlock the machine
            # if new_status in ["idle", "serving"]:
            #     machine.is_locked = False

            machine.save()

            if new_status == "error" and message and dispenser_name:
                print(f"Error message: {message}")
                if machine.post_notifications:
                    # send a notification
                    notification_data = {
                        "store_name": machine.store.name,
                        "machine_name": machine.name,
                        "notification_type": "alert",
                        "dispenser_name": dispenser_name,
                        "time": datetime.datetime.now().isoformat(),
                        "description": message,
                    }
                    send_notification(notification_data)

            response_data = {
                "status": machine.status,
                "message": "Status updated successfully",
            }
            return Response(response_data, status=status.HTTP_200_OK)

    except VendingMachine.DoesNotExist:
        return Response({"error": "Vending Machine not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
def get_lock_state(request):
    try:
        machine = VendingMachine.objects.first()
        if not machine:
            raise VendingMachine.DoesNotExist
    except VendingMachine.DoesNotExist:
        return Response({"error": "Vending machine not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"is_locked": machine.is_locked}, status=status.HTTP_200_OK)


@api_view(["POST"])
def set_lock_state(request):
    try:
        machine = VendingMachine.objects.first()
        if not machine:
            raise VendingMachine.DoesNotExist
    except VendingMachine.DoesNotExist:
        return Response({"error": "Vending machine not found"}, status=status.HTTP_404_NOT_FOUND)

    is_locked = request.data.get("is_locked")
    if is_locked is None:
        return Response({"error": "Lock state is required"}, status=status.HTTP_400_BAD_REQUEST)

    machine.is_locked = is_locked
    machine.save()
    return Response({"is_locked": machine.is_locked}, status=status.HTTP_200_OK)


@api_view(["POST"])
def set_pin_code(request):
    try:
        machine = VendingMachine.objects.first()
        if not machine:
            raise VendingMachine.DoesNotExist
    except VendingMachine.DoesNotExist:
        return Response({"error": "Vending machine not found"}, status=status.HTTP_404_NOT_FOUND)

    pin_code = request.data.get("pin_code")
    if not pin_code or len(pin_code) != 6 or not pin_code.isdigit():
        return Response({"error": "PIN code must be a 6-digit number"}, status=status.HTTP_400_BAD_REQUEST)

    machine.pin_code = pin_code
    machine.save()
    return Response({"message": "PIN code set successfully"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def verify_pin_code(request):
    try:
        machine = VendingMachine.objects.first()
        if not machine:
            raise VendingMachine.DoesNotExist
    except VendingMachine.DoesNotExist:
        return Response({"error": "Vending machine not found"}, status=status.HTTP_404_NOT_FOUND)

    pin_code = request.data.get("pin_code")
    if not pin_code:
        return Response({"error": "PIN code is required"}, status=status.HTTP_400_BAD_REQUEST)

    if pin_code == machine.pin_code:
        machine.is_locked = False
        machine.save()
        return Response({"message": "PIN code verified successfully, machine unlocked"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid PIN code"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def vending_machine_list(request):
    # Only authenticated users can access this viewset
    # permission_classes = [IsAuthenticated]

    queryset = VendingMachine.objects.all()

    by_name = request.query_params.get("name")

    if by_name:
        # if not request.user.is_authenticated:
        #     raise AuthenticationFailed()

        try:
            queryset = queryset.filter(name=by_name)
            if not queryset.exists():
                raise ValidationError(
                    detail=f"Vending Machine with name {by_name} not found",
                )
        except ValueError:
            raise ValidationError(detail="Vending Machine value error")

    serializer = VendingMachineSerializer(
        queryset,
        many=True,
    )
    return Response(serializer.data)


# Viewset for the Dispenser model - allows for CRUD operations
class DispenserViewSet(viewsets.ModelViewSet):
    queryset = Dispenser.objects.all()
    serializer_class = DispenserSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Check if cleaner_mode is being updated
        # if "cleaner_mode" in serializer.validated_data:
        #     cleaner_mode = serializer.validated_data["cleaner_mode"]
        #     success, response_data = handle_cleaner_mode(instance, cleaner_mode)
        #     if not success:
        #         return Response({"error": "Failed to set cleaner mode"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)


def handle_cleaner_mode(dispenser, mode):
    # Similar to set_cleaner but operates on the dispenser instance and the specified mode
    # Return a tuple (success_flag, response_data)

    # response_data, response_status, error = send_set_command(
    #     dispenser.name,
    #     "cleaner",
    #     0,  # set mode to 0 to stop the cleaner
    # )

    # if response_data is not None:
    response_data2, response_status2, error2 = send_set_command(
        dispenser.name,
        "cleaner",
        mode,
    )

    if response_data2 is not None:
        # Update status of vending machine to "cleaning" if mode is not 0
        if mode != 0:
            vending_machine = dispenser.vending_machine
            vending_machine.status = "cleaning"
            vending_machine.save()
        else:
            vending_machine = dispenser.vending_machine
            vending_machine.status = "idle"
            vending_machine.save()

        # add the cleaner_mode to the response_data
        response_data2["mode"] = mode
        return True, response_data2
    else:
        return False, {"error": error2}


# else:
#     return False, {"error": error}


class CleanDispenserView(views.APIView):

    def post(self, request, *args, **kwargs):
        dispenser_name = request.data.get("dispenser_name")
        mode = request.data.get("mode")

        if not dispenser_name or mode is None:
            return Response({"error": "dispenser_name and mode are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            dispenser = Dispenser.objects.get(name=dispenser_name)
        except Dispenser.DoesNotExist:
            return Response({"error": "Dispenser not found"}, status=status.HTTP_404_NOT_FOUND)

        success, response_data = handle_cleaner_mode(dispenser, mode)
        if success:
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class SetHeaterDispenserView(views.APIView):

    def post(self, request, *args, **kwargs):
        dispenser_name = request.data.get("dispenser_name")
        heater_status = request.data.get("heater_status")

        print(f"dispenser_name: {dispenser_name}, heater_status: {heater_status}")

        if not dispenser_name or heater_status is None:
            return Response(
                {"error": "dispenser_name and heater_status are required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            dispenser = Dispenser.objects.get(name=dispenser_name)
        except Dispenser.DoesNotExist:
            return Response({"error": "Dispenser not found"}, status=status.HTTP_404_NOT_FOUND)

        heater_strength = 0
        if heater_status:
            heater_strength = 3
            dispenser.heater_strength = heater_strength
            dispenser.heater_status = heater_status
            dispenser.save()

        else:
            dispenser.heater_strength = 0
            dispenser.heater_status = heater_status
            dispenser.save()

        response_data, response_status, error = send_set_command(
            dispenser_name,
            "heater",
            heater_strength,
        )

        print(f"response_data: {response_data}, response_status: {response_status}, error: {error}")

        if response_data is not None:
            return Response(response_data, status=response_status)
        else:
            return Response({"error": error}, status=response_status)


class SetTempRegulationDispenserView(views.APIView):

    def post(self, request, *args, **kwargs):
        dispenser_name = request.data.get("dispenser_name")
        temperature_regulation = request.data.get("temperature_regulation")

        if not dispenser_name or temperature_regulation is None:
            return Response(
                {"error": "dispenser_name, temperature_regulation are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            dispenser = Dispenser.objects.get(name=dispenser_name)
        except Dispenser.DoesNotExist:
            return Response({"error": "Dispenser not found"}, status=status.HTTP_404_NOT_FOUND)

        dispenser.temperature_regulation = temperature_regulation
        dispenser.save()

        return Response(
            {
                "dispenser": dispenser_name,
                "temperature_regulation": temperature_regulation,
            },
            status=status.HTTP_200_OK,
        )


class TurnOnTapDispenserView(views.APIView):

    def post(self, request, *args, **kwargs):
        dispenser_name = request.data.get("dispenser_name")

        # Validate dispenser_name presence
        if dispenser_name is None:
            return Response(
                {"error": "dispenser_name is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Turn on the tap
        _, _, error = send_set_command(
            dispenser_name,
            "pump",
            20,  # max time
        )

        # Handle potential error from send_set_command
        if error:
            response_data["error"] = error
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Read Thermos weight
        response_data = {}
        resp_data, _, error = send_get_command(
            dispenser_name,
            "thermos_weight",
        )

        # Handle potential error from send_get_command
        if error:
            response_data["error"] = error
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Prepare successful response
        response_data["dispenser"] = resp_data["dispenser"]
        response_data["initialWeight"] = resp_data["thermos_weight"] * 10

        print(f"Tap turned on for dispenser: {dispenser_name}, Initial weight: {response_data['initialWeight']}")

        return Response(response_data, status=status.HTTP_200_OK)


class TurnOffTapDispenserView(views.APIView):
    def post(self, request, *args, **kwargs):
        dispenser_name = request.data.get("dispenser_name")
        response_data = {}

        # Validate dispenser_name presence
        if dispenser_name is None:
            return Response(
                {"error": "dispenser_name is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Turn off the tap
        _, _, error = send_set_command(
            dispenser_name,
            "pump",
            0,  # 0 time to turn off
        )

        # Handle potential error from send_set_command
        if error:
            response_data["error"] = error
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Read Thermos weight
        resp_data, _, error = send_get_command(
            dispenser_name,
            "thermos_weight",
        )
        # print(f"resp_data: {resp_data}")
        # - Response data: {'dispenser': 'Tap-B', 'thermos_weight': 541}

        # Handle potential error from send_get_command
        if error:
            response_data["error"] = error
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Prepare successful response
        response_data["dispenser"] = resp_data["dispenser"]
        response_data["finalWeight"] = resp_data["thermos_weight"] * 10

        print(f"Tap turned off for dispenser: {dispenser_name}, Final weight: {response_data['finalWeight']}")

        return Response(response_data, status=status.HTTP_200_OK)
        # Optional: Add logging for debugging
        # logger.info(f"Tap turned off for dispenser: {dispenser_name}, Final weight: {response_data['finalWeight']}")


@api_view(["GET"])
def get_menu_items(request):
    dispensers = Dispenser.objects.all()
    serializer = MenuItemSerializer(dispensers, many=True, context={"request": request})

    return Response(serializer.data)


Emulated = settings.DISPENSER_EMULATED
# Emulated = False  # Set to False to use the actual dispenser


@api_view(["GET"])
def dispenser_test(request):
    # Create a DispenserController object with the correct serial port
    # dispenser_controller = DispenserController("COM5")

    # Get the DispenserController object from the app config
    dispenser_controller = apps.get_app_config("dispenser").dispenser_controller

    # Initialize the response data
    response_data = {}

    # Open the serial connection
    if dispenser_controller.open_serial_connection():
        try:
            # Example interaction with the dispenser
            temperature_A = dispenser_controller.get_temperatureA()
            if temperature_A is not None:
                response_data["temperature_A"] = temperature_A

            success = dispenser_controller.set_heaterA_on(2)
            if success:
                response_data["heater_A_status"] = "on"

            firmware_version = dispenser_controller.get_versionS()
            if firmware_version is not None:
                response_data["firmware_version"] = firmware_version

            dispenser_version = dispenser_controller.get_versionH()
            if dispenser_version is not None:
                response_data["dispenser_version"] = dispenser_version

            print(f"Response data: {response_data}")

        except Exception as e:
            response_data["error"] = str(e)

        # finally:
        #     # Close the serial connection
        #     dispenser_controller.close_serial_connection()
    else:
        response_data["error"] = "Failed to open the serial connection to the dispenser"

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(["GET"])
def check_cup_presence(request):
    # Get the dispenser name from the request
    dispenser = request.GET.get("dispenser", default="Tap-A")
    print(f"dispenser: {dispenser}")

    if Emulated:
        # ARTY: Testing ONLY
        cup_status = random.choice([0, 0, 0, 2, 2, 2])
        # cup_status = 0

        res_data = {}
        res_data[dispenser] = dispenser
        res_data["cup_status"] = cup_status
        return Response(res_data, status=status.HTTP_200_OK)

    # Get the cup_status from the dispenser
    response_data, cmd_status, error = send_get_command(dispenser, "cup_status")
    if response_data is not None:
        # Save the cup_status to the database
        try:
            dispenser_object = Dispenser.objects.get(name=dispenser)
            dispenser_object.cup_status = response_data["cup_status"]
            dispenser_object.save()

        except Dispenser.DoesNotExist:
            print(f"Dispenser {dispenser} does not exist in the database")
            return Response(
                {"error": f"Dispenser {dispenser} does not exist in the database"},
                status=cmd_status,
            )

        return Response(response_data, status=cmd_status)
    else:
        return Response({"error": error}, status=cmd_status)


@api_view(["GET"])
def get_temperature(request):
    # Get the dispenser name from the request
    dispenser_name = request.GET.get("dispenser", default="Tap-A")

    # if settings.DISPENSER_EMULATED:
    #     # return a fixed value for testing
    #     response_data = {}
    #     response_data["Tap"] = dispenser_name
    #     response_data["temperature"] = 26

    #     dispenser_object = Dispenser.objects.get(name=dispenser_name)
    #     temperature = float(response_data["temperature"])  # Convert to float
    #     dispenser_object.temperature = temperature
    #     dispenser_object.save()

    #     return Response(response_data, status=status.HTTP_200_OK)

    # Get the temperature from the dispenser
    response_data, command_status, error = send_get_command(
        dispenser_name,
        "temperature",
    )
    if response_data is not None:
        # Save the temperature to the database
        try:
            dispenser_object = Dispenser.objects.get(name=dispenser_name)
            temperature = float(response_data["temperature"])  # Convert to float
            dispenser_object.temperature = temperature
            dispenser_object.save()

        except Dispenser.DoesNotExist:
            print(f"Dispenser {dispenser_name} does not exist in the database")
            return Response(
                {"error": f"Dispenser {dispenser_name} does not exist in the database"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(response_data, status=command_status)
    else:
        return Response({"error": error}, status=command_status)


@api_view(["GET"])
def get_thermos_weight(request):
    # Get the dispenser name from the request
    dispenser = request.GET.get("dispenser", default="Tap-A")

    response_data, status, error = send_get_command(dispenser, "thermos_weight")
    if response_data is not None:
        # Save the thermos weight to the database
        try:
            dispenser_object = Dispenser.objects.get(name=dispenser)
            dispenser_object.thermos_weight = float(response_data["thermos_weight"])
            dispenser_object.save()

        except Dispenser.DoesNotExist:
            print(f"Dispenser {dispenser} does not exist in the database")
            return Response(
                {"error": f"Dispenser {dispenser} does not exist in the database"},
                status=status,
            )

        return Response(response_data, status=status)
    else:
        return Response({"error": error}, status=status)


@api_view(["PUT"])
def set_heater(request):
    dispenser = request.GET.get("dispenser", default="Tap-A")
    strength = request.GET.get("strength", default="1")

    # print(f"dispenser: {dispenser}, strength: {strength}")

    response_data, status, error = send_set_command(
        dispenser,
        "heater",
        strength,
    )

    if response_data is not None:
        return Response(response_data, status=status)
    else:
        return Response({"error": error}, status=status)


@api_view(["PUT"])
def set_heater(request):
    dispenser = request.GET.get("dispenser", default="Tap-A")
    duration = request.GET.get("duration", default="5")

    print(f"dispenser: {dispenser}, duration: {duration}")

    response_data, status, error = send_set_command(
        dispenser,
        "heater",
        duration,
    )

    if response_data is not None:
        return Response(response_data, status=status)
    else:
        return Response({"error": error}, status=status)


@api_view(["PUT"])
def set_cleaner(request):
    dispenser = request.GET.get("dispenser", default="Tap-A")
    mode = request.GET.get("mode", default="10")

    print(f"dispenser: {dispenser}, mode: {mode}")

    response_data, status, error = send_set_command(
        dispenser,
        "cleaner",
        0,  # set mode to 0 to stop the cleaner
    )

    if response_data is not None:
        response_data2, status2, error2 = send_set_command(
            dispenser,
            "cleaner",
            mode,
        )
        if response_data2 is not None:
            return Response(response_data2, status=status2)
        else:
            return Response({"error": error2}, status=status2)
    else:
        return Response({"error": error}, status=status)


@api_view(["PUT"])
def set_pump(request):
    dispenser = request.GET.get("dispenser", default="Tap-A")
    duration = request.GET.get("duration", default="10")

    print(f"dispenser: {dispenser}, duration: {duration}")

    response_data, status, error = send_set_command(
        dispenser,
        "pump",
        duration,
    )

    if response_data is not None:
        return Response(response_data, status=status)
    else:
        return Response({"error": error}, status=status)


@api_view(["GET"])
def get_version(request):
    response_data = {}

    # if Emulated:
    #     response_data["versionS"] = 1
    #     response_data["versionH"] = 1
    #     return Response(response_data, status=status.HTTP_200_OK)

    dispenser_controller = apps.get_app_config("dispenser").dispenser_controller

    if not dispenser_controller.open_serial_connection():
        response_data["error"] = "Failed to open the serial connection to the dispenser"
        return Response(
            response_data,
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    try:
        versionS = dispenser_controller.get_versionS()
        versionH = dispenser_controller.get_versionH()
        if versionH is not None and versionH is not None:
            response_data["versionS"] = versionS
            response_data["versionH"] = versionH

            # Save the version to the database
            try:
                dispenser_object = Dispenser.objects.get(name="Tap-A")

                # Get the VendingMachine object and update the version
                vending_machine = dispenser_object.vending_machine
                vending_machine.versionH = versionH
                vending_machine.versionS = versionS
                vending_machine.save()

            except Dispenser.DoesNotExist:
                print("Dispenser A does not exist in the database")
                return Response(
                    {"error": "Dispenser A does not exist in the database"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            response_data["error"] = "Failed to get versions"
            return Response(
                response_data,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        response_data["error"] = str(e)
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(f"Response data: {response_data}")

    return Response(response_data, status=status.HTTP_200_OK)


def send_get_command(dispenser, data):
    response_data = {}

    if Emulated:
        response_data[dispenser] = dispenser
        response_data[data] = random.choice([15, 20, 30, 40])
        return response_data, status.HTTP_200_OK, None

    # Get the DispenserController object from the app config
    dispenser_controller = apps.get_app_config("dispenser").dispenser_controller

    if not dispenser_controller.open_serial_connection():
        return (
            None,
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Failed to open the serial connection to the dispenser",
        )

    try:
        if dispenser == "Tap-A":
            method_to_call = getattr(dispenser_controller, f"get_{data}A")
            result = method_to_call()
        else:
            method_to_call = getattr(dispenser_controller, f"get_{data}B")
            result = method_to_call()

        if result is not None:
            response_data["dispenser"] = dispenser
            response_data[data] = result
        else:
            return (None, status.HTTP_500_INTERNAL_SERVER_ERROR, "Failed to send command")

    except Exception as e:
        return None, status.HTTP_500_INTERNAL_SERVER_ERROR, str(e)

    print(f"Response data: {response_data}")

    return response_data, status.HTTP_200_OK, None


def send_set_command(dispenser, device, parameter):
    response_data = {}

    if Emulated:
        response_data[dispenser] = dispenser
        response_data["status"] = "success"
        return response_data, status.HTTP_200_OK, None

    # Get the DispenserController object from the app config
    dispenser_controller = apps.get_app_config("dispenser").dispenser_controller

    if not dispenser_controller.open_serial_connection():
        return (
            None,
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Failed to open the serial connection to the dispenser",
        )

    try:
        if dispenser == "Tap-A":
            method_to_call = getattr(dispenser_controller, f"set_{device}A")
        else:
            method_to_call = getattr(dispenser_controller, f"set_{device}B")

        result = method_to_call(int(parameter))

        if result:
            response_data["dispenser"] = dispenser
            response_data["status"] = "success"
        else:
            return (
                None,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                f"Failed to set {device}",
            )

    except Exception as e:
        return None, status.HTTP_500_INTERNAL_SERVER_ERROR, str(e)

    # print(f"Response data: {response_data}")

    return response_data, status.HTTP_200_OK, None


import logging

logger = logging.getLogger(__name__)


@api_view(["POST"])
def start_drink_dispensing(request):
    dispenser_name = request.GET.get("dispenser", default="Tap-A")
    drink_size = request.GET.get("size", default="Small").capitalize()
    # print(f"dispenser: {dispenser_name}, size: {drink_size}")

    response_data = {}

    try:
        # Fetch the selected dispenser from the database
        dispenser = Dispenser.objects.get(name=dispenser_name)
    except Dispenser.DoesNotExist:
        response_data["error"] = f"Dispenser {dispenser_name} does not exist in the database"
        return Response(response_data, status=status.HTTP_404_NOT_FOUND)

    # Determine the dispense time based on the drink size
    if drink_size == "Small":
        dispense_time = dispenser.dispense_time_small
    elif drink_size == "Large":
        dispense_time = dispenser.dispense_time_large
    else:
        response_data["error"] = f"Invalid drink size: {drink_size}. Must be 'Small' or 'Large'."
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

    if not Emulated:
        # Get the DispenserController object from the app config
        dispenser_controller = apps.get_app_config("dispenser").dispenser_controller

        # Check if the serial connection is open
        if not dispenser_controller.is_open():
            if not dispenser_controller.open_serial_connection():
                response_data["error"] = "Failed to open the serial connection to the dispenser"
                return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Send the set command to the dispenser
        response_data, _, error = send_set_command(
            dispenser_name,
            "pump",
            dispense_time,
        )

        if error:
            response_data["error"] = error
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        print("Set Pump: ", response_data)

    # Update the status of the vending machine to "serving"
    vending_machine = dispenser.vending_machine
    vending_machine.status = "serving"
    vending_machine.save()

    # Include the dispenser name and dispense time in the response
    response_data["dispenser"] = dispenser_name
    response_data["dispense_time"] = dispense_time
    response_data["drink_size"] = drink_size

    return Response(response_data, status=status.HTTP_202_ACCEPTED)


@api_view(["POST"])
def stop_drink_dispensing(request):
    dispenser_name = request.GET.get("dispenser", default="Tap-A")

    response_data = {}

    try:
        # Fetch the selected dispenser from the database
        dispenser = Dispenser.objects.get(name=dispenser_name)
    except Dispenser.DoesNotExist:
        response_data["error"] = f"Dispenser {dispenser_name} does not exist in the database"
        return Response(response_data, status=status.HTTP_404_NOT_FOUND)

    if not Emulated:
        # Get the DispenserController object from the app config
        dispenser_controller = apps.get_app_config("dispenser").dispenser_controller

        # Check if the serial connection is open
        if not dispenser_controller.is_open():
            if not dispenser_controller.open_serial_connection():
                response_data["error"] = "Failed to open the serial connection to the dispenser"
                return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Send the set command to stop the pump by setting dispense time to 0
        response_data, _, error = send_set_command(
            dispenser_name,
            "pump",
            0,
        )

        if error:
            response_data["error"] = error
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        print("Stop Pump: ", response_data)

    # Update the status of the vending machine to "idle"
    vending_machine = dispenser.vending_machine
    vending_machine.status = "idle"
    vending_machine.save()

    # Include the dispenser name and confirmation message in the response
    response_data["dispenser"] = dispenser_name
    response_data["message"] = "Drink dispensing stopped successfully."

    return Response(response_data, status=status.HTTP_202_ACCEPTED)


from django.shortcuts import render


# Serve the React app from the root URL
def react_app(request):
    return render(request, "index.html")


from django.http import JsonResponse


def get_react_config(request):
    return JsonResponse(settings.REACT_CONFIG)

# MOCK VIEWS

@api_view(["GET"])
def dispenser_test_mock(request):
    response_data = {}
    mock_dispenser_controller = {
        "open_serial_connection": True,
        "get_temperatureA": 26,
        "set_heaterA": True,
        "get_versionS": "1.0",
        "get_versionH": "2.0",
        "close_serial_connection": True,
    }

    if not mock_dispenser_controller["open_serial_connection"]:
        response_data["error"] = "Failed to open the serial connection to the dispenser"
        return Response(response_data, status=status.HTTP_200_OK)

    temperature_A = mock_dispenser_controller["get_temperatureA"]
    if temperature_A is not None:
        response_data["temperature_A"] = temperature_A

    success = mock_dispenser_controller["set_heaterA"]
    if success:
        response_data["heater_A_status"] = "on"

    firmware_version = mock_dispenser_controller["get_versionS"]
    if firmware_version is not None:
        response_data["firmware_version"] = firmware_version

    dispenser_version = mock_dispenser_controller["get_versionH"]
    if dispenser_version is not None:
        response_data["dispenser_version"] = dispenser_version

    return Response(response_data, status=status.HTTP_200_OK)

@api_view(["GET"])
def check_cup_presence(request):
    dispenser = request.GET.get("dispenser", default="Tap-A")
    cup_status = request.GET.get("dispenser", default=False)

    res_data = {}
    res_data[dispenser] = dispenser
    res_data["cup_status"] = cup_status

    dispenser_object = Dispenser.objects.get(name=dispenser)
    dispenser_object.cup_status = res_data["cup_status"]
    dispenser_object.save()

    return Response(res_data, status=status.HTTP_200_OK)

@api_view(["POST"])
def start_drink_dispensing_mock(request):
    dispenser_name = request.GET.get("dispenser", default="Tap-A")
    drink_size = request.GET.get("size", default="Small").capitalize()

    response_data = {}

    dispenser = Dispenser.objects.get(name=dispenser_name)

    if drink_size == "Small":
        dispense_time = dispenser.dispense_time_small
    elif drink_size == "Large":
        dispense_time = dispenser.dispense_time_large

    vening_machine = dispenser.vending_machine
    vening_machine.status = "serving"
    vening_machine.save()

    response_data["dispenser"] = dispenser_name
    response_data["dispense_time"] = dispense_time
    response_data["drink_size"] = drink_size

    return Response(response_data, status=status.HTTP_202_ACCEPTED)

@api_view(["POST"])
def stop_drink_dispensing_mock(request):
    dispenser_name = request.GET.get("dispenser", default="Tap-A")

    response_data = {}

    dispenser = Dispenser.objects.get(name=dispenser_name)

    vening_machine = dispenser.vending_machine
    vening_machine.status = "idle"
    vening_machine.save()

    response_data["dispenser"] = dispenser_name
    response_data["message"] = "Drink dispensing stopped successfully."

    return Response(response_data, status=status.HTTP_202_ACCEPTED)
