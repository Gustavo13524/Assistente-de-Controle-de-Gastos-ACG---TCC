
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const AssistenteIA = ({ transacoes }) => {
  const { toast } = useToast();
  const [mensagem, setMensagem] = useState('');
  const [historico, setHistorico] = useState([
    {
      tipo: 'assistente',
      conteudo: 'Olá! Sou seu assistente financeiro. Como posso ajudar você hoje? Você pode me perguntar sobre suas finanças, pedir dicas ou solicitar análises específicas.'
    }
  ]);
  const [carregando, setCarregando] = useState(false);
  const chatContainerRef = useRef(null);

  // Rolar para a última mensagem quando o histórico é atualizado
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [historico]);

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;
    
    // Adicionar mensagem do usuário ao histórico
    const novaMensagemUsuario = {
      tipo: 'usuario',
      conteudo: mensagem
    };
    
    setHistorico([...historico, novaMensagemUsuario]);
    setCarregando(true);
    
    // Limpar campo de mensagem
    setMensagem('');
    
    // Simular processamento da IA
    setTimeout(() => {
      const resposta = gerarRespostaIA(mensagem, transacoes);
      
      setHistorico(prev => [...prev, {
        tipo: 'assistente',
        conteudo: resposta
      }]);
      
      setCarregando(false);
    }, 1000);
  };

  // Função para gerar respostas baseadas em regras simples
  const gerarRespostaIA = (pergunta, transacoes) => {
    const perguntaLower = pergunta.toLowerCase();
    
    // Calcular totais para uso nas respostas
    const receitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + Number(t.valor), 0);
      
    const despesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + Number(t.valor), 0);
      
    const saldo = receitas - despesas;
    
    // Categorias de despesas
    const categoriasDespesas = {};
    transacoes
      .filter(t => t.tipo === 'despesa')
      .forEach(t => {
        if (!categoriasDespesas[t.categoria]) {
          categoriasDespesas[t.categoria] = 0;
        }
        categoriasDespesas[t.categoria] += Number(t.valor);
      });
    
    // Ordenar categorias por valor
    const categoriasOrdenadas = Object.entries(categoriasDespesas)
      .sort((a, b) => b[1] - a[1])
      .map(([categoria, valor]) => ({ categoria, valor }));
    
    // Verificar padrões na pergunta e gerar respostas
    if (perguntaLower.includes('lucro') || perguntaLower.includes('ganho') || 
        (perguntaLower.includes('quanto') && perguntaLower.includes('ganho'))) {
      return `Baseado nos dados registrados, seu lucro total (receitas - despesas) é de R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. ${saldo >= 0 ? 'Isso é positivo!' : 'Isso indica que suas despesas estão superando suas receitas.'}`;
    }
    
    if (perguntaLower.includes('receita') || perguntaLower.includes('faturamento') || 
        (perguntaLower.includes('quanto') && perguntaLower.includes('faturei'))) {
      return `O total de receitas registradas é de R$ ${receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
    }
    
    if (perguntaLower.includes('gasto') || perguntaLower.includes('despesa') || 
        (perguntaLower.includes('quanto') && perguntaLower.includes('gastei'))) {
      return `O total de despesas registradas é de R$ ${despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
    }
    
    if (perguntaLower.includes('maior') && perguntaLower.includes('despesa')) {
      if (categoriasOrdenadas.length > 0) {
        const maiorCategoria = categoriasOrdenadas[0];
        return `Sua maior categoria de despesa é "${maiorCategoria.categoria}" com um total de R$ ${maiorCategoria.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, o que representa ${((maiorCategoria.valor / despesas) * 100).toFixed(1)}% de suas despesas totais.`;
      } else {
        return "Não encontrei despesas registradas para analisar.";
      }
    }
    
    if (perguntaLower.includes('dica') || perguntaLower.includes('sugestão') || perguntaLower.includes('conselho')) {
      if (saldo < 0) {
        return "Baseado na sua situação financeira atual, aqui estão algumas dicas:\n\n1. Revise suas despesas maiores e veja se há como reduzi-las\n2. Considere aumentar suas fontes de receita\n3. Estabeleça um orçamento mensal e siga-o rigorosamente\n4. Priorize o pagamento de dívidas com juros altos";
      } else {
        return "Baseado na sua situação financeira atual, aqui estão algumas dicas:\n\n1. Continue mantendo o controle das suas finanças\n2. Considere investir parte do seu saldo positivo\n3. Estabeleça metas de economia ainda maiores\n4. Diversifique suas fontes de receita para maior segurança financeira";
      }
    }
    
    if (perguntaLower.includes('como') && (perguntaLower.includes('reduzir') || perguntaLower.includes('diminuir')) && perguntaLower.includes('despesa')) {
      if (categoriasOrdenadas.length > 0) {
        return `Para reduzir suas despesas, recomendo focar nas categorias que mais impactam seu orçamento:\n\n1. "${categoriasOrdenadas[0].categoria}" - R$ ${categoriasOrdenadas[0].valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n${categoriasOrdenadas[1] ? `2. "${categoriasOrdenadas[1].categoria}" - R$ ${categoriasOrdenadas[1].valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` : ''}${categoriasOrdenadas[2] ? `3. "${categoriasOrdenadas[2].categoria}" - R$ ${categoriasOrdenadas[2].valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` : ''}\nAnalise estas categorias e identifique gastos que podem ser reduzidos ou eliminados.`;
      } else {
        return "Para reduzir despesas, recomendo:\n\n1. Revisar contratos com fornecedores\n2. Negociar melhores condições de pagamento\n3. Eliminar serviços ou assinaturas não essenciais\n4. Otimizar processos para reduzir custos operacionais";
      }
    }
    
    if (perguntaLower.includes('como') && (perguntaLower.includes('aumentar') || perguntaLower.includes('melhorar')) && (perguntaLower.includes('receita') || perguntaLower.includes('faturamento'))) {
      return "Para aumentar suas receitas, considere estas estratégias:\n\n1. Diversificar produtos ou serviços oferecidos\n2. Revisar sua política de preços\n3. Implementar estratégias de marketing para atrair novos clientes\n4. Criar programas de fidelidade para clientes existentes\n5. Explorar novos canais de venda ou distribuição";
    }
    
    // Resposta padrão se nenhum padrão for identificado
    return "Não tenho certeza do que você está perguntando. Você pode me perguntar sobre suas receitas, despesas, lucro, ou pedir dicas específicas para sua situação financeira.";
  };

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Área principal do chat */}
      <motion.div 
        variants={itemVariants}
        className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center">
          <Brain className="mr-2" />
          <h3 className="text-lg font-semibold">Assistente Financeiro IA</h3>
        </div>
        
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {historico.map((msg, index) => (
            <div 
              key={index}
              className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.tipo === 'usuario' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                {msg.conteudo.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < msg.conteudo.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          
          {carregando && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none max-w-[80%] p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              enviarMensagem();
            }}
            className="flex space-x-2"
          >
            <Input
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!mensagem.trim() || carregando}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Painel lateral com sugestões */}
      <motion.div 
        variants={itemVariants}
        className="space-y-4"
      >
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Sparkles className="mr-2 text-blue-600" size={18} />
            Perguntas Sugeridas
          </h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left border-blue-200 hover:bg-blue-50"
              onClick={() => {
                setMensagem("Qual é o meu lucro atual?");
                setTimeout(() => enviarMensagem(), 100);
              }}
            >
              <TrendingUp className="mr-2 h-4 w-4 text-blue-600" />
              Qual é o meu lucro atual?
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left border-blue-200 hover:bg-blue-50"
              onClick={() => {
                setMensagem("Quais são minhas maiores despesas?");
                setTimeout(() => enviarMensagem(), 100);
              }}
            >
              <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
              Quais são minhas maiores despesas?
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left border-blue-200 hover:bg-blue-50"
              onClick={() => {
                setMensagem("Como posso reduzir minhas despesas?");
                setTimeout(() => enviarMensagem(), 100);
              }}
            >
              <AlertCircle className="mr-2 h-4 w-4 text-orange-600" />
              Como posso reduzir minhas despesas?
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left border-blue-200 hover:bg-blue-50"
              onClick={() => {
                setMensagem("Dê-me dicas para melhorar minhas finanças");
                setTimeout(() => enviarMensagem(), 100);
              }}
            >
              <Lightbulb className="mr-2 h-4 w-4 text-yellow-600" />
              Dê-me dicas para melhorar minhas finanças
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md p-4 text-white">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <HelpCircle className="mr-2" size={18} />
            Como o Assistente Pode Ajudar
          </h3>
          <ul className="space-y-2 opacity-90">
            <li className="flex items-start">
              <BarChart3 className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
              <span>Analisar seus dados financeiros e identificar tendências</span>
            </li>
            <li className="flex items-start">
              <MessageSquare className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
              <span>Responder perguntas sobre sua situação financeira</span>
            </li>
            <li className="flex items-start">
              <Lightbulb className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
              <span>Fornecer dicas personalizadas para melhorar seus resultados</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
              <span>Alertar sobre problemas potenciais em suas finanças</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssistenteIA;
