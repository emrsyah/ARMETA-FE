# ARMETA - Panduan Onboarding untuk Programmer Pemula

Selamat datang di proyek ARMETA! Dokumen ini akan membantu programmer pemula memahami struktur proyek, sistem yang digunakan, dan cara berkontribusi dalam pengembangan aplikasi ini.

## 📋 Daftar Isi

- [Memulai](#-memulai)
- [Sistem Desain (Shadcn & Tailwind)](#-sistem-desain-shadcn--tailwind)
- [Sistem Routing](#-sistem-routing)
- [Konvensi Penamaan File](#-konvensi-penamaan-file)
- [Struktur Folder](#-struktur-folder)
- [Commitlint](#-commitlint)
- [Teknologi Utama](#-teknologi-utama)
- [Scripts yang Tersedia](#-scripts-yang-tersedia)

## 🚀 Memulai

### Persyaratan Sistem

- Node.js 18+
- pnpm sebagai package manager
- Git untuk version control

### Setup Proyek

```bash
# Clone repository
git clone <repository-url>
cd armeta

# Install dependencies
pnpm install

# Jalankan development server
pnpm dev

# Aplikasi akan berjalan di http://localhost:3000
```

### Build untuk Production

```bash
# Build aplikasi
pnpm build

# Preview production build
pnpm serve
```

## 🎨 Sistem Desain (Shadcn & Tailwind)

Proyek ini menggunakan kombinasi **Shadcn/ui** dan **Tailwind CSS v4** untuk sistem desain yang konsisten dan modern.

### Konfigurasi Shadcn

- **Style**: New York (dari shadcn/ui)
- **CSS Variables**: Ya, dengan dukungan dark mode
- **Icon Library**: Lucide React
- **Base Color**: Slate

Konfigurasi terdapat di `components.json`:

```json
{
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### Menggunakan Shadcn Components

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Menggunakan component dengan variants
<Button variant="default" size="sm">Klik Saya</Button>

// Menggunakan dengan custom className
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Judul Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Konten card di sini</p>
  </CardContent>
</Card>
```

### Tailwind CSS v4 Features

- **CSS Variables**: Semua warna menggunakan CSS custom properties
- **OKLCH Color Space**: Untuk warna yang lebih akurat
- **Dark Mode**: Didukung dengan class `.dark`
- **Custom Variants**: `@custom-variant dark (&:is(.dark *))`

### Tema Warna

Tema menggunakan OKLCH color space dengan dukungan light/dark mode. Variabel CSS didefinisikan di `src/styles.css`.

## 🛣️ Sistem Routing

Proyek menggunakan **TanStack Router** dengan file-based routing system.

### Struktur Route

Routes dikelola di folder `src/routes/` dengan pola file-based routing:

```
src/routes/
├── __root.tsx          # Root layout
├── index.tsx           # Route utama (/)
└── (app)/              # Route group untuk app
    ├── a.tsx           # Layout untuk /a/*
    ├── a.home.tsx      # Route /a/home
    ├── a.courses.tsx   # Route /a/courses
    ├── a.forum.tsx     # Route /a/forum
    └── a.arme.tsx      # Route /a/arme
```

### Membuat Route Baru

1. **Buat file route** di `src/routes/` dengan pola:
   - `nama-route.tsx` untuk route sederhana
   - `(group)/nama-route.tsx` untuk grouped routes
   - `__layout.tsx` untuk layout routes

2. **Contoh route file**:

```tsx
// src/routes/(app)/a.new-feature.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/a/new-feature')({
  component: NewFeaturePage,
})

function NewFeaturePage() {
  return (
    <div>
      <h1>Fitur Baru</h1>
      <p>Konten fitur baru di sini</p>
    </div>
  )
}
```

### Navigasi

```tsx
import { useNavigate, Link } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()

  // Programmatic navigation
  const handleClick = () => {
    navigate({ to: '/a/home' })
  }

  return (
    <div>
      {/* Declarative navigation */}
      <Link to="/a/home">Ke Beranda</Link>

      {/* Button navigation */}
      <button onClick={handleClick}>
        Navigasi ke Home
      </button>
    </div>
  )
}
```

### Layout Routes

Route dengan `<Outlet />` akan me-render child routes:

```tsx
// src/routes/(app)/a.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export const Route = createFileRoute('/(app)/a')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavigation />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet /> {/* Child routes akan di-render di sini */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

## 📝 Konvensi Penamaan File

### Route Files
- **Pola**: `prefix.nama-route.tsx`
- **Contoh**: `a.home.tsx`, `a.courses.tsx`, `(auth).login.tsx`
- **Keterangan**: Menggunakan titik sebagai separator, kebab-case

### Component Files
- **UI Components**: kebab-case (contoh: `app-sidebar.tsx`, `top-navigation.tsx`)
- **Hook Files**: camelCase dengan prefix `use` (contoh: `use-mobile.ts`)

### Folder Structure
- **Components**: `src/components/`
- **UI Components**: `src/components/ui/` (shadcn components)
- **Routes**: `src/routes/`
- **Hooks**: `src/hooks/`
- **Utilities**: `src/lib/`

## 📁 Struktur Folder

```
src/
├── components/          # Komponen aplikasi
│   ├── ui/             # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── sidebar.tsx
│   │   └── ...
│   ├── app-sidebar.tsx
│   ├── navigation.tsx
│   └── top-navigation.tsx
├── hooks/              # Custom hooks
│   └── use-mobile.ts
├── lib/                # Utilities & helpers
│   └── utils.ts
├── routes/             # File-based routes
│   ├── __root.tsx      # Root route
│   ├── index.tsx       # Home route
│   └── (app)/          # App route group
│       ├── a.tsx       # App layout
│       ├── a.home.tsx
│       ├── a.courses.tsx
│       ├── a.forum.tsx
│       └── a.arme.tsx
├── router.tsx          # Router configuration
├── routeTree.gen.ts    # Generated route tree
└── styles.css          # Global styles & Tailwind config
```

### Path Aliases

Konfigurasi alias di `tsconfig.json`:

```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"],
    "~/*": ["./public/*"]
  }
}
```

**Penggunaan**:
```tsx
import { Button } from "@/components/ui/button"    // src/components/ui/button
import logo from "~/logo.svg"                      // public/logo.svg
```

## 🔒 Commitlint

**Status**: Tidak dikonfigurasi dalam proyek ini

Commitlint biasanya digunakan untuk memastikan pesan commit mengikuti konvensi tertentu. Untuk menambahkan commitlint di masa depan:

```bash
# Install dependencies
pnpm add -D @commitlint/cli @commitlint/config-conventional husky

# Setup husky
pnpm exec husky init

# Create commitlint config
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# Add commit-msg hook
echo "pnpm exec commitlint --edit \$1" > .husky/commit-msg
```

### Conventional Commits

Jika commitlint dikonfigurasi, ikuti pola:
```
type(scope): description

# Contoh:
feat(auth): add login functionality
fix(ui): resolve button hover state
docs(readme): update installation guide
```

## 🛠️ Teknologi Utama

### Frontend Framework
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool dan dev server

### UI & Styling
- **Tailwind CSS v4**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React components
- **Lucide React**: Beautiful icon library
- **Radix UI**: Accessible UI primitives

### Routing & State
- **TanStack Router**: File-based routing untuk React
- **TanStack Devtools**: Development debugging tools

### Build & Development
- **Vite**: Fast development dan build tool
- **Vitest**: Unit testing framework
- **ESLint + TypeScript**: Code quality tools

### Package Management
- **pnpm**: Efficient package manager
- **TypeScript Paths**: Path aliases untuk clean imports

## 📜 Scripts yang Tersedia

```json
{
  "scripts": {
    "dev": "vite dev --port 3000",    // Development server
    "build": "vite build",            // Production build
    "serve": "vite preview",          // Preview production build
    "test": "vitest run"              // Run tests
  }
}
```

## 🎯 Best Practices

### 1. Component Structure
- Gunakan functional components dengan hooks
- Pisahkan logic ke custom hooks jika kompleks
- Export named exports, bukan default

### 2. Styling
- Prioritas Tailwind classes untuk styling
- Gunakan CSS variables untuk tema
- Ikuti design system dari shadcn/ui

### 3. File Organization
- Satu component per file
- Group related components dalam folder
- Export dari index.ts untuk clean imports

### 4. TypeScript
- Selalu gunakan type annotations
- Manfaatkan utility types dari React/TypeScript
- Import types dengan prefix `type`

### 5. Git Workflow
- Branch dari `main` untuk fitur baru
- Pull request untuk code review
- Squash commits sebelum merge

## 📚 Resources Tambahan

- [TanStack Router Docs](https://tanstack.com/router)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [React 19](https://react.dev)
- [TypeScript Handbook](https://typescriptlang.org)

## ❓ Troubleshooting

### Common Issues

1. **Import errors**: Pastikan path aliases dikonfigurasi dengan benar
2. **Component not found**: Periksa file naming conventions
3. **Styling issues**: Pastikan Tailwind classes ditulis dengan benar
4. **Route not working**: Periksa file path dan route configuration

### Development Tips

- Gunakan React DevTools untuk debugging components
- TanStack Router Devtools untuk debugging routing
- Browser developer tools untuk styling inspection
- VS Code extensions: TypeScript, Tailwind CSS IntelliSense

---

**Selamat berkoding!** 🚀 Jika ada pertanyaan, jangan ragu untuk bertanya kepada tim atau melihat dokumentasi resmi dari teknologi yang digunakan.
