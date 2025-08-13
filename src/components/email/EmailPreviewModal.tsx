import React from 'react';
import { Modal } from '../common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  html: string;
}

export const EmailPreviewModal: React.FC<Props> = ({ isOpen, onClose, subject, html }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Náhled e‑mailu" size="lg">
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Předmět</div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm font-medium">{subject}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tělo e‑mailu</div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-md text-sm border max-h-[70vh] overflow-auto" dangerouslySetInnerHTML={{ __html: html || '<p>(prázdné)</p>' }} />
        </div>
      </div>
    </Modal>
  );
};
