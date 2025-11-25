interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

export const Modal = ({ open, title, onClose, children }: ModalProps) => {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn secondary" type="button" onClick={onClose}>
            Cerrar
          </button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  )
}
