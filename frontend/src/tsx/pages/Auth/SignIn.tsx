import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/buttons';
import { Input } from '../../components/Input';
import { login } from '../../api';
import '../../../css/auth.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
    window.location.href = '/dashboard';
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your JumpStart account</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <hr className="auth-divider" />
        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/auth/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
