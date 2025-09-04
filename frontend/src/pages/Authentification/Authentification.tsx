import { useState } from 'react';
import Button from '../../components/Button/Button';
import { Toast, useToast } from '../../components/Toast';

export default function Authentification() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast, showError, showSuccess, hideToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Exemple d'utilisation du toast
    if (isLogin) {
      showError("Mot de passe incorrect");
    } else {
      showSuccess("Compte créé avec succès !");
    }
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
              Authentification
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Champ Email */}
              <div>
                <label className="block text-lg mb-2 font-medium" style={{ 
                  color: '#2d3e1f',
                  fontStyle: 'italic'
                }}>
                  Email :
                </label>
                <input
                  type="email"
                  className="w-full px-5 py-4 border-none rounded-full text-base outline-none transition-all duration-300 focus:-translate-y-1 focus:shadow-lg"
                  style={{
                    backgroundColor: '#a8b876',
                    color: '#2d3e1f'
                  }}
                  placeholder="exemple@exemple.com"
                />
              </div>
              
              {/* Champ Password */}
              <div>
                <label className="block text-lg mb-2 font-medium" style={{ 
                  color: '#2d3e1f',
                  fontStyle: 'italic'
                }}>
                  Password :
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-5 py-4 pr-14 border-none rounded-full text-base outline-none transition-all duration-300 focus:-translate-y-1 focus:shadow-lg"
                    style={{
                      backgroundColor: '#a8b876',
                      color: '#2d3e1f'
                    }}
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
              
              {/* Boutons SignUp/Login */}
              <div className="flex gap-4 pt-4 justify-center">
                <Button
                  type="button"
                  variant={!isLogin ? 'primary' : 'secondary'}
                  onClick={() => {
                    setIsLogin(false);
                    showSuccess("Mode inscription activé");
                  }}
                >
                  SignUp
                </Button>
                <Button
                  type="submit"
                  variant={isLogin ? 'primary' : 'secondary'}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </Button>
              </div>
              
              {/* Lien mot de passe oublié */}
              <div className="text-center pt-4">
                <a 
                  href="#" 
                  className="text-base hover:underline transition-colors duration-300"
                  style={{ color: '#2d3e1f' }}
                >
                  Forgot your password ?
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
