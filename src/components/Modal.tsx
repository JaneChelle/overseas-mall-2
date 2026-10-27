import { useRef } from 'react'
import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  children: ReactNode
  className?: string
  testId?: string
}

/** Accessible overlay with focus trapping, Escape dismissal, and focus restoration. */
export function Modal({ open, onClose, title, description, children, className = '', testId }: ModalProps) {
  const previousFocus = useRef<HTMLElement | null>(null)
  return (
    <Dialog.Root open={open} onOpenChange={next => { if (!next) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className={`modal-content ${className}`}
          data-test-id={testId}
          onOpenAutoFocus={() => { previousFocus.current = document.activeElement as HTMLElement }}
          onCloseAutoFocus={event => {
            event.preventDefault()
            previousFocus.current?.focus()
          }}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Description className="sr-only">{description}</Dialog.Description>
          <Dialog.Close className="icon-button modal-close" aria-label={`Close ${title.toLowerCase()}`} title="Close">
            <X size={21} />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
