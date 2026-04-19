import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isRegister) {
                await register(name, email, password);
            } else {
                await login(email, password);
            }
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-panel">
                <h2 className="gradient-text">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="auth-subtitle">
                    {isRegister ? 'Join NexusShop today' : 'Sign in to your account'}
                </p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {isRegister && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="auth-input"
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="auth-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="auth-input"
                        required
                        minLength={6}
                    />
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (isRegister ? 'Register' : 'Sign In')}
                    </button>
                </form>

                <p className="auth-toggle">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="auth-toggle-btn">
                        {isRegister ? 'Sign In' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
}
