from RPLCD.i2c import CharLCD


class DisplayController:

    """
    Håndterer LCD display via I2C.
    """

    def __init__(self, address=0x27):

        self.mode = 0

        self.latest_values = None

        self.modes = [
            "humidity",
            "radon",
            "temperature",
        ]

        self.lcd = CharLCD(
            i2c_expander="PCF8574",
            address=address,
            port=1,
            cols=16,
            rows=2,
        )

        self.show_startup_message()

    def show_startup_message(self):

        self.lcd.clear()

        self.lcd.write_string(
            "Smart Air"
        )

        self.lcd.cursor_pos = (1, 0)

        self.lcd.write_string(
            "Starting..."
        )

    def next_mode(self):

        self.mode = (
            self.mode + 1
        ) % len(self.modes)

        self.refresh()

    def update_values(self, values):

        self.latest_values = values

        self.refresh()

    def refresh(self):

        self.lcd.clear()

        if self.latest_values is None:

            self.lcd.write_string(
                "No data yet"
            )

            return

        mode = self.modes[self.mode]

        if mode == "humidity":

            self.lcd.write_string(
                "Humidity"
            )

            self.lcd.cursor_pos = (1, 0)

            self.lcd.write_string(
                f"{self.latest_values.humidity:.1f}%"
            )

        elif mode == "radon":

            self.lcd.write_string(
                "Radon STA"
            )

            self.lcd.cursor_pos = (1, 0)

            self.lcd.write_string(
                f"{self.latest_values.radon_sta}"
            )

        elif mode == "temperature":

            self.lcd.write_string(
                "Temperature"
            )

            self.lcd.cursor_pos = (1, 0)

            self.lcd.write_string(
                f"{self.latest_values.temperature:.1f}C"
            )

    def close(self):

        self.lcd.clear()

        self.lcd.write_string(
            "Stopped"
        )
