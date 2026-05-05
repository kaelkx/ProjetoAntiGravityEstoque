import React, { useState, useEffect } from 'react';
import { 
  Trash, Plus, Eye, Edit2, Trash2, X, Download, FileText, 
  Image as ImageIcon, UploadCloud, Info, CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './DescartesList.css';

// Initial Mock Data
const INITIAL_MOCK_DATA = [
  {
    id: 1,
    codigoAtivo: 'AT-00155',
    nomeEquipamento: 'Mouse sem fio Logitech',
    tipo: 'Periférico',
    numeroSerie: 'SN-987654321',
    colaborador: 'João Silva',
    dataDevolucao: '2024-11-20',
    motivo: 'Scroll com defeito permanente',
    tipoDescarte: 'Sucata',
    dataSolicitacao: '2024-11-22',
    dataDescarte: '2024-11-25',
    responsavel: 'Admin TI',
    status: 'Finalizado',
    imagens: [
      { id: 1, url: 'https://images.unsplash.com/photo-1527814050087-37938154799f?auto=format&fit=crop&q=80&w=200' }
    ],
    anexos: [
      { id: 1, nome: 'laudo_tecnico.pdf' }
    ]
  },
  {
    id: 2,
    codigoAtivo: 'AT-00170',
    nomeEquipamento: 'Teclado Mecânico Keychron',
    tipo: 'Periférico',
    numeroSerie: 'KC-12345',
    colaborador: 'João Silva',
    dataDevolucao: '2025-01-15',
    motivo: 'Múltiplas teclas falhando',
    tipoDescarte: 'Reciclagem',
    dataSolicitacao: '2025-01-16',
    dataDescarte: null,
    responsavel: 'Admin TI',
    status: 'Pendente',
    imagens: [],
    anexos: []
  }
];

export function DescartesList() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('descartesData');
    return savedData ? JSON.parse(savedData) : INITIAL_MOCK_DATA;
  });

  const [feedback, setFeedback] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view', 'edit', 'new', null
  const [activeTab, setActiveTab] = useState('geral');
  const [enlargedImage, setEnlargedImage] = useState(null);
  
  const [formData, setFormData] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro de descarte?")) {
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      localStorage.setItem('descartesData', JSON.stringify(updatedData));
      setFeedback({ type: 'success', msg: 'Descarte excluído com sucesso!' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Pendente') return 'status-pendente';
    if (status === 'Aprovado') return 'status-aprovado';
    if (status === 'Finalizado') return 'status-finalizado';
    return '';
  };

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setActiveTab('geral');
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({
        id: Date.now(),
        codigoAtivo: '', nomeEquipamento: '', tipo: '', numeroSerie: '',
        colaborador: '', dataDevolucao: '',
        motivo: '', tipoDescarte: 'Reciclagem', dataSolicitacao: new Date().toISOString().split('T')[0], dataDescarte: '', responsavel: '',
        status: 'Pendente', imagens: [], anexos: []
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setFormData(null);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    if (!formData.codigoAtivo || !formData.nomeEquipamento) {
      alert("Preencha ao menos o Código e o Nome do Equipamento.");
      return;
    }
    
    let updatedData;
    if (modalMode === 'new') {
      updatedData = [...data, formData];
    } else {
      updatedData = data.map(item => item.id === formData.id ? formData : item);
    }
    
    setData(updatedData);
    localStorage.setItem('descartesData', JSON.stringify(updatedData));
    setFeedback({ type: 'success', msg: `Descarte ${modalMode === 'new' ? 'criado' : 'atualizado'} com sucesso!` });
    setTimeout(() => setFeedback(null), 3000);
    closeModal();
  };

  const simulateImageUpload = () => {
    const newImage = { 
      id: Date.now(), 
      url: 'https://images.unsplash.com/photo-1588508065123-287b28e0131b?auto=format&fit=crop&q=80&w=200' 
    };
    setFormData(prev => ({ ...prev, imagens: [...prev.imagens, newImage] }));
  };

  const simulateAttachmentUpload = () => {
    const newAttachment = { id: Date.now(), nome: `documento_${Date.now()}.pdf` };
    setFormData(prev => ({ ...prev, anexos: [...prev.anexos, newAttachment] }));
  };

  const isViewOnly = modalMode === 'view';

  return (
    <div className="descartes-container animate-fade-in">
      <div className="descartes-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trash size={28} className="text-primary" />
          <h1 className="descartes-title">Descarte de Ativos</h1>
        </div>
        <Button onClick={() => openModal('new')}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          Novo Descarte
        </Button>
      </div>

      {feedback && (
        <div className={`feedback-msg ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.msg}
        </div>
      )}

      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código do Ativo</th>
                <th>Nome / Equipamento</th>
                <th>Colaborador</th>
                <th>Tipo Descarte</th>
                <th>Status</th>
                <th>Data Solicitação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum registro encontrado.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.codigoAtivo}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.nomeEquipamento}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.tipo}</div>
                    </td>
                    <td>{item.colaborador || '-'}</td>
                    <td>{item.tipoDescarte}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>{item.status}</span>
                    </td>
                    <td>{new Date(item.dataSolicitacao).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn" title="Visualizar" onClick={() => openModal('view', item)}><Eye size={18} /></button>
                        <button className="action-btn" title="Editar" onClick={() => openModal('edit', item)}><Edit2 size={18} /></button>
                        <button className="action-btn" title="Excluir" onClick={() => handleDelete(item.id)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View / Edit / New */}
      {modalMode && formData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === 'new' ? 'Novo Registro de Descarte' : modalMode === 'edit' ? `Editar Descarte: ${formData.codigoAtivo}` : `Detalhes do Descarte: ${formData.codigoAtivo}`}
              </h2>
              <button className="close-btn" onClick={closeModal}><X size={24} /></button>
            </div>

            <div className="tabs-header">
              <button className={`tab-btn ${activeTab === 'geral' ? 'active' : ''}`} onClick={() => setActiveTab('geral')}>
                <Info size={16} /> Dados Gerais
              </button>
              <button className={`tab-btn ${activeTab === 'imagens' ? 'active' : ''}`} onClick={() => setActiveTab('imagens')}>
                <ImageIcon size={16} /> Imagens ({formData.imagens.length})
              </button>
              <button className={`tab-btn ${activeTab === 'anexos' ? 'active' : ''}`} onClick={() => setActiveTab('anexos')}>
                <FileText size={16} /> Anexos ({formData.anexos.length})
              </button>
            </div>

            <div className="modal-body">
              {activeTab === 'geral' && (
                <div className="tab-content">
                  {isViewOnly ? (
                    <>
                      <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Dados do Ativo</h3>
                      <div className="detail-grid">
                        <div className="detail-item"><span className="detail-label">Código</span><span className="detail-value">{formData.codigoAtivo}</span></div>
                        <div className="detail-item"><span className="detail-label">Nome do Equipamento</span><span className="detail-value">{formData.nomeEquipamento}</span></div>
                        <div className="detail-item"><span className="detail-label">Tipo</span><span className="detail-value">{formData.tipo}</span></div>
                        <div className="detail-item"><span className="detail-label">Número de Série</span><span className="detail-value">{formData.numeroSerie || '-'}</span></div>
                      </div>

                      <h3 style={{ marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--text-dark)' }}>Dados do Colaborador</h3>
                      <div className="detail-grid">
                        <div className="detail-item"><span className="detail-label">Nome do Colaborador</span><span className="detail-value">{formData.colaborador || '-'}</span></div>
                        <div className="detail-item"><span className="detail-label">Data de Devolução</span><span className="detail-value">{formData.dataDevolucao ? new Date(formData.dataDevolucao).toLocaleDateString('pt-BR') : '-'}</span></div>
                      </div>

                      <h3 style={{ marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--text-dark)' }}>Informações de Descarte</h3>
                      <div className="detail-grid">
                        <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value"><span className={`status-badge ${getStatusClass(formData.status)}`}>{formData.status}</span></span></div>
                        <div className="detail-item"><span className="detail-label">Tipo de Descarte</span><span className="detail-value">{formData.tipoDescarte}</span></div>
                        <div className="detail-item"><span className="detail-label">Motivo</span><span className="detail-value">{formData.motivo}</span></div>
                        <div className="detail-item"><span className="detail-label">Responsável</span><span className="detail-value">{formData.responsavel}</span></div>
                        <div className="detail-item"><span className="detail-label">Data Solicitação</span><span className="detail-value">{new Date(formData.dataSolicitacao).toLocaleDateString('pt-BR')}</span></div>
                        <div className="detail-item"><span className="detail-label">Data Descarte</span><span className="detail-value">{formData.dataDescarte ? new Date(formData.dataDescarte).toLocaleDateString('pt-BR') : '-'}</span></div>
                      </div>
                    </>
                  ) : (
                    <div className="form-grid">
                      <div className="form-group"><span className="form-label">Código do Ativo *</span><Input id="codigoAtivo" value={formData.codigoAtivo} onChange={handleInputChange} placeholder="Ex: AT-000" /></div>
                      <div className="form-group"><span className="form-label">Nome do Equipamento *</span><Input id="nomeEquipamento" value={formData.nomeEquipamento} onChange={handleInputChange} placeholder="Ex: Notebook Dell" /></div>
                      
                      <div className="form-group"><span className="form-label">Tipo</span>
                        <select id="tipo" className="input-field" value={formData.tipo} onChange={handleInputChange}>
                          <option value="">Selecione...</option>
                          <option value="Notebook">Notebook</option>
                          <option value="Monitor">Monitor</option>
                          <option value="Periférico">Periférico</option>
                          <option value="Mobiliário">Mobiliário</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                      <div className="form-group"><span className="form-label">Número de Série</span><Input id="numeroSerie" value={formData.numeroSerie} onChange={handleInputChange} placeholder="S/N..." /></div>
                      
                      <div className="form-group full-width" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginTop: '0.5rem' }}></div>
                      
                      <div className="form-group"><span className="form-label">Colaborador</span><Input id="colaborador" value={formData.colaborador} onChange={handleInputChange} placeholder="Nome do colaborador" /></div>
                      <div className="form-group"><span className="form-label">Data de Devolução</span><Input id="dataDevolucao" type="date" value={formData.dataDevolucao} onChange={handleInputChange} /></div>

                      <div className="form-group full-width" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginTop: '0.5rem' }}></div>

                      <div className="form-group">
                        <span className="form-label">Status</span>
                        <select id="status" className="input-field" value={formData.status} onChange={handleInputChange}>
                          <option value="Pendente">Pendente</option>
                          <option value="Aprovado">Aprovado</option>
                          <option value="Finalizado">Finalizado</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <span className="form-label">Tipo de Descarte</span>
                        <select id="tipoDescarte" className="input-field" value={formData.tipoDescarte} onChange={handleInputChange}>
                          <option value="Reciclagem">Reciclagem</option>
                          <option value="Doação">Doação</option>
                          <option value="Venda">Venda</option>
                          <option value="Sucata">Sucata</option>
                        </select>
                      </div>

                      <div className="form-group full-width"><span className="form-label">Motivo do Descarte</span><Input id="motivo" value={formData.motivo} onChange={handleInputChange} placeholder="Descreva o motivo..." /></div>
                      
                      <div className="form-group"><span className="form-label">Data Solicitação</span><Input id="dataSolicitacao" type="date" value={formData.dataSolicitacao} onChange={handleInputChange} /></div>
                      <div className="form-group"><span className="form-label">Data do Descarte</span><Input id="dataDescarte" type="date" value={formData.dataDescarte} onChange={handleInputChange} /></div>
                      
                      <div className="form-group full-width"><span className="form-label">Responsável</span><Input id="responsavel" value={formData.responsavel} onChange={handleInputChange} placeholder="Nome do responsável pelo descarte" /></div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'imagens' && (
                <div className="tab-content">
                  {!isViewOnly && (
                    <div className="image-upload-box" onClick={simulateImageUpload}>
                      <UploadCloud size={32} style={{ marginBottom: '0.5rem' }} />
                      <span style={{ fontWeight: 600 }}>Clique para adicionar imagem</span>
                      <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Suporta JPG, PNG. (Simulação)</span>
                    </div>
                  )}

                  {formData.imagens.length === 0 && isViewOnly ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '1rem' }}>Nenhuma imagem cadastrada.</p>
                  ) : (
                    <div className="images-grid">
                      {formData.imagens.map((img) => (
                        <div key={img.id} className="image-preview-card" onClick={() => setEnlargedImage(img.url)}>
                          <img src={img.url} alt="Evidência" />
                          <div className="image-preview-overlay">
                            <Eye size={24} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'anexos' && (
                <div className="tab-content">
                  {!isViewOnly && (
                    <Button variant="secondary" onClick={simulateAttachmentUpload} style={{ marginBottom: '1.5rem' }}>
                      <Plus size={16} style={{ marginRight: '0.5rem' }} /> Adicionar Documento
                    </Button>
                  )}

                  {formData.anexos.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhum anexo disponível.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {formData.anexos.map((anexo) => (
                        <div key={anexo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
                            <FileText size={20} style={{ color: 'var(--primary)' }} />
                            {anexo.nome}
                          </div>
                          <button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                            <Download size={16} /> Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!isViewOnly && (
              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: 'var(--bg-card)' }}>
                <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
                <Button onClick={handleSave}>
                  <CheckCircle size={18} style={{ marginRight: '0.5rem' }} />
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="enlarged-image-modal" onClick={() => setEnlargedImage(null)}>
          <button className="enlarged-image-close" onClick={() => setEnlargedImage(null)}><X size={32} /></button>
          <img src={enlargedImage} alt="Ampliada" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
