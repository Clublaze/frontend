import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

function Modal({ open, onClose, title, children }) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[var(--color-overlay)] backdrop-blur-[2px]" />
        <Dialog.Content
          className={[
            'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md',
            '-translate-x-1/2 -translate-y-1/2',
            'rounded-[var(--radius-xl)] border border-[var(--color-border)]',
            'bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]',
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold text-[var(--color-text-primary)]">
              {title}
            </Dialog.Title>
            <button
              aria-label="Close"
              className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
