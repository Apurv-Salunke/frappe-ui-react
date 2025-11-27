# How to Run the POC

## Quick Start

1. **Install dependencies:**
   ```bash
   cd react-poc
   npm install
   # or
   yarn install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**
   The server will start on `http://localhost:5173` (or another port if 5173 is busy)

## What You'll See

The app will display:

1. **Buttons Section**
   - All variants (solid, subtle, outline, ghost)
   - All themes (gray, blue, green, red)
   - All sizes (sm, md, lg, xl, 2xl)
   - Loading states, disabled states, icons

2. **Inputs Section**
   - All sizes and variants
   - Prefix/suffix examples
   - Disabled state

3. **Dialogs Section**
   - Full dialog with actions
   - Icons and messages
   - Different sizes

## Comparing with Vue Version

To compare with the Vue version:

1. **Run Vue version** (in the main project):
   ```bash
   cd ..  # Go back to main frappe-ui directory
   yarn story:dev  # Run Histoire (component docs)
   ```

2. **Run React version** (in react-poc):
   ```bash
   cd react-poc
   npm run dev
   ```

3. **Compare side-by-side:**
   - Open both in different browser windows
   - Compare the same components
   - Verify they look identical

## Troubleshooting

### Port already in use
If port 5173 is busy, Vite will automatically use the next available port. Check the terminal output.

### Missing dependencies
If you see import errors:
```bash
npm install
# or
yarn install
```

### TypeScript errors
The components are fully typed. If you see TypeScript errors, make sure all dependencies are installed.

### Tailwind not working
Make sure:
1. `postcss.config.js` exists
2. `tailwind.config.js` exists
3. `styles/globals.css` is imported in `src/main.tsx`

## Build for Production

To build the app:
```bash
npm run build
# or
yarn build
```

To preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Next Steps

Once you've verified the components look the same:

1. Review the code in `components/ui/`
2. Check `COMPARISON.md` for Vue vs React code comparisons
3. See `REACT_PORT_ANALYSIS.md` for full porting strategy
4. Port additional components as needed

