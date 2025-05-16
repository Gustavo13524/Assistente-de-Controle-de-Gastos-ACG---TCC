import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertCircle
} from 'lucide-react';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const ResumoCard = ({ title, value, icon, trend, trendText, trendColor, bgColor, textColor, isSaldo = false, saldo }) => (
  <motion.div 
    variants={itemVariants}
    className="bg-white rounded-xl shadow-md p-4 md:p-6 card-hover"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
        <h3 className={`text-xl sm:text-2xl font-bold mt-1 ${isSaldo ? (saldo >= 0 ? 'text-green-600' : 'text-red-600') : textColor}`}>
          R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h3>
      </div>
      <div className={`p-2 sm:p-3 rounded-full ${bgColor} ${textColor}`}>
        {React.cloneElement(icon, {size: 18})}
      </div>
    </div>
    <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
      {trend && <span className={`${trendColor} font-medium flex items-center`}>{trend}</span>}
      {trendText && <span className="text-gray-500 ml-1 hidden sm:inline">{trendText}</span>}
      {isSaldo && (
        saldo >= 0 ? (
          <>
            <span className="text-gray-500">Seu saldo está </span>
            <span className="text-green-500 font-medium ml-1">positivo</span>
          </>
        ) : (
          <>
            <AlertCircle className="text-orange-500 mr-1" size={14} />
            <span className="text-orange-500 font-medium">Atenção!</span>
            <span className="text-gray-500 ml-1 hidden sm:inline">Saldo negativo</span>
          </>
        )
      )}
    </div>
  </motion.div>
);

const ResumoCards = ({ totais }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ResumoCard
        title="Receitas"
        value={totais.receitas}
        icon={<TrendingUp />}
        trend={<><ArrowUpRight className="text-green-500 mr-1" size={14} />+12%</>}
        trendText="mês anterior"
        trendColor="text-green-500"
        bgColor="bg-green-100"
        textColor="text-green-600"
      />
      <ResumoCard
        title="Despesas"
        value={totais.despesas}
        icon={<TrendingDown />}
        trend={<><ArrowDownRight className="text-red-500 mr-1" size={14} />+8%</>}
        trendText="mês anterior"
        trendColor="text-red-500"
        bgColor="bg-red-100"
        textColor="text-red-600"
      />
      <ResumoCard
        title="Saldo"
        value={totais.saldo}
        icon={<DollarSign />}
        isSaldo={true}
        saldo={totais.saldo}
        bgColor={totais.saldo >= 0 ? 'bg-blue-100' : 'bg-orange-100'}
        textColor={totais.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}
      />
    </div>
  );
};

export default ResumoCards;