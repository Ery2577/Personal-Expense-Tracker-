import { type ReactNode, useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { expenseService, incomeService, categoryService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = "MoneyTrack" }: LayoutProps) {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // Raccourci clavier global pour la recherche (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const loadSearchData = async () => {
      if (!token) return;
      
      try {
        const [expensesResponse, incomesResponse, categoriesResponse] = await Promise.all([
          expenseService.getExpenses(token),
          incomeService.getIncomes(token),
          categoryService.getCategories(token)
        ]);
        
        if (expensesResponse.success) setExpenses(expensesResponse.data);
        if (incomesResponse.success) setIncomes(incomesResponse.data);
        if (categoriesResponse.success) setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };

    loadSearchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <Navbar 
          title={title} 
          expenses={expenses}
          incomes={incomes}
          categories={categories}
          onSearchOpen={() => setShowSearch(true)}
          isSearchOpen={showSearch}
          onSearchClose={() => setShowSearch(false)}
        />

        {/* Page Content */}
        <main className="mt-16 p-6 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
