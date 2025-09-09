import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'expense' | 'income' | 'category';
  title: string;
  subtitle: string;
  amount?: string;
  date?: string;
  category?: string;
  icon: string;
  route: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: any[];
  incomes: any[];
  categories: any[];
}

export default function SearchModal({ isOpen, onClose, expenses, incomes, categories }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const performSearch = (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowercaseTerm = term.toLowerCase();

    // Recherche dans les dépenses
    expenses.forEach(expense => {
      const category = categories.find(c => c.id === expense.categoryId);
      const matchesAmount = expense.amount.toString().includes(lowercaseTerm);
      const matchesCategory = category?.name.toLowerCase().includes(lowercaseTerm);
      const matchesDescription = expense.description?.toLowerCase().includes(lowercaseTerm);

      if (matchesAmount || matchesCategory || matchesDescription) {
        searchResults.push({
          id: expense.id,
          type: 'expense',
          title: `Expense - MGA ${parseFloat(expense.amount).toLocaleString()}`,
          subtitle: `${category?.name || 'Unknown'} - ${new Date(expense.date).toLocaleDateString()}`,
          amount: expense.amount,
          date: expense.date,
          category: category?.name,
          icon: '💸',
          route: '/dashboard'
        });
      }
    });

    // Recherche dans les revenus
    incomes.forEach(income => {
      const matchesAmount = income.amount.toString().includes(lowercaseTerm);
      const matchesDescription = income.description?.toLowerCase().includes(lowercaseTerm);

      if (matchesAmount || matchesDescription) {
        searchResults.push({
          id: income.id,
          type: 'income',
          title: `Income - MGA ${parseFloat(income.amount).toLocaleString()}`,
          subtitle: `${income.description || 'No description'} - ${new Date(income.date).toLocaleDateString()}`,
          amount: income.amount,
          date: income.date,
          icon: '💰',
          route: '/dashboard'
        });
      }
    });

    // Recherche dans les catégories
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(lowercaseTerm)) {
        const categoryExpenses = expenses.filter(e => e.categoryId === category.id);
        const totalAmount = categoryExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        
        searchResults.push({
          id: category.id,
          type: 'category',
          title: `Category - ${category.name}`,
          subtitle: `${categoryExpenses.length} transactions - MGA ${totalAmount.toLocaleString()} total`,
          icon: '📁',
          route: '/transaction'
        });
      }
    });

    // Trier par pertinence (exact match en premier)
    searchResults.sort((a, b) => {
      const aExact = a.title.toLowerCase().includes(lowercaseTerm) ? 1 : 0;
      const bExact = b.title.toLowerCase().includes(lowercaseTerm) ? 1 : 0;
      return bExact - aExact;
    });

    setResults(searchResults.slice(0, 8)); // Limiter à 8 résultats
    setSelectedIndex(0);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, expenses, incomes, categories]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.route);
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search transactions, categories, amounts..."
              className="w-full px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 && searchTerm.trim() !== '' && (
            <div className="p-6 text-center text-gray-500">
              <span className="text-2xl mb-2 block">🔍</span>
              <p>No results found for "{searchTerm}"</p>
              <p className="text-sm mt-1">Try searching for transaction amounts, categories, or descriptions</p>
            </div>
          )}

          {results.length === 0 && searchTerm.trim() === '' && (
            <div className="p-6 text-center text-gray-500">
              <span className="text-2xl mb-2 block">💡</span>
              <p>Start typing to search...</p>
              <div className="text-sm mt-2 space-y-1">
                <p>• Search by amount: "5000", "1000"</p>
                <p>• Search by category: "Food", "Transport"</p>
                <p>• Search by description: "Lunch", "Gas"</p>
              </div>
            </div>
          )}

          {results.map((result, index) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result)}
              className={`p-4 cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-green-50 border-l-4 border-green-500' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{result.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{result.title}</h3>
                  <p className="text-sm text-gray-600">{result.subtitle}</p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {result.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            {results.length > 0 && (
              <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
