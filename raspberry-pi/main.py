import argparse
import signal
import sys
import time

from airthings_reader import Wave2
from backend_client import BackendClient
from display_controller import DisplayController
from button_controller import ButtonController


def main():
    """
    Program entrypoint.

    Programflow:
    1. Opretter controllers/services
    2. Scanner efter Airthings via BLE
    3. Læser målinger fra sensoren
    4. Viser måling på LCD-display
    5. Sender måling til NestJS backend
    6. Knap kan skifte mellem humidity, radon og temperature
    """

    parser = argparse.ArgumentParser()

    parser.add_argument("serial_number", type=int)
    parser.add_argument("sample_period", type=int)
    parser.add_argument("backend_url")

    parser.add_argument(
        "--api-key",
        default="change-this-pi-key",
    )

    parser.add_argument(
        "--lcd-address",
        default="0x27",
    )

    parser.add_argument(
        "--button-pin",
        type=int,
        default=17,
    )

    args = parser.parse_args()

    lcd_address = int(args.lcd_address, 16)

    wave = Wave2(args.serial_number)

    backend = BackendClient(
        backend_url=args.backend_url,
        api_key=args.api_key,
    )

    display = DisplayController(
        address=lcd_address,
    )

    button = ButtonController(
        gpio_pin=args.button_pin,
        display_controller=display,
    )

    def handle_exit(sig, frame):
        """
        Lukker forbindelser pænt ved CTRL+C.
        """

        wave.disconnect()
        display.close()
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_exit)

    while True:
        try:
            wave.connect(retries=3)

            values = wave.read()

            print(values)

            display.update_values(values)

            backend.send_measurement(values)

        except Exception as e:
            print("ERROR:", repr(e))

        finally:
            wave.disconnect()

        time.sleep(args.sample_period)


if __name__ == "__main__":
    main()
