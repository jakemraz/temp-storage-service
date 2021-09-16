import json
import logging
import os
import time
import boto3

logger = logging.getLogger('set_value')
logger.setLevel(logging.INFO)
ddb = boto3.resource('dynamodb')
table = ddb.Table(os.environ['TEMP_STORAGE_TABLE'])

def handler(event, context):
    logger.info(event)

    body = event.get('body', None)
    body = json.loads(body) if body != None else None
    if (body == None):
        return respond(400, {
            'code': 100000,
            'message': 'Missing Parameters'
        })

    value = body.get('value', None)
    if (value == None):
        return respond(400, {
            'code': 100000,
            'message': 'Missing Parameters: value'
        })

    key = body.get('key', None)
    if (key == None):
        return respond(400, {
            'code': 100000,
            'message': 'Missing Parameters: key'
        })

    table.put_item(
        Item={
            'key': key,
            'value': value,
            'TTL': int(time.time()) + 3600
        }
    )

    res = {}

    return respond(200, res)

def respond(statusCode, body):
    return {
        'statusCode': statusCode,
        'body': json.dumps(body)
    }
