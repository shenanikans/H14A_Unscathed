import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NavbarLoggedIn() {
    const token = localStorage.getItem('accessToken')
    const email = token ? JSON.parse(atob(token.split('.')[1])).email : 'User'
    const [showDropdown, setShowDropdown] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        navigate('/login')
    }

    return (
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white">
            <h1 className="font-conthrax text-xl">Atlas</h1>
            <div className="relative">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <span className="text-sm text-gray-600">{email}</span>
                    <div className="w-8 h-8 rounded-full bg-deep-sky-blue-600 flex items-center justify-center text-white text-sm">
                        {email[0].toUpperCase()}
                    </div>
                </div>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
                            onClick={() => setShowDropdown(false)}
                        >
                            Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowDropdown(false)}
                        >
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 rounded-b-xl"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}