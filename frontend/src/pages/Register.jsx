import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/despatch'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setLoading(true)
    setError('')
    const res = await register(email, password, name)
    if (res.ok) {
      navigate('/')
    } else {
      const data = await res.json()
      setError(data || 'Registration failed')
    }
    setLoading(false)
  }
}

export default Register
