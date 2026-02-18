import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginOverlay = ({ onClose }) => {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(form.email, form.password);
            onClose();
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overlay">
            <div className="overlay__content">
                <button className="overlay__close" onClick={onClose}>×</button>
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                    <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
                    {error && <p className="overlay__error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginOverlay;
