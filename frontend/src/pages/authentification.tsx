// ===== frontend/src/pages/Auth.jsx =====
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de connexion - remplacez par votre logique d'authentification
    if (isLogin) {
      // Simuler une connexion réussie
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({
        name: 'John Doe',
        email: formData.email
      }));
      navigate('/dashboard');
    } else {
      // Logique d'inscription
      console.log('Inscription:', formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-300 to-green-400 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex items-center justify-between">
        
        {/* Section gauche - Description */}
        <div className="flex-1 text-center mr-8 hidden lg:block">
          <h1 className="text-6xl font-bold text-gray-800 mb-8">
            MoneyTrack
          </h1>
          
          <div className="text-lg text-gray-700 leading-relaxed max-w-lg mx-auto space-y-4">
            <p>
              <strong>MoneyTrack</strong> is a simple and intuitive personal 
              expense management application.
            </p>
            <p>
              It helps you track your daily income and expenses, 
              analyze your financial habits and better organize 
              your budget.
            </p>
          </div>
        </div>

        {/* Section droite - Formulaire d'authentification */}
        <div className="w-full max-w-md">
          <div className="bg-green-100 bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Authentication
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 italic">
                  Email :
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@example.com"
                  className="w-full px-4 py-3 bg-green-200 bg-opacity-60 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 placeholder-gray-600"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 italic">
                  Password :
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-green-200 bg-opacity-60 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (pour l'inscription) */}
              {!isLogin && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2 italic">
                    Confirm Password :
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-green-200 bg-opacity-60 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
                    required
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 ${
                    !isLogin 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-green-300 bg-opacity-60 text-gray-700 hover:bg-green-400 hover:bg-opacity-70'
                  }`}
                >
                  SignUp
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 ${
                    isLogin 
                      ? 'bg-green-700 text-white shadow-lg' 
                      : 'bg-green-300 bg-opacity-60 text-gray-700 hover:bg-green-400 hover:bg-opacity-70'
                  }`}
                >
                  Login
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors duration-200 shadow-lg mt-4"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>

              {/* Forgot Password */}
              {isLogin && (
                <div className="text-center mt-6">
                  <button
                    type="button"
                    className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                  >
                    Forgot your password ?
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;