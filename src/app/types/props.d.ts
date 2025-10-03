export interface MenuButtonProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface CreateChallangeProps {
  onChoice: (choice: string) => void;
}

export interface DefaultButtonProps {
  label: string;
  bg?: string;
  hoverBg?: string;
  wFit?: boolean;
  small?: boolean;
  font?:
    | "100" // thin
    | "200" // extralight
    | "300" // light
    | "400" // normal
    | "500" // medium
    | "600" // semibold
    | "700" // bold
    | "800" // extrabold
    | "900" // black
}

export interface QuizOptionCreateProps {
  label: string;
}

export interface CreateChallengeWrapperProps {
  col?: boolean,
  gap?: number,
}