import { useMemo } from 'react'
import DOMPurify from 'dompurify'

export interface ErrorMessageProps {
  message?: string | Error
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const errorMessage = useMemo(() => {
    if (!message) return ''
    if (message instanceof Error) {
      // Handle Error objects - check for messages property or use message property
      const errorWithMessages = message as any
      return errorWithMessages.messages || message.message
    }
    return String(message)
  }, [message])

  if (!message) return null

  const sanitizedMessage = DOMPurify.sanitize(errorMessage, {
    ALLOWED_TAGS: ['a', 'em', 'strong', 'i', 'b', 'u', 'br', 'p'],
  })

  return (
    <div
      className="whitespace-pre-line text-sm text-ink-red-4"
      role="alert"
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  )
}

