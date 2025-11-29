let idCounter = 0

/**
 * Generates a unique ID for form elements
 * Equivalent to Vue's useId composable
 */
export function useId(): string {
  return `frappe-ui-${++idCounter}`
}

