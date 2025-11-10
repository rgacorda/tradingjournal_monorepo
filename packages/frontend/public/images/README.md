# Images Directory Structure

This directory contains all images used throughout the application.

## Directory Structure

```
public/images/
├── landing/          # Landing page images
│   ├── SS1.png      # Main dashboard screenshot (hero section)
│   ├── SS2.png      # Analytics screenshot
│   └── SS3.png      # Trade journal screenshot
│
└── auth/            # Authentication pages images
    ├── login-bg.png      # Login page background (optional)
    ├── register-bg.png   # Register page background (optional)
    └── logo-large.png    # Large logo for auth pages (optional)
```

## Usage Guidelines

### Landing Page Images (`/images/landing/`)
- **SS1.png**: Main dashboard screenshot displayed in the hero section
  - Recommended size: 1200x700px or higher
  - Format: PNG for quality, or WebP for better performance

- **SS2.png**: Analytics view screenshot
  - Recommended size: 600x400px or higher
  - Shows detailed analytics features

- **SS3.png**: Trade journal screenshot
  - Recommended size: 600x400px or higher
  - Shows journal and note-taking features

### Authentication Images (`/images/auth/`)
- Place background images, logos, or hero images for:
  - Login page
  - Register page
  - Forgot password page
  - Email verification page

## Image Optimization Tips

1. **Format**: Use WebP format when possible for better compression
2. **Size**: Optimize images before uploading (use tools like TinyPNG)
3. **Dimensions**: Use appropriate dimensions for each use case
4. **Alt Text**: Always provide descriptive alt text in components

## Adding New Images

1. Place images in the appropriate subdirectory
2. Use descriptive filenames (kebab-case): `dashboard-analytics.png`
3. Update components to reference the new image path
4. Add entry to this README for documentation

## Current Image Paths in Code

### Landing Page
- Hero: `/images/landing/SS1.png`
- Features Section: `/images/landing/SS2.png`, `/images/landing/SS3.png`

### Authentication Pages
- To be configured as needed
