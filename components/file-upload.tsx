"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  label: string
  description: string
  accept: string
  file: File | null
  onFileChange: (file: File | null) => void
}

export function FileUpload({ label, description, accept, file, onFileChange }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        onFileChange(droppedFile)
      }
    },
    [onFileChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold uppercase tracking-wider text-foreground">
        {label}
      </label>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div
        className={cn(
          "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-all",
          isDragging
            ? "border-accent bg-accent/5"
            : file
            ? "border-primary/30 bg-card"
            : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0]
            if (selectedFile) {
              onFileChange(selectedFile)
            }
          }}
          aria-label={`Choose file for ${label}`}
        />

        {file ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onFileChange(null)
                if (inputRef.current) inputRef.current.value = ""
              }}
              className="ml-2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-border">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-foreground">
                Drop your file here or click to browse
              </span>
              <span className="text-xs text-muted-foreground">PDF files supported</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
