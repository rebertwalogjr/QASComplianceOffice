import { ChevronDown } from "lucide-react"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "./ui/item"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu"

// DUMMY DATA
type typeAttachment = {
  id: number,
  name: string,
  type: string,
  size: string
}

const attachments: typeAttachment[] = [
  { id: 1, name: "sample-file-1.pdf", type: "pdf", size: "8 MD" },
  { id: 2, name: "file-not-found.docx", type: "doc", size: "88 KB" },
  { id: 3, name: "not-a-table.xlsx", type: "xlsx", size: "2 MB" },
  { id: 4, name: "unknown.txt", type: "txt", size: "10 KB" },
]
// DUMMY DATA

const IconSwitcher = (type: string) => {
  switch (type) {
    case "pdf":
      return "bi-filetype-pdf text-red-700";
    case "doc":
      return "bi-filetype-doc text-blue-700";
    case "xlsx":
      return "bi-filetype-xlsx text-green-700";
    default:
      return "bi-file-earmark text-gray-700"
  }
}

export default function AttachmentViewer() {
  return (
    <div className="flex flex-col w-full gap-2">
      {attachments.map((item: typeAttachment) => (
        <Item key={item.id} variant="outline" size="sm" className="w-full hover:bg-muted">
          <i className={`bi ${IconSwitcher(item.type)} text-xl`} />
          <ItemContent>
            <ItemTitle>{item.name}</ItemTitle>
            <ItemDescription className="text-xs">{item.size}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-center items-center size-6 hover:bg-background rounded">
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Download</DropdownMenuItem>
                <DropdownMenuItem>Preview</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        </Item>
      ))
      }
    </div>
  )
}