export default function Setting() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] p-8 space-y-8 rounded-3xl justify-center">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide text-center">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center rounded-3xl ">
          <img
            src="src/assets/images/Logo MoneyTrack.png"
            alt="MoneyTrack Logo"
            className="w-80 h-100 object-contain mb-6 "
          />
        </div>

        {/* Settings Form */}
        <div className="bg-white p-10 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h2>

          <form className="space-y-6">
            {/* User Name */}
            <div>
              <label className="block font-serif italic text-lg font-medium text-gray-600 mb-2">User name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className=" block font-serif italic text-lg font-medium text-gray-600 mb-2">E-mail</label>
              <input
                type="email"
                placeholder="example@mail.com"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-serif italic text-lgfont-medium text-gray-600 mb-2">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center pt-4 gap-x-6">
              <button
                type="button"
                className="bg-gradient-to-r from-red-400 to-red-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg"
              >
                Logout
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
