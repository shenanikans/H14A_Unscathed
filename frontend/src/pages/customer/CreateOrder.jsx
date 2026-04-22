import CustomerDashboardLayout from '../../components/customer/CustomerDashboardLayout'

export default function CustomerDashboard() {
    return (
        <CustomerDashboardLayout>
            <h1 className="text-2xl font-bold mb-8">Welcome to Atlas</h1>
            <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <p className="text-gray-500 text-sm">My Orders</p>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <p className="text-gray-500 text-sm">Pending Deliveries</p>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <p className="text-gray-500 text-sm">Invoices</p>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <p className="text-gray-500 text-sm">Total Spent</p>
                    <p className="text-3xl font-bold mt-2">$0</p>
                </div>
            </div>
        </CustomerDashboardLayout>
    )
}