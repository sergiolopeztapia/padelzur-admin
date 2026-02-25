# Uso de Assets

## Cómo usar imágenes estáticas

### Colocar imágenes
Coloca tus imágenes en esta carpeta:
- `src/assets/logo.png`
- `src/assets/background.jpg`
- `src/assets/icons/user-avatar.svg`

### Importar en componentes

#### Opción 1: Import directo
```tsx
import logo from '@/assets/logo.png'

export function Header() {
  return <img src={logo} alt="Logo" />
}
```

#### Opción 2: URL pública
Coloca archivos en `public/` y referencialos directamente:
```tsx
<img src="/logo.png" alt="Logo" />
```

### Ejemplo completo
```tsx
import { useState } from 'react'
import logoImage from '@/assets/logo.png'
import backgroundImage from '@/assets/background.jpg'

export function LoginPage() {
  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }}>
      <img src={logoImage} alt="Company Logo" width={200} />
      <h1>Bienvenido</h1>
    </div>
  )
}
```

### Formatos soportados
- PNG (.png)
- JPG/JPEG (.jpg, .jpeg)
- SVG (.svg)
- GIF (.gif)
- WebP (.webp)
- AVIF (.avif)
