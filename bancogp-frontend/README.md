# BancoGP · Frontend

Interfaz web del sistema de gestión bancaria BancoGP, construida con React 19 + Vite.

## Ejecutar

```bash
pnpm install
pnpm dev
```

La app queda disponible en `http://localhost:5035`. Las URLs de los microservicios se configuran en `.env`.

## Sistema de diseño

La interfaz sigue la filosofía de diseño de Emil Kowalski: neutra, sobria y con detalles que no se notan pero se sienten.

| Principio | Cómo se aplica |
| --- | --- |
| Curvas propias | `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` en lugar de las curvas por defecto de CSS |
| Animaciones cortas | Interacciones < 300 ms; modales y cajones son la excepción |
| Botones que responden | `scale(0.97)` al presionar |
| Nada aparece desde la nada | Entradas desde `scale(0.96)` + opacidad, nunca `scale(0)` |
| Navegación sin animación | La barra lateral se usa decenas de veces al día, así que no se anima |
| Hover solo con puntero fino | `@media (hover: hover) and (pointer: fine)` |
| Movimiento reducido | `prefers-reduced-motion` conserva opacidad y elimina desplazamientos |
| Números estables | `font-variant-numeric: tabular-nums` en montos y métricas |

### Estructura

```
src/
├─ features/            # Componentes propios de cada módulo
├─ pages/               # Una página por ruta (carga diferida)
├─ shared/
│  ├─ components/ui/    # Button, Input, Select, Card, DataTable, Modal, Tabs, StatCard…
│  ├─ components/layout # Sidebar, Topbar, MobileNav, DashboardLayout
│  ├─ hooks/            # useTheme
│  └─ utils/            # format.js (moneda, fechas), cn.js (helpers)
├─ store/               # AuthProvider y ThemeProvider
└─ styles/
   ├─ tokens.css        # Colores, radios, sombras, curvas (claro y oscuro)
   ├─ base.css          # Reset y tipografía
   ├─ animations.css    # Keyframes compartidos
   └─ components/       # Un archivo por componente
```

### Librerías

- [Sonner](https://sonner.emilkowal.ski/) para notificaciones.
- [Motion](https://motion.dev/) para el modal, el cajón móvil, las pestañas y los contadores.
- `NumberTicker` y `DotPattern` adaptados de [Magic UI](https://magicui.design/) (MIT).
- Tipografía [Geist](https://vercel.com/font).

### Tema

El tema claro/oscuro sigue al sistema por defecto y se puede cambiar con el botón de la barra superior; la preferencia se guarda en `localStorage`.
