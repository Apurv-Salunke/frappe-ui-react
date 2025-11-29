import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Dialog } from '../components/ui/dialog'
import { Badge } from '../components/ui/badge'
import { Card } from '../components/ui/card'
import { Divider } from '../components/ui/divider'
import { Avatar } from '../components/ui/avatar'
import { Checkbox } from '../components/ui/checkbox'
import { Switch } from '../components/ui/switch'
import { Textarea } from '../components/ui/textarea'
import { Progress } from '../components/ui/progress'
import { Alert } from '../components/ui/alert'
import { Select } from '../components/ui/select'
import { Popover } from '../components/ui/popover'
import { Tooltip } from '../components/ui/tooltip'
import { Spinner } from '../components/ui/spinner'
import { Password } from '../components/ui/password'
import { Dropdown } from '../components/ui/dropdown'
import { MultiSelect } from '../components/ui/multiselect'
import { FileUploader } from '../components/ui/file-uploader'
import { Autocomplete } from '../components/ui/autocomplete'
import { Combobox } from '../components/ui/combobox'

function App() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const [autocompleteValue, setAutocompleteValue] = useState<any>(null)
  const [autocompleteMultipleValue, setAutocompleteMultipleValue] = useState<any[]>([])
  const [comboboxValue, setComboboxValue] = useState<string | null>(null)
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([])

  const handleAutocompleteMultipleChange = (value: any) => {
    setAutocompleteMultipleValue(Array.isArray(value) ? value : [])
  }

  const autocompleteOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' },
  ]

  const comboboxOptions = [
    'Option 1',
    'Option 2',
    'Option 3',
    { label: 'Option with Icon', value: 'option-4', icon: 'star' },
    { label: 'Disabled Option', value: 'option-5', disabled: true },
  ]

  const multiSelectOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Purple', value: 'purple' },
  ]

  return (
    <div className="min-h-screen bg-surface-gray-1">
      {/* Header */}
      <div className="bg-surface-white border-b border-outline-gray-2 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-ink-gray-9">
              Frappe UI React - Component Showcase
            </h1>
            <p className="text-p-base text-ink-gray-7">
              React components ported from Vue with identical styling and functionality
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-ink-gray-9 mb-4">Components</h3>
                <nav className="space-y-2 text-sm">
                  <a href="#buttons" className="block text-ink-gray-7 hover:text-ink-gray-9">Buttons</a>
                  <a href="#inputs" className="block text-ink-gray-7 hover:text-ink-gray-9">Inputs</a>
                  <a href="#autocomplete" className="block text-ink-gray-7 hover:text-ink-gray-9">Autocomplete</a>
                  <a href="#combobox" className="block text-ink-gray-7 hover:text-ink-gray-9">Combobox</a>
                  <a href="#select" className="block text-ink-gray-7 hover:text-ink-gray-9">Select</a>
                  <a href="#multiselect" className="block text-ink-gray-7 hover:text-ink-gray-9">MultiSelect</a>
                  <a href="#dropdown" className="block text-ink-gray-7 hover:text-ink-gray-9">Dropdown</a>
                  <a href="#password" className="block text-ink-gray-7 hover:text-ink-gray-9">Password</a>
                  <a href="#file-uploader" className="block text-ink-gray-7 hover:text-ink-gray-9">File Uploader</a>
                  <a href="#checkboxes" className="block text-ink-gray-7 hover:text-ink-gray-9">Checkboxes</a>
                  <a href="#switches" className="block text-ink-gray-7 hover:text-ink-gray-9">Switches</a>
                  <a href="#textareas" className="block text-ink-gray-7 hover:text-ink-gray-9">Textareas</a>
                  <a href="#progress" className="block text-ink-gray-7 hover:text-ink-gray-9">Progress</a>
                  <a href="#alerts" className="block text-ink-gray-7 hover:text-ink-gray-9">Alerts</a>
                  <a href="#popovers" className="block text-ink-gray-7 hover:text-ink-gray-9">Popovers</a>
                  <a href="#tooltips" className="block text-ink-gray-7 hover:text-ink-gray-9">Tooltips</a>
                  <a href="#spinners" className="block text-ink-gray-7 hover:text-ink-gray-9">Spinners</a>
                  <a href="#badges" className="block text-ink-gray-7 hover:text-ink-gray-9">Badges</a>
                  <a href="#cards" className="block text-ink-gray-7 hover:text-ink-gray-9">Cards</a>
                  <a href="#avatars" className="block text-ink-gray-7 hover:text-ink-gray-9">Avatars</a>
                </nav>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">

        {/* Button Examples */}
        <section id="buttons" className="space-y-6 scroll-mt-24">
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
        <section id="inputs" className="space-y-6 scroll-mt-24">
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

        {/* Badge Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Badges</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Status indicators with multiple variants and themes
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Variants (Gray Theme)</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge theme="gray" variant="solid" size="md">Solid</Badge>
                <Badge theme="gray" variant="subtle" size="md">Subtle</Badge>
                <Badge theme="gray" variant="outline" size="md">Outline</Badge>
                <Badge theme="gray" variant="ghost" size="md">Ghost</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge theme="gray" variant="subtle" size="sm">Small</Badge>
                <Badge theme="gray" variant="subtle" size="md">Medium</Badge>
                <Badge theme="gray" variant="subtle" size="lg">Large</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">With Numbers</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge theme="gray" variant="subtle" size="md">5</Badge>
                <Badge theme="gray" variant="subtle" size="md">12</Badge>
                <Badge theme="gray" variant="subtle" size="md">99+</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Avatar Examples */}
        <section id="avatars" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Avatars</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              User profile images with fallback to initials
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Avatar label="JD" size="xs" />
                <Avatar label="JD" size="sm" />
                <Avatar label="JD" size="md" />
                <Avatar label="JD" size="lg" />
                <Avatar label="JD" size="xl" />
                <Avatar label="JD" size="2xl" />
                <Avatar label="JD" size="3xl" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Shapes</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Avatar label="JD" size="md" shape="circle" />
                <Avatar label="JD" size="md" shape="square" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">With Indicator</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Avatar 
                  label="JD" 
                  size="md" 
                  indicator={<div className="h-full w-full rounded-full bg-green-500" />}
                />
                <Avatar 
                  label="AB" 
                  size="lg" 
                  indicator={<div className="h-full w-full rounded-full bg-red-500" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Card Examples */}
        <section id="cards" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Cards</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Container components for grouping content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Basic Card"
              subtitle="This is a subtitle"
            >
              <p className="text-p-sm text-ink-gray-7">
                This is the card content. You can put any content here.
              </p>
            </Card>

            <Card
              title="Card with Actions"
              subtitle="Actions on the right"
              actions={
                <Button theme="gray" variant="ghost" size="sm">
                  Action
                </Button>
              }
            >
              <p className="text-p-sm text-ink-gray-7">
                This card has action buttons in the header.
              </p>
            </Card>

            <Card
              title="Loading Card"
              loading={true}
            />

            <Card
              title="Card with Badge"
              actionsLeft={
                <Badge theme="gray" variant="subtle" size="sm">New</Badge>
              }
            >
              <p className="text-p-sm text-ink-gray-7">
                Cards can have badges or other elements in the header.
              </p>
            </Card>
          </div>
        </section>

        {/* Divider Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Dividers</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Separators with optional action buttons
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Horizontal</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-p-sm text-ink-gray-7 mb-2">Above content</p>
                  <Divider />
                  <p className="text-p-sm text-ink-gray-7 mt-2">Below content</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">With Action</h3>
              <div className="space-y-4">
                <Divider
                  action={{
                    label: 'Show More',
                    handler: () => console.log('Show more clicked'),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* MultiSelect Examples */}
        <section id="multiselect" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">MultiSelect</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Multi-select dropdown with search
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Basic MultiSelect</label>
              <MultiSelect
                placeholder="Select colors..."
                options={multiSelectOptions}
                value={multiSelectValue}
                onChange={setMultiSelectValue}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Without Search</label>
              <MultiSelect
                placeholder="Select..."
                options={multiSelectOptions}
                hideSearch
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">With Loading</label>
              <MultiSelect
                placeholder="Loading..."
                options={multiSelectOptions}
                loading
              />
            </div>
          </div>
        </section>

        {/* Dropdown Examples */}
        <section id="dropdown" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Dropdown</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Dropdown menu with options and submenus
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <Dropdown
                button={{ label: 'Actions' }}
                options={[
                  { label: 'Edit', icon: 'edit', onClick: () => alert('Edit clicked') },
                  { label: 'Delete', icon: 'trash-2', theme: 'red', onClick: () => alert('Delete clicked') },
                  { label: 'Share', icon: 'share-2' },
                ]}
              />

              <Dropdown
                button={{ label: 'More Options' }}
                options={[
                  {
                    group: 'Actions',
                    items: [
                      { label: 'Copy', icon: 'copy' },
                      { label: 'Paste', icon: 'clipboard' },
                    ],
                  },
                  {
                    group: 'Settings',
                    items: [
                      { label: 'Preferences', icon: 'settings' },
                      { label: 'Help', icon: 'help-circle' },
                    ],
                  },
                ]}
              />

              <Dropdown
                options={[
                  { label: 'Toggle Setting', switch: true, switchValue: true },
                  { label: 'Another Setting', switch: true, switchValue: false },
                ]}
              >
                <Button>With Switches</Button>
              </Dropdown>
            </div>
          </div>
        </section>

        {/* Password Examples */}
        <section id="password" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Password</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Password input with show/hide toggle
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Basic Password</label>
              <Password placeholder="Enter password..." />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Sizes</label>
              <div className="space-y-2">
                <Password size="sm" placeholder="Small" />
                <Password size="md" placeholder="Medium" />
                <Password size="lg" placeholder="Large" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Variants</label>
              <div className="space-y-2">
                <Password variant="subtle" placeholder="Subtle" />
                <Password variant="outline" placeholder="Outline" />
              </div>
            </div>
          </div>
        </section>

        {/* FileUploader Examples */}
        <section id="file-uploader" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">File Uploader</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              File upload component with progress tracking
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Basic Upload</label>
              <FileUploader
                fileTypes="image/*"
                onSuccess={(data) => console.log('Upload success:', data)}
                onFailure={(error) => console.error('Upload failed:', error)}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Custom Button</label>
              <FileUploader fileTypes=".pdf,.doc,.docx">
                {({ openFileSelector, uploading, progress }) => (
                  <Button onClick={openFileSelector} loading={uploading}>
                    {uploading ? `Uploading ${progress}%` : 'Upload Document'}
                  </Button>
                )}
              </FileUploader>
            </div>
          </div>
        </section>

        {/* Checkbox Examples */}
        <section id="checkboxes" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Checkboxes</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Checkbox inputs with labels and padding options
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Basic Checkboxes</h3>
              <div className="space-y-3">
                <Checkbox label="Small checkbox" size="sm" />
                <Checkbox label="Medium checkbox" size="md" />
                <Checkbox label="Disabled checkbox" size="sm" disabled />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">With Padding</h3>
              <div className="space-y-3">
                <Checkbox label="Checkbox with padding" size="sm" padding />
                <Checkbox label="Medium with padding" size="md" padding />
              </div>
            </div>
          </div>
        </section>

        {/* Switch Examples */}
        <section id="switches" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Switches</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Toggle switches with labels and descriptions
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Basic Switches</h3>
              <div className="space-y-3">
                <Switch label="Small switch" size="sm" />
                <Switch label="Medium switch" size="md" />
                <Switch label="Disabled switch" size="sm" disabled />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">With Description</h3>
              <div className="space-y-3">
                <Switch
                  label="Enable notifications"
                  description="Receive email notifications for updates"
                  size="sm"
                />
                <Switch
                  label="Dark mode"
                  description="Switch to dark theme"
                  size="md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Textarea Examples */}
        <section id="textareas" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Textareas</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Multi-line text inputs with all variants
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Basic Textarea</label>
              <Textarea
                placeholder="Enter your message..."
                size="md"
                variant="subtle"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Sizes</label>
              <div className="space-y-2">
                <Textarea placeholder="Small" size="sm" variant="subtle" rows={2} />
                <Textarea placeholder="Medium" size="md" variant="subtle" rows={2} />
                <Textarea placeholder="Large" size="lg" variant="subtle" rows={2} />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Variants</label>
              <div className="space-y-2">
                <Textarea placeholder="Subtle" size="md" variant="subtle" rows={2} />
                <Textarea placeholder="Outline" size="md" variant="outline" rows={2} />
                <Textarea placeholder="Disabled" size="md" variant="subtle" rows={2} disabled />
              </div>
            </div>

            <div>
              <Textarea
                label="With Label"
                placeholder="Enter text..."
                size="md"
                variant="subtle"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Progress Examples */}
        <section id="progress" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Progress Bars</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Progress indicators with continuous and interval modes
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Continuous Progress</h3>
              <div className="space-y-4">
                <Progress value={25} size="sm" label="Loading..." hint />
                <Progress value={50} size="md" label="Processing" hint />
                <Progress value={75} size="lg" label="Almost done" hint />
                <Progress value={100} size="xl" label="Complete" hint />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Interval Progress</h3>
              <div className="space-y-4">
                <Progress value={33} size="sm" intervals intervalCount={6} />
                <Progress value={66} size="md" intervals intervalCount={6} />
                <Progress value={100} size="lg" intervals intervalCount={6} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Sizes</h3>
              <div className="space-y-4">
                <Progress value={50} size="sm" hint />
                <Progress value={50} size="md" hint />
                <Progress value={50} size="lg" hint />
                <Progress value={50} size="xl" hint />
              </div>
            </div>
          </div>
        </section>

        {/* Alert Examples */}
        <section id="alerts" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Alerts</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Alert notifications with themes and variants
            </p>
          </div>

          <div className="space-y-4 max-w-2xl">
            <Alert
              title="Info Alert"
              description="This is an informational alert message."
              theme="blue"
            />
            <Alert
              title="Success Alert"
              description="Operation completed successfully."
              theme="green"
            />
            <Alert
              title="Warning Alert"
              description="Please review this warning message."
              theme="yellow"
            />
            <Alert
              title="Error Alert"
              description="An error occurred. Please try again."
              theme="red"
            />
            <Alert
              title="Outline Alert"
              description="This alert uses the outline variant."
              variant="outline"
            />
            <Alert
              title="Non-dismissable Alert"
              description="This alert cannot be dismissed."
              theme="blue"
              dismissable={false}
            />
          </div>
        </section>

        {/* Autocomplete Examples */}
        <section id="autocomplete" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Autocomplete</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Searchable dropdown with single and multiple selection
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Single Selection</label>
              <Autocomplete
                placeholder="Search fruits..."
                options={autocompleteOptions}
                value={autocompleteValue}
                onChange={setAutocompleteValue}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Multiple Selection</label>
              <Autocomplete
                multiple
                placeholder="Select multiple fruits..."
                options={autocompleteOptions}
                value={autocompleteMultipleValue}
                onChange={handleAutocompleteMultipleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">With Groups</label>
              <Autocomplete
                placeholder="Search..."
                options={[
                  {
                    group: 'Fruits',
                    items: [
                      { label: 'Apple', value: 'apple' },
                      { label: 'Banana', value: 'banana' },
                    ],
                  },
                  {
                    group: 'Vegetables',
                    items: [
                      { label: 'Carrot', value: 'carrot' },
                      { label: 'Broccoli', value: 'broccoli' },
                    ],
                  },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">With Loading State</label>
              <Autocomplete
                placeholder="Search..."
                options={autocompleteOptions}
                loading
              />
            </div>
          </div>
        </section>

        {/* Combobox Examples */}
        <section id="combobox" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Combobox</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Searchable input with dropdown selection
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Basic Combobox</label>
              <Combobox
                placeholder="Type to search..."
                options={comboboxOptions}
                value={comboboxValue}
                onChange={setComboboxValue}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Variants</label>
              <div className="space-y-2">
                <Combobox
                  variant="subtle"
                  placeholder="Subtle variant"
                  options={comboboxOptions}
                />
                <Combobox
                  variant="outline"
                  placeholder="Outline variant"
                  options={comboboxOptions}
                />
                <Combobox
                  variant="ghost"
                  placeholder="Ghost variant"
                  options={comboboxOptions}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">With Groups</label>
              <Combobox
                placeholder="Search..."
                options={[
                  {
                    group: 'Group A',
                    options: ['Option A1', 'Option A2'],
                  },
                  {
                    group: 'Group B',
                    options: ['Option B1', 'Option B2'],
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Select Examples */}
        <section id="select" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Select</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Dropdown select components with various options
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Basic Select</label>
              <Select
                placeholder="Choose an option..."
                options={['Option 1', 'Option 2', 'Option 3']}
              />
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Sizes</label>
              <div className="space-y-2">
                <Select size="sm" placeholder="Small" options={['A', 'B', 'C']} />
                <Select size="md" placeholder="Medium" options={['A', 'B', 'C']} />
                <Select size="lg" placeholder="Large" options={['A', 'B', 'C']} />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">Variants</label>
              <div className="space-y-2">
                <Select variant="subtle" placeholder="Subtle" options={['A', 'B', 'C']} />
                <Select variant="outline" placeholder="Outline" options={['A', 'B', 'C']} />
                <Select variant="ghost" placeholder="Ghost" options={['A', 'B', 'C']} />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink-gray-7 mb-2">With Options Object</label>
              <Select
                placeholder="Select..."
                options={[
                  { label: 'First Option', value: '1' },
                  { label: 'Second Option', value: '2' },
                  { label: 'Disabled Option', value: '3', disabled: true },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Popover Examples */}
        <section id="popovers" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Popovers</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Floating popover components with click and hover triggers
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <Popover
                content={
                  <div className="rounded-lg border bg-surface-modal shadow-xl p-4">
                    <p className="text-sm text-ink-gray-9">This is a popover content</p>
                  </div>
                }
              >
                <Button>Click to Open Popover</Button>
              </Popover>

              <Popover
                trigger="hover"
                content={
                  <div className="rounded-lg border bg-surface-modal shadow-xl p-4">
                    <p className="text-sm text-ink-gray-9">Hover popover</p>
                  </div>
                }
              >
                <Button variant="outline">Hover to Open</Button>
              </Popover>
            </div>
          </div>
        </section>

        {/* Tooltip Examples */}
        <section id="tooltips" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Tooltips</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Tooltip components for additional information
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <Tooltip text="This is a tooltip">
                <Button>Hover for Tooltip</Button>
              </Tooltip>

              <Tooltip text="Tooltip on the right" placement="right">
                <Button variant="outline">Right Tooltip</Button>
              </Tooltip>

              <Tooltip text="Tooltip on the bottom" placement="bottom">
                <Button variant="subtle">Bottom Tooltip</Button>
              </Tooltip>

              <Tooltip text="Tooltip on the left" placement="left">
                <Button variant="ghost">Left Tooltip</Button>
              </Tooltip>
            </div>
          </div>
        </section>

        {/* Spinner Examples */}
        <section id="spinners" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold text-ink-gray-9 mb-2">Spinners</h2>
            <p className="text-p-sm text-ink-gray-6 mb-4">
              Loading spinner components
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">Sizes</h3>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-ink-gray-6">Small</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" />
                  <span className="text-sm text-ink-gray-6">Medium</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" />
                  <span className="text-sm text-ink-gray-6">Large</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-ink-gray-8 mb-3">In Buttons</h3>
              <div className="flex gap-4">
                <Button loading>Loading Button</Button>
                <Button variant="outline" loading>Loading</Button>
              </div>
            </div>
          </div>
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
      </div>
    </div>
  )
}

export default App

