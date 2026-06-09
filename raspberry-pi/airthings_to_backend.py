import argparse
import json
import signal
import struct
import sys
import time

# HTTP klient til kommunikation med NestJS backend.
import requests

# BLE bibliotek til kommunikation med Airthings sensoren.
import bluepy.btle as btle


class Wave2:
    """
    Håndterer kommunikation med Airthings Wave sensoren via BLE.
    """

    # UUID for karakteristikken som indeholder de aktuelle målinger.
    CURR_VAL_UUID = btle.UUID("b42e4dcc-ade7-11e4-89d3-123b93f75cba")

    def __init__(self, serial_number):

        # BLE forbindelse til sensoren.
        self._periph = None

        # Karakteristik som indeholder målingerne.
        self._char = None

        # MAC adresse findes når sensoren opdages.
        self.mac_addr = None

        # Serienummer bruges til at identificere den korrekte sensor.
        self.serial_number = serial_number

    def is_connected(self):
        """
        Kontrollerer om BLE forbindelsen stadig er aktiv.
        """
        try:
            return self._periph.getState() == "conn"
        except Exception:
            return False

    def discover(self):
        """
        Scanner efter Airthings sensoren og returnerer dens MAC adresse.
        """

        scan_interval = 0.1
        timeout = 5

        scanner = btle.Scanner()

        print("Scanning for Airthings Wave...")

        for _ in range(int(timeout / scan_interval)):
            advertisements = scanner.scan(scan_interval)

            for adv in advertisements:

                found_serial = parse_serial_number(
                    adv.getValue(btle.ScanEntry.MANUFACTURER)
                )

                if self.serial_number == found_serial:
                    print(f"Found Airthings device: {adv.addr}")
                    return adv.addr

        return None

    def connect(self, retries=3):
        """
        Opretter forbindelse til Airthings sensoren.
        Forsøger flere gange hvis forbindelsen fejler.
        """

        tries = 0

        while tries < retries and not self.is_connected():

            tries += 1

            if self.mac_addr is None:
                self.mac_addr = self.discover()

            if self.mac_addr is None:
                raise Exception("Airthings device not found")

            try:
                print(f"Connecting to {self.mac_addr}...")

                self._periph = btle.Peripheral(self.mac_addr)

                # Henter karakteristikken som indeholder målingerne.
                self._char = self._periph.getCharacteristics(
                    uuid=self.CURR_VAL_UUID
                )[0]

                print("Connected")

            except Exception as e:

                print(
                    f"Connect failed attempt {tries}/{retries}: {e}"
                )

                self.disconnect()
                self.mac_addr = None

                if tries == retries:
                    raise

                time.sleep(2)

    def read(self):
        """
        Læser rå bytes fra sensoren og konverterer dem til målinger.
        """

        rawdata = self._char.read()

        return CurrentValues.from_bytes(rawdata)

    def disconnect(self):
        """
        Lukker BLE forbindelsen korrekt.
        """

        if self._periph is not None:
            try:
                self._periph.disconnect()
            except Exception:
                pass

        self._periph = None
        self._char = None


class CurrentValues:
    """
    Indeholder de aktuelle målinger fra sensoren.
    """

    def __init__(self, humidity, radon_sta, radon_lta, temperature):
        self.humidity = humidity
        self.radon_sta = radon_sta
        self.radon_lta = radon_lta
        self.temperature = temperature

    @classmethod
    def from_bytes(cls, rawdata):
        """
        Konverterer rå bytes fra Airthings til temperatur,
        luftfugtighed og radonmålinger.
        """

        data = struct.unpack("<4B8H", rawdata)

        if data[0] != 1:
            raise ValueError(
                f"Incompatible current values version. Expected 1, got {data[0]}"
            )

        return cls(
            humidity=data[1] / 2.0,
            radon_sta=data[4],
            radon_lta=data[5],
            temperature=data[6] / 100.0,
        )

    def to_dict(self):
        """
        Konverterer målingerne til et dictionary som kan sendes
        til NestJS backend som JSON.
        """

        return {
            "humidity": self.humidity,
            "temperature": self.temperature,
            "radonShortTermAvg": self.radon_sta,
            "radonLongTermAvg": self.radon_lta,
        }

    def __str__(self):
        """
        Bruges til læsevenlig udskrift i terminalen.
        """

        return (
            f"Humidity: {self.humidity} %rH, "
            f"Temperature: {self.temperature} °C, "
            f"Radon STA: {self.radon_sta} Bq/m3, "
            f"Radon LTA: {self.radon_lta} Bq/m3"
        )


def parse_serial_number(manufacturer_data):
    """
    Udtrækker serienummeret fra BLE advertisement data.
    """

    try:
        device_id, serial_number, _ = struct.unpack(
            "<HLH",
            manufacturer_data
        )
    except Exception:
        return None

    if device_id == 0x0334:
        return serial_number

    return None


def send_to_backend(backend_url, values, api_key):
    """
    Sender målingerne til NestJS backend via HTTP POST.
    """

    payload = values.to_dict()

    print("Sending to backend:")
    print(json.dumps(payload, indent=2))

    response = requests.post(
        backend_url,
        json=payload,
        timeout=10,
        headers={
            "x-api-key": api_key
        }
    )

    print("Backend status:", response.status_code)

    if response.status_code >= 400:
        print("Backend response:", response.text)
    else:
        print("Measurement sent successfully")


def main():
    """
    Program entrypoint.
    """

    parser = argparse.ArgumentParser()

    # Airthings sensorens serienummer.
    parser.add_argument("serial_number", type=int)

    # Antal sekunder mellem målinger.
    parser.add_argument("sample_period", type=int)

    # URL til NestJS backend.
    parser.add_argument("backend_url")

    # API nøgle som verificeres af backend.
    parser.add_argument(
        "--api-key",
        default="change-this-pi-key"
    )

    args = parser.parse_args()

    wave = Wave2(args.serial_number)

    def handle_exit(sig, frame):
        """
        Lukker BLE forbindelsen ved CTRL+C.
        """
        wave.disconnect()
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_exit)

    while True:
        try:
            # Opret forbindelse til sensoren.
            wave.connect(retries=3)

            # Læs målingerne.
            values = wave.read()

            # Udskriv målingerne.
            print(values)

            # Send målingerne til backend.
            send_to_backend(
                args.backend_url,
                values,
                args.api_key
            )

        except Exception as e:
            print("ERROR:", repr(e))

        finally:
            wave.disconnect()

        # Sender målinger periodisk.
        # Eksempel: 60 = én måling pr. minut.
        time.sleep(args.sample_period)


if __name__ == "__main__":
    main()
