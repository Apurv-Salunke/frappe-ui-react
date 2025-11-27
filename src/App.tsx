import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Dialog } from '../components/ui/dialog'

function App() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-surface-gray-1 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-ink-gray-9">
            Frappe UI React - Proof of Concept
          </h1>
          <p className="text-p-base text-ink-gray-7">
            Compare these React components with the Vue version to verify visual consistency
          </p>
        </div>

        {/* Button Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Buttons</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              All variants, themes, and sizes - identical Tailwind classes as Vue version
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Variants (Gray Theme)</h3>
              <div className="flex flex-wrap gap-4">
                <Button theme="gray" variant="solid" size="md" className="min-w-[120px]">
                  Solid
                </Button>
                <Button theme="gray" variant="subtle" size="md" className="min-w-[120px]">
                  Subtle
                </Button>
                <Button theme="gray" variant="outline" size="md" className="min-w-[120px]">
                  Outline
                </Button>
                <Button theme="gray" variant="ghost" size="md" className="min-w-[120px]">
                  Ghost
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Sizes (Gray Solid)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button theme="gray" variant="solid" size="sm" className="min-w-[120px]">
                  Small
                </Button>
                <Button theme="gray" variant="solid" size="md" className="min-w-[120px]">
                  Medium
                </Button>
                <Button theme="gray" variant="solid" size="lg" className="min-w-[120px]">
                  Large
                </Button>
                <Button theme="gray" variant="solid" size="xl" className="min-w-[120px]">
                  Extra Large
                </Button>
                <Button theme="gray" variant="solid" size="2xl" className="min-w-[120px]">
                  2XL
                </Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button 
                  theme="gray" 
                  variant="solid" 
                  size="md"
                  className="min-w-[120px]"
                  loading={loading}
                  loadingText="Loading..."
                  onClick={() => {
                    setLoading(true)
                    setTimeout(() => setLoading(false), 2000)
                  }}
                >
                  {loading ? 'Loading...' : 'Click to Load'}
                </Button>
                <Button theme="gray" variant="solid" size="md" className="min-w-[120px]" disabled>
                  Disabled Solid
                </Button>
                <Button 
                  theme="gray" 
                  variant="solid" 
                  size="md"
                  className="min-w-[120px]"
                  iconLeft="search"
                >
                  With Icon
                </Button>
                <Button 
                  theme="gray" 
                  variant="solid" 
                  size="md"
                  className="min-w-[120px]"
                  icon="check"
                >
                  Icon Only
                </Button>
              </div>
            </div>

            {/* Disabled Variants */}
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Disabled Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button theme="gray" variant="solid" size="md" className="min-w-[120px]" disabled>
                  Disabled Solid
                </Button>
                <Button theme="gray" variant="subtle" size="md" className="min-w-[120px]" disabled>
                  Disabled Subtle
                </Button>
                <Button theme="gray" variant="outline" size="md" className="min-w-[120px]" disabled>
                  Disabled Outline
                </Button>
                <Button theme="gray" variant="ghost" size="md" className="min-w-[120px]" disabled>
                  Disabled Ghost
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Inputs</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              All sizes and variants with prefix/suffix support
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Basic Input</label>
              <Input
                placeholder="Enter text..."
                value={inputValue}
                onChange={setInputValue}
                size="md"
                variant="subtle"
              />
              <p className="text-xs text-ink-gray-5 mt-1">Value: {inputValue || '(empty)'}</p>
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">With Prefix</label>
              <Input
                placeholder="0.00"
                size="md"
                variant="outline"
                prefix={<span className="text-ink-gray-5">$</span>}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">With Suffix</label>
              <Input
                placeholder="Enter email"
                type="email"
                size="md"
                variant="subtle"
                suffix={<span className="text-ink-gray-5">@</span>}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Sizes</label>
              <div className="space-y-2">
                <Input placeholder="Small" size="sm" variant="subtle" />
                <Input placeholder="Medium" size="md" variant="subtle" />
                <Input placeholder="Large" size="lg" variant="subtle" />
                <Input placeholder="Extra Large" size="xl" variant="subtle" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Variants</label>
              <div className="space-y-2">
                <Input placeholder="Subtle" size="md" variant="subtle" />
                <Input placeholder="Outline" size="md" variant="outline" />
                <Input placeholder="Ghost" size="md" variant="ghost" />
                <Input placeholder="Disabled" size="md" variant="subtle" disabled />
              </div>
            </div>
          </div>
        </section>

        {/* Dialog Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Dialogs</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Full dialog system with actions, icons, and sizes
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              theme="gray"
              variant="solid"
              size="md"
              className="min-w-[120px]"
              onClick={() => setDialogOpen(true)}
            >
              Open Dialog
            </Button>
          </div>

          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            options={{
              title: 'Confirm Action',
              message: 'Are you sure you want to proceed with this action? This cannot be undone.',
              size: 'lg',
              icon: {
                name: 'alert-circle',
                appearance: 'warning',
              },
              actions: [
                {
                  label: 'Cancel',
                  variant: 'ghost',
                  theme: 'gray',
                },
                {
                  label: 'Confirm',
                  variant: 'solid',
                  theme: 'gray',
                  onClick: async (context) => {
                    console.log('Confirmed!')
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    context.close()
                  },
                } as const,
              ],
            }}
          />
        </section>

        {/* Comparison Note */}
        <section className="mt-12 p-6 bg-surface-gray-2 rounded-lg border border-outline-gray-2">
          <h3 className="text-lg font-semibold text-ink-gray-9 mb-2">
            Visual Consistency Check
          </h3>
          <p className="text-p-sm text-ink-gray-7">
            These React components use <strong>identical Tailwind CSS classes</strong> as the Vue version.
            Compare them side-by-side with the Vue components to verify they look exactly the same.
            All styling, spacing, colors, and animations are preserved.
          </p>
        </section>
      </div>
    </div>
  )
}

export default App

