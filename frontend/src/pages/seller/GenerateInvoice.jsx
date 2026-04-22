import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SellerDashboardLayout from '../../components/seller/SellerDashboardLayout'

export default function GenerateInvoice() {
    const { id } = useParams()
    const navigate = useNavigate()

    return (
        <SellerDashboardLayout>
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(`/despatch/${id}`)} className="text-gray-500 hover:text-gray-700 text-sm">← Back</button>
                <h1 className="text-2xl font-bold">Generate Invoice</h1>
            </div>
            <p className="text-gray-400">Coming soon...</p>
        </SellerDashboardLayout>
    )
}