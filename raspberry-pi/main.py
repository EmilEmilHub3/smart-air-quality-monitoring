import json
import signal
import sys
import time

from airthings_reader import Wave2
from backend_client import BackendClient
from display_controller import DisplayController
from button_controller import ButtonController
from led_controller import LedController


def main():
    """
    Program entrypoint.

    Programflow:
    1. Læser konfiguration fra config.json
    2. Opretter Airthings sensor
    3. Opretter backend klient
    4. Opretter LCD display
    5. Opretter GPIO knap
    6. Opretter PWM LED
    7. Læser målinger
    8. Viser målinger på display
    9. Opdaterer LED lysstyrke ud fra radonniveau
    10. Sender målinger til backend
    """

    # Læs konfiguration fra fil.
    with open("config.json", "r") as file:
        config = json.load(file)

    # Hent værdier fra config.json.
    serial_number = config["serialNumber"]
    sample_period = config["samplePeriod"]
    backend_url = config["backendUrl"]
    api_key = config["apiKey"]

    # LCD adressen gemmes som tekst i config.json, f.eks. "0x27".
    # Derfor konverteres den til et tal med base 16.
    lcd_address = int(
        config["lcdAddress"],
        16,
    )

    # GPIO pin til knappen.
    button_pin = config["buttonPin"]

    print("Configuration loaded")

    # Opret Airthings sensor.
    wave = Wave2(serial_number)

    # Opret backend klient.
    backend = BackendClient(
        backend_url=backend_url,
        api_key=api_key,
    )

    # Opret LCD display via I2C.
    display = DisplayController(
        address=lcd_address,
    )

    # Opret GPIO knap.
    # Knappen skifter mellem humidity, radon og temperature på displayet.
    button = ButtonController(
        gpio_pin=button_pin,
        display_controller=display,
    )

    # Opret PWM LED på GPIO18.
    # LED'en lyser svagt ved lav radon og kraftigere ved høj radon.
    led = LedController(
        gpio_pin=18,
    )

    def handle_exit(sig, frame):
        """
        Lukker forbindelser pænt ved CTRL+C.
        """

        print("\nStopping Smart Air...")

        # Afbryd BLE-forbindelse til Airthings sensor.
        wave.disconnect()

        # Sluk LED og frigiv GPIO.
        led.close()

        # Ryd LCD display.
        display.close()

        # Stop programmet.
        sys.exit(0)

    # Gør så CTRL+C kalder handle_exit().
    signal.signal(signal.SIGINT, handle_exit)

    print("Smart Air started")
    print(f"Serial Number: {serial_number}")
    print(f"Backend URL: {backend_url}")
    print(f"Sample Period: {sample_period} seconds")

    while True:
        try:
            # Opret forbindelse til Airthings.
            wave.connect(retries=3)

            # Læs målinger fra Airthings.
            values = wave.read()

            # Udskriv målinger i terminal.
            print(values)

            # Opdater LCD display med nyeste målinger.
            display.update_values(values)

            # Opdater LED lysstyrke med PWM ud fra radon STA.
            # Jo højere radon, desto højere duty cycle og kraftigere lys.
            led.update_radon(values.radon_sta)

            # Send målinger til NestJS backend.
            backend.send_measurement(values)

        except Exception as e:
            print("ERROR:", repr(e))

        finally:
            # Afbryd BLE-forbindelsen efter hver måling.
            wave.disconnect()

        # Vent til næste måling.
        time.sleep(sample_period)


if __name__ == "__main__":
    main()
