import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../../api/auth'
import useAuthStore from '../../store/useAuthStore'

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const EnvelopeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const EyeSlashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// Project Feature Icons
const RocketIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.5v-11l-6 3.428m6-3.428l6 3.428m-6-3.428v11m0-11L3.5 5.928m10 10.5l6-3.428m-6 3.428l-6-3.428m6 3.428v11m-6-11l-6 3.428" />
  </svg>
)

const GlobalIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21c-2.668 0-5.116-.857-7.184-2.304m14.368-5.396h.008v.008h-.008m0 0h.008v.008h-.008M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>
)

const SparklesIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09l-.813 2.846zM18.259 8.715L18 9.5l-.259-.785a3.375 3.375 0 00-2.457-2.457L15 5.25l.75.75a3.375 3.375 0 002.457 2.457L18.259 8.715zm0 6.75l.75.75-.75.75a3.375 3.375 0 00-2.457 2.457l-.259.785-.259-.785a3.375 3.375 0 00-2.457-2.457l-.75-.75.75-.75a3.375 3.375 0 002.457-2.457l.259-.785.259.785a3.375 3.375 0 002.457 2.457z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 001.591-.079 9.335 9.335 0 005.892-5.123 9.35 9.35 0 001.386-4.605c0-5.192-4.308-9.5-9.5-9.5S3.5 3.308 3.5 8.5c0 1.757.372 3.429 1.037 4.93M15 19.128v-.008a9.347 9.347 0 00-5.618-3.876m0 0a9.37 9.37 0 00-5.142 4.543m7.66-13.734L9.35 4.5m0 0a9.382 9.382 0 013.154-.466c5.192 0 9.5 4.308 9.5 9.5s-4.308 9.5-9.5 9.5c-1.757 0-3.429-.372-4.93-1.037" />
  </svg>
)

// ─── Password Strength Calculator ───────────────────────────────────────────
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-400' }
  if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-400' }
  if (score <= 3) return { score: 3, label: 'Good', color: 'bg-blue-400' }
  return { score: 4, label: 'Strong', color: 'bg-emerald-400' }
}

// ─── Role Card Component ────────────────────────────────────────────────────
const RoleCard = ({ value, currentRole, onChange, icon, title, description }) => {
  const isActive = currentRole === value
  return (
    <button
      type="button"
      onClick={() => onChange({ target: { name: 'role', value } })}
      className={`relative flex-1 rounded-xl border-2 p-4 text-left transition-all duration-300 ease-out group
        ${isActive
          ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-brand-100/50 shadow-lg shadow-brand-500/15'
          : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-md'
        }`}
    >
      {/* Active indicator */}
      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
        ${isActive
          ? 'border-brand-500 bg-brand-500 scale-100'
          : 'border-surface-300 bg-white scale-90'
        }`}>
        {isActive && <CheckIcon />}
      </div>

      <div className={`text-2xl mb-2 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </div>
      <p className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-brand-700' : 'text-surface-700'}`}>
        {title}
      </p>
      <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">
        {description}
      </p>
    </button>
  )
}

