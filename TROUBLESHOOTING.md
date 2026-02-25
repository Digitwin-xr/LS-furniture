# 🔍 Troubleshooting Blank Screen Issue

## Quick Diagnosis Steps

### Step 1: Check if Dev Server is Running
Open a terminal (Command Prompt recommended on Windows) and look for output like:
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
```

If you don't see this, the server isn't running. Start it with:
```cmd
cd "c:\Users\digit\LS Furniture APP\ls-lifestyle-web"
npm run dev
```

### Step 2: Check Browser Console
1. Open http://localhost:3000 in your browser
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Look for error messages (red text)

### Step 3: Common Blank Screen Causes

#### Cause A: JavaScript Build Error
**Symptoms:** Console shows errors like "SyntaxError" or "Unexpected token"
**Solution:** Check terminal for build errors

#### Cause B: Missing Dependencies
**Symptoms:** Console shows "Cannot find module" or "is not defined"
**Solution:** Run:
```cmd
npm install
```

#### Cause C: Port Conflict  
**Symptoms:** Server says port 3000 is in use
**Solution:** Either stop the other process or use a different port:
```cmd
npm run dev -- -p 3001
```

#### Cause D: Corrupted Build Cache
**Symptoms:** Page loads but nothing renders
**Solution:** Clear the cache:
```cmd
rmdir /s /q .next
npm run dev
```

### Step 4: Test with Simple Page

If the issue persists, let's create a minimal test page to isolate the problem.

Create `app/test/page.tsx`:
```tsx
export default function TestPage() {
  return <div>Hello World!</div>
}
```

Then visit: http://localhost:3000/test

- **If this works:** The issue is in the homepage components
- **If this doesn't work:** The issue is with Next.js setup or build process

## Most Likely Solution for Your Case

Based on Windows + PowerShell restrictions you encountered earlier:

### Option 1: Use Command Prompt
1. Close any PowerShell windows
2. Open **Command Prompt** (not PowerShell)
3. Run:
   ```cmd
   cd "c:\Users\digit\LS Furniture APP\ls-lifestyle-web"
   npm run dev
   ```
4. Wait for "Ready" message
5. Open http://localhost:3000

### Option 2: Check if Server is Already Running
You might have the server running in another terminal. Check all open terminals for Next.js output.

## What to Share for Further Help

If still experiencing issues, please provide:
1. **Terminal output** when you run `npm run dev`
2. **Browser console errors** (F12 → Console tab)
3. **Network tab status** (F12 → Network tab → reload page)
4. **What you see** (blank white screen? error page? loading forever?)

## Emergency: Start Fresh Build

If nothing works:
```cmd
cd "c:\Users\digit\LS Furniture APP\ls-lifestyle-web"
rmdir /s /q .next
rmdir /s /q node_modules
npm install
npm run dev
```

This will take a few minutes but should fix most issues.
