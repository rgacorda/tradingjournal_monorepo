# Image Directory Guide

## Directory Structure

Your images are now organized in the following structure:

```
public/
├── images/
│   ├── landing/              # Landing page images
│   │   ├── SS1.png          # Main dashboard screenshot (1200x700px)
│   │   ├── SS2.png          # Analytics screenshot (600x400px)
│   │   └── SS3.png          # Trade journal screenshot (600x400px)
│   │
│   └── auth/                # Authentication pages images
│       └── (place your auth images here)
│
└── assets/                  # Legacy directory (can be removed after migration)
    └── (old screenshots)
```

## How to Add New Images

### For Landing Page

1. **Save your image** to the appropriate directory:
   ```
   public/images/landing/your-image.png
   ```

2. **Use in your component** (example):
   ```tsx
   import Image from 'next/image';

   <Image
     src="/images/landing/your-image.png"
     alt="Descriptive alt text"
     width={1200}
     height={700}
     className="rounded-lg w-full h-auto"
   />
   ```

### For Authentication Pages (Login/Register/etc.)

1. **Save your image** to:
   ```
   public/images/auth/your-auth-image.png
   ```

2. **Suggested auth images**:
   - `login-background.png` - Background image for login page
   - `register-background.png` - Background image for register page
   - `auth-hero.png` - Hero image for auth pages
   - `logo-large.png` - Large logo for auth pages
   - `verification-success.png` - Success illustration

3. **Use in your auth component** (example):
   ```tsx
   import Image from 'next/image';

   <Image
     src="/images/auth/login-background.png"
     alt="Login background"
     width={800}
     height={600}
     className="rounded-lg"
   />
   ```

## Current Images in Use

### Landing Page Components

| Component | Image Path | Dimensions | Purpose |
|-----------|------------|------------|---------|
| Hero.tsx | `/images/landing/SS1.png` | 1200x700 | Main dashboard screenshot |
| Features.tsx | `/images/landing/SS2.png` | 600x400 | Analytics view |
| Features.tsx | `/images/landing/SS3.png` | 600x400 | Trade journal view |

### Authentication Pages (Not yet configured)

You can add images for:
- Login page
- Register page
- Forgot password page
- Email verification page

## Image Optimization Best Practices

1. **Format**:
   - Use WebP for better compression (Next.js auto-converts)
   - PNG for images with transparency
   - JPG for photos without transparency

2. **Dimensions**:
   - Hero images: 1200x700px or larger
   - Feature screenshots: 600x400px or larger
   - Icons/logos: SVG preferred
   - Background images: 1920x1080px for full-screen

3. **File Size**:
   - Compress images before uploading
   - Tools: TinyPNG, ImageOptim, Squoosh
   - Target: < 500KB per image

4. **Naming Convention**:
   - Use kebab-case: `dashboard-analytics.png`
   - Be descriptive: `trade-journal-mobile-view.png`
   - Avoid spaces and special characters

## Example: Adding a New Landing Page Section

Let's say you want to add a "Testimonials" section with customer photos:

1. **Create subdirectory** (optional):
   ```bash
   mkdir public/images/landing/testimonials
   ```

2. **Add images**:
   ```
   public/images/landing/testimonials/customer-1.jpg
   public/images/landing/testimonials/customer-2.jpg
   ```

3. **Use in component**:
   ```tsx
   <Image
     src="/images/landing/testimonials/customer-1.jpg"
     alt="John Doe - Professional Trader"
     width={100}
     height={100}
     className="rounded-full"
   />
   ```

## Next.js Image Component Benefits

Using the Next.js `<Image>` component provides:
- Automatic image optimization
- Lazy loading
- Responsive images
- WebP conversion (when supported)
- Prevention of layout shift

Always use `<Image>` instead of `<img>` for better performance!

## Cleanup

Once you've verified all images work correctly, you can remove the old directory:
```bash
# After testing, remove the old assets directory
rm -rf public/assets
```

## Need Help?

- [Next.js Image Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Image Optimization Tools](https://tinypng.com/)
