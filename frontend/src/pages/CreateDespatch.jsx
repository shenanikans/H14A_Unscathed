import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useNavigate } from 'react-router-dom'

export default function CreateDespatch() {
    const navigate = useNavigate()

    const [docId, setDocId] = useState('')
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
    const [issueTime, setIssueTime] = useState(new Date().toTimeString().split(' ')[0])
    const [docNote, setDocNote] = useState('')
    const [orderRefId, setOrderRefId] = useState('')
    const [supplierPartyName, setSupplierPartyName] = useState('Atlas')
    const [supplierEndpointId, setSupplierEndpointId] = useState('')
    const [supplierSchemeId, setSupplierSchemeId] = useState('')
    const [customerPartyName, setCustomerPartyName] = useState('')
    const [customerEndpointId, setCustomerEndpointId] = useState('')
    const [customerSchemeId, setCustomerSchemeId] = useState('')
    const [streetName, setStreetName] = useState('')
    const [cityName, setCityName] = useState('')
    const [postalZone, setPostalZone] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [mode, setMode] = useState(null)
    const [file, setFile] = useState(null)
    const [hoverSelect, setHoverSelect] = useState(false)
    const [hoverUpload, setHoverUpload] = useState(false)
    const [hoverManual, setHoverManual] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (mode === 'upload' && fileInputRef.current) {
            fileInputRef.current.click()
            setMode(null)
            setHoverUpload(false)
        }
        if (mode === 'manual') {
            const fetchNextId = async () => {
                const token = localStorage.getItem('accessToken')
                const response = await fetch('/atlas/api/despatch/next-id', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const data = await response.json()
                setDocId(data.nextId)
            }
            fetchNextId()
        }
    }, [mode])

    const handleSubmit = async () => {
        if (mode === 'upload' && !file) return

        const token = localStorage.getItem('accessToken')
        let body

        if (file) {
            body = await file.text()
        } else if (mode === 'manual') {
            body = `<?xml version="1.0" encoding="UTF-8"?><Order xmlns="urn:oasis:names:specification:ubl:schema:xsd:Order-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"><cbc:ID>${orderRefId}</cbc:ID><cbc:IssueDate>${issueDate}</cbc:IssueDate><cac:OrderReference><cbc:ID>${orderRefId}</cbc:ID><cbc:IssueDate>${issueDate}</cbc:IssueDate></cac:OrderReference><cac:SellerSupplierParty><cac:Party><cac:PartyName><cbc:Name>${supplierPartyName}</cbc:Name></cac:PartyName></cac:Party></cac:SellerSupplierParty><cac:BuyerCustomerParty><cac:Party><cac:PartyName><cbc:Name>${customerPartyName}</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>${streetName}</cbc:StreetName><cbc:CityName>${cityName}</cbc:CityName><cbc:PostalZone>${postalZone}</cbc:PostalZone><cbc:CountrySubentity>${state}</cbc:CountrySubentity><cac:Country><cbc:IdentificationCode>${country}</cbc:IdentificationCode></cac:Country></cac:PostalAddress></cac:Party></cac:BuyerCustomerParty></Order>`
        }

        const response = await fetch('/atlas/api/despatch/despatch-advice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'Authorization': `Bearer ${token}`
            },
            body
        })

        const data = await response.text()
        if (response.ok) {
            navigate('/despatch')
        } else {
            console.log('Error:', data)
        }
    }

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-8">Create Despatch Advice</h1>

            <div className="max-w-2xl flex flex-col gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Order Source</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode('select')}
                            onMouseEnter={() => setHoverSelect(true)}
                            onMouseLeave={() => setHoverSelect(false)}
                            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors duration-100 ${mode === 'select' || hoverSelect ? 'bg-deep-sky-blue-600 text-white border-deep-sky-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                        >
                            Select Order
                        </button>
                        <button
                            onClick={() => setMode('upload')}
                            onMouseEnter={() => setHoverUpload(true)}
                            onMouseLeave={() => setHoverUpload(false)}
                            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors duration-100 ${hoverUpload ? 'bg-deep-sky-blue-600 text-white border-deep-sky-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                        >
                            Upload XML
                        </button>
                        <button
                            onClick={() => setMode('manual')}
                            onMouseEnter={() => setHoverManual(true)}
                            onMouseLeave={() => setHoverManual(false)}
                            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors duration-100 ${mode === 'manual' || hoverManual ? 'bg-deep-sky-blue-600 text-white border-deep-sky-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                        >
                            Manual Input
                        </button>
                    </div>

                    {file && (
                        <p className="text-sm text-gray-500 mt-3">Selected: {file.name}</p>
                    )}

                    <input
                        type="file"
                        accept=".xml"
                        ref={fileInputRef}
                        onChange={(event) => {
                            setFile(event.target.files[0])
                            setHoverUpload(false)
                        }}
                        className="hidden"
                    />

                    {mode === 'manual' && (
                        <div className="mt-6 flex flex-col gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Document Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" value={docId || 'Loading...'} readOnly className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                    <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                    <input type="time" value={issueTime} onChange={(e) => setIssueTime(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                    <input type="text" placeholder="Note" value={docNote} onChange={(e) => setDocNote(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Order Reference</h3>
                                <input type="text" placeholder="Order Reference ID" value={orderRefId} onChange={(e) => setOrderRefId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Customer</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Party Name" value={customerPartyName} onChange={(e) => setCustomerPartyName(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                    <input type="text" placeholder="Endpoint ID" value={customerEndpointId} onChange={(e) => setCustomerEndpointId(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                    <input type="text" placeholder="Scheme ID" value={customerSchemeId} onChange={(e) => setCustomerSchemeId(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Delivery Address</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Street Name" value={streetName} onChange={(e) => setStreetName(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                    <input type="text" placeholder="City" value={cityName} onChange={(e) => setCityName(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                    <input type="text" placeholder="Postal Zone" value={postalZone} onChange={(e) => setPostalZone(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                    <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                    <select value={country} onChange={(e) => setCountry(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600">
                                        <option value="">Select Country</option>
                                        <option value="AU">Australia</option>
                                        <option value="NZ">New Zealand</option>
                                        <option value="US">United States</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="CA">Canada</option>
                                        <option value="SG">Singapore</option>
                                        <option value="JP">Japan</option>
                                        <option value="CN">China</option>
                                        <option value="IN">India</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'select' && (
                        <div className="mt-6">
                            <p className="text-gray-400 text-sm">Order selection coming soon</p>
                        </div>
                    )}
                </div>

                {mode === 'manual' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Supplier Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Party Name" value={supplierPartyName} onChange={(e) => setSupplierPartyName(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                            <input type="text" placeholder="Endpoint ID" value={supplierEndpointId} onChange={(e) => setSupplierEndpointId(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                            <input type="text" placeholder="Scheme ID" value={supplierSchemeId} onChange={(e) => setSupplierSchemeId(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-deep-sky-blue-600 text-white px-6 py-3 rounded-lg hover:bg-deep-sky-blue-700"
                    >
                        Create Despatch
                    </button>
                </div>
            </div>
        </DashboardLayout>
    )
}