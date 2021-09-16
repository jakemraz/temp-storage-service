import json
import logging
import os
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger('get-value')
logger.setLevel(logging.INFO)
ddb = boto3.resource('dynamodb')
table = ddb.Table(os.environ['TEMP_STORAGE_TABLE'])

def handler(event, context):
    query = event.get('queryStringParameters', None)
    if query == None:
        return respond(400, {
            "code": 100000,
            "message": "Missing parameters",
        })

    key = query.get('key', None)

    if key == None:
        return respond(400, {
            "code": 100000,
            "message": "Missing parameters: key",
        })
    try:
        response = table.get_item(Key={'key': key})
    except ClientError as e:
        return respond(404, {
            "code": 100007,
            "message": e.response['']['Message'],
        })

    item = response.get('Item', None)
    if item == None:
        return respond(404, {
            "code": 100007,
            "message": "not found",
        })

    # TODO : 3분 유효

    print(item)
    return respond(200, {
        "value": item.get('value', None)
    })


def respond(statusCode, body):
    return {
        'statusCode': statusCode,
        'body': json.dumps(body)
    }

# print(handler({'queryStringParameters':{
#     'id':'asdfasdf@asdf.net',
#     'token':'5a777653'
# }}, None))