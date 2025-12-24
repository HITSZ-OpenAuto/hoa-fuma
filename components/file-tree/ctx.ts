import { createContext, useContext } from "react"

interface FileTreeContextValue {
  level: number
  path: string
  selected: Set<string>
  toggleSelect: (id: string) => void
  selectBatch: (ids: string[], selected: boolean) => void
  isSelectable: boolean
  searchQuery: string
  isAccelerated: boolean
}

export const FileTreeContext = createContext<FileTreeContextValue>({
  level: 0,
  path: "",
  selected: new Set(),
  toggleSelect: () => {},
  selectBatch: () => {},
  isSelectable: false,
  searchQuery: "",
  isAccelerated: false,
})

export function useFileTree() {
  return useContext(FileTreeContext)
}
