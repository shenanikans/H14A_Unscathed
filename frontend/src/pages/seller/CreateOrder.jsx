import { useState } from 'react'
import SellerDashboardLayout from '../../components/seller/SellerDashboardLayout'

export default function CreateOrder() {
    const [orderName, setOrderName] = useState('')
    const [sellerId, setSellerId] = useState('')
    const [documentCurrencyCode, setDocumentCurrencyCode] = useState('AUD')
    const [paymentMethodCode, setPaymentMethodCode] = useState('')
    const [destinationCountryCode, setDestinationCountryCode] = useState('AU')

    return (
        <SellerDashboardLayout>
            <h1 className="text-2xl font-bold mb-8">Create Order</h1>
            <div className="max-w-2xl">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                    <div className="flex flex-col gap-4">
                        <input type="text" placeholder="Order Name" value={orderName} onChange={(e) => setOrderName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                        <input type="text" placeholder="Seller ID" value={sellerId} onChange={(e) => setSellerId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                        <input type="text" placeholder="Currency Code (e.g. AUD)" value={documentCurrencyCode} onChange={(e) => setDocumentCurrencyCode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                        <input type="text" placeholder="Payment Method (e.g. CreditCard)" value={paymentMethodCode} onChange={(e) => setPaymentMethodCode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                        <input type="text" placeholder="Destination Country (e.g. AU)" value={destinationCountryCode} onChange={(e) => setDestinationCountryCode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                    </div>
                </div>
            </div>
        </SellerDashboardLayout>
    )
}