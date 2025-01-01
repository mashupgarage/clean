# dispenser\urls.py
from django.urls import path

from . import views

urlpatterns = [
    path(
        "test/",
        views.dispenser_test,
        name="dispenser_test",
    ),
    path(
        "check-cup-presence/",
        views.check_cup_presence,
        name="check_cup_presence",
    ),
    path(
        "get-temperature",
        views.get_temperature,
        name="get_temperature",
    ),
    path(
        "get-thermos-weight",
        views.get_thermos_weight,
        name="get_thermos_weight",
    ),
    path(
        "get-version",
        views.get_version,
        name="get_version",
    ),
    path(
        "set-heater",
        views.set_heater,
        name="set_heater",
    ),
    path(
        "set-pump",
        views.set_pump,
        name="set_pump",
    ),
    path(
        "set-cleaner",
        views.set_cleaner,
        name="set_cleaner",
    ),
    path(
        "start-drink-dispensing/",
        views.start_drink_dispensing,
        name="start_drink_dispensing",
    ),
    path(
        "stop-drink-dispensing/",
        views.stop_drink_dispensing,
        name="stop_drink_dispensing",
    ),
    path(
        "clean/",
        views.clean_dispenser,
        name="clean_dispenser",
    ),
    path(
        "set-heater/",
        views.set_heater,
        name="set_heater",
    ),
    path(
        "set-temp-regulation/",
        views.set_temp_regulation,
        name="set_temp_regulation",
    ),
    path(
        "turn-on-tap/",
        views.turn_on_tap,
        name="turn_on_tap",
    ),
    path(
        "turn-off-tap/",
        views.TurnOffTapDispenserView.as_view(),
        name="turn_off_tap",
    ),
    path(
        "report-transaction/",
        views.report_transaction,
        name="report_transaction",
    ),
    path(
        "dispenser-periodic-task/",
        views.dispenser_periodic_task,
        name="dispenser_periodic_task",
    ),
    path(
        "select-vm/",
        views.vending_machine_list,
        name="vending_machine_list",
    ),
    path(
        "vending_machine/lock-state/",
        views.get_lock_state,
        name="get_lock_state",
    ),
    path(
        "vending_machine/lock-state/set/",
        views.set_lock_state,
        name="set_lock_state",
    ),
    path(
        "vending_machine/set-pin/",
        views.set_pin_code,
        name="set_pin_code",
    ),
    path(
        "vending_machine/status/",
        views.get_machine_status,
        name="get_machine_status",
    ),
    path(
        "vending_machine/status/update/",
        views.update_machine_status,
        name="update_machine_status",
    ),
    path(
        "vending_machine/verify-pin/",
        views.verify_pin_code,
        name="verify_pin_code",
    ),
    path(
        "vending-machine-appearance/",
        views.get_vending_machine_appearance,
        name="vending_machine_appearance",
    ),
    path(
        "menu-items/",
        views.get_menu_items,
        name="get_menu_items",
    ),
    path(
        "react-config/",
        views.get_react_config,
        name="get_react_config",
    ),
]
