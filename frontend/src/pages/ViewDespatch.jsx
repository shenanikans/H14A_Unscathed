import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

export default function ViewDespatch() {
    const { id } = useParams()
    const [despatch, setDespatch] = useState(null)
    const [formatted, setFormatted] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showFormatted, setShowFormatted] = useState(false)
    const [deliveredQuantity, setDeliveredQuantity] = useState('')
    const [backorderQuantity, setBackorderQuantity] = useState('')
    const [backorderReason, setBackorderReason] = useState('')
    const [note, setNote] = useState('')

    const formatXml = (xml) => {
        let formatted = ''
        let indent = ''
        xml.split(/>\s*</).forEach(node => {
            if (node.match(/^\/\w/)) indent = indent.substring(2)
            formatted += indent + '<' + node + '>\r\n'
            if (node.match(/^<?\w[^>]*[^\/]$/)) indent += '  '
        })
        return formatted.substring(1, formatted.length - 3)
    }

    useEffect(() => {
        const fetchDespatch = async () => {
            const token = localStorage.getItem('accessToken')
            const response = await fetch(`/atlas/api/despatch/despatch-advice/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.text()
            setDespatch(data)

            const parser = new DOMParser()
            const doc = parser.parseFromString(data, 'application/xml')
            const get = (tag) => doc.getElementsByTagName(tag)[0]?.textContent || ''

            setFormatted({
                id: get('ns1:ID'),
                issueDate: get('ns1:IssueDate'),
                status: get('ns1:DocumentStatusCode'),
                orderRef: doc.getElementsByTagName('ns2:OrderReference')[0]?.getElementsByTagName('ns1:ID')[0]?.textContent || '',
                supplier: doc.getElementsByTagName('ns2:DespatchSupplierParty')[0]?.getElementsByTagName('ns1:Name')[0]?.textContent || '',
                customer: doc.getElementsByTagName('ns2:DeliveryCustomerParty')[0]?.getElementsByTagName('ns1:Name')[0]?.textContent || '',
                street: get('ns1:StreetName'),
                city: get('ns1:CityName'),
                postal: get('ns1:PostalZone'),
            })

            setLoading(false)
        }
        fetchDespatch()
    }, [id])

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-6">Despatch Advice {id}</h1>
            
            <div className="flex flex-col gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Update Despatch</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Delivered Quantity" value={deliveredQuantity} onChange={(e) => setDeliveredQuantity(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2" />
                        <input type="number" placeholder="Backorder Quantity" value={backorderQuantity} onChange={(e) => setBackorderQuantity(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2" />
                        <input type="text" placeholder="Backorder Reason" value={backorderReason} onChange={(e) => setBackorderReason(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2" />
                        <input type="text" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2" />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="bg-deep-sky-blue-600 text-white px-6 py-2 rounded-lg hover:bg-deep-sky-blue-700">Update</button>
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
                    {loading ? (
                        <p className="text-gray-400">Loading...</p>
                    ) : showFormatted && formatted ? (
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm flex flex-col gap-2">
                            <p><span className="text-gray-500 font-medium">ID:</span> {formatted.id}</p>
                            <p><span className="text-gray-500 font-medium">Issue Date:</span> {formatted.issueDate}</p>
                            <p><span className="text-gray-500 font-medium">Status:</span> {formatted.status}</p>
                            <p><span className="text-gray-500 font-medium">Order Reference:</span> {formatted.orderRef}</p>
                            <p><span className="text-gray-500 font-medium">Supplier:</span> {formatted.supplier}</p>
                            <p><span className="text-gray-500 font-medium">Customer:</span> {formatted.customer}</p>
                            <p><span className="text-gray-500 font-medium">Delivery Address:</span> {formatted.street}, {formatted.city} {formatted.postal}</p>
                        </div>
                    ) : (
                        <pre className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm overflow-auto">
                            {despatch ? formatXml(despatch) : ''}
                        </pre>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}