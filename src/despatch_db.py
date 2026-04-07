"""
Despatch ownership mapping table handle.

Table schema: PK email_id (S), SK despatch_id (S)
"""
import os
import boto3

_REGION = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION") or "us-east-1"
dynamodb = boto3.resource("dynamodb", region_name=_REGION)

# TODO: Set DESPATCH_TABLE_NAME in Lambda environment.
DESPATCH_TABLE_NAME = os.environ.get("DESPATCH_TABLE_NAME", "Despatch_Id_Email")

dynamodb_table = dynamodb.Table(DESPATCH_TABLE_NAME)