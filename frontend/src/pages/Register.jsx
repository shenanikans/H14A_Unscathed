import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [role, setRole] = useState('buyer')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        const response = await fetch('/atlas/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        })

        const data = await response.json()

        if (response.status === 201) {
            navigate('/login')
        } else if (response.status === 409) {
            setError('Email already registered')
        } else {
            setError('Something went wrong')
        }
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center"
            style={{ 
                backgroundImage: "url('/babyblue_background.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="font-conthrax text-6xl mb-5 text-center">Atlas</h1>
                <p className="text-gray-500 mb-4 text-center">Create your account</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    />
                    <div className="relative mb-4">
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-16"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2 text-gray-500 text-sm"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <input 
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-16"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2 text-gray-500 text-sm"
                        >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <input
                            type="checkbox"
                            id="seller"
                            checked={role === 'seller'}
                            onChange={(e) => setRole(e.target.checked ? 'seller' : 'buyer')}
                            className="w-4 h-4"
                        />
                        <label htmlFor="seller" className="text-sm text-gray-600">Register as a Seller</label>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button type="submit" className="w-full bg-deep-sky-blue-600 text-white py-2 rounded-lg hover:bg-deep-sky-blue-700">Register</button>
                </form>
                <p className="text-sm text-gray-500 mt-4 text-center">Already have an account? <Link to="/" className="text-deep-sky-blue-600 hover:underline">Log in</Link></p>
            </div>
        </div>
    )
}