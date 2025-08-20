import type { Vote } from '../types/vote';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Download } from 'lucide-react';

interface VoteAttachmentsProps {
  vote: Vote;
}

export function VoteAttachments({ vote }: VoteAttachmentsProps) {
  const attachments = vote.attachments || [];

  if (attachments.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-600 dark:text-gray-400">
          K tomuto hlasování nejsou připojeny žádné přílohy.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {attachments.map((attachment) => (
        <Card key={attachment.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{attachment.file_name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {attachment.content_type}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => window.open(attachment.file_url)}>
              <Download className="w-4 h-4 mr-2" />
              Stáhnout
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
