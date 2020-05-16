import asyncio

from starlette.exceptions import HTTPException
import json as json


async def validate(validator, request):
    try:
        json_data = await request.json()
    except json.decoder.JSONDecodeError:
        raise HTTPException(400, "Body is not JSON")
    data, errors = validator.validate_or_error(json_data)
    if errors:
        raise HTTPException(400, dict(errors))
    return dict(data)


def add_task(task):
    asyncio.get_event_loop().create_task(task)
