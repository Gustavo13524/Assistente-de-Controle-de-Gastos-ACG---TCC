import React from 'react';
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

const CORES_GRAFICO = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4'];

const GraficosCategorias = ({ dadosCategorias, tipo }) => {
  const titulo = tipo === 'despesa' ? 'Despesas por Categoria' : 'Receitas por Categoria';
  const corBarra = tipo === 'despesa' ? '#ef4444' : '#3b82f6';

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>
      {dadosCategorias.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosCategorias}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                  nameKey="nome"
                  label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dadosCategorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, undefined]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosCategorias}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nome" type="category" width={100} />
                <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, undefined]} />
                <Bar dataKey="valor" name="Valor" fill={corBarra} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-500">
          Nenhuma {tipo} registrada no período selecionado
        </div>
      )}
    </div>
  );
};

export default GraficosCategorias;