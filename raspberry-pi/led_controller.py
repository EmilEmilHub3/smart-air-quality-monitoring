from gpiozero import PWMLED


class LedController:
    """
    Håndterer PWM-styring af en LED.

    LED'en bruges som visuel indikator for radonniveauet:

    Lav radon  -> svagt lys
    Høj radon -> kraftigt lys

    PWM (Pulse Width Modulation) bruges til at ændre
    LED'ens lysstyrke ved at variere duty cycle.
    """

    def __init__(self, gpio_pin=18):
        """
        Opretter en PWM LED på den angivne GPIO-pin.

        GPIO18 understøtter hardware-PWM på Raspberry Pi
        og er derfor et godt valg til LED-styring.
        """

        self.led = PWMLED(gpio_pin)

    def update_radon(self, radon):
        """
        Opdaterer LED'ens lysstyrke ud fra radonniveauet.

        Radonværdien begrænses til intervallet 0-300 Bq/m³.

        Derefter konverteres værdien til et tal mellem
        0.0 og 1.0 som PWMLED forventer.

        Eksempler:

        0 Bq/m³   -> 0.0  -> LED slukket
        150 Bq/m³ -> 0.5  -> 50% duty cycle
        300 Bq/m³ -> 1.0  -> 100% duty cycle
        """

        # Begræns radon til intervallet 0-300.
        radon = max(
            0,
            min(radon, 300)
        )

        # Konverter til PWM-værdi mellem 0.0 og 1.0.
        brightness = radon / 300

        # Opdater LED lysstyrken.
        self.led.value = brightness

    def close(self):
        """
        Slukker LED'en.

        Kaldes når programmet afsluttes.
        """

        self.led.off()
