import { useState } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

export default function ViewDespatch() {
    const { id } = useParams()
    const [deliveredQuantity, setDeliveredQuantity] = useState('')
    const [backorderQuantity, setBackorderQuantity] = useState('')
    const [backorderReason, setBackorderReason] = useState('')
    const [note, setNote] = useState('')    
    const [showFormatted, setShowFormatted] = useState(false)
    const mockDespatch = `<?xml version="1.0" encoding="UTF-8"?>
<DespatchAdvice xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns="urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2">
    <cbc:UBLVersionID>2.0</cbc:UBLVersionID>
    <cbc:ID>${id}</cbc:ID>
    <cbc:IssueDate>2026-04-21</cbc:IssueDate>
    <cbc:DocumentStatusCode>NoStatus</cbc:DocumentStatusCode>
    <cbc:DespatchAdviceTypeCode>delivery</cbc:DespatchAdviceTypeCode>
    <cac:OrderReference>
        <cbc:ID>PO-2026-001</cbc:ID>
        <cbc:SalesOrderID>CON0095678</cbc:SalesOrderID>
        <cbc:IssueDate>2026-04-01</cbc:IssueDate>
    </cac:OrderReference>
</DespatchAdvice>`

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-6">Despatch Advice {id}</h1>
            
            <div className="flex flex-col gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Update Despatch</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Delivered Quantity"
                            value={deliveredQuantity}
                            onChange={(event) => setDeliveredQuantity(event.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <input
                            type="number"
                            placeholder="Backorder Quantity"
                            value={backorderQuantity}
                            onChange={(event) => setBackorderQuantity(event.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Backorder Reason"
                            value={backorderReason}
                            onChange={(event) => setBackorderReason(event.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Note"
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="bg-deep-sky-blue-600 text-white px-6 py-2 rounded-lg hover:bg-deep-sky-blue-700">
                            Update
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Document</h2>
                        <button
                            onClick={() => setShowFormatted(!showFormatted)}
                            className="text-sm border border-gray-300 px-4 py-1 rounded-md hover:bg-gray-50"
                        >
                            {showFormatted ? 'View Raw XML' : 'View Formatted'}
                        </button>
                    </div>
                    {showFormatted ? (
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm">
                            <p><span className="text-gray-500">ID:</span> {id}</p>
                            <p><span className="text-gray-500">Issue Date:</span> 2026-04-21</p>
                            <p><span className="text-gray-500">Status:</span> NoStatus</p>
                            <p><span className="text-gray-500">Type:</span> delivery</p>
                            <p><span className="text-gray-500">Order Reference:</span> PO-2026-001</p>
                        </div>
                    ) : (
                        <pre className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm overflow-auto">
                            {mockDespatch}
                        </pre>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}