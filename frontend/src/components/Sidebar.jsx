import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className={`flex flex-col bg-gray-50 border-r border-gray-200 h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
            <div className={`flex items-center border-b border-gray-200 p-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && <span className="font-conthrax text-3xl">Atlas</span>}
                <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-gray-800">
                    ☰
                </button>
            </div>

            <nav className="flex flex-col gap-1 p-2 mt-2">
                <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                    <span>🏠</span>
                    {!collapsed && <span>Dashboard</span>}
                </Link>
                <Link to="/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                    <span>📦</span>
                    {!collapsed && <span>Orders</span>}
                </Link>
                <Link to="/despatch" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                    <span>🚚</span>
                    {!collapsed && <span>Despatch Advice</span>}
                </Link>
                <Link to="/invoices" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
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