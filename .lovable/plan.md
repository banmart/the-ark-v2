

## Fix: Early Unlock Warning Dialog Mobile Overflow

**Problem**: The `AlertDialogContent` uses `fixed` positioning with `top-[50%] translate-y-[-50%]` centering. On mobile, when content is tall, it overflows the viewport with no scroll capability.

**Solution**: Update `EarlyUnlockWarningDialog.tsx` to make the dialog full-screen on mobile with internal scrolling:

### Changes to `src/components/locker/EarlyUnlockWarningDialog.tsx`

Update the `AlertDialogContent` className (line 52) to:
- Add `max-h-[100dvh] sm:max-h-[85vh]` to cap height
- Add `overflow-y-auto` for scrollable content
- Add `h-full sm:h-auto` and `rounded-none sm:rounded-lg` for full-screen mobile
- Add `inset-0 sm:inset-auto` with overrides for the centering transforms on mobile

Specifically, replace the content wrapper class to use mobile-first full-screen approach:

```
className="max-w-md mx-auto bg-white text-gray-900 
  fixed inset-0 sm:inset-auto 
  sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]
  overflow-y-auto 
  rounded-none sm:rounded-lg"
```

This requires a small tweak to the `AlertDialogContent` in the alert-dialog UI primitive **or** overriding classes directly on the dialog instance. Since modifying the shared primitive affects all dialogs, the cleaner approach is to override on the instance in `EarlyUnlockWarningDialog.tsx` line 52:

- Override to: `"fixed inset-0 z-50 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:max-w-md sm:translate-x-[-50%] sm:translate-y-[-50%] w-full h-full sm:h-auto sm:max-h-[85vh] overflow-y-auto bg-white text-gray-900 p-6 shadow-lg border rounded-none sm:rounded-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"`

This ensures:
- **Mobile**: Dialog fills entire screen (`inset-0`, `h-full`, `rounded-none`) with `overflow-y-auto` for scrolling
- **Desktop (sm+)**: Centered modal with max-width and max-height, rounded corners

### File: `src/components/locker/EarlyUnlockWarningDialog.tsx` (1 change)

