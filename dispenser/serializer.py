from rest_framework import serializers

from .models import Dispenser, Store, VendingMachine


# Serializer for the Dispenser model - allows for CRUD operations
class DispenserSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source="vending_machine.store.name")
    store_url = serializers.CharField(source="vending_machine.store.url")
    machine_name = serializers.CharField(source="vending_machine.name")
    machine_port = serializers.CharField(source="vending_machine.port")
    machine_is_locked = serializers.CharField(source="vending_machine.is_locked")
    machine_pin_code = serializers.CharField(source="vending_machine.pin_code")
    machine_post_notifications = serializers.CharField(source="vending_machine.post_notifications")
    machine_is_setting_up = serializers.CharField(source="vending_machine.is_setting_up")
    machine_status = serializers.CharField(source="vending_machine.status")
    # machine_version = serializers.SerializerMethodField()

    def get_machine_version(self, obj):
        return f"V{obj.vending_machine.versionS}-{obj.vending_machine.versionH}"

    class Meta:
        model = Dispenser
        fields = (
            "id",
            "name",
            "store_name",
            "store_url",
            "machine_name",
            "machine_port",
            "machine_is_locked",
            "machine_pin_code",
            "machine_post_notifications",
            "machine_is_setting_up",
            "machine_status",
            # "machine_version",
            "dispense_status",
            "cleaner_mode",
            "cleaner_status",
            "temperature",
            "target_temperature",
            "temperature_tolerance",
            "temperature_regulation",
            "cup_status",
            "thermos_weight",
            "minimum_thermos_weight",
            "empty_thermos_weight",
            "heater_strength",
            "heater_cycle_time",
            "heater_status",
            "dispenser_image",
            "drink_size",
            "drink_name",
            "drink_name2",
            "price_small",
            "price_large",
            "dispense_time_small",
            "dispense_time_large",
            "weight_small",
            "weight_large",
            "SKU",
            "drink_image",
        )


class VendingMachineSerializer(serializers.ModelSerializer):
    dispensers = DispenserSerializer(many=True)
    name2 = serializers.SerializerMethodField()
    store_url = serializers.CharField(source="store.url")

    class Meta:
        model = VendingMachine
        fields = (
            "id",
            "store",
            "store_url",
            "name",
            "name2",
            "port",
            "font_name",
            "background_color",
            "background_image",
            "versionS",
            "versionH",
            "dispensers",
            "is_locked",
            "post_notifications",
            "pin_code",
            "is_setting_up",
            "status",
        )

    def get_name2(self, obj):
        return str(obj)


class VendingMachineAppearanceSerializer(serializers.ModelSerializer):
    background_image = serializers.SerializerMethodField()

    class Meta:
        model = VendingMachine
        fields = ["id", "font_name", "background_color", "background_image"]

    def get_background_image(self, obj):
        request = self.context.get("request")
        if obj.background_image and request:
            return request.build_absolute_uri(obj.background_image.url)
        return None


# Serializer for the Store model - allows for CRUD operations
class StoreSerializer(serializers.ModelSerializer):
    machines = VendingMachineSerializer(many=True)

    class Meta:
        model = Store
        fields = (
            "id",
            "name",
            "url",
            "address",
            "description",
            "machines",
        )


class MenuItemSerializer(serializers.ModelSerializer):
    drink_image = serializers.SerializerMethodField()

    class Meta:
        model = Dispenser
        fields = [
            "id",
            "name",
            "drink_name",
            "drink_name2",
            "drink_size",
            "price_small",
            "price_large",
            "drink_image",
            "SKU",
        ]

    # Include the full URL of the image
    def get_drink_image(self, obj):
        request = self.context.get("request")
        if obj.drink_image and request:
            return request.build_absolute_uri(obj.drink_image.url)
        return None
