import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SellerDashboardLayout from '../../components/seller/SellerDashboardLayout'

const STANDARDS = [
    { code: 'AU', label: 'Australia / New Zealand', standard: 'PEPPOL BIS Billing 3.0', description: 'Required for Australian and New Zealand government invoicing, broadly used across industries' },
    { code: 'SG', label: 'Singapore', standard: 'InvoiceNow (PEPPOL)', description: "InvoiceNow is Singapore's national e-invoicing network, built on PEPPOL" },
    { code: 'JP', label: 'Japan', standard: 'JP PINT', description: 'Japan Procurement INTeroperability - mandatory for Japanese government procurement since 2023' },
    { code: 'EU', label: 'European Union', standard: 'EN 16931', description: 'EU directive 2014/55/EU requires this standard for public sector invoicing' },
    { code: 'US', label: 'United States', standard: 'UBL 2.1', description: 'No federal mandate yet, but UBL 2.1 is the most widely accepted format' },
]

const TAX_SCHEME_BY_COUNTRY = {
    AU: 'GST', SG: 'GST', JP: 'JCT', EU: 'VAT', US: 'Sales Tax'
}

const CURRENCY_BY_COUNTRY = {
    AU: 'AUD', SG: 'SGD', JP: 'JPY', EU: 'EUR', US: 'USD'
}

const DEFAULT_TAX_BY_COUNTRY = {
    AU: '10', SG: '9', JP: '10', EU: '20', US: '0'
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
    const canGenerate = invoiceNumber && issueDate && dueDate && unitPrice && parseFloat(unitPrice) > 0

    return (
        <SellerDashboardLayout>
            <div className="mb-8">
                <button onClick={() => navigate(`/despatch/${id}`)} className="text-gray-500 hover:text-gray-700 text-sm mb-2 block">← Back</button>
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
                        <div className="flex gap-8">
                            <div className="flex-1">
                                <p className="text-gray-500 mb-4">Select the e-invoicing standard for the destination country.</p>
                                <div className="flex flex-col gap-3">
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
                                                    <div className="w-6 h-6 rounded-full bg-deep-sky-blue-600 flex items-center justify-center text-white text-xs flex-shrink-0 ml-4">✓</div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!selectedStandard}
                                        className="bg-deep-sky-blue-600 text-white px-6 py-2 rounded-lg hover:bg-deep-sky-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>

                            <div className="w-72 flex-shrink-0">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">Despatch Details</h3>
                                    {formatted ? (
                                        <div className="flex flex-col gap-3 text-sm">
                                            <div>
                                                <p className="text-xs text-gray-400">Despatch ID</p>
                                                <p className="font-medium">{id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Order Reference</p>
                                                <p className="font-medium">{formatted.orderRef || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Supplier</p>
                                                <p className="font-medium">{formatted.supplier || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Customer</p>
                                                <p className="font-medium">{formatted.customer || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Quantity</p>
                                                <p className="font-medium">{formatted.quantity}</p>
                                            </div>
                                            {selectedStandard && (
                                                <>
                                                    <div className="border-t border-gray-100 pt-3">
                                                        <p className="text-xs text-gray-400">Selected Standard</p>
                                                        <p className="font-medium text-deep-sky-blue-600">{standard?.standard}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Currency</p>
                                                        <p className="font-medium">{CURRENCY_BY_COUNTRY[selectedStandard]}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Tax Scheme</p>
                                                        <p className="font-medium">{TAX_SCHEME_BY_COUNTRY[selectedStandard]}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm">Loading...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex gap-8">
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Invoice Number</label>
                                            <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Payment Terms</label>
                                            <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm">
                                                <option value="Net 7">Net 7</option>
                                                <option value="Net 14">Net 14</option>
                                                <option value="Net 30">Net 30</option>
                                                <option value="Net 60">Net 60</option>
                                                <option value="Due on receipt">Due on receipt</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Issue Date</label>
                                            <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Due Date</label>
                                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Unit Price ({currency})</label>
                                            <input type="number" placeholder="0.00" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">{taxScheme} Rate (%)</label>
                                            <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-sm text-gray-600 mb-1 block">Note (optional)</label>
                                            <input type="text" placeholder="Any additional notes..." value={note} onChange={(e) => setNote(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Bank Account Number</label>
                                            <input type="text" placeholder="e.g. 123456789" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">BSB</label>
                                            <input type="text" placeholder="e.g. 062-000" value={bsb} onChange={(e) => setBsb(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button onClick={() => setStep(1)} className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50">← Back</button>
                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!canGenerate}
                                        className="bg-deep-sky-blue-600 text-white px-6 py-2 rounded-lg hover:bg-deep-sky-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>

                            <div className="w-72 flex-shrink-0">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                                    <div className="flex flex-col gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-gray-400">Standard</p>
                                            <p className="font-medium text-deep-sky-blue-600">{standard?.standard}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Customer</p>
                                            <p className="font-medium">{formatted?.customer || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Quantity</p>
                                            <p className="font-medium">{qty}</p>
                                        </div>
                                        {unitPrice && parseFloat(unitPrice) > 0 && (
                                            <>
                                                <div className="border-t border-gray-100 pt-3">
                                                    <div className="flex justify-between text-gray-500">
                                                        <span>Subtotal</span>
                                                        <span>{currency} {subtotal.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-gray-500">
                                                    <span>{taxScheme} ({taxRate}%)</span>
                                                    <span>{currency} {tax.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between font-semibold text-gray-800 pt-1 border-t border-gray-100">
                                                    <span>Total</span>
                                                    <span>{currency} {total.toFixed(2)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
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