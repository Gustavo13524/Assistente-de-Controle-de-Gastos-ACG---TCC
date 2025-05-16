import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from '@/components/ui/use-toast';

export const exportarDadosPDF = (transacoes) => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório Financeiro - ACG Gastos", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

    const tableColumn = ["Data", "Tipo", "Cat.", "Desc.", "Valor (R$)"];
    const tableRows = [];

    transacoes.forEach(transacao => {
      const transacaoData = [
        new Date(transacao.data).toLocaleDateString('pt-BR'),
        transacao.tipo.charAt(0).toUpperCase(),
        transacao.categoria.substring(0,10),
        transacao.descricao.substring(0,15),
        Number(transacao.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
      ];
      tableRows.push(transacaoData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
      styles: { font: 'helvetica', fontSize: 8 },
      columnStyles: {
        0: {cellWidth: 18},
        1: {cellWidth: 10},
        2: {cellWidth: 20},
        3: {cellWidth: 25},
        4: {cellWidth: 20, halign: 'right'},
      }
    });
    
    const receitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + Number(t.valor), 0);
    const despesas = transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + Number(t.valor), 0);
    const saldo = receitas - despesas;

    let finalY = doc.lastAutoTable.finalY || 35;
    doc.setFontSize(12);
    doc.text("Resumo Financeiro:", 14, finalY + 10);
    doc.setFontSize(10);
    doc.text(`Total de Receitas: R$ ${receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, finalY + 18);
    doc.text(`Total de Despesas: R$ ${despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, finalY + 24);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`Saldo: R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, finalY + 30);
    
    doc.save(`ACG_Gastos_financas_${new Date().toISOString().slice(0,10)}.pdf`);
    
    toast({
      title: "Exportação PDF concluída",
      description: "Seus dados foram exportados como PDF com sucesso.",
    });
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    toast({
      title: "Erro na exportação PDF",
      description: "Não foi possível exportar seus dados como PDF.",
      variant: "destructive",
    });
  }
};