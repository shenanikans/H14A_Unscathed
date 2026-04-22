import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerDashboardLayout from '../../components/seller/SellerDashboardLayout'

export default function Invoices() {
    const navigate = useNavigate()
    const [invoices, setInvoices] = useState([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')
    const [showModal, setShowModal] = useState(false)
    const [despatchList, setDespatchList] = useState([])
    const [despatchLoading, setDespatchLoading] = useState(false)
    const [modalStep, setModalStep] = useState('select')
    const fileInputRef = useState(null)

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('invoices') || '[]')
        setInvoices(stored)
    }, [])

    const fetchDespatches = async () => {
        setDespatchLoading(true)
        const token = localStorage.getItem('accessToken')
        const response = await fetch('/atlas/api/despatch/despatch-advice', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!response.ok) { setDespatchLoading(false); return }
        const xmlText = await response.text()
        const matches = xmlText.match(/<ns0:DespatchAdvice[\s\S]*?<\/ns0:DespatchAdvice>/g) || []
        const parsed = matches.map(advice => {
            const idMatch = advice.match(/<ns1:ID>(.*?)<\/ns1:ID>/)
            const dateMatch = advice.match(/<ns1:IssueDate>(.*?)<\/ns1:IssueDate>/)
            const orderRefMatch = advice.match(/<ns2:OrderReference>[\s\S]*?<ns1:ID>(.*?)<\/ns1:ID>/)
            return {
                id: idMatch?.[1] || '',
                date: dateMatch?.[1] || '',
                orderId: orderRefMatch?.[1] || '',
            }
        })
        setDespatchList(parsed)
        setDespatchLoading(false)
    }

    const handleOpenModal = () => {
        setModalStep('select')
        setShowModal(true)
        fetchDespatches()
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        navigate('/generate-invoice/upload', { state: { fileContent: await file.text() } })
        setShowModal(false)
    }

    const filtered = invoices
        .filter(inv => filter === 'All' || inv.status === filter)
        .filter(inv =>
            inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
            inv.customer?.toLowerCase().includes(search.toLowerCase()) ||
            inv.orderRef?.toLowerCase().includes(search.toLowerCase())
        )

    const totalPaid = invoices.filter(inv => inv.status === 'Paid').length
    const totalUnpaid = invoices.filter(inv => inv.status !== 'Paid').length

    return (
        <SellerDashboardLayout>
            <div className="flex flex-col h-full">

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Generate Invoice</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
                            </div>

                            {modalStep === 'select' && (
                                <>
                                    <p className="text-gray-500 text-sm mb-4">How would you like to create this invoice?</p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setModalStep('despatch')}
                                            className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-deep-sky-blue-400 transition-colors"
                                        >
                                            <p className="font-medium text-gray-800">Select existing despatch advice</p>
                                            <p className="text-xs text-gray-400 mt-1">Pick from your saved despatch advices</p>
                                        </button>
                                        <label className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-deep-sky-blue-400 transition-colors cursor-pointer">
                                            <p className="font-medium text-gray-800">Upload despatch XML</p>
                                            <p className="text-xs text-gray-400 mt-1">Upload a UBL 2.1 despatch advice file</p>
                                            <input type="file" accept=".xml" className="hidden" onChange={handleFileUpload} />
                                        </label>
                                        <button
                                            onClick={() => { setShowModal(false); navigate('/generate-invoice/manual') }}
                                            className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-deep-sky-blue-400 transition-colors"
                                        >
                                            <p className="font-medium text-gray-800">Manual input</p>
                                            <p className="text-xs text-gray-400 mt-1">Fill in invoice details manually</p>
                                        </button>
                                    </div>
                                </>
                            )}

                            {modalStep === 'despatch' && (
                                <>
                                    <button onClick={() => setModalStep('select')} className="text-sm text-gray-500 hover:text-gray-700 mb-3 block">← Back</button>
                                    <p className="text-gray-500 text-sm mb-3">Select a despatch advice to generate an invoice from.</p>
                                    {despatchLoading ? (
                                        <p className="text-gray-400 text-sm text-center py-6">Loading...</p>
                                    ) : despatchList.length === 0 ? (
                                        <p className="text-gray-400 text-sm text-center py-6">No despatch advices found.</p>
                                    ) : (
                                        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                                            {despatchList.map((d) => (
                                                <button
                                                    key={d.id}
                                                    onClick={() => { setShowModal(false); navigate(`/generate-invoice/${d.id}`) }}
                                                    className="text-left p-3 border border-gray-200 rounded-lg hover:border-deep-sky-blue-400 hover:bg-deep-sky-blue-50 transition-colors"
                                                >
                                                    <p className="font-medium text-sm text-gray-800">{d.id}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">Order: {d.orderId} · {d.date}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Invoices</h1>
                    <button
                        onClick={handleOpenModal}
                        className="bg-deep-sky-blue-600 text-white px-4 py-2 rounded-lg hover:bg-deep-sky-blue-700 text-sm"
                    >
                        + Generate Invoice
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500 text-sm">Total Invoices</p>
                        <p className="text-3xl font-bold mt-2">{invoices.length}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500 text-sm">Paid</p>
                        <p className="text-3xl font-bold mt-2 text-green-600">{totalPaid}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500 text-sm">Unpaid / Overdue</p>
                        <p className="text-3xl font-bold mt-2 text-red-500">{totalUnpaid}</p>
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 w-64" />
                    <div className="flex gap-2">
                        {['All', 'Unpaid', 'Paid'].map((status) => (
                            <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-md text-sm ${filter === status ? 'bg-deep-sky-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{status}</button>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl shadow-sm border border-gray-300 overflow-hidden flex-1 overflow-y-auto">
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-gray-200">
                            <tr className="text-left text-gray-600 text-sm">
                                <th className="px-4 py-3 border-b border-gray-300">Invoice Number</th>
                                <th className="px-4 py-3 border-b border-gray-300">Order Ref</th>
                                <th className="px-4 py-3 border-b border-gray-300">Customer</th>
                                <th className="px-4 py-3 border-b border-gray-300">Issue Date</th>
                                <th className="px-4 py-3 border-b border-gray-300">Due Date</th>
                                <th className="px-4 py-3 border-b border-gray-300">Total</th>
                                <th className="px-4 py-3 border-b border-gray-300">Standard</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center text-gray-400">
                                        <p className="font-medium mb-1">No invoices yet</p>
                                        <p className="text-sm">Click Generate Invoice to create your first invoice.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((inv, index) => (
                                    <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                                        <td className="px-4 py-3 text-deep-sky-blue-600 text-sm font-medium">{inv.invoiceNumber}</td>
                                        <td className="px-4 py-3 text-sm">{inv.orderRef}</td>
                                        <td className="px-4 py-3 text-sm">{inv.customer}</td>
                                        <td className="px-4 py-3 text-gray-500 text-sm">{inv.issueDate}</td>
                                        <td className="px-4 py-3 text-gray-500 text-sm">{inv.dueDate}</td>
                                        <td className="px-4 py-3 text-sm font-medium">{inv.currency} {inv.total}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{inv.standard}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SellerDashboardLayout>
    )
}