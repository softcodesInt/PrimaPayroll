from rest_framework_jwt.settings import api_settings


def generate_token(user):
    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

    payload = jwt_payload_handler(user)
    payload['user_id'] = str(payload['user_id'])
    token = jwt_encode_handler(payload)
    return token