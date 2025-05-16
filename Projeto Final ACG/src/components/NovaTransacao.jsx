import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';


const NovaTransacao = ({ onSalvar, onCancelar, transacaoInicial = null }) => {
  const [transacao, setTransacao] = useState(transacaoInicial || {
    tipo: 'receita',
    categoria: '',
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0]
  });

  const ehEdicao = transacaoInicial !== null;

  const handleChange = (campo, valor) => {
    setTransacao({
      ...transacao,
      [campo]: valor
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!transacao.categoria || !transacao.descricao || !transacao.valor || !transacao.data) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    onSalvar(transacao);
  };

  const categoriasSugeridas = {
    receita: ['Vendas', 'Serviços', 'Salário', 'Aluguel Recebido', 'Investimentos', 'Freelance', 'Consultoria', 'Outros'],
    despesa: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Fornecedores', 'Aluguel', 'Funcionários', 'Impostos', 'Marketing', 'Equipamentos', 'Contas (água, luz, internet)', 'Outros']
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: "100vh", scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', damping: 30, stiffness: 250 }
    },
    exit: { 
      opacity: 0, 
      y: "100vh", 
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4"
        onClick={onCancelar}
      >
        <motion.div
          variants={modalVariants}
          className="bg-white rounded-t-xl md:rounded-xl shadow-xl w-full h-full md:h-auto max-w-md flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              {ehEdicao ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onCancelar} className="text-gray-500">
              <X size={18} />
            </Button>
          </div>
          
          <ScrollArea className="flex-grow">
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Transação</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={transacao.tipo === 'receita' ? 'default' : 'outline'}
                    className={transacao.tipo === 'receita' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 text-green-700'}
                    onClick={() => handleChange('tipo', 'receita')}
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Receita
                  </Button>
                  <Button
                    type="button"
                    variant={transacao.tipo === 'despesa' ? 'default' : 'outline'}
                    className={transacao.tipo === 'despesa' ? 'bg-red-600 hover:bg-red-700' : 'border-red-200 text-red-700'}
                    onClick={() => handleChange('tipo', 'despesa')}
                  >
                    <ArrowDownRight className="mr-2 h-4 w-4" />
                    Despesa
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select 
                  value={transacao.categoria} 
                  onValueChange={(valor) => handleChange('categoria', valor)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione ou digite uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasSugeridas[transacao.tipo].map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 <Input
                  id="categoria-custom"
                  placeholder="Ou digite uma nova categoria"
                  value={categoriasSugeridas[transacao.tipo].includes(transacao.categoria) ? "" : transacao.categoria}
                  onChange={(e) => handleChange('categoria', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  placeholder="Descreva a transação"
                  value={transacao.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={transacao.valor}
                  onChange={(e) => handleChange('valor', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={transacao.data}
                  onChange={(e) => handleChange('data', e.target.value)}
                />
              </div>
            </form>
          </ScrollArea>
          
          <div className="p-4 border-t mt-auto">
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancelar}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NovaTransacao;
