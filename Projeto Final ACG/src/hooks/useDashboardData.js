import { useMemo } from 'react';

export const useDashboardData = (transacoes) => {
  const totais = useMemo(() => {
    const receitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + Number(t.valor), 0);
      
    const despesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + Number(t.valor), 0);
      
    return {
      receitas,
      despesas,
      saldo: receitas - despesas
    };
  }, [transacoes]);

  const dadosGraficoBarras = useMemo(() => {
    const hoje = new Date();
    const ultimosMeses = [];
    
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mes = data.toLocaleString('pt-BR', { month: 'short' });
      const ano = data.getFullYear();
      const mesAno = `${mes}/${ano.toString().substr(2, 2)}`;
      
      ultimosMeses.push({
        mes: mesAno,
        receitas: 0,
        despesas: 0
      });
    }
    
    transacoes.forEach(t => {
      const data = new Date(t.data);
      const mes = data.toLocaleString('pt-BR', { month: 'short' });
      const ano = data.getFullYear();
      const mesAno = `${mes}/${ano.toString().substr(2, 2)}`;
      
      const index = ultimosMeses.findIndex(m => m.mes === mesAno);
      if (index !== -1) {
        if (t.tipo === 'receita') {
          ultimosMeses[index].receitas += Number(t.valor);
        } else {
          ultimosMeses[index].despesas += Number(t.valor);
        }
      }
    });
    
    return ultimosMeses;
  }, [transacoes]);

  const dadosGraficoPizza = useMemo(() => {
    const categorias = {};
    
    transacoes
      .filter(t => t.tipo === 'despesa')
      .forEach(t => {
        if (!categorias[t.categoria]) {
          categorias[t.categoria] = 0;
        }
        categorias[t.categoria] += Number(t.valor);
      });
    
    return Object.entries(categorias).map(([nome, valor]) => ({
      nome,
      valor
    }));
  }, [transacoes]);

  return { totais, dadosGraficoBarras, dadosGraficoPizza };
};