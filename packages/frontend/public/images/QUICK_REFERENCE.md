# Quick Image Reference

## 📁 Directory Structure

```
public/images/
├── landing/          → Landing page screenshots
│   ├── SS1.png      → Main dashboard (Hero section)
│   ├── SS2.png      → Analytics view
│   └── SS3.png      → Trade journal
│
└── auth/            → Login/Register page images
    └── (your auth images go here)
```

## 🚀 Quick Add Guide

### Landing Page Image
```tsx
// 1. Save image to: public/images/landing/my-image.png
// 2. Use in component:
import Image from 'next/image';

<Image
  src="/images/landing/my-image.png"
  alt="Description"
  width={1200}
  height={700}
  className="rounded-lg w-full h-auto"
/>
```

### Auth Page Image
```tsx
// 1. Save image to: public/images/auth/login-bg.png
// 2. Use in component:
import Image from 'next/image';

<Image
  src="/images/auth/login-bg.png"
  alt="Login background"
  width={800}
  height={600}
  className="rounded-lg"
/>
```

## 📏 Recommended Sizes

| Type | Dimensions | Location |
|------|------------|----------|
| Hero screenshot | 1200x700px | `/images/landing/` |
| Feature screenshot | 600x400px | `/images/landing/` |
| Auth background | 1920x1080px | `/images/auth/` |
| Logo (large) | 400x400px | `/images/auth/` |

## ✅ Current Setup

Landing page components already updated to use:
- ✓ `/images/landing/SS1.png` (Hero)
- ✓ `/images/landing/SS2.png` (Features)
- ✓ `/images/landing/SS3.png` (Features)

## 🎯 Next Steps for Auth Pages

1. Add your auth images to `public/images/auth/`
2. Suggested filenames:
   - `login-background.png`
   - `register-background.png`
   - `logo-large.png`
   - `verification-icon.png`
   - `success-illustration.png`

3. Update your auth components to use these images

## 💡 Tips

- Always use Next.js `<Image>` component (not `<img>`)
- Compress images before uploading (use TinyPNG)
- Use WebP format when possible
- Keep file sizes under 500KB
- Use descriptive alt text for accessibility
