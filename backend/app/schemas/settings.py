from pydantic import BaseModel

class APIkeyRequest(BaseModel):
    provider:str
    api_key:str