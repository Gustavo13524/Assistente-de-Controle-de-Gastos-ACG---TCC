import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const LOCAL_STORAGE_KEY = 'transacoesACG_Gastos';

const dadosIniciaisExemplo = [
  { id: 1, tipo: 'receita', categoria: 'Vendas', descricao: 'Venda de produtos', valor: 2500, data: '2025-05-10' },
  { id: 2, tipo: 'despesa', categoria: 'Fornecedores', descricao: 'Compra de materiais', valor: 1200, data: '2025-05-05' },
  { id: 3, tipo: 'despesa', categoria: 'Aluguel', descricao: 'Aluguel do espaço', valor: 800, data: '2025-05-01' },
  { id: 4, tipo: 'receita', categoria: 'Serviços', descricao: 'Consultoria', valor: 1500, data: '2025-05-15' }
];

export const useTransacoes = () => {
  const { toast } = useToast();
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (dadosSalvos) {
      try {
        setTransacoes(JSON.parse(dadosSalvos));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível recuperar seus dados salvos. Carregando dados de exemplo.",
          variant: "destructive",
        });
        setTransacoes(dadosIniciaisExemplo);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dadosIniciaisExemplo));
      }
    } else {
      setTransacoes(dadosIniciaisExemplo);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dadosIniciaisExemplo));
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transacoes));
  }, [transacoes]);

  const adicionarTransacao = (novaTransacao) => {
    const transacaoComId = {
      ...novaTransacao,
      id: Date.now() 
    };
    setTransacoes(prevTransacoes => [...prevTransacoes, transacaoComId]);
    toast({
      title: "Transação adicionada",
      description: "Sua transação foi registrada com sucesso.",
    });
  };

  const excluirTransacao = (id) => {
    setTransacoes(prevTransacoes => prevTransacoes.filter(t => t.id !== id));
    toast({
      title: "Transação excluída",
      description: "A transação foi removida com sucesso.",
    });
  };

  const editarTransacao = (transacaoEditada) => {
    setTransacoes(prevTransacoes => 
      prevTransacoes.map(t => (t.id === transacaoEditada.id ? transacaoEditada : t))
    );
    toast({
      title: "Transação atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  return {
    transacoes,
    adicionarTransacao,
    excluirTransacao,
    editarTransacao,
  };
};