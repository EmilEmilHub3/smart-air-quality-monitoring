from gpiozero import Button


class ButtonController:
    """
    Håndterer fysisk knap via GPIO.

    Knap-forbindelse:
    GPIO17 / physical pin 11 -> knap
    GND / physical pin 9     -> knap

    Programmet bruger Raspberry Pi's interne pull-up resistor,
    så der er ikke behov for en ekstern resistor til knappen.
    """

    def __init__(
        self,
        gpio_pin,
        display_controller,
    ):
        # Reference til displayet, så knappen kan skifte visning.
        self.display_controller = display_controller

        # Opretter knappen på den valgte GPIO-pin.
        self.button = Button(
            gpio_pin,
            pull_up=True,
            bounce_time=0.2,
        )

        # Callback/interrupt:
        # Når knappen trykkes, kaldes on_button_pressed automatisk.
        self.button.when_pressed = self.on_button_pressed

    def on_button_pressed(self):
        """
        Kaldes automatisk ved knaptryk.

        Dette er et eksempel på interrupt/callback-baseret input:
        programmet behøver ikke selv hele tiden tjekke knappen i et loop.
        """

        print("Button pressed - switching display mode")

        self.display_controller.next_mode()
