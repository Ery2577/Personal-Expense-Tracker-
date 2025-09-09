import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { categoryService, expenseService, incomeService, type Category, type Expense, type Income, type CreateExpenseData, type CreateIncomeData } from '../../services/api';
import { useToast } from '../../components/Toast/useToast';
import Toast from '../../components/Toast/Toast';
import DepositModal from '../../components/Modal/DepositModal';
import RemovalModal from '../../components/Modal/RemovalModal';
import EditTransactionModal from '../../components/Modal/EditTransactionModal';
import DeleteConfirmationModal from '../../components/Modal/DeleteConfirmationModal';
import { formatDateShort } from '../../utils/formatDate';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Wallet() {
  const { token } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  // States
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states pour l'édition et suppression
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<{
    id: string;
    amount: number;
    description: string;
    isIncome: boolean;
    date: string;
    categoryId?: string;
    categoryName?: string;
    paymentMethod?: string;
  } | null>(null);

  // Charger les données
  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      const [categoriesRes, expensesRes, incomesRes] = await Promise.all([
        categoryService.getCategories(token!),
        expenseService.getExpenses(token!),
        incomeService.getIncomes(token!)
      ]);
      
      setCategories(categoriesRes.data);
      setExpenses(expensesRes.data);
      setIncomes(incomesRes.data);
    } catch (error: any) {
      console.error('Error loading data:', error);
    }
  };

  // Fonction pour récupérer une transaction complète
  const getFullTransaction = (transactionId: string, isIncome: boolean) => {
    const id = transactionId.replace(isIncome ? 'income-' : 'expense-', '');
    
    if (isIncome) {
      const income = incomes.find(i => i.id.toString() === id);
      return income ? {
        id: transactionId,
        amount: income.amount,
        description: income.source || income.description || 'Income',
        isIncome: true,
        date: income.date,
        categoryId: undefined,
        categoryName: undefined,
        paymentMethod: undefined
      } : null;
    } else {
      const expense = expenses.find(e => e.id.toString() === id);
      return expense ? {
        id: transactionId,
        amount: expense.amount,
        description: expense.description || 'Expense',
        isIncome: false,
        date: expense.date,
        categoryId: expense.category?.id,
        categoryName: expense.category?.name,
        paymentMethod: expense.paymentMethod
      } : null;
    }
  };

  // Fonction pour ouvrir le modal d'édition
  const openEditModal = (transactionId: string, isIncome: boolean) => {
    const fullTransaction = getFullTransaction(transactionId, isIncome);
    if (fullTransaction) {
      setSelectedTransaction(fullTransaction);
      setShowEditModal(true);
    }
  };

  // Fonction pour sauvegarder les modifications
  const handleSaveEdit = async (data: {
    amount: number;
    description: string;
    categoryId?: string;
    paymentMethod?: string;
    date: string;
  }) => {
    if (!selectedTransaction) return;
    
    console.log('💾 Saving transaction with data:', data);
    
    try {
      setIsLoading(true);
      const id = selectedTransaction.id.replace(selectedTransaction.isIncome ? 'income-' : 'expense-', '');
      
      if (selectedTransaction.isIncome) {
        const incomeData = {
          amount: data.amount,
          source: data.description,
          date: data.date
        };
        console.log('🔄 Updating income with:', incomeData);
        await incomeService.updateIncome(token!, id, incomeData);
      } else {
        const expenseData = {
          amount: data.amount,
          description: data.description,
          categoryId: data.categoryId || selectedTransaction.categoryId || categories[0]?.id || '1',
          paymentMethod: data.paymentMethod || selectedTransaction.paymentMethod || 'CASH',
          date: data.date,
          type: 'ONE_TIME' // ✅ Obligatoire pour que la date soit mise à jour !
        };
        console.log('🔄 Updating expense with:', expenseData);
        await expenseService.updateExpense(token!, id, expenseData);
      }
      
      await loadData(); // Recharger les données
      showSuccess('Transaction updated successfully!');
      setShowEditModal(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to update transaction');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ouvrir le modal de suppression
  const openDeleteModal = (transactionId: string, isIncome: boolean) => {
    const fullTransaction = getFullTransaction(transactionId, isIncome);
    if (fullTransaction) {
      setSelectedTransaction(fullTransaction);
      setShowDeleteModal(true);
    }
  };

  // Fonction pour confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!selectedTransaction) return;
    
    try {
      setIsLoading(true);
      if (selectedTransaction.isIncome) {
        await incomeService.deleteIncome(token!, selectedTransaction.id.replace('income-', ''));
      } else {
        await expenseService.deleteExpense(token!, selectedTransaction.id.replace('expense-', ''));
      }
      
      await loadData(); // Recharger les données
      showSuccess('Transaction deleted successfully!');
      setShowDeleteModal(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to delete transaction');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour filtrer les transactions du mois actuel
  const getCurrentMonthTransactions = (transactions: any[]) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date || transaction.createdAt);
      return transactionDate.getFullYear() === currentYear && 
             transactionDate.getMonth() === currentMonth;
    });
  };

  // Calculer les totaux (tous les temps pour la balance)
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const principalBalance = totalIncome - totalExpense;

  // Filtrer les transactions pour le mois actuel (pour les tableaux)
  const currentMonthExpenses = getCurrentMonthTransactions(expenses);
  const currentMonthIncomes = getCurrentMonthTransactions(incomes);

  // Gérer l'ajout d'income
  const handleAddIncome = async (data: { amount: number; source: string; description: string; date: string }) => {
    setIsLoading(true);
    try {
      const incomeData: CreateIncomeData = {
        amount: data.amount,
        source: data.source,
        description: data.description || undefined,
        date: data.date
      };

      await incomeService.createIncome(incomeData, token!);
      showSuccess('Income added successfully!');
      setShowDepositModal(false);
      loadData(); // Recharger les données
    } catch (error: any) {
      showError(error.message || 'Failed to add income');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer le balance actuel
  const currentBalance = incomes.reduce((sum, income) => sum + income.amount, 0) - expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Gérer l'ajout d'expense avec validation du balance
  const handleAddExpense = async (data: { amount: number; categoryId: string; description: string; paymentMethod: string; date: string }) => {
    // Validation : vérifier que le retrait ne rend pas le balance négatif
    if (currentBalance - data.amount < 0) {
      showError(`Insufficient funds! Current balance: MGA ${currentBalance.toLocaleString()}. Cannot withdraw MGA ${data.amount.toLocaleString()}.`);
      return;
    }

    setIsLoading(true);
    try {
      const expenseData: CreateExpenseData = {
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description || undefined,
        paymentMethod: data.paymentMethod,
        date: data.date
      };

      await expenseService.createExpense(expenseData, token!);
      showSuccess('Withdrawal successful!');
      setShowRemovalModal(false);
      loadData(); // Recharger les données
    } catch (error: any) {
      showError(error.message || 'Failed to process withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de fallback pour créer un tableau manuel avec pagination
  const createSimpleTable = (doc: jsPDF, headers: string[], data: string[][], startY: number) => {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const colWidth = (pageWidth - 40) / headers.length;
    let currentY = startY;
    const rowHeight = 8;
    const headerHeight = 10;
    
    const drawHeaders = (y: number) => {
      // En-têtes
      doc.setFillColor(34, 197, 94);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.rect(20, y, pageWidth - 40, headerHeight, 'F');
      
      headers.forEach((header, index) => {
        const headerText = String(header || '');
        if (headerText.length > 0) {
          doc.text(headerText, 22 + index * colWidth, y + 7);
        }
      });
      
      return y + headerHeight;
    };

    // Dessiner les en-têtes initiaux
    currentY = drawHeaders(currentY);

    // Données avec gestion de pagination
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    
    data.forEach((row, rowIndex) => {
      // Vérifier s'il faut une nouvelle page (laisser seulement 80px pour les totaux)
      if (currentY + rowHeight > pageHeight - 80) {
        doc.addPage();
        currentY = 40; // Marge du haut
        currentY = drawHeaders(currentY);
      }
      
      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(20, currentY, pageWidth - 40, rowHeight, 'F');
      }
      
      row.forEach((cell, cellIndex) => {
        // S'assurer que cell est une chaîne valide
        const cellText = String(cell || '');
        if (cellText.length > 0) {
          doc.text(cellText, 22 + cellIndex * colWidth, currentY + 6);
        }
      });
      
      currentY += rowHeight;
    });

    return currentY;
  };

  // Fonctions de génération PDF
  const generatePDF = (activities: any[], period: string, periodName: string) => {
    // Validation des données d'entrée
    if (!activities || !Array.isArray(activities)) {
      console.error('Invalid activities data for PDF generation');
      return;
    }

    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('MoneyTrack - Financial Activities', 20, 30);
    
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text(`${period} Report (${periodName})`, 20, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);
    
    // Vérifier s'il y a des activités
    if (activities.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('No activities found for this period.', 20, 90);
      doc.save(`${period.toLowerCase()}-activities-${periodName}.pdf`);
      return;
    }
    
    // Debug : afficher les activités pour comprendre leur structure
    console.log('Activities for PDF:', activities);
    console.log('Number of activities received:', activities.length);
    
    // Préparer les données pour le tableau (filtrer les données vides)
    const validActivities = activities.filter(activity => 
      activity && 
      activity.amount && 
      parseFloat(activity.amount) !== 0 &&
      activity.action // S'assurer qu'il y a un type d'action
    );
    
    console.log('Valid activities after filtering:', validActivities.length);
    
    const tableData = validActivities.map(activity => {
        try {
          // Essayer différentes propriétés pour la description
          let description = 'No description';
          if (activity.description) {
            description = activity.description;
          } else if (activity.category?.name) {
            description = activity.category.name;
          } else if (activity.paymentMethod) {
            description = `Payment: ${activity.paymentMethod}`;
          }
          
          // Format de date français (jj/mm/aaaa)
          let formattedDate = '';
          if (activity.date) {
            const date = new Date(activity.date);
            formattedDate = date.toLocaleDateString('fr-FR');
          } else if (activity.createdAt) {
            const date = new Date(activity.createdAt);
            formattedDate = date.toLocaleDateString('fr-FR');
          }
          
          return [
            formattedDate,
            String(activity.action || 'Transaction'),
            description,
            activity.action === 'Income' ? 
              `+MGA ${(parseFloat(activity.amount) || 0).toLocaleString()}` : 
              `-MGA ${(parseFloat(activity.amount) || 0).toLocaleString()}`
          ];
        } catch (error) {
          console.warn('Error processing activity:', activity, error);
          return null; // Retourner null pour filtrer plus tard
        }
      })
      .filter(row => row !== null); // Supprimer les lignes nulles
    
    console.log('Final table data:', tableData);
    console.log('Table rows count:', tableData.length);
    
    // Calculer les totaux
    const totalIncome = activities.filter(a => a.action === 'Income').reduce((sum, a) => sum + (parseFloat(String(a.amount)) || 0), 0);
    const totalExpense = activities.filter(a => a.action === 'Expense').reduce((sum, a) => sum + (parseFloat(String(a.amount)) || 0), 0);
    const netBalance = totalIncome - totalExpense;
    
    // Générer le tableau - avec fallback si autoTable échoue
    let finalY = 70;
    
    // ABANDON D'AUTOTABLE - Créer notre propre tableau MANUELLEMENT
    console.log(`Generating PDF with ${tableData.length} transactions - MANUAL METHOD`);
    
    let currentY = 70;
    const pdfPageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width - (margin * 2);
    
    // Colonnes du tableau
    const colPositions = [margin, margin + 30, margin + 55, margin + 95];
    
    // Fonction pour dessiner l'en-tête
    const drawHeader = (y: number) => {
      // Fond vert pour l'en-tête
      doc.setFillColor(34, 197, 94);
      doc.rect(margin, y, pageWidth, 12, 'F');
      
      // Texte blanc pour l'en-tête
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('Date', colPositions[0] + 2, y + 8);
      doc.text('Type', colPositions[1] + 2, y + 8);
      doc.text('Description', colPositions[2] + 2, y + 8);
      doc.text('Amount', colPositions[3] + 2, y + 8);
      
      return y + 12;
    };
    
    // Dessiner l'en-tête initial
    currentY = drawHeader(currentY);
    
    // Dessiner chaque ligne
    tableData.forEach((row, index) => {
      // Vérifier si on a besoin d'une nouvelle page
      if (currentY + 10 > pdfPageHeight - 40) {
        doc.addPage();
        currentY = drawHeader(40); // Redessiner l'en-tête sur la nouvelle page
      }
      
      // Alternance de couleur de fond
      if (index % 2 === 1) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, currentY, pageWidth, 10, 'F');
      }
      
      // TEXTE NOIR GARANTI
      doc.setTextColor(0, 0, 0); // NOIR PUR - PAS DE GRIS
      doc.setFontSize(9);
      
      // Dessiner chaque cellule
      doc.text(String(row[0]), colPositions[0] + 2, currentY + 7); // Date
      doc.text(String(row[1]), colPositions[1] + 2, currentY + 7); // Type
      doc.text(String(row[2]).substring(0, 20), colPositions[2] + 2, currentY + 7); // Description (tronquée)
      doc.text(String(row[3]), colPositions[3] + 2, currentY + 7); // Amount
      
      currentY += 10;
    });
    
    finalY = currentY + 10;
    
    // Vérifier s'il faut une nouvelle page pour les totaux (utilisation optimale de l'espace A4)
    const spaceNeeded = 70; // Espace nécessaire pour les totaux
    
    if (finalY + spaceNeeded > pdfPageHeight - 25) { // Utiliser plus d'espace (marge de 25px seulement)
      // Pas assez de place, nouvelle page
      doc.addPage();
      finalY = 40;
    } else {
      // Assez de place, continuer sur la même page
      finalY += 10; // Réduire l'espacement
    }
    
    // Ajouter les totaux avec un style amélioré mais plus compact
    doc.setFillColor(240, 248, 255);
    doc.rect(20, finalY, doc.internal.pageSize.width - 40, 65, 'F');
    
    doc.setFontSize(13);
    doc.setTextColor(34, 197, 94);
    doc.text('Financial Summary', 25, finalY + 12);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`${tableData.length} transaction${tableData.length !== 1 ? 's' : ''} included`, 25, finalY + 22);
    
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total Income: MGA ${totalIncome.toLocaleString()}`, 25, finalY + 32);
    doc.text(`Total Expenses: MGA ${totalExpense.toLocaleString()}`, 25, finalY + 42);
    
    // Net Balance avec couleur conditionnelle
    doc.setFontSize(11);
    doc.setTextColor(netBalance >= 0 ? 34 : 239, netBalance >= 0 ? 197 : 68, netBalance >= 0 ? 94 : 68);
    const balanceText = netBalance >= 0 ? `Net Balance: +MGA ${netBalance.toLocaleString()}` : `Net Balance: -MGA ${Math.abs(netBalance).toLocaleString()}`;
    doc.text(balanceText, 25, finalY + 52);
    
    // Télécharger le PDF
    doc.save(`MoneyTrack_${period}_${periodName.replace(/\s+/g, '_')}.pdf`);
  };

  const downloadMonthActivities = () => {
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Utiliser TOUTES les transactions du mois pour le PDF (pas seulement currentMonthExpenses)
    // Au cas où currentMonthExpenses serait limité à 10 par exemple
    const allMonthExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    
    const allMonthIncomes = incomes.filter(i => {
      const date = new Date(i.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    
    console.log('All month expenses for PDF:', allMonthExpenses.length);
    console.log('All month incomes for PDF:', allMonthIncomes.length);
    
    // Enrichir les données avec les informations de catégorie
    const enrichedExpenses = allMonthExpenses.map(e => ({
      ...e, 
      action: 'Expense',
      description: e.description || e.category?.name || 'Expense transaction'
    }));
    
    const enrichedIncomes = allMonthIncomes.map(i => ({
      ...i, 
      action: 'Income',
      description: i.description || 'Income transaction'
    }));
    
    const monthActivities = [...enrichedExpenses, ...enrichedIncomes];
    console.log('Total month activities for PDF:', monthActivities.length);
    generatePDF(monthActivities, 'Monthly', monthName);
  };

  const downloadWeekActivities = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    // Enrichir les dépenses avec les informations de catégorie
    const weekExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date >= weekStart && date <= weekEnd;
    }).map(e => {
      return {
        ...e, 
        action: 'Expense',
        description: e.description || e.category?.name || 'Expense transaction'
      };
    });
    
    // Enrichir les revenus
    const weekIncomes = incomes.filter(i => {
      const date = new Date(i.date);
      return date >= weekStart && date <= weekEnd;
    }).map(i => ({
      ...i, 
      action: 'Income',
      description: i.description || 'Income transaction'
    }));
    
    const weekActivities = [...weekExpenses, ...weekIncomes];
    
    const weekName = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    generatePDF(weekActivities, 'Weekly', weekName);
  };

  const downloadDayActivities = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Enrichir les dépenses du jour
    const dayExpenses = expenses.filter(e => e.date.startsWith(today)).map(e => ({
      ...e, 
      action: 'Expense',
      description: e.description || e.category?.name || 'Expense transaction'
    }));
    
    // Enrichir les revenus du jour
    const dayIncomes = incomes.filter(i => i.date.startsWith(today)).map(i => ({
      ...i, 
      action: 'Income',
      description: i.description || 'Income transaction'
    }));
    
    const dayActivities = [...dayExpenses, ...dayIncomes];
    generatePDF(dayActivities, 'Daily', new Date().toLocaleDateString());
  };

  // Combiner et trier les activités du mois actuel
    const allActivities = [
      ...currentMonthExpenses.map(expense => ({
        id: `expense-${expense.id}`,
        date: expense.date,
        action: 'Expense',
        description: `${expense.category?.name || 'Uncategorized'} • ${expense.paymentMethod ? expense.paymentMethod.replace('_', ' ') : 'N/A'}`,
        amount: expense.amount,
        isIncome: false
      })),
      ...currentMonthIncomes.map(income => ({
        id: `income-${income.id}`,
        date: income.date,
        action: 'Income',
        description: income.source || 'No source specified',
        amount: income.amount,
        isIncome: true
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Grouper les transactions par date pour la transaction list (mois actuel uniquement)
  const getTransactionsByDate = () => {
    const grouped: { [key: string]: { deposits: number; withdrawals: number; incomeCount: number; expenseCount: number } } = {};
    
    currentMonthIncomes.forEach(income => {
      const dateKey = new Date(income.date).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!grouped[dateKey]) grouped[dateKey] = { deposits: 0, withdrawals: 0, incomeCount: 0, expenseCount: 0 };
      grouped[dateKey].deposits += income.amount;
      grouped[dateKey].incomeCount += 1;
    });

    currentMonthExpenses.forEach(expense => {
      const dateKey = new Date(expense.date || expense.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!grouped[dateKey]) grouped[dateKey] = { deposits: 0, withdrawals: 0, incomeCount: 0, expenseCount: 0 };
      grouped[dateKey].withdrawals += expense.amount;
      grouped[dateKey].expenseCount += 1;
    });

    return Object.entries(grouped)
      .map(([dateKey, amounts]) => ({ 
        date: formatDateShort(dateKey), 
        dateKey, 
        ...amounts 
      }))
      .sort((a, b) => new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime());
  };

  const transactionsByDate = getTransactionsByDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] p-8 space-y-8 rounded-3xl">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide"> My Wallet</h1>

      {/* Balance */}
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full relative ">
        <h2 className="font-bold text-gray-700 text-xl mb-2">Principal Balance</h2>
        <p className={`text-4xl font-extrabold ${principalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          MGA {principalBalance.toLocaleString()}
        </p>

        <div className="absolute bottom-6 right-8 flex flex-col text-sm text-right space-y-1">
          <span className="text-green-600 font-semibold">+ MGA {totalIncome.toLocaleString()}</span>
          <span className="text-red-600 font-semibold">- MGA {totalExpense.toLocaleString()}</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* Activities*/}
        <div className="bg-white rounded-3xl shadow-xl p-6 h-144">
          <h2 className="font-bold text-gray-700 text-xl mb-4">Activities - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="overflow-y-auto h-120">
            <table className="w-full text-sm text-gray-600">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allActivities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No activities this month
                    </td>
                  </tr>
                ) : (
                  allActivities.map((activity) => (
                    <tr key={activity.id} className="border-b">
                      <td className="py-3">{formatDateShort(activity.date)}</td>
                      <td className={`font-medium ${activity.isIncome ? 'text-green-700' : 'text-red-700'}`}>
                        {activity.action}
                      </td>
                      <td className="py-2 max-w-xs truncate" title={activity.description}>
                        {activity.description}
                      </td>
                      <td className={`font-semibold ${activity.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {activity.isIncome ? '+' : '-'} MGA {activity.amount.toLocaleString()}
                      </td>
                      <td className="py-2">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => openEditModal(activity.id, activity.isIncome)}
                            className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 cursor-pointer"
                            disabled={isLoading}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => openDeleteModal(activity.id, activity.isIncome)}
                            className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50 cursor-pointer"
                            disabled={isLoading}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Reports */}
        <div className="flex flex-col space-y-4 items-center justify-center ">
          <button
            onClick={downloadMonthActivities}
            className="flex flex-col items-center justify-center bg-white text-gray-900 font-semibold shadow-md rounded-2xl h-24 w-64 max-w-full transition duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer hover:bg-gray-50"
          >
            <span className="text-base">Monthly Activities</span>
            <span className="text-xs opacity-80">Download PDF</span>
          </button>
          <button
            onClick={downloadWeekActivities}
            className="flex flex-col items-center justify-center bg-white text-gray-900 font-semibold shadow-md rounded-2xl h-24 w-64 max-w-full transition duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer hover:bg-gray-50"
          >
            <span className="text-base">Weekly Activities</span>
            <span className="text-xs opacity-80">Download PDF</span>
          </button>
          <button
            onClick={downloadDayActivities}
            className="flex flex-col items-center justify-center bg-white text-gray-900 font-semibold shadow-md rounded-2xl h-24 w-64 max-w-full transition duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer hover:bg-gray-50"
          >
            <span className="text-base">Today's Activities</span>
            <span className="text-xs opacity-80">Download PDF</span>
          </button>
        </div>
      </div>

      {/* Bottom Part */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* Buttons */}
        <div className="flex flex-col gap-4 justify-center items-center font-sans">
          <button 
            onClick={() => setShowDepositModal(true)}
            disabled={isLoading}
            className="flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold text-lg shadow-lg rounded-xl h-24 w-64 hover:scale-105 transform transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deposit
            <span className="text-sm text-white/80 mt-1">Click to deposit</span>
          </button>
          <button 
            onClick={() => setShowRemovalModal(true)}
            disabled={isLoading}
            className="flex flex-col items-center justify-center bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold text-lg shadow-lg rounded-xl h-24 w-64 hover:scale-105 transform transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Removal
            <span className="text-sm text-white/80 mt-1">Click to withdraw</span>
          </button>
        </div>


        {/* Transaction list  */}
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl mx-auto h-160 hover:shadow-2xl transition-all duration-300">
          <h2 className="font-bold text-gray-700 text-2xl mb-4">Transaction List - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="overflow-y-auto h-130">
            <table className="w-full text-sm text-gray-600 table-auto">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Count</th>
                  <th className="pb-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactionsByDate.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No transactions this month
                    </td>
                  </tr>
                ) : (
                  transactionsByDate.map((transaction) => (
                    <>
                      {transaction.withdrawals > 0 && (
                        <tr key={`${transaction.date}-withdrawal`} className="border-b">
                          <td className="py-4">{transaction.date}</td>
                          <td className="font-medium text-red-700">Withdrawal</td>
                          <td className="text-gray-600">{transaction.expenseCount} expenses</td>
                          <td className="text-red-600 font-semibold">- MGA {transaction.withdrawals.toLocaleString()}</td>
                        </tr>
                      )}
                      {transaction.deposits > 0 && (
                        <tr key={`${transaction.date}-deposit`} className="border-b">
                          <td className="py-4">{transaction.date}</td>
                          <td className="font-medium text-green-700">Deposit</td>
                          <td className="text-gray-600">{transaction.incomeCount} incomes</td>
                          <td className="text-green-600 font-semibold">+ MGA {transaction.deposits.toLocaleString()}</td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onConfirm={handleAddIncome}
      />

      {/* Removal Modal */}
      <RemovalModal
        isOpen={showRemovalModal}
        onClose={() => setShowRemovalModal(false)}
        onConfirm={handleAddExpense}
        categories={categories}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTransaction(null);
        }}
        onSave={handleSaveEdit}
        transaction={selectedTransaction}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTransaction(null);
        }}
        onConfirm={handleConfirmDelete}
        transaction={selectedTransaction}
        isLoading={isLoading}
      />

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