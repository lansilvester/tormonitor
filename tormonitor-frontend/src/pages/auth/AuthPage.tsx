import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2, Activity, AlertCircle } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgotpassword';

const getPasswordStrength = (pwd: string) => {
  if (!pwd) return { score: 0, label: '', color: 'bg-transparent', textClass: 'text-forest/40' };
  
  let score = 0;
  
  // 1. Length checks
  if (pwd.length >= 8) score++;
  if (pwd.length >= 10) score++;
  
  // 2. Character checks
  const hasLetter = /[a-zA-Z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  
  if (hasLetter && hasNumber) score++;
  if (hasSpecial) score++;
  
  const finalScore = Math.min(score, 4);
  
  switch (finalScore) {
    case 1:
      return { score: 1, label: 'Sangat Lemah', color: 'bg-terracotta', textClass: 'text-terracotta' };
    case 2:
      return { score: 2, label: 'Cukup', color: 'bg-amber-500', textClass: 'text-amber-600' };
    case 3:
      return { score: 3, label: 'Kuat', color: 'bg-emerald-500', textClass: 'text-emerald-600' };
    case 4:
      return { score: 4, label: 'Sangat Kuat', color: 'bg-forest', textClass: 'text-forest' };
    default:
      return { score: 1, label: 'Sangat Lemah', color: 'bg-terracotta', textClass: 'text-terracotta' };
  }
};

interface AuthPageProps {
  initialMode?: AuthMode;
  onNavigate: (path: string) => void;
  onLoginSuccess: (email: string) => void;
}

export function AuthPage({ initialMode = 'login', onNavigate, onLoginSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Sync state with path updates (e.g. browser navigation) and clear inputs
  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setErrors({});
    setShakeTrigger(0);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setAgreeTerms(false);
  }, [initialMode]);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const strength = getPasswordStrength(password);

  // Field-specific validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  // Synchronize internal state with path if needed
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setErrors({});
    setShakeTrigger(0);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setAgreeTerms(false);
    
    // Update parent url
    onNavigate(`/${newMode}`);
  };

  // Helper validation functions
  const validateEmail = (val: string) => {
    if (!val) return 'Silakan masukkan alamat email Anda.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Format email tidak valid (contoh: name@domain.com).';
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Silakan masukkan kata sandi Anda.';
    if (val.length < 8) return 'Kata sandi minimal harus terdiri dari 8 karakter.';
    const hasNumber = /\d/.test(val);
    const hasLetter = /[a-zA-Z]/.test(val);
    if (!hasNumber || !hasLetter) {
      return 'Kata sandi harus mengandung setidaknya 1 huruf dan 1 angka.';
    }
    return '';
  };

  const validateFullName = (val: string) => {
    if (!val) return 'Silakan masukkan nama lengkap Anda.';
    if (val.trim().length < 3) return 'Nama lengkap minimal harus terdiri dari 3 karakter.';
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(val)) return 'Nama lengkap hanya boleh berisi huruf dan spasi.';
    return '';
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(val) || undefined }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errors.password) {
      if (mode === 'register') {
        setErrors(prev => ({ ...prev, password: validatePassword(val) || undefined }));
      } else {
        setErrors(prev => ({ ...prev, password: !val ? 'Silakan masukkan kata sandi Anda.' : undefined }));
      }
    }
    if (errors.confirmPassword && mode === 'register') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: val !== confirmPassword ? 'Konfirmasi kata sandi tidak cocok.' : undefined
      }));
    }
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (errors.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: password !== val ? 'Konfirmasi kata sandi tidak cocok.' : undefined
      }));
    }
  };

  const handleFullNameChange = (val: string) => {
    setFullName(val);
    if (errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: validateFullName(val) || undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    const newErrors: typeof errors = {};

    if (mode === 'register') {
      const nameErr = validateFullName(fullName);
      if (nameErr) newErrors.fullName = nameErr;

      const emailErr = validateEmail(email);
      if (emailErr) newErrors.email = emailErr;

      const pwdErr = validatePassword(password);
      if (pwdErr) newErrors.password = pwdErr;

      if (!confirmPassword) {
        newErrors.confirmPassword = 'Silakan konfirmasi kata sandi Anda.';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
      }

      if (!agreeTerms) {
        newErrors.agreeTerms = 'Anda harus menyetujui syarat & ketentuan layanan.';
      }
    } else if (mode === 'login') {
      const emailErr = validateEmail(email);
      if (emailErr) newErrors.email = emailErr;

      if (!password) {
        newErrors.password = 'Silakan masukkan kata sandi Anda.';
      }
    } else if (mode === 'forgotpassword') {
      const emailErr = validateEmail(email);
      if (emailErr) newErrors.email = emailErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMsg('Silakan periksa kembali data yang Anda masukkan.');
      setShakeTrigger(prev => prev + 1);
      return;
    }

    // Clear all error objects on success validate
    setErrors({});
    setLoading(true);

    // Simulate Network Request Delay
    setTimeout(() => {
      setLoading(false);
      if (mode === 'register') {
        setSuccessMsg('Akun berhasil dibuat! Mengalihkan ke halaman masuk...');
        setTimeout(() => {
          switchMode('login');
        }, 2000);
      } else if (mode === 'login') {
        onLoginSuccess(email || 'chrisslat9@gmail.com');
      } else if (mode === 'forgotpassword') {
        setSuccessMsg(`Tautan pemulihan kata sandi telah dikirim ke ${email}. Silakan periksa kotak masuk Anda!`);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center gap-6 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative ambient elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-forest/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-terracotta/5 blur-[120px] pointer-events-none"></div>

      {/* Top Header Logo */}
      <div className="flex justify-center items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-2xl bg-forest text-cream flex items-center justify-center font-bold shadow-md">
          <Activity size={22} />
        </div>
        <span className="font-display text-2xl font-bold tracking-tight text-forest">TorMonitor</span>
      </div>

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: shakeTrigger > 0 ? [0, -8, 8, -6, 6, -3, 3, 0] : 0
          }}
          transition={{ 
            x: { duration: 0.45, ease: 'easeInOut' },
            default: { duration: 0.5, ease: 'easeOut' },
          }}
          className="glass rounded-3xl p-8 border border-black/5 shadow-xl relative overflow-hidden"
        >
          {/* Accent decoration inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-forest/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {/* Form titles based on Mode */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-forest text-center">
              {mode === 'login' && 'Selamat Datang Kembali'}
              {mode === 'register' && 'Buat Akun Anda'}
              {mode === 'forgotpassword' && 'Atur Ulang Sandi'}
            </h2>
            <p className="text-xs sm:text-sm text-forest/60 text-center mt-2 font-medium">
              {mode === 'login' && 'Kelola kekayaan dan pantau aset investasi Anda hari ini.'}
              {mode === 'register' && 'Langkah awal menuju kebebasan finansial yang terukur.'}
              {mode === 'forgotpassword' && 'Masukkan email Anda untuk menerima instruksi pemulihan.'}
            </p>
          </div>

          {/* Alert banners */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-terracotta/10 border border-terracotta/20 text-xs text-forest font-semibold"
            >
              ⚠️ {errorMsg}
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-forest/10 border border-forest/20 text-xs text-forest font-semibold flex gap-2 items-start"
            >
              <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" noValidate>
            {/* Dummy inputs to prevent aggressive page-load autofill */}
            <input type="text" name="prevent_autofill_username" style={{ display: 'none' }} autoComplete="off" />
            <input type="password" name="prevent_autofill_password" style={{ display: 'none' }} autoComplete="off" />

            {/* Full Name input for register */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest/70 uppercase tracking-wider pl-1">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.fullName ? 'text-terracotta/70' : 'text-forest/40'}`} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => handleFullNameChange(e.target.value)}
                    placeholder="Contoh: Chris Slat"
                    disabled={loading}
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl transition-all border outline-none text-sm placeholder:text-forest/30 ${errors.fullName ? 'bg-terracotta/3 border-terracotta/40 focus:ring-terracotta/20 text-terracotta' : 'bg-black/5 border-transparent focus:ring-forest/20 text-forest'} focus:ring-2`}
                  />
                </div>
                <AnimatePresence>
                  {errors.fullName && (
                    <motion.div
                       initial={{ opacity: 0, height: 0, y: -4 }}
                       animate={{ opacity: 1, height: 'auto', y: 0 }}
                       exit={{ opacity: 0, height: 0, y: -4 }}
                       transition={{ duration: 0.2 }}
                       className="flex items-center gap-1.5 mt-1.5 pl-1 text-[11px] text-terracotta font-semibold overflow-hidden"
                    >
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.fullName}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Email input for all modes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-forest/70 uppercase tracking-wider pl-1">Alamat Email</label>
              <div className="relative">
                <Mail size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-terracotta/70' : 'text-forest/40'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="name@domain.com"
                  disabled={loading}
                  autoComplete="email"
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl transition-all border outline-none text-sm placeholder:text-forest/30 ${errors.email ? 'bg-terracotta/3 border-terracotta/40 focus:ring-terracotta/20 text-terracotta' : 'bg-black/5 border-transparent focus:ring-forest/20 text-forest'} focus:ring-2`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 mt-1.5 pl-1 text-[11px] text-terracotta font-semibold overflow-hidden"
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.email}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password input for login and register */}
            {mode !== 'forgotpassword' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-forest/70 uppercase tracking-wider">Kata Sandi</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgotpassword')}
                      className="text-[11px] font-bold text-terracotta hover:text-forest transition-colors"
                    >
                      Lupa Sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-terracotta/70' : 'text-forest/40'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder={mode === 'register' ? 'Min. 8 Karakter (Huruf & Angka)' : 'Masukkan kata sandi Anda'}
                    disabled={loading}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    className={`w-full pl-11 pr-11 py-3 rounded-2xl transition-all border outline-none text-sm placeholder:text-forest/30 ${errors.password ? 'bg-terracotta/3 border-terracotta/40 focus:ring-terracotta/20 text-terracotta' : 'bg-black/5 border-transparent focus:ring-forest/20 text-forest'} focus:ring-2`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {mode === 'register' && password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 pt-1.5 pb-0.5 overflow-hidden"
                  >
                    <div className="flex gap-1.5 h-1">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            index <= strength.score ? strength.color : 'bg-forest/10'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider pl-1">
                      <span className="text-forest/50">Kekuatan Sandi</span>
                      <span className={`${strength.textClass} transition-colors duration-300`}>{strength.label}</span>
                    </div>
                  </motion.div>
                )}

                <AnimatePresence>
                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5 mt-1.5 pl-1 text-[11px] text-terracotta font-semibold overflow-hidden"
                    >
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.password}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Confirm Password input for register */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest/70 uppercase tracking-wider pl-1">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <Lock size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? 'text-terracotta/70' : 'text-forest/40'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    placeholder="Ketik ulang kata sandi"
                    disabled={loading}
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-11 py-3 rounded-2xl transition-all border outline-none text-sm placeholder:text-forest/30 ${errors.confirmPassword ? 'bg-terracotta/3 border-terracotta/40 focus:ring-terracotta/20 text-terracotta' : 'bg-black/5 border-transparent focus:ring-forest/20 text-forest'} focus:ring-2`}
                  />
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5 mt-1.5 pl-1 text-[11px] text-terracotta font-semibold overflow-hidden"
                    >
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Terms and conditions Checkbox for Register */}
            {mode === 'register' && (
              <div className="space-y-1 pt-1">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.agreeTerms) {
                        setErrors(prev => ({ ...prev, agreeTerms: e.target.checked ? undefined : 'Anda harus menyetujui syarat & ketentuan layanan.' }));
                      }
                    }}
                    disabled={loading}
                    className={`mt-1 w-4 h-4 rounded-md text-forest focus:ring-forest/20 bg-cream transition-all ${errors.agreeTerms ? 'border-terracotta text-terracotta focus:ring-terracotta/20' : 'border-forest/20'}`}
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-forest/60 leading-tight">
                    Saya menyetujui <span className="font-semibold text-forest underline cursor-pointer">Syarat & Ketentuan</span> serta <span className="font-semibold text-forest underline cursor-pointer">Kebijakan Privasi</span> platform.
                  </label>
                </div>
                <AnimatePresence>
                  {errors.agreeTerms && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5 mt-1 pl-1 text-[11px] text-terracotta font-semibold overflow-hidden"
                    >
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.agreeTerms}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Remember Me Checkbox for Login */}
            {mode === 'login' && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-md border-forest/20 text-forest focus:ring-forest/20 bg-cream"
                  />
                  <span className="text-xs text-forest/60 select-none">Biarkan saya tetap masuk</span>
                </label>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading || (mode === 'register' && !agreeTerms)}
              className="w-full mt-2 py-3.5 rounded-2xl bg-forest text-cream font-bold text-sm tracking-wide shadow-md hover:bg-forest-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Masuk Akun'}
                    {mode === 'register' && 'Daftar Sekarang'}
                    {mode === 'forgotpassword' && 'Kirim Tautan Atur Ulang'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Bottom redirection footers */}
          <div className="mt-8 pt-6 border-t border-black/5 text-center">
            {mode === 'login' && (
              <p className="text-xs text-forest/60">
                Belum memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-bold text-terracotta hover:text-forest transition-colors"
                >
                  Daftar di sini
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p className="text-xs text-forest/60">
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-terracotta hover:text-forest transition-colors"
                >
                  Masuk Sekarang
                </button>
              </p>
            )}

            {mode === 'forgotpassword' && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-bold text-forest hover:text-terracotta transition-colors flex items-center justify-center gap-1.5 mx-auto"
              >
                <span>Kembali ke halaman masuk</span>
              </button>
            )}
          </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
