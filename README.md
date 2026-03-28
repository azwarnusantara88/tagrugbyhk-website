# HKTR Tag Asia Cup 2026 Website

Official fixture website for Hong Kong Tag Rugby's first ITF-sanctioned tournament.

## 🌐 Live Website

**URL:** https://tagrugbyhk.org

## 🏆 Tournament Details

- **Event:** Tag Asia Cup 2026
- **Location:** J-Green Sakai, Osaka, Japan
- **Dates:** April 11-12, 2026
- **Teams:** 16
- **Matches:** 29
- **Divisions:** 4 (Open, Women's, U18, U16)

## 🛠 Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- GSAP (animations)
- shadcn/ui components

## 📁 Project Structure

```
├── .github/workflows/    # GitHub Actions deployment
├── public/               # Static assets (images, logos)
├── src/
│   ├── sections/         # Page sections
│   ├── components/ui/    # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript types
├── dist/                 # Build output (auto-generated)
└── vite.config.ts        # Vite configuration
```

## 🚀 Deployment

This website is automatically deployed to GitHub Pages on every push to the `main` branch.

### Manual Deployment

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The dist folder will be deployed automatically via GitHub Actions
```

## 📊 Google Sheets Integration

The fixtures section can sync with Google Sheets for live updates.

### Setup Instructions

1. Create a Google Sheet with columns: `time`, `team1`, `team2`, `pool`, `venue`, `status`, `score`
2. Publish the sheet to web
3. Create a Google Apps Script web app
4. Update the `refreshFixtures` function in `src/sections/FixturesSection.tsx`

## 📝 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

- **Primary Color:** `#0B3D2E` (Deep Pitch Green)
- **Accent Color:** `#CFFF2E` (Neon Lime)
- **Background:** `#F6F7F6` (Off-white)
- **Typography:** League Spartan (headings), Inter (body)

## 📧 Contact

- **Email:** hktr@tagrugbyhk.org
- **Website:** https://tagrugbyhk.org

---

© 2026 Hong Kong Tag Rugby. All rights reserved.
