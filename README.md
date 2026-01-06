# App Chat

Modern React Native chat app scaffold with mock API + realtime simulator. Built with TypeScript, React Navigation, Zustand, React Query, Axios, and React Native Paper.

## ✨ Features
- Auth flow with session restore (AsyncStorage)
- Conversations list with search, pull-to-refresh, skeleton loading
- Chat detail with bubble UI, optimistic send, infinite scroll
- Mock WebSocket for typing + online status
- Light/Dark theme toggle
- Mock API layer with latency + random errors

## ✅ Tech Stack
- React Native + TypeScript
- Navigation: @react-navigation/native (stack + bottom tabs)
- State: Zustand
- Data fetching: @tanstack/react-query
- HTTP: axios (with interceptors)
- Forms: react-hook-form
- UI: react-native-paper (light/dark theme)

## 📁 Project Structure
```
src/
  app/                # navigation + theme
  screens/            # Login, Chats, ChatDetail, Settings
  components/         # reusable UI blocks
  services/
    api/              # axios client + endpoints
    mock/             # seed data + mock server
    realtime/         # mock socket
  store/              # zustand stores
  hooks/              # react-query hooks
  utils/              # date, id, debounce helpers
  types/              # TypeScript models + navigation types
```

## 🚀 Getting Started

### 1. Install dependencies
```
npm install
```

### 2. Start Metro
```
npm start
```

### 3. Run on device/simulator
```
npm run ios
npm run android
```

## 🧪 Mock API
The mock server runs in-app (no backend). It simulates:
- Network delay (300–800ms)
- Random failures (≈7%)

Endpoints:
- `POST /auth/login`
- `GET /me`
- `GET /conversations?page=&limit=`
- `GET /conversations/:id/messages?before=&limit=`
- `POST /conversations/:id/messages`
- `POST /conversations/:id/read`

To swap with a real API, replace the `adapter` in `src/services/api/client.ts` with a real baseURL.

## 🧩 Architecture Notes
- **Zustand** handles auth session + theme.
- **React Query** manages caching and pagination.
- **MockSocket** in `services/realtime` simulates typing and online state.
- UI is built with **React Native Paper** and follows consistent spacing/typography.

## ✅ Lint & Format
```
npm run lint
npm run format
```
