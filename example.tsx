/**
 * Example usage of Frappe UI React components
 * This demonstrates how the ported components work
 */

import React, { useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Dialog } from './components/ui/dialog'

export function Example() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Frappe UI React - Proof of Concept</h1>

      {/* Button Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button theme="blue" variant="solid" size="md">
            Solid Blue
          </Button>
          <Button theme="gray" variant="subtle" size="md">
            Subtle Gray
          </Button>
          <Button theme="green" variant="outline" size="md">
            Outline Green
          </Button>
          <Button theme="red" variant="ghost" size="md">
            Ghost Red
          </Button>
          <Button 
            theme="blue" 
            variant="solid" 
            size="md"
            loading
            loadingText="Loading..."
          >
            Loading
          </Button>
          <Button 
            theme="blue" 
            variant="solid" 
            size="md"
            iconLeft="search"
          >
            With Icon
          </Button>
        </div>
      </section>

      {/* Input Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Inputs</h2>
        <div className="space-y-4 max-w-md">
          <Input
            placeholder="Enter text..."
            value={inputValue}
            onChange={setInputValue}
            size="md"
            variant="subtle"
          />
          <Input
            placeholder="With prefix"
            size="md"
            variant="outline"
            prefix={<span className="text-ink-gray-5">$</span>}
          />
          <Input
            placeholder="Disabled"
            size="md"
            variant="subtle"
            disabled
          />
        </div>
      </section>

      {/* Dialog Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dialog</h2>
        <Button
          theme="blue"
          variant="solid"
          onClick={() => setDialogOpen(true)}
        >
          Open Dialog
        </Button>

        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          options={{
            title: 'Confirm Action',
            message: 'Are you sure you want to proceed?',
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
                theme: 'blue',
                onClick: async ({ close }) => {
                  console.log('Confirmed!')
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  close()
                },
              },
            ],
          }}
        />
      </section>
    </div>
  )
}

