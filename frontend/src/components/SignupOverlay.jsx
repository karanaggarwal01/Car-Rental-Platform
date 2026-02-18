import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SignupOverlay = ({ onClose }) => {
    const { signup } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signup(form);
            onClose();
        } catch (err) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overlay">
            <div className="overlay__content">
                <button className="overlay__close" onClick={onClose}>×</button>
                <h2>Create account</h2>
                <form onSubmit={handleSubmit}>
                    <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                    <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                    <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign up'}</button>
                    {error && <p className="overlay__error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignupOverlay;
