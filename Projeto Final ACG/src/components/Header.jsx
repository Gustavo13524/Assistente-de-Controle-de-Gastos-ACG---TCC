import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Settings, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm py-3 px-4 border-b sticky top-0 z-40"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="mr-2 text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </motion.div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ACG
          </h1>
        </div>
        
        <div className="hidden sm:flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
            <HelpCircle size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
            <Settings size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
            <Sun size={20} />
          </Button>
        </div>
         <div className="sm:hidden">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
            <Menu size={24} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;