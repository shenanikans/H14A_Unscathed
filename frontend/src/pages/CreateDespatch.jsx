import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../components/DashboardLayout'

export default function CreateDespatch() {
    const [mode, setMode] = useState(null)
    const [file, setFile] = useState(null)
    const [hoverSelect, setHoverSelect] = useState(false)
    const [hoverUpload, setHoverUpload] = useState(false)
    const [hoverManual, setHoverManual] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (mode === 'upload' && fileInputRef.current) {
            fileInputRef.current.click()
            setMode(null)
            setHoverUpload(false)
        }
    }, [mode])

    const handleSubmit = async () => {
        if (mode === 'upload' && !file) return

        const token = localStorage.getItem('accessToken')
        let body

        if (mode === 'upload' || file) {
            const xmlText = await file.text()
            body = JSON.stringify({ xml: xmlText })
        }

        const response = await fetch('/atlas/api/despatch/despatch-advice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body
        })

        if (response.ok) {
            console.log('Despatch created successfully')
        } else {
            console.log('Error creating despatch')
        }
    }

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-8">Create Despatch Advice</h1>

            <div className="max-w-2xl flex flex-col gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Order Source</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode('select')}
                            onMouseEnter={() => setHoverSelect(true)}
                            onMouseLeave={() => setHoverSelect(false)}
                            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors duration-100 ${mode === 'select' || hoverSelect ? 'bg-deep-sky-blue-600 text-white border-deep-sky-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                        >
                            Select Order
                        </button>
                        <button
                            onClick={() => setMode('upload')}
                            onMouseEnter={() => setHoverUpload(true)}
                            onMouseLeave={() => setHoverUpload(false)}
                            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors duration-100 ${hoverUpload ? 'bg-deep-sky-blue-600 text-white border-deep-sky-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                        >
                            Upload XML
                        </button>
                        <button
                            onClick={() => setMode('manual')}
                            onMouseEnter={() => setHoverManual(true)}
                            onMouseLeave={() => setHoverManual(false)}
                            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors duration-100 ${mode === 'manual' || hoverManual ? 'bg-deep-sky-blue-600 text-white border-deep-sky-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                        >
                            Manual Input
                        </button>
                    </div>

                    {file && (
                        <p className="text-sm text-gray-500 mt-3">Selected: {file.name}</p>
                    )}

                    <input
                        type="file"
                        accept=".xml"
                        ref={fileInputRef}
                        onChange={(event) => {
                            setFile(event.target.files[0])
                            setHoverUpload(false)
                        }}
                        className="hidden"
                    />

                    {mode === 'manual' && (
                        <div className="mt-6 flex flex-col gap-4">
                            <p className="text-gray-400 text-sm">Manual input fields coming soon</p>
                        </div>
                    )}

                    {mode === 'select' && (
                        <div className="mt-6">
                            <p className="text-gray-400 text-sm">Order selection coming soon</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-deep-sky-blue-600 text-white px-6 py-3 rounded-lg hover:bg-deep-sky-blue-700"
                    >
                        Create Despatch
                    </button>
                </div>
            </div>
        </DashboardLayout>
    )
}