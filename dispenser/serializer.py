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
            "versionS",
            "versionH",
            "dispensers",
            "is_locked",
            "post_notifications",
            "pin_code",
            "is_setting_up",
            "status",
            # General Settings
            "general_button_font_style",
            "general_button_text_color",
            "general_button_text_content",
            "general_title_style",
            # Idle Page
            "idle_background_color",
            "idle_background_image",
            "idle_video",
            "idle_video_toggle",
            "idle_title",
            "idle_subtitle",
            "idle_title_font_style",
            "idle_title_font_color",
            # Item Selection Page
            "item_selection_title",
            # Item Size Page
            "item_size_title",
            # Payment Page
            "payment_title",
            # Detect Cup and Dispensing Page
            "detection_timeout",
            "dispensing_timeout",
            # Thank You Page
            "thank_you_background_image",
            "thank_you_title",
            "thank_you_subtitle",
            "thank_you_font_style",
            "thank_you_font_color",
            "thank_you_exit_timeout",
        )

    def get_name2(self, obj):
        return str(obj)


class VendingMachineAppearanceSerializer(serializers.ModelSerializer):
    idle_background_image = serializers.SerializerMethodField()
    idle_video = serializers.SerializerMethodField()
    thank_you_background_image = serializers.SerializerMethodField()

    class Meta:
        model = VendingMachine
        fields = [
            "id",
            # General Settings
            "general_button_font_style",
            "general_button_text_color",
            "general_button_text_content",
            "general_title_style",
            # Idle Page
            "idle_background_color",
            "idle_background_image",
            "idle_video",
            "idle_video_toggle",
            "idle_title",
            "idle_subtitle",
            "idle_font_style",
            "idle_font_color",
            # Item Selection Page
            "item_selection_title",
            # Item Size Page
            "item_size_title",
            # Payment Page
            "payment_title",
            # Detect Cup and Dispensing Page
            "detection_timeout",
            "dispensing_timeout",
            # Thank You Page
            "thank_you_background_image",
            "thank_you_title",
            "thank_you_subtitle",
            "thank_you_font_style",
            "thank_you_font_color",
            "thank_you_exit_timeout",
        ]

    def get_idle_background_image(self, obj):
        request = self.context.get("request")
        if obj.idle_background_image and request:
            return request.build_absolute_uri(obj.idle_background_image.url)
        return None

    def get_idle_video(self, obj):
        request = self.context.get("request")
        if obj.idle_video and request:
            return request.build_absolute_uri(obj.idle_video.url)
        return None

    def get_thank_you_background_image(self, obj):
        request = self.context.get("request")
        if obj.thank_you_background_image and request:
            return request.build_absolute_uri(obj.thank_you_background_image.url)
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
