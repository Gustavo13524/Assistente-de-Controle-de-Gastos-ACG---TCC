import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Brain,
  Menu
} from 'lucide-react';

import Dashboard from '@/components/Dashboard';
import Transacoes from '@/components/Transacoes';
import Relatorios from '@/components/Relatorios';
import NovaTransacao from '@/components/NovaTransacao';
import AssistenteIA from '@/components/AssistenteIA';
import Header from '@/components/Header';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTransacoes } from '@/hooks/useTransacoes'; 
import { exportarDadosPDF } from '@/lib/pdfUtils';

const TabItem = ({ value, icon, label }) => (
  <TabsTrigger value={value} className="data-[state=active]:bg-white flex-1 md:flex-none">
    {React.cloneElement(icon, { className: "mr-0 md:mr-2 h-4 w-4"})}
    <span className="hidden md:inline">{label}</span>
  </TabsTrigger>
);

function App() {
  const {
    transacoes,
    adicionarTransacao,
    excluirTransacao,
    editarTransacao
  } = useTransacoes();

  const [showNovaTransacao, setShowNovaTransacao] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleExportPDF = () => {
    exportarDadosPDF(transacoes);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
              ACG - Assistente de Controle de Gastos
            </h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={() => setShowNovaTransacao(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-1 sm:flex-none"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 flex-1 sm:flex-none"
              >
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          <Tabs defaultValue="dashboard" value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <div className="md:hidden mb-4">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Menu className="mr-2 h-4 w-4" />
                       Menu ({currentTab.charAt(0).toUpperCase() + currentTab.slice(1)})
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom">
                    <TabsList className="grid grid-cols-2 gap-2 p-2">
                      <TabsTrigger value="dashboard" onClick={() => setIsMobileMenuOpen(false)} className="data-[state=active]:bg-blue-100 flex items-center justify-center py-3">
                        <BarChart3 className="mr-2 h-5 w-5" /> Dashboard
                      </TabsTrigger>
                      <TabsTrigger value="transacoes" onClick={() => setIsMobileMenuOpen(false)} className="data-[state=active]:bg-blue-100 flex items-center justify-center py-3">
                        <TrendingUp className="mr-2 h-5 w-5" /> Transações
                      </TabsTrigger>
                      <TabsTrigger value="relatorios" onClick={() => setIsMobileMenuOpen(false)} className="data-[state=active]:bg-blue-100 flex items-center justify-center py-3">
                        <PieChart className="mr-2 h-5 w-5" /> Relatórios
                      </TabsTrigger>
                      <TabsTrigger value="assistente" onClick={() => setIsMobileMenuOpen(false)} className="data-[state=active]:bg-blue-100 flex items-center justify-center py-3">
                        <Brain className="mr-2 h-5 w-5" /> Assistente IA
                      </TabsTrigger>
                    </TabsList>
                  </SheetContent>
                </Sheet>
            </div>
            <TabsList className="hidden md:grid md:grid-cols-4 mb-8 bg-blue-100/50 p-1 rounded-lg">
              <TabItem value="dashboard" icon={<BarChart3 />} label="Dashboard" />
              <TabItem value="transacoes" icon={<TrendingUp />} label="Transações" />
              <TabItem value="relatorios" icon={<PieChart />} label="Relatórios" />
              <TabItem value="assistente" icon={<Brain />} label="Assistente IA" />
            </TabsList>

            <TabsContent value="dashboard" className="outline-none">
              <Dashboard transacoes={transacoes} />
            </TabsContent>
            
            <TabsContent value="transacoes" className="outline-none">
              <Transacoes 
                transacoes={transacoes} 
                onExcluir={excluirTransacao} 
                onEditar={editarTransacao} 
              />
            </TabsContent>
            
            <TabsContent value="relatorios" className="outline-none">
              <Relatorios transacoes={transacoes} />
            </TabsContent>
            
            <TabsContent value="assistente" className="outline-none">
              <AssistenteIA transacoes={transacoes} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {showNovaTransacao && (
        <NovaTransacao 
          onSalvar={(novaTransacao) => {
            adicionarTransacao(novaTransacao);
            setShowNovaTransacao(false);
          }} 
          onCancelar={() => setShowNovaTransacao(false)} 
        />
      )}
    </div>
  );
}

export default App;