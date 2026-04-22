import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function CustomerSidebar() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className={`flex flex-col bg-gray-50 border-r border-gray-200 h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
            <div className={`flex items-center border-b border-gray-200 p-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && <span className="font-conthrax text-2xl">Atlas</span>}
                <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-gray-800">☰</button>
            </div>
            <nav className="flex flex-col gap-1 p-2 mt-2">
                <Link to="/customer-dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                    <span>🏠</span>
                    {!collapsed && <span>Dashboard</span>}
                </Link>
                <Link to="/customer-orders" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                    <span>📦</span>
                    {!collapsed && <span>My Orders</span>}
                </Link>
                <Link to="/customer-create-order" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                    <span>➕</span>
                    {!collapsed && <span>Place Order</span>}
                </Link>
                <Link to="/customer-despatch" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                    <span>🚚</span>
                    {!collapsed && <span>Deliveries</span>}
                </Link>
                <Link to="/customer-invoices" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                    <span>🧾</span>
                    {!collapsed && <span>Invoices</span>}
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                    <span>⚙️</span>
                    {!collapsed && <span>Settings</span>}
                </Link>
            </nav>
        </div>
    )
}