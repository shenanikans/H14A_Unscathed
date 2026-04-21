import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

const fakeOrders = [
    { id: 'PO-2026-001', name: 'Purchase Order A', date: '2026-04-01', status: 'Pending', total: '$1,200.00' },
    { id: 'PO-2026-002', name: 'Purchase Order B', date: '2026-04-05', status: 'Delivered', total: '$3,450.00' },
    { id: 'PO-2026-003', name: 'Purchase Order C', date: '2026-04-10', status: 'Processing', total: '$780.00' },
]

export default function Orders() {
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Orders</h1>
                <Link to="/create-order">
                    <button className="bg-deep-sky-blue-600 text-white px-4 py-2 rounded-lg hover:bg-deep-sky-blue-700">
                        + Create Order
                    </button>
                </Link>
            </div>
            <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-left text-gray-500 text-sm">
                            <th className="px-4 py-3 border-b border-gray-100">Order ID</th>
                            <th className="px-4 py-3 border-b border-gray-100">Name</th>
                            <th className="px-4 py-3 border-b border-gray-100">Date</th>
                            <th className="px-4 py-3 border-b border-gray-100">Status</th>
                            <th className="px-4 py-3 border-b border-gray-100">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fakeOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <td className="px-4 py-3 text-deep-sky-blue-600">{order.id}</td>
                                <td className="px-4 py-3">{order.name}</td>
                                <td className="px-4 py-3 text-gray-500">{order.date}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100">{order.status}</span>
                                </td>
                                <td className="px-4 py-3">{order.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </DashboardLayout>
    )
}