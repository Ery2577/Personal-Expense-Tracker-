import { type ReactNode } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = "MoneyTrack" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <Navbar title={title} />

        {/* Page Content */}
        <main className="mt-16 p-6 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
