import { useState } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminPage() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await apiService.createProduct({
                name,
                price: parseFloat(price),
                description,
                stock: parseInt(stock, 10),
                category,
            });
            setMessage('Product created successfully!');
            setName('');
            setPrice('');
            setDescription('');
            setStock('');
            setCategory('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="app-container">
            <div className="auth-card glass-panel" style={{ margin: '0 auto', maxWidth: '600px' }}>
                <h2 className="gradient-text">Admin Panel</h2>
                <p className="auth-subtitle">Add a new product to the store</p>

                {error && <div className="auth-error">{error}</div>}
                {message && <div className="success-banner">{message}</div>}

                <form onSubmit={handleSubmit} className="auth-form" style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Product Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="auth-input"
                            style={{ width: '100%' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="auth-input"
                                style={{ width: '100%' }}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Stock</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="auth-input"
                                style={{ width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="auth-input"
                            style={{ width: '100%' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="auth-input"
                            style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" style={{ width: '100%' }}>
                        Create Product
                    </button>
                    
                    <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--accent-glow)', textDecoration: 'none' }}>
                        ← Back to Shop
                    </a>
                </form>
            </div>
        </div>
    );
}
