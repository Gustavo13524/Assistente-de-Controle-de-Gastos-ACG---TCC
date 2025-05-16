import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRelatoriosData } from '@/hooks/useRelatoriosData';
import ResumoFinanceiroRelatorio from '@/components/relatorios/ResumoFinanceiroRelatorio';
import GraficoEvolucaoMensal from '@/components/relatorios/GraficoEvolucaoMensal';
import GraficosCategorias from '@/components/relatorios/GraficosCategorias';
import AnaliseRecomendacoes from '@/components/relatorios/AnaliseRecomendacoes';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useToast } from '@/components/ui/use-toast';


const Relatorios = ({ transacoes }) => {
  const [periodoFiltro, setPeriodoFiltro] = useState('ultimos6meses');
  const { toast } = useToast();
  
  const {
    transacoesFiltradas,
    dadosEvolucaoMensal,
    dadosCategoriasDespesas,
    dadosCategoriasReceitas,
    resumoFinanceiro
  } = useRelatoriosData(transacoes, periodoFiltro);

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

  const exportarRelatorioPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Relatório Financeiro Detalhado", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Período: ${periodoFiltro.replace('ultimos', 'Últimos ').replace('meses', ' meses').replace('ano', ' ano')}`, 14, 30);
      doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 36);

      let currentY = 45;

      doc.setFontSize(14);
      doc.text("Resumo Financeiro", 14, currentY);
      currentY += 8;
      doc.setFontSize(10);
      doc.text(`Total de Receitas: R$ ${resumoFinanceiro.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, currentY);
      currentY += 6;
      doc.text(`Total de Despesas: R$ ${resumoFinanceiro.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, currentY);
      currentY += 6;
      doc.setFont(undefined, 'bold');
      doc.text(`Saldo do Período: R$ ${resumoFinanceiro.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, currentY);
      currentY += 6;
      doc.setFont(undefined, 'normal');
      doc.text(`Taxa de Economia: ${resumoFinanceiro.taxaEconomia.toFixed(1)}%`, 14, currentY);
      currentY += 10;
      
      doc.setFontSize(14);
      doc.text("Transações do Período", 14, currentY);
      currentY += 8;

      const tableColumn = ["Data", "Tipo", "Categoria", "Descrição", "Valor (R$)"];
      const tableRows = [];

      transacoesFiltradas.forEach(transacao => {
        const transacaoData = [
          new Date(transacao.data).toLocaleDateString('pt-BR'),
          transacao.tipo.charAt(0).toUpperCase() + transacao.tipo.slice(1),
          transacao.categoria,
          transacao.descricao,
          Number(transacao.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        ];
        tableRows.push(transacaoData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: currentY,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { font: 'helvetica', fontSize: 9 },
      });
      
      currentY = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(12);
      doc.text("Análise e Recomendações:", 14, currentY);
      currentY += 6;
      doc.setFontSize(10);
      const recomendacoes = resumoFinanceiro.saldo >= 0 
        ? [
            `Saldo positivo de R$ ${resumoFinanceiro.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
            "Continue mantendo o controle das suas finanças.",
            "Considere investir parte do seu saldo positivo.",
            "Estabeleça metas de economia ainda maiores."
          ]
        : [
            `Saldo negativo de R$ ${Math.abs(resumoFinanceiro.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
            "Revise seus gastos em categorias não essenciais.",
            "Busque aumentar suas fontes de receita.",
            "Estabeleça um orçamento mensal e siga-o rigorosamente."
          ];
      
      recomendacoes.forEach(rec => {
        doc.text(`- ${rec}`, 14, currentY);
        currentY += 5;
      });

      doc.save(`relatorio_financeiro_${periodoFiltro}_${new Date().toISOString().slice(0,10)}.pdf`);
      
      toast({
        title: "Relatório PDF exportado",
        description: "O relatório detalhado foi gerado com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao exportar relatório PDF:', error);
      toast({
        title: "Erro na exportação do relatório",
        description: "Não foi possível gerar o relatório PDF.",
        variant: "destructive",
      });
    }
  };


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div className="flex items-center">
          <Filter className="mr-2 text-gray-500" size={18} />
          <span className="text-sm font-medium text-gray-700 mr-2">Período:</span>
          <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultimos3meses">Últimos 3 meses</SelectItem>
              <SelectItem value="ultimos6meses">Últimos 6 meses</SelectItem>
              <SelectItem value="ultimo1ano">Último ano</SelectItem>
              <SelectItem value="todos">Todo o período</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="text-blue-600 border-blue-200" onClick={exportarRelatorioPDF}>
          <Download className="mr-2 h-4 w-4" />
          Exportar relatório PDF
        </Button>
      </motion.div>

      <ResumoFinanceiroRelatorio resumoFinanceiro={resumoFinanceiro} variants={itemVariants} />

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="evolucao">
          <TabsList className="mb-6 bg-blue-100/50 p-1 rounded-lg">
            <TabsTrigger value="evolucao" className="data-[state=active]:bg-white">
              Evolução Mensal
            </TabsTrigger>
            <TabsTrigger value="despesas" className="data-[state=active]:bg-white">
              Despesas por Categoria
            </TabsTrigger>
            <TabsTrigger value="receitas" className="data-[state=active]:bg-white">
              Receitas por Categoria
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evolucao">
            <GraficoEvolucaoMensal dadosEvolucaoMensal={dadosEvolucaoMensal} />
          </TabsContent>
          
          <TabsContent value="despesas">
            <GraficosCategorias 
              dadosCategorias={dadosCategoriasDespesas} 
              tipo="despesa" 
            />
          </TabsContent>
          
          <TabsContent value="receitas">
            <GraficosCategorias 
              dadosCategorias={dadosCategoriasReceitas} 
              tipo="receita" 
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      <AnaliseRecomendacoes resumoFinanceiro={resumoFinanceiro} variants={itemVariants} />
    </motion.div>
  );
};

export default Relatorios;