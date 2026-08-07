"use client"

import DOMPurify from "isomorphic-dompurify"
import { cn } from "@/lib/utils"

interface HtmlViewerProps {
  content: string
  className?: string
  sanitize?: boolean
}

export function HtmlViewer({ content, className, sanitize = true }: HtmlViewerProps) {
  if (!content) return null

  // Sanitize the HTML string to protect against XSS
  const cleanHtml = sanitize ? DOMPurify.sanitize(content) : content

  return (
    <div
      className={cn(
        // Force element to fill parent, clip extra overflow, and enable auto scrollbars
        "html-viewer-content [&_a]:pointer-events-none [&_a]:cursor-default [&_button]:pointer-events-none [&_button]:cursor-default",
        "p-4 border-2 rounded-md w-full h-full max-w-full max-h-full overflow-auto",
        "prose dark:prose-invert",
        // Typography & layout styling
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold",
        "[&_p]:leading-relaxed",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:p-2 [&_td]:border [&_td]:p-2",
        className
      )}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  )
}