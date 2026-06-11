import json
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
    1. Læser konfiguration fra config.json
    2. Opretter Airthings sensor
    3. Opretter LCD display
    4. Opretter GPIO knap
    5. Opretter backend klient
    6. Læser målinger
    7. Viser målinger på display
    8. Sender målinger til backend
    """

    # Læs konfiguration fra fil.
    with open("config.json", "r") as file:
        config = json.load(file)

    serial_number = config["serialNumber"]

    sample_period = config["samplePeriod"]

    backend_url = config["backendUrl"]

    api_key = config["apiKey"]

    lcd_address = int(
        config["lcdAddress"],
        16,
    )

    button_pin = config["buttonPin"]

    print("Configuration loaded")

    # Airthings sensor.
    wave = Wave2(serial_number)

    # Backend klient.
    backend = BackendClient(
        backend_url=backend_url,
        api_key=api_key,
    )

    # LCD display.
    display = DisplayController(
        address=lcd_address,
    )

    # GPIO knap.
    button = ButtonController(
        gpio_pin=button_pin,
        display_controller=display,
    )

    def handle_exit(sig, frame):
        """
        Lukker forbindelser pænt ved CTRL+C.
        """

        print("\nStopping Smart Air...")

        wave.disconnect()

        display.close()

        sys.exit(0)

    signal.signal(signal.SIGINT, handle_exit)

    print("Smart Air started")
    print(f"Serial Number: {serial_number}")
    print(f"Backend URL: {backend_url}")
    print(f"Sample Period: {sample_period} seconds")

    while True:
        try:
            # Opret forbindelse til Airthings.
            wave.connect(retries=3)

            # Læs målinger.
            values = wave.read()

            # Udskriv målinger i terminal.
            print(values)

            # Opdater LCD display.
            display.update_values(values)

            # Send til NestJS backend.
            backend.send_measurement(values)

        except Exception as e:
            print("ERROR:", repr(e))

        finally:
            wave.disconnect()

        # Vent til næste måling.
        time.sleep(sample_period)


if __name__ == "__main__":
    main()
