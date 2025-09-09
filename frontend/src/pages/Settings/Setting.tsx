import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { useToast } from '../../components/Toast/useToast';
import Toast from '../../components/Toast/Toast';
import { formatDate } from '../../utils/formatDate';

export default function Setting() {
  const { user, token, logout } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Focus sur l'input password quand on entre en mode changement
  useEffect(() => {
    if (isChangingPassword && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [isChangingPassword]);

  // Gérer le clic sur "Change Password"
  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    setCurrentPassword('');
    setNewPassword('');
  };

  // Gérer le clic sur "Cancel"
  const handleCancel = () => {
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  // Gérer le clic sur "Save"
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ne valider que si on est en mode changement de mot de passe
    if (!isChangingPassword) {
      return;
    }
    
    // Validation
    if (!currentPassword.trim() || !newPassword.trim()) {
      showError('Please fill in both password fields');
      return;
    }

    if (newPassword.length < 6) {
      showError('New password must be at least 6 characters long');
      return;
    }

    // Changer le mot de passe directement
    if (!token) {
      showError('No authentication token found');
      return;
    }

    console.log('Attempting password change...');
    console.log('Current password length:', currentPassword.length);
    console.log('New password length:', newPassword.length);

    setIsLoading(true);

    try {
      const response = await authService.changePassword(currentPassword, newPassword, token);
      console.log('Password change response:', response);
      
      showSuccess('Password changed successfully!');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error('Password change error:', error);
      showError(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    logout();
  };

  // Formatage du nom complet
  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.lastName) {
      return user.lastName;
    }
    return 'No name provided';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] p-8 space-y-8 rounded-3xl justify-center">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide text-center">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center rounded-3xl">
          <img
            src="src/assets/images/Logo MoneyTrack.png"
            alt="MoneyTrack Logo"
            className="w-80 h-100 object-contain mb-6"
          />
        </div>

        {/* Settings Form */}
        <div className="bg-white p-10 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h2>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Full Name - Read Only */}
            <div>
              <label className="block font-serif italic text-lg font-medium text-gray-600 mb-2">Full Name</label>
              <input
                type="text"
                value={getFullName()}
                readOnly
                className="w-full p-3 bg-gray-100 rounded-xl border border-gray-200 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Email - Read Only */}
            <div>
              <label className="block font-serif italic text-lg font-medium text-gray-600 mb-2">E-mail</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full p-3 bg-gray-100 rounded-xl border border-gray-200 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Account Created Date - Read Only */}
            <div>
              <label className="block font-serif italic text-lg font-medium text-gray-600 mb-2">Account Created</label>
              <input
                type="text"
                value={user?.createdAt ? formatDate(user.createdAt) : ''}
                readOnly
                className="w-full p-3 bg-gray-100 rounded-xl border border-gray-200 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Current Password - Only shown when changing password */}
            {isChangingPassword && (
              <div>
                <label className="block font-serif italic text-lg font-medium text-gray-600 mb-2">Current Password</label>
                <input
                  ref={passwordInputRef}
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-text"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* New Password - Only shown when changing password */}
            {isChangingPassword && (
              <div>
                <label className="block font-serif italic text-lg font-medium text-gray-600 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-text"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-center pt-4 gap-x-6">
              {!isChangingPassword ? (
                <>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-400 to-red-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    onClick={handleChangePasswordClick}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    Change Password
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSave(e);
                    }}
                    disabled={isLoading || !currentPassword.trim() || !newPassword.trim()}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>



      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
