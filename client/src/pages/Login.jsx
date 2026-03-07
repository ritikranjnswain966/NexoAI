import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const Login = () => {
    const [state, setState] = useState("login")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { axios, setToken } = useAppContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const url = state === "login" ? "/api/user/login" : "/api/user/register"
        try {
            const { data } = await axios.post(url, { name, email, password })
            if (data.success) {
                setToken(data.token)
                localStorage.setItem('token', data.token)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const switchState = () => {
        setState(state === "login" ? "register" : "login")
        setName("")
        setEmail("")
        setPassword("")
    }

    return (
        <div className="login-page">
            {/* Animated background */}
            <div className="login-bg-grid" />
            <div className="login-bg-orb login-bg-orb-1" />
            <div className="login-bg-orb login-bg-orb-2" />
            <div className="login-bg-orb login-bg-orb-3" />

            {/* Floating particles */}
            <div className="login-particles">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="login-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main card */}
            <div className={`login-card ${state === 'register' ? 'login-card-expanded' : ''}`}>
                {/* Logo header */}
                <div className="login-logo-section">
                    <div className="login-logo-wrapper">
                        <div className="login-logo-glow" />
                        <img src={assets.logo_full} alt="Nexo" className="login-logo-img logo-recolor" />
                    </div>
                </div>

                {/* Title */}
                <div className="login-title-section">
                    <h1 className="login-title">
                        {state === "login" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="login-subtitle">
                        {state === "login"
                            ? "Sign in to continue your AI journey"
                            : "Join Nexo and start chatting with AI"
                        }
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Name field - only for register */}
                    {state === "register" && (
                        <div className="login-field login-field-animate">
                            <label className="login-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Full Name
                            </label>
                            <div className="login-input-wrapper">
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    placeholder="Enter your name"
                                    className="login-input"
                                    type="text"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email field */}
                    <div className="login-field">
                        <label className="login-label">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            Email Address
                        </label>
                        <div className="login-input-wrapper">
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="you@example.com"
                                className="login-input"
                                type="email"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="login-field">
                        <label className="login-label">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Password
                        </label>
                        <div className="login-input-wrapper">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="••••••••"
                                className="login-input login-input-password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete={state === "login" ? "current-password" : "new-password"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="login-password-toggle"
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button type="submit" className="login-submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <div className="login-spinner" />
                        ) : (
                            <>
                                {state === "register" ? "Create Account" : "Sign In"}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="login-divider">
                    <div className="login-divider-line" />
                    <span className="login-divider-text">
                        {state === "login" ? "New to Nexo?" : "Already a member?"}
                    </span>
                    <div className="login-divider-line" />
                </div>

                {/* Switch state */}
                <button onClick={switchState} className="login-switch-btn">
                    {state === "login" ? "Create an account" : "Sign in instead"}
                </button>

                {/* Footer */}
                <p className="login-footer">
                    By continuing, you agree to Nexo's Terms of Service
                </p>
            </div>

            <style>{`
                .login-page {
                    position: fixed;
                    inset: 0;
                    background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 30%, #dbeafe 60%, #f1f5f9 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    padding: 20px;
                }

                .dark .login-page {
                    background: linear-gradient(135deg, #030712 0%, #0c1222 30%, #0f172a 60%, #030712 100%);
                }

                /* Background grid */
                .login-bg-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(59, 130, 246, 0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.06) 1px, transparent 1px);
                    background-size: 60px 60px;
                    animation: loginGridMove 12s linear infinite;
                }

                .dark .login-bg-grid {
                    background-image:
                        linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
                }

                @keyframes loginGridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(60px, 60px); }
                }

                /* Orbs */
                .login-bg-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.18;
                    animation: loginOrbPulse 5s ease-in-out infinite;
                }

                .login-bg-orb-1 {
                    width: 500px; height: 500px;
                    background: #60A5FA;
                    top: -150px; right: -100px;
                }

                .login-bg-orb-2 {
                    width: 400px; height: 400px;
                    background: #A78BFA;
                    bottom: -120px; left: -100px;
                    animation-delay: 2s;
                }

                .login-bg-orb-3 {
                    width: 250px; height: 250px;
                    background: #3B82F6;
                    top: 50%; left: 30%;
                    animation-delay: 3.5s;
                }

                .dark .login-bg-orb-1 { background: #3B82F6; opacity: 0.12; }
                .dark .login-bg-orb-2 { background: #8B5CF6; opacity: 0.12; }
                .dark .login-bg-orb-3 { background: #06B6D4; opacity: 0.12; }

                @keyframes loginOrbPulse {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.22; transform: scale(1.15); }
                }

                /* Particles */
                .login-particles {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }

                .login-particle {
                    position: absolute;
                    width: 2px; height: 2px;
                    background: #3B82F6;
                    border-radius: 50%;
                    opacity: 0;
                    animation: loginParticleFloat linear infinite;
                    box-shadow: 0 0 6px rgba(59, 130, 246, 0.5);
                }

                .dark .login-particle {
                    background: #60A5FA;
                    box-shadow: 0 0 6px rgba(96, 165, 250, 0.6);
                }

                @keyframes loginParticleFloat {
                    0% { opacity: 0; transform: translateY(0) scale(0); }
                    20% { opacity: 0.5; transform: translateY(-30px) scale(1); }
                    80% { opacity: 0.2; transform: translateY(-120px) scale(0.5); }
                    100% { opacity: 0; transform: translateY(-180px) scale(0); }
                }

                /* Card */
                .login-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 420px;
                    background: rgba(255, 255, 255, 0.75);
                    backdrop-filter: blur(40px);
                    border: 1px solid rgba(59, 130, 246, 0.12);
                    border-radius: 24px;
                    padding: 40px 36px;
                    box-shadow:
                        0 0 40px rgba(59, 130, 246, 0.06),
                        0 25px 60px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.8);
                    animation: loginCardAppear 0.6s ease-out;
                    transition: all 0.4s ease;
                }

                .dark .login-card {
                    background: rgba(15, 23, 42, 0.7);
                    border-color: rgba(59, 130, 246, 0.12);
                    box-shadow:
                        0 0 40px rgba(59, 130, 246, 0.06),
                        0 25px 60px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(59, 130, 246, 0.08);
                }

                .login-card-expanded {
                    max-width: 420px;
                }

                @keyframes loginCardAppear {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* Logo */
                .login-logo-section {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 28px;
                }

                .login-logo-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .login-logo-glow {
                    position: absolute;
                    width: 80px; height: 80px;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: loginLogoGlow 3s ease-in-out infinite;
                }

                .dark .login-logo-glow {
                    background: radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%);
                }

                @keyframes loginLogoGlow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.3); }
                }

                .login-logo-img {
                    width: 120px;
                    position: relative;
                    z-index: 1;
                    filter: hue-rotate(130deg) saturate(1.2) drop-shadow(0 0 15px rgba(59, 130, 246, 0.2));
                }

                .dark .login-logo-img {
                    filter: hue-rotate(130deg) saturate(1.2) drop-shadow(0 0 15px rgba(96, 165, 250, 0.3));
                }

                /* Title */
                .login-title-section {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .login-title {
                    font-size: 26px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.5px;
                }

                .dark .login-title {
                    color: #fff;
                }

                .login-subtitle {
                    font-size: 14px;
                    color: rgba(59, 130, 246, 0.7);
                    margin: 0;
                    letter-spacing: 0.3px;
                }

                .dark .login-subtitle {
                    color: rgba(96, 165, 250, 0.5);
                }

                /* Form */
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .login-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .login-field-animate {
                    animation: loginFieldSlideIn 0.3s ease-out;
                }

                @keyframes loginFieldSlideIn {
                    from { opacity: 0; transform: translateY(-10px); max-height: 0; }
                    to { opacity: 1; transform: translateY(0); max-height: 80px; }
                }

                .login-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #64748b;
                    letter-spacing: 0.3px;
                }

                .dark .login-label {
                    color: rgba(255, 255, 255, 0.6);
                }

                .login-label svg {
                    color: #3B82F6;
                }

                .dark .login-label svg {
                    color: rgba(96, 165, 250, 0.5);
                }

                .login-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .login-input {
                    width: 100%;
                    padding: 14px 16px;
                    background: rgba(59, 130, 246, 0.04);
                    border: 1px solid rgba(59, 130, 246, 0.15);
                    border-radius: 12px;
                    color: #1e293b;
                    font-size: 14px;
                    font-family: 'Outfit', sans-serif;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .dark .login-input {
                    background: rgba(59, 130, 246, 0.04);
                    border-color: rgba(59, 130, 246, 0.12);
                    color: #fff;
                }

                .login-input::placeholder {
                    color: #94a3b8;
                }

                .dark .login-input::placeholder {
                    color: rgba(255, 255, 255, 0.2);
                }

                .login-input:focus {
                    border-color: rgba(59, 130, 246, 0.5);
                    background: rgba(59, 130, 246, 0.06);
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.08);
                }

                .dark .login-input:focus {
                    border-color: rgba(96, 165, 250, 0.4);
                    background: rgba(59, 130, 246, 0.06);
                    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.08), 0 0 20px rgba(96, 165, 250, 0.1);
                }

                .login-input-password {
                    padding-right: 48px;
                }

                .login-password-toggle {
                    position: absolute;
                    right: 14px;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s ease;
                }

                .dark .login-password-toggle {
                    color: rgba(255, 255, 255, 0.3);
                }

                .login-password-toggle:hover {
                    color: #3B82F6;
                }

                .dark .login-password-toggle:hover {
                    color: #60A5FA;
                }

                /* Submit button */
                .login-submit-btn {
                    width: 100%;
                    padding: 14px 24px;
                    margin-top: 4px;
                    background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #A78BFA 100%);
                    border: none;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 15px;
                    font-weight: 600;
                    font-family: 'Outfit', sans-serif;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .dark .login-submit-btn {
                    background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #A78BFA 100%);
                    color: #fff;
                    box-shadow: 0 0 20px rgba(96, 165, 250, 0.25);
                }

                .login-submit-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
                    transform: translateX(-100%);
                    transition: transform 0.5s ease;
                }

                .login-submit-btn:hover::before {
                    transform: translateX(100%);
                }

                .login-submit-btn:hover {
                    box-shadow: 0 6px 30px rgba(59, 130, 246, 0.4);
                    transform: translateY(-1px);
                }

                .dark .login-submit-btn:hover {
                    box-shadow: 0 0 40px rgba(96, 165, 250, 0.4);
                }

                .login-submit-btn:active {
                    transform: translateY(1px) scale(0.98);
                }

                .login-submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .login-spinner {
                    width: 22px; height: 22px;
                    border: 2.5px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: loginSpin 0.7s linear infinite;
                }

                .dark .login-spinner {
                    border-color: rgba(255, 255, 255, 0.2);
                    border-top-color: #fff;
                }

                @keyframes loginSpin {
                    to { transform: rotate(360deg); }
                }

                /* Divider */
                .login-divider {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin: 24px 0 16px;
                }

                .login-divider-line {
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
                }

                .dark .login-divider-line {
                    background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.15), transparent);
                }

                .login-divider-text {
                    font-size: 12px;
                    color: #94a3b8;
                    white-space: nowrap;
                }

                .dark .login-divider-text {
                    color: rgba(255, 255, 255, 0.3);
                }

                /* Switch button */
                .login-switch-btn {
                    width: 100%;
                    padding: 12px;
                    background: transparent;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    border-radius: 12px;
                    color: #3B82F6;
                    font-size: 14px;
                    font-weight: 500;
                    font-family: 'Outfit', sans-serif;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .dark .login-switch-btn {
                    border-color: rgba(96, 165, 250, 0.15);
                    color: #60A5FA;
                }

                .login-switch-btn:hover {
                    background: rgba(59, 130, 246, 0.06);
                    border-color: rgba(59, 130, 246, 0.35);
                    box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
                }

                .dark .login-switch-btn:hover {
                    background: rgba(96, 165, 250, 0.06);
                    border-color: rgba(96, 165, 250, 0.3);
                    box-shadow: 0 0 15px rgba(96, 165, 250, 0.1);
                }

                /* Footer */
                .login-footer {
                    text-align: center;
                    font-size: 11px;
                    color: #94a3b8;
                    margin: 20px 0 0;
                }

                .dark .login-footer {
                    color: rgba(255, 255, 255, 0.2);
                }

                /* Mobile */
                @media (max-width: 480px) {
                    .login-card {
                        padding: 32px 24px;
                        border-radius: 20px;
                    }

                    .login-title {
                        font-size: 22px;
                    }

                    .login-logo-img {
                        width: 100px;
                    }

                    .login-input {
                        padding: 12px 14px;
                    }

                    .login-submit-btn {
                        padding: 12px 20px;
                    }
                }
            `}</style>
        </div>
    )
}

export default Login
