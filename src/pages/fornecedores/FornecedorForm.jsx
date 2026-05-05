import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { fornecedorService } from '../../services/api';
import './FornecedorForm.css';

export function FornecedorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    ticket: '',
    colaborador: '',
    ativo: '',
    fornecedor: '',
    cnpj: '',
    email: '',
    telefone: '',
    custoCentro: '',
    custo: '',
    status: 'Pendente de envio',
    data: new Date().toISOString().split('T')[0], // Padrão: hoje
    os: ''
  });

  const [files, setFiles] = useState({
    termo: null,
    laudo: null
  });

  useEffect(() => {
    if (isEditing) {
      loadFornecedor();
    }
  }, [id]);

  const loadFornecedor = async () => {
    try {
      setLoading(true);
      const savedData = localStorage.getItem('fornecedoresData');
      if (savedData) {
        const list = JSON.parse(savedData);
        const item = list.find(x => x.id === parseInt(id));
        if (item) {
          setFormData({
            ticket: item.ticket || '',
            colaborador: item.colaborador || '',
            ativo: item.ativo || '',
            fornecedor: item.fornecedor || '',
            cnpj: item.cnpj || '',
            email: item.email || '',
            telefone: item.telefone || '',
            custoCentro: item.custoCentro || '',
            custo: item.custo || '',
            status: item.status || 'Pendente de envio',
            data: item.data || '',
            os: item.os || ''
          });
        }
      } else {
        // Simulação para o visual se não tiver localstorage
        setFormData({
          ticket: 'CHM-1025', colaborador: 'João Silva', ativo: 'NTB-4059', 
          fornecedor: 'Tech Fix S.A.', cnpj: '12.345.678/0001-90', email: 'contato@techfix.com', telefone: '(11) 9876-5432',
          custoCentro: 'TI', custo: '350.00', 
          status: 'Concluído', data: '2023-10-01', os: 'OS-982'
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    
    // 1. Validar se todos os campos obrigatórios foram preenchidos
    if (!formData.colaborador || !formData.ativo || !formData.fornecedor || !formData.cnpj || !formData.email || !formData.telefone || !formData.custoCentro || formData.custo === '' || !formData.data || !formData.status) {
      setFeedback({ type: 'error', msg: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    // 2. Validar formato da data (dd/mm/aaaa)
    // O input type="date" retorna yyyy-mm-dd. Vamos validar se está nesse formato que representa uma data válida do calendário.
    if (!formData.data.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setFeedback({ type: 'error', msg: 'Formato de data inválido. Preencha uma data válida.' });
      return;
    }

    // 3. Validar se o custo é numérico e maior ou igual a zero
    const custoNum = parseFloat(formData.custo);
    if (isNaN(custoNum) || custoNum < 0) {
      setFeedback({ type: 'error', msg: 'O custo deve ser um valor numérico maior ou igual a zero.' });
      return;
    }

    setLoading(true);

    try {
      const savedData = localStorage.getItem('fornecedoresData');
      const MOCK_DATA = [
        { id: 1, ticket: 'CHM-1025', colaborador: 'João Silva', ativo: 'NTB-4059', termo: 'termo_aceite.pdf', laudo: null, status: 'Concluído', data: '2023-10-01', fornecedor: 'Tech Fix S.A.', cnpj: '12.345.678/0001-90', email: 'contato@techfix.com', telefone: '(11) 98765-4321', custoCentro: 'TI', custo: 350.00, os: 'OS-982' },
        { id: 2, ticket: 'CHM-1026', colaborador: 'Maria Souza', ativo: 'CEL-1234', termo: null, laudo: null, status: 'Pendente de envio', data: '2023-10-05', fornecedor: 'Reparos Express', cnpj: '98.765.432/0001-10', email: 'suporte@reparos.com', telefone: '(11) 91234-5678', custoCentro: 'Comercial', custo: 120.00, os: 'OS-985' },
        { id: 3, ticket: 'CHM-1027', colaborador: 'Carlos Dias', ativo: 'TAB-5541', termo: 'termo.pdf', laudo: 'laudo.pdf', status: 'Enviado ao fornecedor', data: '2023-10-08', fornecedor: 'Global Assist', cnpj: '11.222.333/0001-44', email: 'atendimento@global.com', telefone: '(21) 99999-8888', custoCentro: 'TI', custo: 0.00, os: 'OS-990' },
        { id: 4, ticket: 'CHM-1028', colaborador: 'Ana Marques', ativo: 'NTB-9988', termo: 'termo_assinado.pdf', laudo: null, status: 'Pendente de devolução', data: '2023-10-10', fornecedor: 'Tech Fix S.A.', cnpj: '12.345.678/0001-90', email: 'contato@techfix.com', telefone: '(11) 98765-4321', custoCentro: 'Operações', custo: 450.00, os: 'OS-995' }
      ];
      let currentData = savedData ? JSON.parse(savedData) : MOCK_DATA;

      if (isEditing) {
        currentData = currentData.map(item => {
          if (item.id === parseInt(id)) {
            return {
              ...item,
              ...formData,
              custo: custoNum,
              termo: files.termo ? files.termo.name : item.termo,
              laudo: files.laudo ? files.laudo.name : item.laudo
            };
          }
          return item;
        });
      } else {
        const newItem = {
          id: Date.now(),
          ticket: formData.ticket || `CHM-${Math.floor(Math.random() * 10000)}`,
          os: formData.os || `OS-${Math.floor(Math.random() * 1000)}`,
          colaborador: formData.colaborador,
          ativo: formData.ativo,
          fornecedor: formData.fornecedor,
          cnpj: formData.cnpj,
          email: formData.email,
          telefone: formData.telefone,
          custoCentro: formData.custoCentro,
          custo: custoNum,
          data: formData.data,
          status: formData.status,
          termo: files.termo ? files.termo.name : null,
          laudo: files.laudo ? files.laudo.name : null
        };
        // Adicionar o novo chamado no início da lista para aparecer primeiro
        currentData = [newItem, ...currentData];
      }

      localStorage.setItem('fornecedoresData', JSON.stringify(currentData));

      // Simular chamada de sucesso
      setTimeout(() => {
        setLoading(false);
        setFeedback({ type: 'success', msg: isEditing ? 'Chamado atualizado com sucesso!' : 'Chamado cadastrado com sucesso!' });
        if (!isEditing) {
          setTimeout(() => navigate('/fornecedores'), 1500);
        }
      }, 800);

    } catch (err) {
      setLoading(false);
      setFeedback({ type: 'error', msg: 'Houve um erro ao salvar os dados. Tente novamente.' });
      console.error(err);
    }
  };

  return (
    <div className="form-container animate-fade-in">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="action-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="form-title">{isEditing ? 'Editar Registro' : 'Novo Registro de Fornecedor'}</h1>
        </div>
      </div>

      {feedback && (
        <div className={`feedback-msg ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.msg}
        </div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          
          <Input id="ticket" label="Ticket do chamado" placeholder="Ex: CHM-1020" value={formData.ticket} onChange={handleInputChange} />
          <Input id="os" label="Ordem de Serviço (OS)" placeholder="Ex: OS-980" value={formData.os} onChange={handleInputChange} />
          
          <Input id="colaborador" label="Colaborador Solicitante" placeholder="Nome completo" value={formData.colaborador} onChange={handleInputChange} />
          <Input id="ativo" label="Número do Ativo" placeholder="Serial/Tombamento" value={formData.ativo} onChange={handleInputChange} />
          
          <Input id="fornecedor" label="Nome do Fornecedor" placeholder="Empresa prestadora" value={formData.fornecedor} onChange={handleInputChange} />
          <Input id="cnpj" label="CNPJ" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={handleInputChange} />
          
          <Input id="email" label="E-mail do Fornecedor" placeholder="contato@empresa.com" type="email" value={formData.email} onChange={handleInputChange} />
          <Input id="telefone" label="Telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleInputChange} />
          
          <div className="input-wrapper">
            <label className="input-label" htmlFor="custoCentro">Centro de Custo</label>
            <select id="custoCentro" className="input-field" value={formData.custoCentro} onChange={handleInputChange} required>
              <option value="">Selecione...</option>
              <option value="TI">TI</option>
              <option value="Operações">Operações</option>
              <option value="Comercial">Comercial</option>
              <option value="RH">RH</option>
            </select>
          </div>

          <Input id="custo" label="Custo Estimado/Final (R$)" type="number" placeholder="0.00" value={formData.custo} onChange={handleInputChange} />
          <Input id="data" label="Data da Solicitação" type="date" value={formData.data} onChange={handleInputChange} />
          
          <div className="input-wrapper full-width">
            <label className="input-label" htmlFor="status">Status do Processo</label>
            <select id="status" className="input-field" value={formData.status} onChange={handleInputChange}>
              <option value="Pendente de envio">Pendente de envio</option>
              <option value="Enviado ao fornecedor">Enviado ao fornecedor</option>
              <option value="Pendente de devolução">Pendente de devolução</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>

          {/* Uploads Multipart */}
          <div className="file-upload-wrapper">
            <span className="file-upload-label">Termo Anexado</span>
            <label className="file-upload-box">
              <UploadCloud size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{files.termo ? files.termo.name : 'Clique para anexar Termo'}</div>
              <input type="file" className="file-input" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => handleFileChange(e, 'termo')} />
            </label>
          </div>

          <div className="file-upload-wrapper">
            <span className="file-upload-label">Laudo Técnico</span>
            <label className="file-upload-box">
              <UploadCloud size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{files.laudo ? files.laudo.name : 'Clique para anexar Laudo'}</div>
              <input type="file" className="file-input" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => handleFileChange(e, 'laudo')} />
            </label>
          </div>
          
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit">
            <Save size={18} style={{ marginRight: '0.5rem' }} />
            {loading ? 'Salvando...' : 'Salvar Registro'}
          </Button>
        </div>
      </form>
    </div>
  );
}
