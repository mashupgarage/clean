import json
import os
import time
from typing import Optional, Tuple

import serial
from django.conf import settings

INTER_COMMAND_DELAY = 10 / 1000.0  # 10 milliseconds delay
PRINT_RESULT = True


class DispenserController:
    def __init__(
        self,
        # serial_port="/dev/ttyACM0",
        # baudrate=19200,
        serial_port: str,
        baudrate: int,
        dispenserA: str = "Tap-A",
        dispenserB: str = "Tap-B",
        # timeout=5,
        emulation: bool = True,
    ):
        self.emulation = emulation
        self.serial_port = serial_port
        self.baudrate = baudrate
        self.serial_connection: Optional[serial.Serial] = None
        self.dispenserA = dispenserA
        self.dispenserB = dispenserB

        print(f"Emulation: {emulation}")

    def is_open(self) -> bool:
        if self.emulation:
            return True

        return self.serial_connection.is_open

    def open_serial_connection(self) -> bool:
        if self.emulation:
            return True

        if self.serial_connection and self.serial_connection.is_open:
            return True

        try:
            self.serial_connection = serial.Serial(
                self.serial_port,
                self.baudrate,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE,
                bytesize=serial.EIGHTBITS,
                # timeout=5,
            )

            print(self.serial_connection)

            print("Waiting for dispenser to start up...")
            # time.sleep(2)  # Important❗ Wait for the dispenser to start up
            print("Dispenser started!")

            return True
        except serial.SerialException:
            return False

    def close_serial_connection(self) -> None:
        if self.serial_connection:
            self.serial_connection.close()

    def initialize_dispenser(self) -> None:
        # if self.emulation:
        #     return

        print("Initializing dispensers...")

        json_file_path = os.path.join(settings.BASE_DIR, "initial_settings.json")

        with open(json_file_path, "r") as file:
            init_settings = json.load(file)["Initial_settings"]

        for setting in init_settings:
            command_hex, value1_hex, value2_hex = setting["data"][1:4]
            command = int(command_hex, 16)
            value1 = int(value1_hex, 16)
            value2 = int(value2_hex, 16)
            _, success, _ = self.send_command(command, value1, value2)
            self.print_result(setting["remark"], success)

        # # Coffee Pump Power Setting (round 70% = 178/255)
        # # FA E1 B2 B2 FF
        # _, success, _ = self.send_command(0xE1, 0xB2, 0xB2)
        # self.print_result("Set Coffee Pump Power Setting", success)

        # # Clean Pump Power Setting (100% = 255/255)
        # # FA E2 FF FF FF
        # _, success, _ = self.send_command(0xE2, 0xFF, 0xFF)
        # self.print_result("Set Clean Pump Power Setting", success)

        # # Max. Coffee Pump Time (20 seconds)
        # # FA E3 00 14 FF
        # _, success, _ = self.send_command(0xE3, 0, 0x14)
        # self.print_result("Set Max. Coffee Pump Time", success)

        # # Heating Cycle Time (N x 4 seconds)
        # # FA E5 00 04 FF
        # _, success, _ = self.send_command(0xE5, 0, 0x04)
        # self.print_result("Set Heating Cycle Time", success)

        # # Weight Sensor Gain (0: Gain = 128)
        # # FA EA 00 00 FF
        # _, success, _ = self.send_command(0xEA, 0, 0)
        # self.print_result("Set Weight Sensor Gain", success)

        # # Weight Sensing Value Scaling ( '1' )
        # # FA EB 01 01 FF
        # _, success, _ = self.send_command(0xEB, 1, 1)
        # self.print_result("Set Weight Sensing Value Scaling", success)

        # # Set A Mapping Point at 0g (0x0FE1 = 4065)
        # # FA EC 0F E1 FF
        # _, success, _ = self.send_command(0xEC, 0x0F, 0xE1)
        # self.print_result("Set A Mapping Point at 0g", success)

        # # Set A Mapping Point at 5kg (0x1FE6 = 8166)
        # # FA ED 1F E6 FF
        # _, success, _ = self.send_command(0xED, 0x1F, 0xE6)
        # self.print_result("Set A Mapping Point at 5kg", success)

        # # Set A Mapping Point at 10kg (0x2FEC = 12268)
        # # FA EE 2F EC FF
        # _, success, _ = self.send_command(0xEE, 0x2F, 0xEC)
        # self.print_result("Set A Mapping Point at 10kg", success)

        # # Set B Mapping Point at 0g (0x0519 = 1305)
        # # FA EF 05 19 FF
        # _, success, _ = self.send_command(0xEF, 0x05, 0x19)
        # self.print_result("Set B Mapping Point at 0g", success)

        # # Set B Mapping Point at 5kg (0x1546 = 5446)
        # # FA F0 15 46 FF
        # _, success, _ = self.send_command(0xF0, 0x15, 0x46)
        # self.print_result("Set B Mapping Point at 5kg", success)

        # # Set B Mapping Point at 10kg (0x2574 = 9588)
        # # FA F1 25 74 FF
        # _, success, _ = self.send_command(0xF1, 0x25, 0x74)
        # self.print_result("Set B Mapping Point at 10kg", success)

    def swap_bytes(self, word: int) -> int:
        # Ensure the word is a 16-bit value
        if not (0 <= word <= 0xFFFF):
            raise ValueError(
                "Input must be a 16-bit word " "(0 <= word <= 0xFFFF)",
            )
        # Swap the bytes
        swapped_word = ((word & 0x00FF) << 8) | ((word & 0xFF00) >> 8)
        return swapped_word

    def send_command(self, command_byte: int, data1: int, data2: int) -> Tuple[Optional[int], bool, Optional[int]]:

        # Validate inputs
        if not (0 <= command_byte <= 255 and 0 <= data1 <= 255 and 0 <= data2 <= 255):
            raise ValueError("All command inputs must be within the range 0 to 255.")

        time.sleep(INTER_COMMAND_DELAY)  # delay between commands

        if self.emulation:

            if PRINT_RESULT:
                print(f"Emulation: Command: {command_byte:02X}, Data1: {data1:02X}, Data2: {data2:02X}")

            return 0, True, 0

        if not self.serial_connection:
            return None, False, 0

        # Build the communication packet
        packet = bytes([0xFA, command_byte, data1, data2, 0xFF])
        packet_str = "-".join(format(x, "02x") for x in packet)

        if PRINT_RESULT:
            print(f"Packet: {packet_str}")

        # Send the packet
        self.serial_connection.write(packet)

        # Read the response
        response = self.serial_connection.read(5)
        response_str = "-".join(format(x, "02x") for x in response)

        if PRINT_RESULT:
            print(f"Response: {response_str}")

        # Check if the response starts with 0xF5
        if response and response[0] == 0xF5:
            status = response[2]  # Get the status byte
            data = (response[3] << 8) | response[2]
            return data, True, status
        else:
            return None, False, None

    def read_command(self, command_byte: int) -> Tuple[Optional[int], bool, Optional[int]]:
        if self.emulation:
            return 0, True, 0

        # For read commands, just send the command and get the echoed data
        return self.send_command(command_byte, 0, 0)

    def get_temperatureA(self) -> Optional[int]:
        if self.emulation:
            return 26

        response_data, success, _ = self.read_command(0x03)
        # print(f"response_data: {response_data}")
        return response_data & 0xFF if success else None

    def get_temperatureB(self) -> Optional[int]:
        if self.emulation:
            return 26

        response_data, success, _ = self.read_command(0x03)
        # print(f"Temperature A: {response_data}")
        return (response_data >> 8) & 0xFF if success else None

    def get_thermos_weightA(self) -> Optional[int]:
        if self.emulation:
            return 80

        response_data, success, _ = self.read_command(0x01)
        # print(f"Thermos Weigh A: {response_data}")
        swapped_word = self.swap_bytes(response_data) if response_data is not None else None
        return swapped_word if success else None

    def get_thermos_weightB(self) -> Optional[int]:
        if self.emulation:
            return 80

        response_data, success, _ = self.read_command(0x02)
        # print(f"Thermos Weigh B: {response_data}")
        swapped_word = self.swap_bytes(response_data) if response_data is not None else None
        return swapped_word if success else None

    def get_cup_statusA(self) -> Optional[int]:
        response_data, success, _ = self.read_command(0x04)
        # ARTY swapped the taps temporarily
        # return response_data & 0xFF if success else None
        return (response_data >> 8) & 0xFF if success else None

    def get_cup_statusB(self) -> Optional[int]:
        response_data, success, _ = self.read_command(0x04)
        # ARTY swapped the taps temporarily
        # return (response_data >> 8) & 0xFF if success else None
        return response_data & 0xFF if success else None

    def get_version(self) -> Optional[int]:
        response_data, success, _ = self.read_command(0x00)
        return response_data if success else None

    def get_versionS(self) -> Optional[int]:
        response_data, success, _ = self.read_command(0x00)
        return (response_data >> 8) & 0xFF if success else None

    def get_versionH(self) -> Optional[int]:
        response_data, success, _ = self.read_command(0x00)
        return response_data & 0xFF if success else None

    def set_heaterA(self, strength: int) -> bool:
        # strength = 0: disable, stop immediately
        _, success, _ = self.send_command(0x11, 0, strength)
        return success

    def set_heaterB(self, strength: int) -> bool:
        # strength = 0: disable, stop immediately
        _, success, _ = self.send_command(0x12, 0, strength)
        return success

    def set_pumpA(self, duration: int) -> Tuple[Optional[int], bool, Optional[int]]:
        # duration: 1~20 - Enable for 1~20 seconds
        # duration = 0: disable, stop immediately
        data, success, status = self.send_command(0x13, 0, duration)
        return data, success, status

    def set_pumpB(self, duration: int) -> Tuple[Optional[int], bool, Optional[int]]:
        # duration: 1~20 - Enable for 1~20 seconds
        # duration = 0: disable, stop immediately
        data, success, status = self.send_command(0x14, 0, duration)
        return data, success, status

    def set_cleanerA(self, mode: int) -> Tuple[Optional[int], bool, Optional[int]]:
        # mode: 1, 2, 3, mode = 0: disable, stop immediately
        data, success, status = self.send_command(0x15, 0, mode)
        return data, success, status

    def set_cleanerB(self, mode: int) -> Tuple[Optional[int], bool, Optional[int]]:
        # mode: 1, 2, 3, mode = 0: disable, stop immediately
        data, success, status = self.send_command(0x16, 0, mode)
        return data, success, status

    def set_coffee_pump_power(self, power: int) -> bool:
        # 0~255	Coffee Pump power setting in N/255 %.
        _, success, _ = self.send_command(0xE1, power, power)
        return success

    def set_clean_pump_power(self, power: int) -> bool:
        # 0~255	Clean Pump power setting in N/255 %.
        _, success, _ = self.send_command(0xE2, power, power)
        return success

    def set_max_pump_time(self, pump_time: int) -> bool:
        # 0~255	Maximum Coffee Pump time in N seconds.
        _, success, _ = self.send_command(0xE3, 0, pump_time)
        return success

    def set_heating_cycle_time(self, cycle_time: int) -> bool:
        # 0~255	N x 4 (in sec) is the cycle timing of heater.
        _, success, _ = self.send_command(0xE5, 0, cycle_time)
        return success

    def get_distance_sensorA(self) -> Optional[int]:
        # ARTY swapped the taps temporarily
        response_data, success, _ = self.read_command(0xE9)
        # print(f"response_data: {response_data}")
        swapped_word = self.swap_bytes(response_data) if response_data is not None else None
        return swapped_word if success else None

    def get_distance_sensorB(self) -> Optional[int]:
        # ARTY swapped the taps temporarily
        response_data, success, _ = self.read_command(0xE8)
        # print(f"response_data: {response_data}")
        swapped_word = self.swap_bytes(response_data) if response_data is not None else None
        return swapped_word if success else None

    def print_result(self, title, success):
        if PRINT_RESULT:
            print(f"{title}: {success}")
