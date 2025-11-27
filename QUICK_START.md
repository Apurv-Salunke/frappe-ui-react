# Quick Start Guide

## Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

## Required Dependencies

The POC requires these packages (already in package.json):

```json
{
  "@radix-ui/react-dialog": "^1.0.5",
  "clsx": "^2.0.0",
  "feather-icons": "^4.28.0",
  "lucide-react": "^0.300.0",
  "tailwind-merge": "^2.0.0",
  "@tailwindcss/forms": "^0.5.3",
  "@tailwindcss/typography": "^0.5.16"
}
```

## Setup Tailwind

1. Import styles in your main file:
```tsx
import './styles/globals.css'
```

2. Configure Tailwind (already done in `tailwind.config.js`)

3. For production, replace the simplified config with the full preset:
```js
// In tailwind.config.js
module.exports = {
  presets: [
    require('frappe-ui/src/tailwind/preset') // From Vue version
  ],
  // ...
}
```

## Usage Examples

### Button

```tsx
import { Button } from './components/ui/button'

function App() {
  return (
    <Button 
      theme="blue" 
      variant="solid" 
      size="md"
      loading={isLoading}
      iconLeft="search"
    >
      Click me
    </Button>
  )
}
```

### Input

```tsx
import { Input } from './components/ui/input'
import { useState } from 'react'

function App() {
  const [value, setValue] = useState('')
  
  return (
    <Input
      value={value}
      onChange={setValue}
      size="md"
      variant="subtle"
      placeholder="Enter text..."
      prefix={<span>$</span>}
    />
  )
}
```

### Dialog

```tsx
import { Dialog } from './components/ui/dialog'
import { useState } from 'react'

function App() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Dialog</button>
      
      <Dialog
        open={open}
        onOpenChange={setOpen}
        options={{
          title: 'Confirm',
          message: 'Are you sure?',
          size: 'lg',
          icon: {
            name: 'alert-circle',
            appearance: 'warning'
          },
          actions: [
            {
              label: 'Cancel',
              variant: 'ghost',
              theme: 'gray'
            },
            {
              label: 'Confirm',
              variant: 'solid',
              theme: 'blue',
              onClick: async ({ close }) => {
                // Handle action
                close()
              }
            }
          ]
        }}
      />
    </>
  )
}
```

## Component Props

### Button Props

```tsx
interface ButtonProps {
  theme?: 'gray' | 'blue' | 'green' | 'red'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost'
  label?: string
  icon?: string | React.ComponentType
  iconLeft?: string | React.ComponentType
  iconRight?: string | React.ComponentType
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  // ... standard button props
}
```

### Input Props

```tsx
interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'subtle' | 'outline' | 'ghost'
  value?: string | number
  onChange?: (value: string) => void
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  debounce?: number
  // ... standard input props
}
```

### Dialog Props

```tsx
interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  options?: {
    title?: string
    message?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
    icon?: { name: string; appearance?: 'warning' | 'info' | 'danger' | 'success' }
    actions?: Array<DialogAction>
    position?: 'top' | 'center'
  }
  disableOutsideClickToClose?: boolean
}
```

## Styling

All components use Tailwind CSS classes that are **identical to the Vue version**.

### Customization

You can override styles using the `className` prop:

```tsx
<Button className="custom-class" theme="blue">
  Custom Button
</Button>
```

### Theme Colors

The components use Frappe UI's design tokens:
- `ink-*` - Text colors
- `surface-*` - Background colors
- `outline-*` - Border colors

These are defined in the Tailwind config and match the Vue version exactly.

## Next Steps

1. Review the ported components
2. Test visual consistency
3. Port additional components as needed
4. See `REACT_PORT_ANALYSIS.md` for full porting strategy

## Support

For questions or issues:
- See `COMPARISON.md` for Vue vs React comparisons
- See `POC_SUMMARY.md` for detailed analysis
- See `REACT_PORT_ANALYSIS.md` for full porting guide

