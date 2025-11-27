# Diagnostics - Why Components Don't Look the Same

## Issues Fixed

### 1. ✅ Missing Full Tailwind Preset
**Problem**: The POC was using a simplified Tailwind config with hardcoded colors instead of the full preset.

**Fix**: Copied the full preset from `src/tailwind/` to `react-poc/tailwind-preset/` and updated `tailwind.config.js` to use it.

### 2. ✅ Missing CSS Variables
**Problem**: Components use CSS variables like `border-[--surface-gray-2]` which require the CSS variables to be defined by the preset.

**Fix**: The full preset includes `generateCSSVariables()` which creates all the CSS variables.

### 3. ✅ Content Paths
**Problem**: Tailwind wasn't scanning `src/**/*` files.

**Fix**: Updated content paths to include:
- `./index.html`
- `./src/**/*.{js,ts,jsx,tsx}`
- `./components/**/*.{js,ts,jsx,tsx}`

## How to Verify the Fix

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for any CSS/Tailwind errors
   - Check if CSS variables are defined in `:root`

2. **Inspect Elements**
   - Right-click a button → Inspect
   - Check computed styles
   - Verify colors match Vue version

3. **Check CSS Variables**
   ```javascript
   // In browser console
   getComputedStyle(document.documentElement).getPropertyValue('--surface-gray-2')
   // Should return a color value
   ```

4. **Compare Side-by-Side**
   - Open Vue version (Histoire)
   - Open React version (http://localhost:5173)
   - Compare same components

## Common Issues

### Colors Still Don't Match?

1. **Check if CSS variables are loaded:**
   ```css
   /* In browser DevTools, check :root styles */
   --surface-gray-2: #F3F3F3;
   ```

2. **Check if Tailwind classes are applied:**
   - Inspect element
   - Look for classes like `bg-surface-gray-2`
   - Should have computed background color

3. **Check if preset is loaded:**
   - Look for Tailwind errors in console
   - Check if `tailwind-preset/` files exist

### Styles Not Loading?

1. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache:**
   - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

3. **Check PostCSS:**
   - Verify `postcss.config.js` exists
   - Check if Tailwind is processing CSS

### CSS Variables Not Working?

The components use syntax like `border-[--surface-gray-2]` which Tailwind should handle, but if it doesn't:

1. Check Tailwind version (should be 3.3+)
2. Verify CSS variables are in `:root`
3. Check browser DevTools for actual computed values

## Next Steps

If components still don't look the same:

1. **Check specific differences:**
   - Which component?
   - What's different? (color, spacing, size)
   - Take screenshots for comparison

2. **Check computed styles:**
   - Compare Vue vs React in DevTools
   - Look at actual CSS values, not just classes

3. **Verify Tailwind is processing:**
   - Check if classes are in the generated CSS
   - Look for `bg-surface-gray-2` in the CSS output

## Files Changed

- ✅ `tailwind.config.js` - Now uses full preset
- ✅ `tailwind-preset/` - Copied from Vue version
- ✅ Content paths updated
- ✅ Server restarted

The components should now look identical! 🎉

