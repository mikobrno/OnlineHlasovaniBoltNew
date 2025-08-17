import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Vote } from '../../data/mockData';
import { useApp } from '../../hooks/useApp';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { renderDocumentTemplate, defaultBallotTemplate } from '../../lib/documentTemplate';

interface Props {
  vote: Vote;
  isOpen: boolean;
  onClose: () => void;
}

export const BallotTemplateModal: React.FC<Props> = ({ vote, isOpen, onClose }) => {
  const { selectedBuilding, members } = useApp();
  const [template, setTemplate] = useState<string>(defaultBallotTemplate);
  const [previewMemberId, setPreviewMemberId] = useState<string>('');
  const [mode, setMode] = useState<'preview' | 'edit' | 'split'>('preview');
  const [zoom, setZoom] = useState<number>(100);
  const printRef = useRef<HTMLDivElement>(null);

  // Load default template for building/global when opening
  useEffect(() => {
    if (!isOpen) return;
    try {
      const rawDefaults = localStorage.getItem('document_template_defaults');
      const rawTemplates = localStorage.getItem('document_templates');
      if (!rawTemplates) return;
      const templates = JSON.parse(rawTemplates) as Array<{ id: string; body: string }>;
      const defaults = rawDefaults ? (JSON.parse(rawDefaults) as Record<string, string>) : {};
      const bId = selectedBuilding?.id;
      let chosenId: string | undefined;
      if (bId && defaults[bId]) chosenId = defaults[bId];
      else if (defaults['global']) chosenId = defaults['global'];
      if (chosenId) {
        const tpl = templates.find(t => t.id === chosenId);
        if (tpl?.body) setTemplate(tpl.body);
      } else {
        setTemplate(defaultBallotTemplate);
      }
    } catch {
      // ignore
    }
  }, [isOpen, selectedBuilding?.id]);

  const zoomClass = useMemo(() => {
    switch (zoom) {
      case 75: return 'zoom-75';
      case 90: return 'zoom-90';
      case 100: return 'zoom-100';
      case 125: return 'zoom-125';
      case 150: return 'zoom-150';
      default: return 'zoom-100';
    }
  }, [zoom]);

  const previewHtml = useMemo(() => {
    if (!selectedBuilding) return '';
    const member = members.find(m => m.id === previewMemberId);
    return renderDocumentTemplate(template, { building: selectedBuilding, vote, member });
  }, [template, selectedBuilding, vote, members, previewMemberId]);

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const printCss = `
      <style>
        @page { size: A4; margin: 12mm; }
        html, body { background: #fff; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
      </style>
    `;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hlasovací listina</title>${printCss}</head><body>${previewHtml}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hlasovací listina – šablona" size="xl">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div className="inline-flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
          <button
            className={`px-3 py-1.5 text-sm ${mode === 'preview' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setMode('preview')}
            title="Náhled"
          >
            Náhled
          </button>
          <button
            className={`px-3 py-1.5 text-sm border-l border-gray-300 dark:border-gray-700 ${mode === 'split' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setMode('split')}
            title="Rozděleně (Editor + Náhled)"
          >
            Rozděleně
          </button>
          <button
            className={`px-3 py-1.5 text-sm border-l border-gray-300 dark:border-gray-700 ${mode === 'edit' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setMode('edit')}
            title="Editor"
          >
            Editor
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300" htmlFor="member-toolbar-select">Náhled pro člena</label>
          <select
            id="member-toolbar-select"
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            value={previewMemberId}
            onChange={(e) => setPreviewMemberId(e.target.value)}
            aria-label="Vybrat člena pro náhled"
            title="Vybrat člena pro náhled"
          >
            <option value="">— Bez konkrétního člena —</option>
            {members.filter(m => m.buildingId === vote.buildingId).map(m => (
              <option key={m.id} value={m.id}>{m.name} — {m.unit}</option>
            ))}
          </select>
          <label className="text-sm text-gray-700 dark:text-gray-300" htmlFor="zoom-select">Zoom</label>
          <select
            id="zoom-select"
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Nastavení přiblížení náhledu"
            title="Přiblížení náhledu"
          >
            <option value={75}>75%</option>
            <option value={90}>90%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
          </select>
          <Button variant="secondary" onClick={() => setTemplate(defaultBallotTemplate)} title="Obnovit výchozí šablonu">Obnovit výchozí</Button>
          <Button onClick={handlePrint} title="Tisk nebo uložení do PDF">Tisk / PDF</Button>
        </div>
      </div>

      {/* Content */}
      {mode === 'edit' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="member-select">Náhled pro člena</label>
          <select
            id="member-select"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            value={previewMemberId}
            onChange={(e) => setPreviewMemberId(e.target.value)}
            aria-label="Vybrat člena pro náhled"
            title="Vybrat člena pro náhled"
          >
            <option value="">— Bez konkrétního člena —</option>
            {members.filter(m => m.buildingId === vote.buildingId).map(m => (
              <option key={m.id} value={m.id}>{m.name} — {m.unit}</option>
            ))}
          </select>

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="template-textarea">HTML šablona</label>
          <textarea
            id="template-textarea"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-xs bg-white dark:bg-gray-800"
            aria-label="HTML šablona hlasovací listiny"
            title="HTML šablona hlasovací listiny"
            placeholder="Vložte HTML šablonu s proměnnými (např. {{vote.title}}, blok {{#questions}}...{{/questions}})"
          />
        </div>
      )}

      {mode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="member-select-2">Náhled pro člena</label>
            <select
              id="member-select-2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              value={previewMemberId}
              onChange={(e) => setPreviewMemberId(e.target.value)}
              aria-label="Vybrat člena pro náhled"
              title="Vybrat člena pro náhled"
            >
              <option value="">— Bez konkrétního člena —</option>
              {members.filter(m => m.buildingId === vote.buildingId).map(m => (
                <option key={m.id} value={m.id}>{m.name} — {m.unit}</option>
              ))}
            </select>

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="template-textarea-2">HTML šablona</label>
            <textarea
              id="template-textarea-2"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full h-80 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-xs bg-white dark:bg-gray-800"
              aria-label="HTML šablona hlasovací listiny"
              title="HTML šablona hlasovací listiny"
              placeholder="Vložte HTML šablonu s proměnnými (např. {{vote.title}}, blok {{#questions}}...{{/questions}})"
            />
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-auto bg-gray-100 dark:bg-gray-900">
            <div className="flex justify-center p-4">
              <div className={`doc-a4 bg-white shadow print:shadow-none ${zoomClass}`}>
                <div ref={printRef} dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'preview' && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-auto bg-gray-100 dark:bg-gray-900">
          <div className="flex justify-center p-4">
            <div className={`doc-a4 bg-white shadow print:shadow-none ${zoomClass}`}>
              <div ref={printRef} dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
