export interface MenuButtonProps {
  open: boolean,
  onOpen: () => void
  onClose: () => void
}

export interface CreateChallangeProps {
  onChoice: (choice: string) => void
}

export interface DefaultButtonProps {
  label: string,
  bg?: string,
  hoverBg?: string, 
}