import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const DicasAlertas = ({ saldo }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md p-6 text-white"
    >
      <div className="flex items-start">
        <div className="p-3 rounded-full bg-white/20 mr-4">
          <Calendar size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Dica do mês</h3>
          <p className="opacity-90">
            {saldo < 0 
              ? "Suas despesas estão superando as receitas. Considere revisar seus gastos em categorias não essenciais."
              : "Continue mantendo o controle das suas finanças. Considere investir parte do seu saldo positivo."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DicasAlertas;