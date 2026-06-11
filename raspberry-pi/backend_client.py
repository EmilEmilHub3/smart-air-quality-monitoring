import json
import requests


class BackendClient:
    """
    Håndterer HTTP kommunikation med NestJS backend.
    """

    def __init__(
        self,
        backend_url,
        api_key,
    ):
        self.backend_url = backend_url
        self.api_key = api_key

    def send_measurement(self, values):
        """
        Sender målinger til backend.
        """

        payload = values.to_dict()

        print("Sending to backend:")

        print(
            json.dumps(
                payload,
                indent=2
            )
        )

        response = requests.post(
            self.backend_url,
            json=payload,
            timeout=10,
            headers={
                "x-api-key": self.api_key
            }
        )

        print(
            "Backend status:",
            response.status_code
        )

        if response.status_code >= 400:

            print(
                "Backend response:",
                response.text
            )

        else:

            print(
                "Measurement sent successfully"
            )
