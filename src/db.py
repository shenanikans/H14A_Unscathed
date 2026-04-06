"""
Backward-compatible DynamoDB table handle.

This project uses two DynamoDB tables:
- Users: accessed via src/users_db.py
- Despatch_Id_Email: mapping of (email_id, despatch_id) -> ownership metadata

Older modules import src.db.dynamodb_table, so we expose the Despatch_Id_Email table
here and allow configuring its name via env.
"""
import os
import boto3

_REGION = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION") or "us-east-1"
dynamodb = boto3.resource("dynamodb", region_name=_REGION)

# TODO: Set DESPATCH_TABLE_NAME in Lambda environment.
DESPATCH_TABLE_NAME = os.environ.get("DESPATCH_TABLE_NAME", "Despatch_Id_Email")

# Table schema: PK email_id (S), SK despatch_id (S)
dynamodb_table = dynamodb.Table(DESPATCH_TABLE_NAME)

