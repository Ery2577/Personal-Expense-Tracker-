import "./App.css"
import AppRoutes from "../src/routes/index.tsx"; 
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
