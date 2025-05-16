
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Trash2, 
  Edit,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Transacoes = ({ transacoes, onExcluir, onEditar }) => {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('data-desc');
  const [transacaoParaEditar, setTransacaoParaEditar] = useState(null);
  const [transacaoEditada, setTransacaoEditada] = useState({});
  
  // Filtrar e ordenar transações
  const transacoesFiltradas = transacoes
    .filter(t => {
      // Filtro por tipo
      if (filtroTipo !== 'todos' && t.tipo !== filtroTipo) return false;
      
      // Filtro por busca
      const termoBusca = busca.toLowerCase();
      return (
        t.descricao.toLowerCase().includes(termoBusca) ||
        t.categoria.toLowerCase().includes(termoBusca) ||
        t.valor.toString().includes(termoBusca)
      );
    })
    .sort((a, b) => {
      // Ordenação
      switch (ordenacao) {
        case 'data-asc':
          return new Date(a.data) - new Date(b.data);
        case 'data-desc':
          return new Date(b.data) - new Date(a.data);
        case 'valor-asc':
          return a.valor - b.valor;
        case 'valor-desc':
          return b.valor - a.valor;
        default:
          return new Date(b.data) - new Date(a.data);
      }
    });

  const handleEditarClick = (transacao) => {
    setTransacaoParaEditar(transacao);
    setTransacaoEditada({ ...transacao });
  };

  const handleSalvarEdicao = () => {
    onEditar(transacaoEditada);
    setTransacaoParaEditar(null);
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    },
    exit: { 
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros e busca */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar transações..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="receita">Receitas</SelectItem>
                <SelectItem value="despesa">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <ChevronDown size={18} className="text-gray-500" />
            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data-desc">Data (mais recente)</SelectItem>
                <SelectItem value="data-asc">Data (mais antiga)</SelectItem>
                <SelectItem value="valor-desc">Valor (maior)</SelectItem>
                <SelectItem value="valor-asc">Valor (menor)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Lista de transações */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {transacoesFiltradas.length > 0 ? (
                  transacoesFiltradas.map((transacao) => (
                    <motion.tr 
                      key={transacao.id}
                      variants={itemVariants}
                      exit="exit"
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarData(transacao.data)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transacao.tipo === 'receita' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transacao.tipo === 'receita' ? (
                            <ArrowUpRight className="mr-1" size={12} />
                          ) : (
                            <ArrowDownRight className="mr-1" size={12} />
                          )}
                          {transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transacao.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transacao.descricao}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        R$ {Number(transacao.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditarClick(transacao)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onExcluir(transacao.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de edição */}
      <Dialog open={transacaoParaEditar !== null} onOpenChange={(open) => !open && setTransacaoParaEditar(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <Select 
                value={transacaoEditada.tipo || ''} 
                onValueChange={(valor) => setTransacaoEditada({...transacaoEditada, tipo: valor})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoria
              </Label>
              <Input
                id="categoria"
                value={transacaoEditada.categoria || ''}
                onChange={(e) => setTransacaoEditada({...transacaoEditada, categoria: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Input
                id="descricao"
                value={transacaoEditada.descricao || ''}
                onChange={(e) => setTransacaoEditada({...transacaoEditada, descricao: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor
              </Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={transacaoEditada.valor || ''}
                onChange={(e) => setTransacaoEditada({...transacaoEditada, valor: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data" className="text-right">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={transacaoEditada.data || ''}
                onChange={(e) => setTransacaoEditada({...transacaoEditada, data: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransacaoParaEditar(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarEdicao}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transacoes;
