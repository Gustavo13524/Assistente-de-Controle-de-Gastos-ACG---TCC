import React from 'react';
import { motion } from 'framer-motion';

const CardResumo = ({ title, value, colorClass }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className={`text-2xl font-bold mt-2 ${colorClass}`}>
      {typeof value === 'number' 
        ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        : `${value}%`}
    </p>
  </div>
);

const ResumoFinanceiroRelatorio = ({ resumoFinanceiro, variants }) => {
  return (
    <motion.div 
      variants={variants}
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <CardResumo 
        title="Total de Receitas" 
        value={resumoFinanceiro.receitas} 
        colorClass="text-green-600" 
      />
      <CardResumo 
        title="Total de Despesas" 
        value={resumoFinanceiro.despesas} 
        colorClass="text-red-600" 
      />
      <CardResumo 
        title="Saldo do Período" 
        value={resumoFinanceiro.saldo} 
        colorClass={resumoFinanceiro.saldo >= 0 ? 'text-green-600' : 'text-red-600'} 
      />
      <CardResumo 
        title="Taxa de Economia" 
        value={resumoFinanceiro.taxaEconomia.toFixed(1)} 
        colorClass={resumoFinanceiro.taxaEconomia >= 0 ? 'text-blue-600' : 'text-orange-600'} 
      />
    </motion.div>
  );
};

export default ResumoFinanceiroRelatorio;