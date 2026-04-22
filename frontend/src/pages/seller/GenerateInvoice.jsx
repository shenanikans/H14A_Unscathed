import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SellerDashboardLayout from '../../components/seller/SellerDashboardLayout'

const STANDARDS = [
    { code: 'AU', label: 'Australia', standard: 'PEPPOL BIS Billing 3.0', description: 'Required for Australian government invoicing, broadly used across industries' },
    { code: 'NZ', label: 'New Zealand', standard: 'PEPPOL BIS Billing 3.0', description: 'NZ government e-invoicing mandate, same framework as Australia' },
    { code: 'SG', label: 'Singapore', standard: 'InvoiceNow (PEPPOL)', description: "InvoiceNow is Singapore's national e-invoicing network, built on PEPPOL" },
    { code: 'EU', label: 'European Union', standard: 'EN 16931', description: 'EU directive 2014/55/EU requires this standard for public sector invoicing' },
    { code: 'US', label: 'United States', standard: 'UBL 2.1', description: 'No federal mandate yet, but UBL 2.1 is the most widely accepted format' },
]

const TAX_SCHEME_BY_COUNTRY = {
    AU: 'GST', NZ: 'GST', SG: 'GST', EU: 'VAT', US: 'Sales Tax'
}

const CURRENCY_BY_COUNTRY = {
    AU: 'AUD', NZ: 'NZD', SG: 'SGD', EU: 'EUR', US: 'USD'
}

const DEFAULT_TAX_BY_COUNTRY = {
    AU: '10', NZ: '10', SG: '9', EU: '20', US: '0'
}

export default function GenerateInvoice() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [selectedStandard, setSelectedStandard] = useState(null)
    const [formatted, setFormatted] = useState(null)
    const [loading, setLoading] = useState(true)

    const year = new Date().getFullYear()
    const seq = String(Math.floor(Math.random() * 900) + 100)
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${year}-${seq}`)
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    const [taxRate, setTaxRate] = useState('10')
    const [paymentTerms, setPaymentTerms] = useState('Net 30')
    const [bankAccount, setBankAccount] = useState('')
    const [bsb, setBsb] = useState('')
    const [note, setNote] = useState('')
    const [unitPrice, setUnitPrice] = useState('')
    const [currency, setCurrency] = useState('AUD')

    useEffect(() => {
        const fetchDespatch = async () => {
            const token = localStorage.getItem('accessToken')
            const response = await fetch(`/atlas/api/despatch/despatch-advice/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.text()
            const parser = new DOMParser()
            const doc = parser.parseFromString(data, 'application/xml')
            const getTag = (tag) => doc.getElementsByTagName(tag)[0]?.textContent || ''

            setFormatted({
                id: getTag('ns1:ID'),
                issueDate: getTag('ns1:IssueDate'),
                orderRef: doc.getElementsByTagName('ns2:OrderReference')[0]?.getElementsByTagName('ns1:ID')[0]?.textContent || '',
                supplier: doc.getElementsByTagName('ns2:DespatchSupplierParty')[0]?.getElementsByTagName('ns1:Name')[0]?.textContent || '',
                customer: doc.getElementsByTagName('ns2:DeliveryCustomerParty')[0]?.getElementsByTagName('ns1:Name')[0]?.textContent || '',
                street: getTag('ns1:StreetName'),
                city: getTag('ns1:CityName'),
                postal: getTag('ns1:PostalZone'),
                quantity: getTag('ns1:DeliveredQuantity') || '1',
            })
            setLoading(false)
        }
        fetchDespatch()
    }, [id])

    useEffect(() => {
        if (selectedStandard) {
            setCurrency(CURRENCY_BY_COUNTRY[selectedStandard] || 'AUD')
            setTaxRate(DEFAULT_TAX_BY_COUNTRY[selectedStandard] || '10')
        }
    }, [selectedStandard])

    const stepClass = (index) => {
        if (step > index + 1) return 'bg-green-500 text-white'
        if (step === index + 1) return 'bg-deep-sky-blue-600 text-white'
        return 'bg-gray-200 text-gray-500'
    }

    const standard = STANDARDS.find(s => s.code === selectedStandard)
    const taxScheme = TAX_SCHEME_BY_COUNTRY[selectedStandard] || 'GST'
    const qty = parseFloat(formatted?.quantity) || 1
    const subtotal = qty * (parseFloat(unitPrice) || 0)
    const tax = subtotal * (parseFloat(taxRate) / 100)
    const total = subtotal + tax

    return (
        <SellerDashboardLayout>
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(`/despatch/${id}`)} className="text-gray-500 hover:text-gray-700 text-sm">← Back</button>
                <h1 className="text-2xl font-bold">Generate Invoice</h1>
            </div>

            <div className="flex items-center gap-2 mb-8">
                {['Select Standard', 'Invoice Details', 'Review & Download'].map((label, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${stepClass(index)}`}>
                            {step > index + 1 ? '✓' : index + 1}
                        </div>
                        <span className={`text-sm ${step === index + 1 ? 'text-deep-sky-blue-600 font-medium' : 'text-gray-400'}`}>{label}</span>
                        {index < 2 && <div className="w-12 h-px bg-gray-200 mx-1" />}
                    </div>
                ))}
            </div>

            {loading ? (
                <p className="text-gray-400">Loading despatch advice...</p>
            ) : (
                <>
                    {step === 1 && (
                        <div className="max-w-3xl">
                            <p className="text-gray-500 mb-6">Select the e-invoicing standard for the destination country.</p>
                            <div className="flex flex-col gap-3 mb-8">
                                {STANDARDS.map((s) => (
                                    <button
                                        key={s.code}
                                        onClick={() => setSelectedStandard(s.code)}
                                        className={`text-left p-4 rounded-xl border-2 transition-colors ${selectedStandard === s.code ? 'border-deep-sky-blue-600 bg-deep-sky-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-800">{s.label}</p>
                                                <p className="text-sm text-deep-sky-blue-600">{s.standard}</p>
                                                <p className="text-xs text-gray-400 mt-1">{s.description}</p>
                                            </div>
                                            {selectedStandard === s.code && (
                                                <div className="w-6 h-6 rounded-full bg-deep-sky-blue-600 flex items-center justify-center text-white text-xs">✓</div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!selectedStandard}
                                    className="bg-deep-sky-blue-600 text-white px-6 py-2 rounded-lg hover:bg-deep-sky-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="max-w-3xl flex flex-col gap-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold mb-1">Despatch Summary</h2>
                                <p className="text-xs text-gray-400 mb-4">Pre-filled from Despatch Advice {id}</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-gray-500">Order Reference:</span> <span className="font-medium">{formatted?.orderRef}</span></div>
                                    <div><span className="text-gray-500">Supplier:</span> <span className="font-medium">{formatted?.supplier}</span></div>
                                    <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{formatted?.customer}</span></div>
                                    <div><span className="text-gray-500">Quantity:</span> <span className="font-medium">{formatted?.quantity}</span></div>
                                    <div><span className="text-gray-500">Standard:</span> <span className="font-medium text-deep-sky-blue-600">{standard?.standard}</span></div>
                                    <div><span className="text-gray-500">Currency:</span> <span className="font-medium">{currency}</span></div>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">Invoice fields coming next...</p>
                            <div className="flex justify-between">
                                <button onClick={() => setStep(1)} className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50">← Back</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <p className="text-gray-400">Review coming soon...</p>
                    )}
                </>
            )}
        </SellerDashboardLayout>
    )
}