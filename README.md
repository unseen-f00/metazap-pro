# Image Metadata Remover

A free, privacy-focused web tool to strip EXIF, GPS, and hidden metadata from images — running entirely in your browser.

## Overview

The **Image Metadata Remover** is a clean, modern Next.js application built with Tailwind CSS. It allows users to upload JPEG, PNG, WebP, TIFF, GIF, and BMP images and instantly download cleaned versions with all hidden metadata removed.

- **100% Client-Side:** No images ever reach a server.
- **Format Preservation:** PNG stays PNG, JPEG stays JPEG.
- **Strict Validation:** Files over 20MB are rejected with clear messages.
- **SEO & AdSense Ready:** Full sitemap, Open Graph tags, legal pages, and educational content.

## Key Features

- Client-side EXIF stripping via `piexifjs` (JPEG) and binary chunk removal (PNG)
- 20MB per-file upload limit with descriptive error messages
- Direct single-file download (no ZIP required for singles)
- Clean drag-and-drop UI with progress indicators
- Responsive layout optimized for mobile and desktop
- SEO-optimized meta, Open Graph, and Twitter cards
- AdSense-required pages: Privacy Policy, Terms of Service, Contact

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React + Tailwind CSS v4
- **Fonts:** Geist (via `next/font/google`)
- **Processing:** `piexifjs`, FileReader, Canvas/Blob API
- **Build:** TypeScript, Turbopack

## Setup & Installation

```bash
# Clone the repository
git clone https://github.com/unseen-f00/image-metadata-remover.git
cd image-metadata-remover

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Author / Credits

Built with care by **[Ankit mishra]** — senior developer focused on clean, readable, production-grade code.

- GitHub: `https://github.com/ankit008-mishra`


## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

## Notes

This tool is designed for educational and privacy-protection purposes. Always verify that cleaned images meet your use-case needs before public sharing.
