import React from 'react';
import { 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const GraficoEvolucaoMensal = ({ dadosEvolucaoMensal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolução Mensal</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dadosEvolucaoMensal}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, undefined]} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="receitas" 
              name="Receitas" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="despesas" 
              name="Despesas" 
              stroke="#ef4444" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="saldo" 
              name="Saldo" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficoEvolucaoMensal;