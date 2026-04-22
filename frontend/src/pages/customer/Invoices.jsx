import { useState } from 'react'
import CustomerDashboardLayout from '../../components/customer/CustomerDashboardLayout'

const fakeInvoices = [
    { id: 'INV-2026-008', orderId: 'PO-2026-008', date: '2026-04-20', due: '2026-05-20', amount: '$540.00', status: 'Unpaid' },
    { id: 'INV-2026-007', orderId: 'PO-2026-007', date: '2026-04-18', due: '2026-05-18', amount: '$1,200.00', status: 'Paid' },
    { id: 'INV-2026-005', orderId: 'PO-2026-005', date: '2026-04-15', due: '2026-05-15', amount: '$320.00', status: 'Paid' },
    { id: 'INV-2026-003', orderId: 'PO-2026-003', date: '2026-04-10', due: '2026-05-10', amount: '$780.00', status: 'Paid' },
    { id: 'INV-2026-001', orderId: 'PO-2026-001', date: '2026-04-01', due: '2026-05-01', amount: '$1,980.00', status: 'Paid' },
]

export default function CustomerInvoices() {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')

    const filtered = fakeInvoices
        .filter(inv => filter === 'All' || inv.status === filter)
        .filter(inv => inv.id.toLowerCase().includes(search.toLowerCase()) || inv.orderId.toLowerCase().includes(search.toLowerCase()))

    return (
        <CustomerDashboardLayout>
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">My Invoices</h1>
                </div>
                <div className="flex gap-4 mb-4">
                    <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 w-64" />
                    <div className="flex gap-2">
                        {['All', 'Unpaid', 'Paid'].map((status) => (
                            <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-md text-sm ${filter === status ? 'bg-deep-sky-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{status}</button>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 overflow-y-auto">
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-gray-50">
                            <tr className="text-left text-gray-500 text-sm">
                                <th className="px-4 py-3 border-b border-gray-100">Invoice ID</th>
                                <th className="px-4 py-3 border-b border-gray-100">Order ID</th>
                                <th className="px-4 py-3 border-b border-gray-100">Issue Date</th>
                                <th className="px-4 py-3 border-b border-gray-100">Due Date</th>
                                <th className="px-4 py-3 border-b border-gray-100">Amount</th>
                                <th className="px-4 py-3 border-b border-gray-100">Status</th>
                                <th className="px-4 py-3 border-b border-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-400">No invoices found.</td></tr>
                            ) : (
                                filtered.map((inv, index) => (
                                    <tr key={index} className="hover:bg-gray-50 border-b border-gray-100">
                                        <td className="px-4 py-3 text-deep-sky-blue-600 text-sm">{inv.id}</td>
                                        <td className="px-4 py-3 text-sm">{inv.orderId}</td>
                                        <td className="px-4 py-3 text-gray-500 text-sm">{inv.date}</td>
                                        <td className="px-4 py-3 text-gray-500 text-sm">{inv.due}</td>
                                        <td className="px-4 py-3 text-sm font-medium">{inv.amount}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                inv.status === 'Unpaid' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>{inv.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {inv.status === 'Unpaid' && (
                                                <button className="bg-deep-sky-blue-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-deep-sky-blue-700">
                                                    Pay Now
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </CustomerDashboardLayout>
    )
}