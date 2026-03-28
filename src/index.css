@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=League+Spartan:wght@400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 160 70% 14%;
    --foreground: 0 0% 100%;
    --card: 0 0% 100%;
    --card-foreground: 160 70% 14%;
    --popover: 0 0% 100%;
    --popover-foreground: 160 70% 14%;
    --primary: 73 100% 59%;
    --primary-foreground: 160 70% 14%;
    --secondary: 160 30% 20%;
    --secondary-foreground: 0 0% 100%;
    --muted: 160 30% 20%;
    --muted-foreground: 0 0% 72%;
    --accent: 73 100% 59%;
    --accent-foreground: 160 70% 14%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 100% / 0.12;
    --input: 0 0% 100% / 0.12;
    --ring: 73 100% 59%;
    --radius: 1.75rem;
    
    /* Custom HKTR Colors */
    --hktr-green: #0B3D2E;
    --hktr-green-light: #145A42;
    --hktr-lime: #CFFF2E;
    --hktr-white: #FFFFFF;
    --hktr-offwhite: #F6F7F6;
    --hktr-text-secondary: rgba(255,255,255,0.72);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--hktr-green);
    color: var(--hktr-white);
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'League Spartan', sans-serif;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 0.92;
  }
}

@layer components {
  .section-pinned {
    @apply relative w-screen h-screen overflow-hidden;
  }
  
  .section-flowing {
    @apply relative w-full;
  }
  
  .bg-pitch-overlay {
    position: relative;
  }
  
  .bg-pitch-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(11, 61, 46, 0.55);
    z-index: 1;
  }
  
  .bg-pitch-overlay > * {
    position: relative;
    z-index: 2;
  }
  
  .card-white {
    @apply bg-white rounded-[28px] shadow-[0_18px_60px_rgba(0,0,0,0.28)];
  }
  
  .text-accent {
    color: var(--hktr-lime);
  }
  
  .bg-accent {
    background-color: var(--hktr-lime);
  }
  
  .btn-primary {
    @apply px-8 py-4 bg-accent text-[#0B3D2E] font-bold rounded-full 
           transition-all duration-300 hover:scale-105 hover:shadow-lg;
  }
  
  .btn-outline {
    @apply px-8 py-4 border-2 border-[#CFFF2E] text-[#CFFF2E] font-bold rounded-full 
           transition-all duration-300 hover:bg-[#CFFF2E] hover:text-[#0B3D2E];
  }
  
  .grain-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.04;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .animation-paused {
    animation-play-state: paused;
  }
}
