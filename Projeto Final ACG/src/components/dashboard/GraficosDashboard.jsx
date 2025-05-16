import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const CORES_PIZZA = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const GraficosDashboard = ({ dadosGraficoBarras, dadosGraficoPizza }) => {
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, nome }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent * 100 < 5) return null; // Não mostrar labels pequenos para não poluir

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10}>
        {`${nome} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-md p-4 md:p-6"
      >
        <h3 className="text-md md:text-lg font-semibold text-gray-800 mb-4">Receitas vs Despesas</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGraficoBarras}
              margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toFixed(2)}`, undefined]} 
                labelStyle={{fontSize: "12px"}}
                itemStyle={{fontSize: "12px"}}
              />
              <Legend wrapperStyle={{fontSize: "12px"}} />
              <Bar dataKey="receitas" name="Receitas" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={15} />
              <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-md p-4 md:p-6"
      >
        <h3 className="text-md md:text-lg font-semibold text-gray-800 mb-4">Despesas por Categoria</h3>
        {dadosGraficoPizza.length > 0 ? (
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosGraficoPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={window.innerWidth < 768 ? 60 : 80} /* Raio menor para mobile */
                  fill="#8884d8"
                  dataKey="valor"
                  nameKey="nome"
                >
                  {dadosGraficoPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value) => [`R$ ${value.toFixed(2)}`, undefined]} 
                    labelStyle={{fontSize: "12px"}}
                    itemStyle={{fontSize: "12px"}}
                />
                <Legend wrapperStyle={{fontSize: "12px", overflow: "auto", maxHeight: "50px"}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 md:h-80 flex items-center justify-center text-gray-500 text-sm">
            Nenhuma despesa registrada
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GraficosDashboard;