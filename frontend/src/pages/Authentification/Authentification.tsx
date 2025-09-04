import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { Toast, useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

export default function Authentification() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { toast, showError, showSuccess, hideToast } = useToast();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading || isRedirecting) return;

    // Basic validation
    if (!formData.email || !formData.password) {
      showError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      showError("Password must contain at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        await login({
          email: formData.email,
          password: formData.password
        });
        showSuccess("Login successful! Redirecting...");
        setIsRedirecting(true);
        
        // Wait a bit for the user to see the success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        // Registration
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined
        });
        showSuccess("Account created successfully! Redirecting...");
        setIsRedirecting(true);
        
        // Wait a bit for the user to see the success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      showError(errorMessage);
      setIsRedirecting(false);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    });
    setIsRedirecting(false);
    hideToast();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{
      background: 'linear-gradient(135deg, #a8b876 0%, #9aab6b 50%, #8b9c5d 100%)'
    }}>
      <div className="w-full max-w-6xl flex items-center gap-16 lg:gap-20">
        {/* Section gauche - Texte de présentation */}
        <div className="flex-1 hidden lg:block animate-fade-in-up" style={{ color: '#2d3e1f' }}>
          <h1 className="text-6xl xl:text-7xl font-bold mb-8 drop-shadow-lg" style={{ 
            color: '#2d3e1f',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            MoneyTrack
          </h1>
          <div className="text-xl xl:text-2xl leading-relaxed max-w-lg font-medium">
            <p className="mb-4">
              MoneyTrack is a simple and intuitive personal expense management application.
            </p>
            <p>
              It helps you track your daily income and expenses, analyze your financial habits and better organize your budget.
            </p>
          </div>
        </div>
        
        {/* Section droite - Formulaire d'authentification */}
        <div className="flex-1 flex justify-center">
          <div className="backdrop-blur-lg rounded-3xl p-8 lg:p-10 w-full max-w-md shadow-2xl animate-fade-in-up animation-delay-200" style={{
            background: 'rgba(230, 235, 220, 0.95)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
          }}>
            <h2 className="text-center text-3xl mb-8 font-semibold" style={{ color: '#2d3e1f' }}>
              {isLogin ? 'Login' : 'Sign Up'}
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* First name and last name fields for registration */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg mb-2 font-medium" style={{ 
                      color: '#2d3e1f',
                      fontStyle: 'italic'
                    }}>
                      First Name:
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-none rounded-full text-base outline-none transition-all duration-300 focus:-translate-y-1 focus:shadow-lg"
                      style={{
                        backgroundColor: '#a8b876',
                        color: '#2d3e1f'
                      }}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-lg mb-2 font-medium" style={{ 
                      color: '#2d3e1f',
                      fontStyle: 'italic'
                    }}>
                      Last Name:
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-none rounded-full text-base outline-none transition-all duration-300 focus:-translate-y-1 focus:shadow-lg"
                      style={{
                        backgroundColor: '#a8b876',
                        color: '#2d3e1f'
                      }}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-lg mb-2 font-medium" style={{ 
                  color: '#2d3e1f',
                  fontStyle: 'italic'
                }}>
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 border-none rounded-full text-base outline-none transition-all duration-300 focus:-translate-y-1 focus:shadow-lg"
                  style={{
                    backgroundColor: '#a8b876',
                    color: '#2d3e1f'
                  }}
                  placeholder="example@example.com"
                />
              </div>
              
              {/* Password Field */}
              <div>
                <label className="block text-lg mb-2 font-medium" style={{ 
                  color: '#2d3e1f',
                  fontStyle: 'italic'
                }}>
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-5 py-4 pr-14 border-none rounded-full text-base outline-none transition-all duration-300 focus:-translate-y-1 focus:shadow-lg"
                    style={{
                      backgroundColor: '#a8b876',
                      color: '#2d3e1f'
                    }}
                    placeholder="Password (min. 6 characters)"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl p-1 rounded-full hover:bg-black/10 transition-colors duration-300 cursor-pointer"
                    style={{ color: '#2d3e1f' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁' : '🙈'}
                  </button>
                </div>
              </div>
              
              {/* SignUp/Login Buttons */}
              <div className="flex gap-4 pt-4 justify-center">
                <Button
                  type="button"
                  variant={!isLogin ? 'primary' : 'secondary'}
                  onClick={switchMode}
                  disabled={isLoading || isRedirecting}
                >
                  {isLogin ? 'Create Account' : 'Login'}
                </Button>
                <Button
                  type="submit"
                  variant={isLogin ? 'primary' : 'secondary'}
                  disabled={isLoading || isRedirecting}
                >
                  {isRedirecting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">🔄</span>
                      Redirecting...
                    </span>
                  ) : isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      {isLogin ? 'Logging in...' : 'Signing up...'}
                    </span>
                  ) : (
                    isLogin ? 'Login' : 'Sign Up'
                  )}
                </Button>
              </div>
              
              {/* Forgot password link */}
              <div className="text-center pt-4">
                <a 
                  href="#" 
                  className="text-base hover:underline transition-colors duration-300"
                  style={{ color: '#2d3e1f' }}
                >
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Version mobile du titre */}
      <div className="lg:hidden absolute top-8 left-1/2 -translate-x-1/2">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg text-center" style={{ 
          color: '#2d3e1f',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          MoneyTrack
        </h1>
      </div>

      {/* Toast pour les notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