// ─── Main Register Component ────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await registerUser(form)
      setSuccess(true)
      
      setTimeout(() => {
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken)
        if (res.data.user.role === 'seller') navigate('/seller/dashboard')
        else navigate('/')
      }, 800)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  const strength = getPasswordStrength(form.password)

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-surface-100">
        <div className="text-center animate-fade-in-up">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-scale-in-bounce">
              <CheckCircleIcon className="text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">Account created!</h2>
          <p className="text-surface-500 text-sm">Setting up your experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <style>{`
        @keyframes float-smooth {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }

        @keyframes float-smooth-delayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(15px) translateX(-15px);
          }
          66% {
            transform: translateY(-15px) translateX(15px);
          }
        }

        @keyframes float-smooth-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        @keyframes scale-in-bounce {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes slide-down-fade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes stagger-fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes text-glow-pulse {
          0%, 100% {
            text-shadow: 0 0 0px rgba(168, 85, 247, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-float-smooth {
          animation: float-smooth 6s ease-in-out infinite;
        }

        .animate-float-smooth-delayed {
          animation: float-smooth-delayed 7s ease-in-out infinite;
        }

        .animate-float-smooth-slow {
          animation: float-smooth-slow 8s ease-in-out infinite;
        }

        .animate-scale-in-bounce {
          animation: scale-in-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-slide-down-fade {
          animation: slide-down-fade 0.3s ease-out;
        }

        .animate-stagger-1 {
          animation: stagger-fade-in-up 0.5s ease-out 0.1s both;
        }

        .animate-stagger-2 {
          animation: stagger-fade-in-up 0.5s ease-out 0.2s both;
        }

        .animate-stagger-3 {
          animation: stagger-fade-in-up 0.5s ease-out 0.3s both;
        }

        .animate-stagger-4 {
          animation: stagger-fade-in-up 0.5s ease-out 0.4s both;
        }

        .animate-stagger-5 {
          animation: stagger-fade-in-up 0.5s ease-out 0.5s both;
        }

        .animate-text-glow-pulse {
          animation: text-glow-pulse 3s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .input-field {
          @apply w-full px-4 py-3 bg-white border border-surface-200 rounded-lg text-surface-900 placeholder-surface-400 transition-all duration-300;
        }

        .input-field:focus {
          @apply outline-none border-brand-500 bg-white shadow-lg shadow-brand-500/20;
        }

        .input-field:hover:not(:focus) {
          @apply border-surface-300;
        }

        .input-with-icon {
          @apply pl-11 input-field;
        }

        .btn-primary {
          @apply relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-lg transition-all duration-300 overflow-hidden;
        }

        .btn-primary:hover:not(:disabled) {
          @apply from-brand-600 to-brand-700 shadow-lg shadow-brand-500/30 -translate-y-0.5;
        }

        .btn-primary:active:not(:disabled) {
          @apply from-brand-700 to-brand-800 translate-y-0;
        }

        .btn-primary:disabled {
          @apply opacity-90 cursor-not-allowed;
        }

        .field-error {
          @apply text-red-500 text-xs mt-1.5 font-medium;
        }

        .feature-card {
          @apply p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer;
        }
      `}</style>

      {/* ── Left Panel: Brand / Visual ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden bg-surface-950">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950" />

        {/* Mesh overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(at 20% 80%, rgba(168,85,247,0.4) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(124,58,237,0.3) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(139,92,246,0.2) 0px, transparent 50%)'
          }}
        />

        {/* Floating decorative shapes */}
        <div className="absolute top-24 right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-smooth" />
        <div className="absolute bottom-40 left-12 w-48 h-48 bg-brand-400/10 rounded-full blur-2xl animate-float-smooth-delayed" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/5 rounded-3xl rotate-12 blur-2xl animate-float-smooth-slow" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo - ENLARGED */}
          <Link to="/" className="flex items-center gap-4 group w-fit animate-slide-in-left">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 group-hover:bg-white/25 group-hover:shadow-2xl group-hover:shadow-white/20 transition-all duration-300">
              <span className="text-white font-display font-black text-4xl">V</span>
            </div>
            <div>
              <span className="text-white font-display font-black text-3xl tracking-tighter block leading-none group-hover:text-brand-100 transition-colors duration-300">VendoraX</span>
              <span className="text-brand-300/70 text-xs font-semibold tracking-wider">Marketplace Platform</span>
            </div>
          </Link>

          {/* Hero Text with Interactive Animation */}
          <div className="space-y-8 max-w-lg">
            <div className="relative">
              <h2 className="text-5xl font-display font-black text-white leading-tight">
                Start your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 via-brand-100 to-brand-200 animate-text-glow-pulse">
                  journey today
                </span>
              </h2>
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-brand-400/20 rounded-full blur-2xl animate-float-smooth"></div>
            </div>

            <p className="text-brand-200/85 text-lg leading-relaxed font-light">
              Join a thriving community of sellers & buyers. Launch your store in minutes with AI-powered tools.
            </p>

            {/* Feature Grid with Icons - PROJECT GRAPHICS */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: RocketIcon, label: 'Quick Launch', desc: 'Set up in minutes' },
                { icon: GlobalIcon, label: 'Global Reach', desc: 'Sell worldwide' },
                { icon: SparklesIcon, label: 'AI Powered', desc: 'Smart tools included' },
                { icon: UsersIcon, label: 'Community', desc: '2,400+ sellers' },
              ].map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <div 
                    key={idx}
                    className="feature-card group animate-bounce-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="text-brand-200 group-hover:text-brand-100 transition-colors duration-300">
                        <IconComponent />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{item.label}</p>
                        <p className="text-brand-200/60 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { value: '2K+', label: 'Active sellers' },
                { value: '50K+', label: 'Happy buyers' },
              ].map((stat, idx) => (
                <div key={stat.label} className="animate-stagger-4" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                  <p className="text-3xl font-display font-black text-white">{stat.value}</p>
                  <p className="text-xs text-brand-300/70 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="bg-gradient-to-r from-white/8 to-white/5 backdrop-blur-md rounded-xl p-5 border border-white/15 shadow-lg shadow-black/20 animate-stagger-4">
            <p className="text-white/90 text-sm leading-relaxed italic">
              "VendoraX transformed my business. The AI tools save me hours every week, and the platform is intuitive."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center text-white text-xs font-bold">
                R
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Rajesh Kumar</p>
                <p className="text-brand-300/60 text-xs">Electronics Entrepreneur</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Register Form ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* ENHANCED BACKGROUND GRAPHICS & GRADIENTS */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-brand-50/40 to-purple-50/30" />
        
        {/* Animated gradient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-400/15 to-purple-400/10 rounded-full blur-3xl animate-float-smooth" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-brand-300/10 to-pink-300/5 rounded-full blur-3xl animate-float-smooth-delayed" />
        
        {/* Geometric elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-brand-400/40 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-16 w-2.5 h-2.5 bg-brand-300/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Gradient lines */}
        <svg className="absolute inset-0 opacity-20" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,400 Q300,300 600,400 T1200,400" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
        </svg>

        <div className="w-full max-w-[480px] relative z-10">

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 group animate-stagger-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-brand-500/30 transition-all duration-300">
              <span className="text-white font-display font-black text-xl">V</span>
            </div>
            <div>
              <span className="text-surface-900 font-display font-black text-xl tracking-tight block">VendoraX</span>
              <span className="text-brand-600 text-xs font-semibold">Marketplace</span>
            </div>
          </Link>

          {/* Interactive Heading */}
          <div className="mb-10 animate-stagger-1">
            <div className="relative inline-block mb-2">
              <h1 className="text-4xl font-display font-black text-surface-900 tracking-tight">
                Create your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 animate-text-glow-pulse">
                  account
                </span>
              </h1>
              <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-brand-500 to-purple-500 w-32 rounded-full animate-slide-in-left" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-surface-500 text-sm leading-relaxed font-medium mt-6">
              Join VendoraX and unlock unlimited possibilities. Set up in under a minute.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg animate-slide-down-fade">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold mb-0.5">Registration error</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-stagger-2">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-surface-800 mb-2.5">Full name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors duration-300">
                  <UserIcon />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-with-icon"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-surface-800 mb-2.5">Email address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors duration-300">
                  <EnvelopeIcon />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-with-icon"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-surface-800 mb-2.5">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors duration-300">
                  <LockIcon />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input-with-icon pr-11"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors duration-200 p-1"
                  tabIndex={-1}
                  disabled={loading}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Password strength bar */}
              {form.password && (
                <div className="mt-3 animate-slide-down-fade">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : 'bg-surface-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-2 font-semibold transition-colors duration-200 ${
                    strength.score <= 1 ? 'text-red-500'
                    : strength.score <= 2 ? 'text-amber-500'
                    : strength.score <= 3 ? 'text-blue-500'
                    : 'text-emerald-500'
                  }`}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Role selection */}
            <div className="animate-stagger-3">
              <label className="block text-sm font-bold text-surface-800 mb-2.5">I want to</label>
              <div className="flex gap-3">
                <RoleCard
                  value="buyer"
                  currentRole={form.role}
                  onChange={handleChange}
                  icon="🛍️"
                  title="Shop & Buy"
                  description="Browse & purchase"
                />
                <RoleCard
                  value="seller"
                  currentRole={form.role}
                  onChange={handleChange}
                  icon="🏪"
                  title="Sell Products"
                  description="Create a store"
                />
              </div>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full py-3.5 text-base font-bold group mt-8 animate-stagger-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <SpinnerIcon />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create my VendoraX account</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-surface-400 text-center mt-5 leading-relaxed animate-stagger-4">
            By creating an account, you agree to our{' '}
            <span className="text-brand-600 hover:text-brand-700 hover:underline cursor-pointer font-medium">Terms of Service</span>
            {' '}and{' '}
            <span className="text-brand-600 hover:text-brand-700 hover:underline cursor-pointer font-medium">Privacy Policy</span>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8 animate-stagger-5">
            <div className="flex-1 h-px bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200" />
            <span className="text-xs text-surface-400 font-bold whitespace-nowrap">Have an account?</span>
            <div className="flex-1 h-px bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-surface-500 animate-stagger-5">
            Already registered?{' '}
            <Link to="/login" className="text-brand-600 font-bold hover:text-brand-700 transition-colors duration-200">
              Sign in instead
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register