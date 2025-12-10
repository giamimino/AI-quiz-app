import { Children } from "@/types/global"

export const ChatsContainer = ({children}: Children) => {
  return (
    <div className="flex flex-col gap-2.5 p-3.5 rounded-3xl w-fit bg-dark-12">
      {children}
    </div>
  )
} 