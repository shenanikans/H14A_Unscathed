import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8 bg-white">
                {children}
            </main>
        </div>
    )
}