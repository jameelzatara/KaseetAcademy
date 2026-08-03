/// <reference types="vite/client" />

// Extension-less asset: presenter cover uploaded without file extension

// Image asset modules
declare module '*.png' { const src: string; export default src; }
declare module '*.jpg' { const src: string; export default src; }
declare module '*.JPG' { const src: string; export default src; }
declare module '*.jpeg' { const src: string; export default src; }
declare module '*.JPEG' { const src: string; export default src; }
declare module '*.webp' { const src: string; export default src; }
declare module '*.svg' { const src: string; export default src; }
declare module '*.gif' { const src: string; export default src; }
