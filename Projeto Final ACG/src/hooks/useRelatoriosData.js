import { useMemo } from 'react';

export const useRelatoriosData = (transacoes, periodoFiltro) => {
  const transacoesFiltradas = useMemo(() => {
    const hoje = new Date();
    let dataLimite;
    
    switch (periodoFiltro) {
      case 'ultimos3meses':
        dataLimite = new Date(hoje.getFullYear(), hoje.getMonth() - 3, hoje.getDate());
        break;
      case 'ultimos6meses':
        dataLimite = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());
        break;
      case 'ultimo1ano':
        dataLimite = new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate());
        break;
      case 'todos':
        return transacoes;
      default:
        dataLimite = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());
    }
    
    return transacoes.filter(t => new Date(t.data) >= dataLimite);
  }, [transacoes, periodoFiltro]);

  const dadosEvolucaoMensal = useMemo(() => {
    const meses = {};
    
    transacoesFiltradas.forEach(t => {
      const data = new Date(t.data);
      const mesAno = `${data.toLocaleString('pt-BR', { month: 'short' })}/${data.getFullYear().toString().substr(2, 2)}`;
      
      if (!meses[mesAno]) {
        meses[mesAno] = { receitas: 0, despesas: 0 };
      }
      
      if (t.tipo === 'receita') {
        meses[mesAno].receitas += Number(t.valor);
      } else {
        meses[mesAno].despesas += Number(t.valor);
      }
    });
    
    return Object.entries(meses)
      .map(([mes, valores]) => ({
        mes,
        receitas: valores.receitas,
        despesas: valores.despesas,
        saldo: valores.receitas - valores.despesas
      }))
      .sort((a, b) => {
        const [mesA, anoA] = a.mes.split('/');
        const [mesB, anoB] = b.mes.split('/');
        const mesesOrdem = { 'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4, 'mai': 5, 'jun': 6, 'jul': 7, 'ago': 8, 'set': 9, 'out': 10, 'nov': 11, 'dez': 12 };
        
        if (anoA !== anoB) return Number(anoA) - Number(anoB);
        return mesesOrdem[mesA.toLowerCase()] - mesesOrdem[mesB.toLowerCase()];
      });
  }, [transacoesFiltradas]);

  const dadosCategoriasDespesas = useMemo(() => {
    const categorias = {};
    
    transacoesFiltradas
      .filter(t => t.tipo === 'despesa')
      .forEach(t => {
        if (!categorias[t.categoria]) {
          categorias[t.categoria] = 0;
        }
        categorias[t.categoria] += Number(t.valor);
      });
    
    return Object.entries(categorias)
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor);
  }, [transacoesFiltradas]);

  const dadosCategoriasReceitas = useMemo(() => {
    const categorias = {};
    
    transacoesFiltradas
      .filter(t => t.tipo === 'receita')
      .forEach(t => {
        if (!categorias[t.categoria]) {
          categorias[t.categoria] = 0;
        }
        categorias[t.categoria] += Number(t.valor);
      });
    
    return Object.entries(categorias)
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor);
  }, [transacoesFiltradas]);

  const resumoFinanceiro = useMemo(() => {
    const receitas = transacoesFiltradas
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + Number(t.valor), 0);
      
    const despesas = transacoesFiltradas
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + Number(t.valor), 0);
      
    const saldo = receitas - despesas;
    const taxaEconomia = receitas > 0 ? ((receitas - despesas) / receitas) * 100 : 0;
    
    return {
      receitas,
      despesas,
      saldo,
      taxaEconomia
    };
  }, [transacoesFiltradas]);

  return {
    transacoesFiltradas,
    dadosEvolucaoMensal,
    dadosCategoriasDespesas,
    dadosCategoriasReceitas,
    resumoFinanceiro
  };
};