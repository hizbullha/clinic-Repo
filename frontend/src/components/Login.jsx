import { useState } from 'react';
import { useAuth } from '../context/useContextHooks';
import { ROLES } from '../context/AuthTypes';
import {
  ShieldCheck,
  Stethoscope,
  User,
  Lock,
  ChevronRight
} from 'lucide-react';

const Login = () => {
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.PATIENT);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFormAction = async (e) => {
    e.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      if (isRegistering) {
        const result = await register(
          username,
          password,
          fullName
        );

        if (!result.success) {
          setError(result.error || 'Registration failed.');
          setSubmitting(false);
          return;
        }
      } else {
        const result = await login(
          username,
          password,
          selectedRole
        );

        if (!result.success) {
          setError(
            result.error ||
            'Invalid credentials or role selection.'
          );

          setSubmitting(false);
          return;
        }
      }
    } catch {
      setError('Something went wrong.');
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setError('');
    setUsername('');
    setPassword('');
    setFullName('');
  };

  return (
    <div className="login-page">
      <div
        className="login-card"
        style={{ maxWidth: '460px' }}
      >
        <div className="login-logo">
          <ShieldCheck
            size={24}
            style={{ color: '#0b0f19' }}
          />
        </div>

        <h1
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '4px'
          }}
        >
          {isRegistering
            ? 'Create Patient Account'
            : 'MediBooking Portal'}
        </h1>

        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          {isRegistering
            ? 'Register to manage medical consultations'
            : 'Enter your system credentials'}
        </p>

        <form
          onSubmit={handleFormAction}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {!isRegistering && (
            <div className="form-group">
              <label className="form-label">
                Sign In Role
              </label>

              <div className="role-grid">
                <button
                  type="button"
                  className={`role-card ${
                    selectedRole === ROLES.PATIENT
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedRole(ROLES.PATIENT);
                    setError('');
                  }}
                >
                  <User size={16} className="role-icon" />
                  <div className="role-name">Patient</div>
                </button>

                <button
                  type="button"
                  className={`role-card ${
                    selectedRole === ROLES.DOCTOR
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedRole(ROLES.DOCTOR);
                    setError('');
                  }}
                >
                  <Stethoscope
                    size={16}
                    className="role-icon"
                  />
                  <div className="role-name">Doctor</div>
                </button>

                <button
                  type="button"
                  className={`role-card ${
                    selectedRole === ROLES.ADMIN
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedRole(ROLES.ADMIN);
                    setError('');
                  }}
                >
                  <Lock size={16} className="role-icon" />
                  <div className="role-name">Admin</div>
                </button>
              </div>
            </div>
          )}

          {isRegistering && (
            <div className="form-group">
              <label className="form-label">
                Full Name
              </label>

              <input
                type="text"
                placeholder="e.g. John Doe"
                className="form-control"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              className="form-control"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="form-control"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <p
              className="form-error"
              style={{ textAlign: 'center' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              height: '40px',
              marginTop: '4px'
            }}
          >
            <span>
              {submitting
                ? 'Connecting...'
                : isRegistering
                ? 'Complete Registration'
                : 'Log In'}
            </span>

            {!submitting && (
              <ChevronRight size={16} />
            )}
          </button>

          <div
            style={{
              textAlign: 'center',
              marginTop: '8px'
            }}
          >
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--primary-light)'
              }}
              onClick={() => {
                setIsRegistering(!isRegistering);
                resetForm();
              }}
            >
              {isRegistering
                ? 'Already have credentials? Log In'
                : 'New Patient? Register here'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;