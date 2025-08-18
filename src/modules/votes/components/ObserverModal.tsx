import React from 'react';
import { AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/common';

interface ObserverModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: { name: string; email: string; role: string }) => Promise<void>;
  title: string;
  initialData?: { name: string; email: string; role: string };
}

export const ObserverModal: React.FC<ObserverModalProps> = ({
  show,
  onHide,
  onSubmit,
  title,
  initialData
}) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [email, setEmail] = React.useState(initialData?.email || '');
  const [role, setRole] = React.useState(initialData?.role || 'observer');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initialData.role);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onSubmit({ name, email, role });
      onHide();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nastala neočekávaná chyba');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            </div>
            <button
              onClick={onHide}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jméno pozorovatele
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                  disabled={isSubmitting}
                  placeholder="např. Ing. Jana Procházková"
                  title="Jméno pozorovatele"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email pozorovatele
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                  disabled={isSubmitting}
                  placeholder="jana.prochazkova@audit.cz"
                  title="Email pozorovatele"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  disabled={isSubmitting}
                  title="Role pozorovatele"
                >
                  <option value="observer">Pozorovatel</option>
                  <option value="auditor">Auditor</option>
                  <option value="legal">Právník</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={onHide}
                variant="secondary"
                disabled={isSubmitting}
              >
                Zrušit
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting ? 'Ukládám...' : 'Uložit'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
