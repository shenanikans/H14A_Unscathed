import json
import xml.etree.ElementTree as ET
import xmlschema
from datetime import datetime, timedelta

## NAMESPACES!!
NS_CBC = 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
NS_CAC = 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2'
NS_UBL = 'urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2'


def cbc_add(parent, tag, text, attribs=None):
    el = ET.SubElement(parent, f'{{{NS_CBC}}}{tag}', attrib=attribs or {})
    el.text = text
    return el
 
 
def cac_add(parent, tag):
    """
    Add a CommonAggregateComponents child element to a parent.
    e.g. cac_add(da, 'OrderReference') produces <cac:OrderReference>
    """
    return ET.SubElement(parent, f'{{{NS_CAC}}}{tag}')
 

def generate_despatch(event, context):

    try:
        order_xml_string = event['body']

        ## schema validation -> ensures given document passes required schema
        schema = xmlschema.XMLSchema('schemas/maindoc/UBL-Order-2.4.xsd')
        try:
            schema.validate(order_xml_string)
        except xmlschema.XMLSchemaValidationError as e:
            return {'statusCode': 400, 'body': f'Invalid Order XML: {e}'}


        root = ET.fromstring(order_xml_string.encode())
 
        order_id = root.findtext(f'{{{NS_CBC}}}ID') or 'UNKNOWN'
        issue_date = root.findtext(f'{{{NS_CBC}}}IssueDate') or ''
        buyer_customer_party = root.findtext(f'{{{NS_CBC}}}BuyerCustomerParty') or ''
        seller_supplier_party = root.findtext(f'{{{NS_CBC}}}SellerSupplierParty') or ''

        ## delivery date calculation
        delivery_start = (datetime.utcnow() + timedelta(days=1)).strftime('%Y-%m-%d')
        delivery_end = (datetime.utcnow() + timedelta(days=2)).strftime('%Y-%m-%d')
        issue_date_today = datetime.utcnow().strftime('%Y-%m-%d')

        ## building our XML
        da = ET.Element(
            f'{{{NS_UBL}}}DespatchAdvice',
            nsmap={None: NS_UBL, 'cbc_add': NS_CBC, 'cac': NS_CAC}
        )

        cbc_add(da, 'UBLVersionID',          '2.0')
        cbc_add(da, 'ID',                    str(uuid.uuid4().int)[:6])
        cbc_add(da, 'CopyIndicator',         'false')
        cbc_add(da, 'UUID',                  str(uuid.uuid4()).upper())
        cbc_add(da, 'IssueDate',             issue_date_today)
        cbc_add(da, 'DocumentStatusCode',    'NoStatus')
        cbc_add(da, 'DespatchAdviceTypeCode','delivery')
 
        # -- <cac:OrderReference> --
        # Links this despatch back to the original order
        order_ref = cac_add(da, 'OrderReference')
        cbc_add(order_ref, 'ID', order_id)
        if issue_date:
            cbc_add(order_ref, 'IssueDate', issue_date)
 
        # -- <cac:DespatchSupplierParty> --
        # The supplier who is sending the goods
        dsp = cac_add(da, 'DespatchSupplierParty')
       
        cbc_add(dsp, 'CustomerAssignedAccountID', seller_supplier_party)
 
        # -- <cac:DeliveryCustomerParty> --
        # The customer who is receiving the goods
        dcp = cac_add(da, 'DeliveryCustomerParty')

        cbc_add(dcp, 'CustomerAssignedAccountID', customer['customerAssignedAccountID'])
        if customer.get('supplierAssignedAccountID'):
            cbc_add(dcp, 'SupplierAssignedAccountID', customer['supplierAssignedAccountID'])
        append_party(dcp, customer)
 
        # -- <cac:Shipment> --
        # Contains delivery address and requested delivery window
        shipment    = cac_add(da, 'Shipment')
        cbc_add(shipment, 'ID', '1')
        consignment = cac_add(shipment, 'Consignment')
        cbc_add(consignment, 'ID', '1')
        delivery    = cac_add(shipment, 'Delivery')
        da_addr     = cac_add(delivery, 'DeliveryAddress')
        append_address(da_addr, delivery_address)
        rdp = cac_add(delivery, 'RequestedDeliveryPeriod')
        cbc_add(rdp, 'StartDate', delivery_start)
        cbc_add(rdp, 'EndDate',   delivery_end)
 
        # -- <cac:DespatchLine> (one per order line) --
        # Each line says what item is being sent and how much
        for i, line in enumerate(lines, start=1):
            dl = cac_add(da, 'DespatchLine')
            cbc_add(dl, 'ID',                str(i))
            cbc_add(dl, 'LineStatusCode',    'NoStatus')
            cbc_add(dl, 'DeliveredQuantity', line['quantity'], {'unitCode': line['unitCode']})
 
            # Link back to the original order line
            olr = cac_add(dl, 'OrderLineReference')
            cbc_add(olr, 'LineID', line['lineID'])
            ior = cac_add(olr, 'OrderReference')
            cbc_add(ior, 'ID', order_id)
            if issue_date:
                cbc_add(ior, 'IssueDate', issue_date)
            
            # Item details
            item = cac_add(dl, 'Item')
            if line.get('itemDescription'): cbc_add(item, 'Description', line['itemDescription'])
            if line.get('itemName'):        cbc_add(item, 'Name',        line['itemName'])
            if line.get('buyersItemID'):
                bid = cac_add(item, 'BuyersItemIdentification')
                cbc_add(bid, 'ID', line['buyersItemID'])
            if line.get('sellersItemID'):
                sid = cac_add(item, 'SellersItemIdentification')
                cbc_add(sid, 'ID', line['sellersItemID'])
 
        # final BUILD
        despatch_xml = ET.tostring(da, pretty_print=True, xml_declaration=True, encoding='UTF-8').decode()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/xml'},
            'body': despatch_xml,
        }
        return {
            "statusCode": 200
        }
    

    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e)
        }
    
