import '../styles/Login.css'
import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: '#1a6b7a', letterSpacing: '2px' }}>ATLAS</h2>
        <p className="login-subtitle">Shipping, Simplified</p>

        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-primary">Sign In</button>
      </div>
    </div>
  )
}

export default Login