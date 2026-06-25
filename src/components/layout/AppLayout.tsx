import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { useGameStore } from '../../stores/useGameStore';
import { setPageAmbient, stopAmbient } from '../../systems/soundEngine';

interface Props {
  children: ReactNode;
  showTopBar?: boolean;
  showSidebar?: boolean;
  className?: string;
}

export default function AppLayout({
  children,
  showTopBar = true,
  showSidebar = false,
  className = '',
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPage = useGameStore((s) => s.currentPage);

  useEffect(() => {
    setPageAmbient(currentPage);
    return () => stopAmbient();
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F5EB' }}>
      {/* Top bar (except login) */}
      {showTopBar && currentPage !== 'login' && <TopBar />}

      <div className="flex-1 flex relative">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            collapsed={!sidebarOpen}
            onToggle={() => setSidebarOpen((v) => !v)}
          />
        )}

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 w-full ${className}`}
          style={{
            marginLeft: showSidebar && sidebarOpen ? 192 : 0,
          }}
        >
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Background blobs (ver4 pattern) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-80"
          style={{ background: '#E2F1E7', filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-80"
          style={{ background: '#FFEAEA', filter: 'blur(120px)' }}
        />
      </div>
    </div>
  );
}
