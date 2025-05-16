import React from 'react';
import { motion } from 'framer-motion';
import ResumoCards from '@/components/dashboard/ResumoCards';
import GraficosDashboard from '@/components/dashboard/GraficosDashboard';
import DicasAlertas from '@/components/dashboard/DicasAlertas';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = ({ transacoes }) => {
  const { totais, dadosGraficoBarras, dadosGraficoPizza } = useDashboardData(transacoes);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <ResumoCards totais={totais} />
      <GraficosDashboard 
        dadosGraficoBarras={dadosGraficoBarras} 
        dadosGraficoPizza={dadosGraficoPizza} 
      />
      <DicasAlertas saldo={totais.saldo} />
    </motion.div>
  );
};

export default Dashboard;