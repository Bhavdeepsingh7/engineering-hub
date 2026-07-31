class NoAPIKeyConfiguredError(Exception):
    """Raised when chat is requested without the required Gemini key."""

    error = "NO_API_KEY"
    message = "Please add your Gemini API key in Settings before starting a chat."
