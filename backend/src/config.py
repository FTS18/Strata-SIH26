import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Strata Urban Intelligence API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Server & CORS
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # MQTT Configuration
    MQTT_BROKER_HOST: str = os.getenv("MQTT_HOST", "localhost")
    MQTT_BROKER_PORT: int = int(os.getenv("MQTT_PORT", "1883"))
    MQTT_TELEMETRY_TOPIC: str = "strata/fleet/telemetry"
    MQTT_DEFECT_TOPIC: str = "strata/fleet/defects"
    MQTT_INCIDENT_TOPIC: str = "strata/fleet/incidents"
    
    # Spatial deduplication buffer in meters
    DEDUPLICATION_RADIUS_METERS: float = 15.0

    class Config:
        case_sensitive = True

settings = Settings()
