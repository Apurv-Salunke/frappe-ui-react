import React, { useRef, useState, useCallback } from 'react'
import { Button } from './button'

export interface FileUploaderProps {
  fileTypes?: string | string[]
  uploadArgs?: Record<string, any>
  validateFile?: (file: File) => Promise<string | null> | string | null
  onSuccess?: (data: any) => void
  onFailure?: (error: any) => void
  children?: (props: {
    file: File | null
    uploading: boolean
    progress: number
    uploaded: number
    message: string
    error: string | null
    total: number
    success: boolean
    openFileSelector: () => void
  }) => React.ReactNode
}

export function FileUploader({
  fileTypes,
  uploadArgs,
  validateFile,
  onSuccess,
  onFailure,
  children,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [message] = useState('')
  const [total, setTotal] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [finishedUploading, setFinishedUploading] = useState(false)

  const progress = Math.floor((uploaded / total) * 100) || 0
  const success = finishedUploading && !error

  const openFileSelector = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleFileAdd = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const selectedFile = e.target.files?.[0]
      if (!selectedFile) return

      setFile(selectedFile)

      if (validateFile) {
        try {
          const validationMessage = await validateFile(selectedFile)
          if (validationMessage) {
            setError(validationMessage)
            return
          }
        } catch (err) {
          setError(String(err))
          return
        }
      }

      await uploadFile(selectedFile)
    },
    [validateFile]
  )

  const uploadFile = useCallback(
    async (fileToUpload: File) => {
      setError(null)
      setUploaded(0)
      setTotal(0)
      setFinishedUploading(false)

      // Create a simple XMLHttpRequest-based upload handler
      const xhr = new XMLHttpRequest()
      const formData = new FormData()

      // Add file
      formData.append('file', fileToUpload)

      // Add upload args if provided
      if (uploadArgs) {
        Object.entries(uploadArgs).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
      }

      setUploading(true)

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setUploaded(e.loaded)
          setTotal(e.total)
        }
      })

      xhr.addEventListener('load', () => {
        setUploading(false)
        setFinishedUploading(true)
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            onSuccess?.(data)
          } catch {
            onSuccess?.(xhr.responseText)
          }
        } else {
          setError('Error Uploading File')
          onFailure?.(new Error('Upload failed'))
        }
      })

      xhr.addEventListener('error', () => {
        setUploading(false)
        setError('Error Uploading File')
        onFailure?.(new Error('Network error'))
      })

      xhr.addEventListener('abort', () => {
        setUploading(false)
        setError('Upload cancelled')
      })

      // For now, we'll use a generic endpoint
      // In a real implementation, you'd configure this properly
      const uploadUrl = uploadArgs?.url || '/api/method/upload_file'
      xhr.open('POST', uploadUrl)
      xhr.send(formData)
    },
    [uploadArgs, onSuccess, onFailure]
  )

  const acceptValue = Array.isArray(fileTypes)
    ? fileTypes.join(',')
    : fileTypes

  const defaultChildren = (
    <Button onClick={openFileSelector} loading={uploading}>
      {uploading ? `Uploading ${progress}%` : 'Upload File'}
    </Button>
  )

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={acceptValue}
        className="hidden"
        onChange={handleFileAdd}
      />
      {children
        ? children({
            file,
            uploading,
            progress,
            uploaded,
            message,
            error,
            total,
            success,
            openFileSelector,
          })
        : defaultChildren}
    </div>
  )
}

