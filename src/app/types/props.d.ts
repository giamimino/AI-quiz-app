export interface MenuButtonProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface CreateChallangeProps {
  onChoice: (choice: string) => void;
}

export interface DefaultButtonProps {
  label?: string;
  bg?: string;
  hoverBg?: string;
  wFit?: boolean;
  small?: boolean;
  noSelect?: boolean;
  mCenter?: boolean,
  icon?: string,
  xSmall?: boolean,
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
  fixed?: boolean,
  tlCorner?: boolean,
  trCorner?: boolean,
  size?: number,
  mt?: number
}

export interface QuizOptionCreateProps {
  value: string;
  onSubmit: (value: string) => void,
  finished?: boolean
}

export interface CreateChallengeWrapperProps {
  col?: boolean,
  gap?: number,
}

export interface ErrorProps {
  error: string,
  handleClose: (error?: string) => void
}

export interface UserProiflePageProps {
  params: Promise<{
    username: string
  }>
}

export interface ChallengePageProps {
  params: Promise<{
    slug: string
  }>
}

export interface ChallengeEditProps {
  params: Promise<{
    slug: string
  }>
}

export interface ProfileImageProps {
  src: string,
  w?: number,
  h?: number,
  alt?: string,
  r?: number
}

export interface ChallangeHeroProps {
  id: string,
  title: string,
  description: string,
  topic?: string,
  slug: string,
  type: "AI" | "CUSTOM",
  isDeleting?: boolean,
  callbackDelete?: (id: string) => void,
  isFinished?: boolean,
  isEditing?: boolean,
}

export interface SearchProps {
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>
}