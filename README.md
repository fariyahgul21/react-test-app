# React Starter Template

Baseline template we use for building React applications.
**Stack:** Vite · React 19 · React Router · Context API (auth) · Fetch API wrapper · Tailwind CSS · Lucide icons · Recharts · Socket.IO client (optional)

It runs **without a backend** (mock mode) so you can see it working immediately.

---

## Run it locally

**Requirements:** Node.js 18.18+ (Node 20 or 22 LTS recommended). Check with `node -v`.

```bash
# 1. Unzip and enter the folder
cd react-starter

# 2. Install dependencies (first time only)
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173**. You'll see the home page.
Click **Log in**, enter any email and password, and you'll land on the protected dashboard.

### Other commands

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start dev server with hot reload                |
| `npm run build`   | Production build into `dist/`                   |
| `npm run preview` | Serve the production build locally to test it   |

---

## Project structure

```
react-starter/
├── index.html              # The single HTML page. React mounts into <div id="root">
├── public/                 # Static files served as-is (favicon, robots.txt). Referenced as /file.ext
├── src/
│   ├── main.jsx            # Entry point: renders <App /> into index.html
│   ├── App.jsx             # Providers (Auth) + Router. Keep it thin
│   ├── index.css           # Tailwind import + design tokens (brand colors, font)
│   │
│   ├── api/                # ALL backend calls live here
│   │   ├── client.js       #   Fetch wrapper: base URL, auth header, token refresh, errors
│   │   ├── auth.api.js     #   One file per resource (auth, users, orders...)
│   │   └── dashboard.api.js
│   ├── assets/             # Images, SVGs, fonts imported from code (bundled + hashed)
│   ├── components/         # Reusable UI pieces (Button, Input, Navbar, StatCard)
│   ├── context/            # Global state via React Context (AuthContext)
│   ├── hooks/              # Custom hooks (useAuth, useFetch)
│   ├── layouts/            # Page shells (PublicLayout, DashboardLayout with sidebar)
│   ├── pages/              # One component per route/screen (Home, Login, Dashboard, NotFound)
│   ├── routes/             # Route table (AppRoutes) + ProtectedRoute guard
│   ├── services/           # Non-HTTP integrations (socket.js for Socket.IO)
│   └── utils/              # Constants, env config and pure helper functions
│
├── .env.example            # Copy to .env to configure API URL etc.
├── vite.config.js          # Vite + React + Tailwind plugins, "@" alias -> src/
└── jsconfig.json           # Editor support for the "@" import alias
```

### Where do HTML, JS and assets go?

- **HTML:** There is only one HTML file, `index.html`. Pages are React components in `src/pages/`, not separate HTML files. Routing is handled in the browser by React Router.
- **JS / JSX:** Everything is in `src/`. Components use `.jsx`; plain logic (api, utils, hooks) uses `.js`.
- **Assets imported in code** (logos, icons, images used in components) → `src/assets/`, then `import logo from '@/assets/logo.svg'`. Vite optimizes and fingerprints them.
- **Static assets that must keep their exact URL** (favicon, robots.txt, downloadable files) → `public/`, referenced as `/favicon.svg`.
- **Styles:** Tailwind utility classes directly in JSX. Global styles and theme tokens only in `src/index.css`.

---

## Conventions

1. **No `fetch()` in components.** Components call functions from `src/api/*.api.js`, which use `api` from `client.js`.
2. **Imports use the `@` alias:** `import Button from '@/components/Button'` instead of `../../components/Button`.
3. **Naming:** components and pages in `PascalCase.jsx`; hooks start with `use`; api files are `resource.api.js`.
4. **Adding a page:** create `src/pages/MyPage.jsx` → register it in `src/routes/AppRoutes.jsx` (inside `ProtectedRoute` if it needs login).
5. **Auth:** read the user anywhere with `const { user, login, logout } = useAuth()`. Restrict by role with `<ProtectedRoute roles={['admin']} />`.
6. **Config:** environment values go in `.env` with the `VITE_` prefix and are read in `src/utils/constants.js`. Never put secrets in frontend env files.

---

## Connecting a real backend

1. `cp .env.example .env`
2. Set `VITE_API_URL=http://localhost:5000/api` (your backend URL). Mock mode turns off automatically.
3. Backend endpoints expected by the template (rename as needed in `src/api/`):
   - `POST /auth/login` → `{ accessToken, user }`
   - `GET  /auth/me` → `{ user }`
   - `POST /auth/refresh` → `{ accessToken }` (refresh token sent as HTTP-only cookie)
   - `POST /auth/logout`
4. Delete the `USE_MOCK` branches in `src/api/*.api.js` once your API is ready.
5. Optional real-time: set `VITE_SOCKET_URL` and use `getSocket()` from `src/services/socket.js`.
