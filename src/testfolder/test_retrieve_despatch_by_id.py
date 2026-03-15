# Import modules needed for testing
import pytest
import sys
import json
from unittest.mock import patch, MagicMock, PropertyMock
from botocore.exceptions import ClientError

# Import functions required for testing
from src.constants import updated_order
from src.helper_functions import parse_despatch_advice_and_return_success_boolean, generate_despatch_advice_and_return_id
from src.delete_despatch import delete_despatch_advice
from src.retrieve_despatch_by_id import get_despatch_advice_by_id
from src.generate_despatch import generate_despatch
from src.update_despatch import update_despatch

# Makes a mock database for testing
mock_db = MagicMock()
sys.modules['db'] = mock_db

# Test that an existing despatch advice is successfully retrieved
def test_successfully_retrieves_despatch_advice():
    with patch('src.generate_despatch.dynamodb_table') as mock_table:
        mock_table.table_status = 'ACTIVE'

        # Generate a despatch advice
        despatch_id = generate_despatch_advice_and_return_id()

    with patch('src.retrieve_despatch_advice_by_id.dynamodb_table') as mock_table:
        mock_table.table_status = 'ACTIVE'

        # Retrieve the despatch advice and check response is correct
        retrieve_response = get_despatch_advice_by_id(despatch_id)
        assert retrieve_response.get("statusCode", '') == 200
        xml_string = retrieve_response.get("body", '')
        assert parse_despatch_advice_and_return_success_boolean(xml_string) == True

# Test that an updated despatch advice is successfully retrieved
def test_successfully_retrieves_updated_despatch_advice():
    with patch('src.generate_despatch.dynamodb_table') as mock_table:
        mock_table.table_status = 'ACTIVE'
        # Generate a despatch advice
        despatch_id = generate_despatch_advice_and_return_id()

    with patch('src.update_despatch.dynamodb_table') as mock_table:
        mock_table.table_status = 'ACTIVE'
        # Update despatch advice
        update_despatch(despatch_id, updated_order)

    with patch('src.retrieve_despatch_advice_by_id.dynamodb_table') as mock_table:
        mock_table.table_status = 'ACTIVE'
        # Retrieve the despatch advice and check response is correct
        retrieve_response = get_despatch_advice_by_id(despatch_id)
        assert retrieve_response.get("statusCode", '') == 200
        xml_string = retrieve_response.get("body", '')
        assert parse_despatch_advice_and_return_success_boolean(xml_string) == True

# Test that a deleted despatch advice fails to retrieve
def test_fails_to_retrieve_deleted_despatch_advice():
    with patch('src.generate_despatch.dynamodb_table') as mock_table:
        mock_table.table_status = 'ACTIVE'
        # Generate a despatch advice
        despatch_id = generate_despatch_advice_and_return_id()

    with patch('src.delete_despatch.dynamodb_table') as mock_table:
        mock_table.table_status = 'ACTIVE'
        # Delete the despatch advice
        delete_despatch_advice(despatch_id)

    with patch('src.retrieve_despatch_advice_by_id.dynamodb_table') as mock_table:
        mock_table.table_status = 'ACTIVE'
        # Retrieve the despatch advice and check response is correct
        retrieve_response = get_despatch_advice_by_id(despatch_id)
        assert retrieve_response.get("statusCode", '') == 404
        assert retrieve_response.get("body", '') == f"Despatch advice {despatch_id} not found"

# Test that a non-existent despatch advice cannot be retrieved
def test_fails_to_retrieve_non_existent_despatch_advice():
    with patch('src.retrieve_despatch_advice_by_id.dynamodb_table') as mock_table:
        mock_table.table_status = 'ACTIVE'

        retrieve_response = get_despatch_advice_by_id(-100)
        assert retrieve_response.get("statusCode", '') == 404
        assert retrieve_response.get("body", '') == f"Despatch advice {despatch_id} not found"

# Test that the retrieving the table returns 503 when AWS throws a ClientError
def test_fails_when_client_error_returned():
    with patch('src.retrieve_despatch_advice_by_id.dynamodb_table') as mock_table:
        type(mock_table).table_status = PropertyMock(side_effect = ClientError(
            {'Error': {'Code': '503', 'Message': 'AWS Error'}},'RetrieveUser'))

        retrieve_response = get_despatch_advice_by_id(1)
        assert retrieve_response.get("statusCode", '') == 503
