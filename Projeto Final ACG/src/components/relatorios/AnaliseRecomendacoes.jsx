import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const AnaliseRecomendacoes = ({ resumoFinanceiro, variants }) => {
  return (
    <motion.div 
      variants={variants}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md p-6 text-white"
    >
      <div className="flex items-start">
        <div className="p-3 rounded-full bg-white/20 mr-4">
          <Calendar size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Análise do Período</h3>
          <p className="opacity-90 mb-4">
            {resumoFinanceiro.saldo >= 0 
              ? `Você teve um saldo positivo de R$ ${resumoFinanceiro.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no período analisado, com uma taxa de economia de ${resumoFinanceiro.taxaEconomia.toFixed(1)}%.`
              : `Você teve um saldo negativo de R$ ${Math.abs(resumoFinanceiro.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no período analisado. Suas despesas superaram as receitas.`}
          </p>
          <h4 className="font-medium mb-2">Recomendações:</h4>
          <ul className="list-disc list-inside opacity-90 space-y-1">
            {resumoFinanceiro.saldo >= 0 ? (
              <>
                <li>Continue mantendo o controle das suas finanças</li>
                <li>Considere investir parte do seu saldo positivo</li>
                <li>Estabeleça metas de economia ainda maiores</li>
              </>
            ) : (
              <>
                <li>Revise seus gastos em categorias não essenciais</li>
                <li>Busque aumentar suas fontes de receita</li>
                <li>Estabeleça um orçamento mensal e siga-o rigorosamente</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AnaliseRecomendacoes;