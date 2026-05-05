import React, { useState, useMemo } from 'react';
import { 
  Trash, Search, Smartphone, Laptop, Tablet, PackageMinus, 
  X, Eye, Image as ImageIcon, Calendar, User
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import './DescarteDashboard.css';

export function DescarteDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingTermo, setViewingTermo] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Load data from localStorage (only items with descarte info)
  const descartes = useMemo(() => {
    const savedData = localStorage.getItem('ativosData');
    if (!savedData) return [];
    const ativos = JSON.parse(savedData);
    return ativos.filter(ativo => ativo.dadosDescarte != null);
  }, []);

  // Metrics
  const metrics = useMemo(() => {
    const total = descartes.length;
    const notebooks = descartes.filter(d => d.tipo.toLowerCase().includes('notebook')).length;
    const celulares = descartes.filter(d => d.tipo.toLowerCase().includes('celular') || d.tipo.toLowerCase().includes('smartphone')).length;
    const tablets = descartes.filter(d => d.tipo.toLowerCase().includes('tablet')).length;

    return { total, notebooks, celulares, tablets };
  }, [descartes]);

  // Filtered Data
  const filteredData = useMemo(() => {
    if (!searchTerm) return descartes;
    const lowerSearch = searchTerm.toLowerCase();
    return descartes.filter(d => 
      d.nome.toLowerCase().includes(lowerSearch) || 
      d.codigo.toLowerCase().includes(lowerSearch)
    );
  }, [descartes, searchTerm]);

  const getStatusClass = (status) => {
    if (status === 'Pendente') return 'status-pendente';
    if (status === 'Aprovado') return 'status-aprovado';
    if (status === 'Finalizado') return 'status-finalizado';
    return '';
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <PackageMinus size={32} className="text-primary" />
        <h1 className="dashboard-title">Painel de Descarte</h1>
      </div>

      {/* Metrics Dashboard */}
      <div className="metrics-grid">
        <div className="metric-card warning">
          <div className="metric-title">Total Descartado</div>
          <div className="metric-value">{metrics.total}</div>
          <Trash size={48} className="metric-icon" />
        </div>
        <div className="metric-card purple">
          <div className="metric-title">Notebooks</div>
          <div className="metric-value">{metrics.notebooks}</div>
          <Laptop size={48} className="metric-icon" />
        </div>
        <div className="metric-card info">
          <div className="metric-title">Celulares</div>
          <div className="metric-value">{metrics.celulares}</div>
          <Smartphone size={48} className="metric-icon" />
        </div>
        <div className="metric-card">
          <div className="metric-title">Tablets</div>
          <div className="metric-value">{metrics.tablets}</div>
          <Tablet size={48} className="metric-icon" style={{ color: 'var(--primary)' }} />
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por código ou nome do ativo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome do Ativo</th>
              <th>Tipo</th>
              <th>Data do Descarte</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum descarte encontrado.</td></tr>
            ) : (
              filteredData.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.codigo}</td>
                  <td style={{ fontWeight: 500 }}>{item.nome}</td>
                  <td>{item.tipo}</td>
                  <td>{item.dadosDescarte.dataDescarte ? new Date(item.dadosDescarte.dataDescarte).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(item.statusDescarte)}`}>
                      {item.statusDescarte}
                    </span>
                  </td>
                  <td>
                    <Button variant="secondary" onClick={() => setViewingTermo(item)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                      <Eye size={14} style={{ marginRight: '0.4rem' }} /> Ver Termo de Descarte
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Termo Modal */}
      {viewingTermo && (
        <div className="modal-overlay" onClick={() => setViewingTermo(null)}>
          <div className="termo-modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="termo-header">
              <h2 className="modal-title">
                <FileText size={24} /> Termo de Descarte: {viewingTermo.codigo}
              </h2>
              <button className="close-btn" onClick={() => setViewingTermo(null)}><X size={24} /></button>
            </div>
            
            <div className="termo-body">
              <div className="termo-grid">
                <div className="termo-item">
                  <span className="termo-label">Equipamento</span>
                  <span className="termo-value">{viewingTermo.nome}</span>
                </div>
                <div className="termo-item">
                  <span className="termo-label">Tipo de Descarte</span>
                  <span className="termo-value">{viewingTermo.dadosDescarte.tipoDescarte}</span>
                </div>
                <div className="termo-item">
                  <span className="termo-label"><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Data da Solicitação</span>
                  <span className="termo-value">{new Date(viewingTermo.dadosDescarte.dataSolicitacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="termo-item">
                  <span className="termo-label"><User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Responsável</span>
                  <span className="termo-value">{viewingTermo.dadosDescarte.responsavel || '-'}</span>
                </div>
                <div className="termo-item termo-motivo">
                  <span className="termo-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Motivo do Descarte</span>
                  <span className="termo-value" style={{ fontStyle: 'normal' }}>{viewingTermo.dadosDescarte.motivo}</span>
                </div>
              </div>

              <div>
                <h3 className="termo-section-title"><ImageIcon size={18} /> Imagens Anexadas</h3>
                {(!viewingTermo.dadosDescarte.imagens || viewingTermo.dadosDescarte.imagens.length === 0) ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>Nenhuma imagem anexada.</p>
                ) : (
                  <div className="termo-images">
                    {viewingTermo.dadosDescarte.imagens.map((img, i) => (
                      <div key={i} className="termo-image-card" onClick={() => setEnlargedImage(img.url)}>
                        <img src={img.url} alt={`Evidência ${i+1}`} />
                        <div className="image-preview-overlay"><Eye size={24} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
