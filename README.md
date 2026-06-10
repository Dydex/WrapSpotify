# Wrap Spotify 🎧🔥

Wrap Spotify is a premium, secure, and beautiful client-side React Native / Expo companion application that wraps your Spotify listening habits into delightful, interactive dashboards. Explore your top tracks, artists, albums, and genre trends across different time frames (Short Term, Medium Term, and Long Term) without waiting for December!

---

## ✨ Key Features

*   **🔒 Secure OAuth Authentication**: Logs in directly via Spotify's official PKCE-based Web Auth Flow. No credentials or tokens are ever saved or transmitted to a third-party server.
*   **📱 Interactive Dashboard**: A unified overview showcasing your greeting, profile details, total songs/artists counts, and quick slides to your top content.
*   **🎨 Genre Donut Chart**: A beautifully scaled 160px custom SVG donut chart visualizer that maps out your top 13 computed genres. Accompanied by a 2-column wrapping grid legend mapping each genre's percentage, color, and emoji, completely fitting the screen without outer page scrolling.
*   **🎵 Top Tracks & Artists**: Fluid, modern lists featuring high-quality album artwork, popularity scores, and customized item layout profiles.
*   **💿 Derived Top Albums**: A custom analytics layer that groups and ranks your favorite albums based on the songs present in your top tracks list.
*   **🕶 Premium Dark Aesthetics**: Styled with a cohesive, state-of-the-art dark theme (`#0d1117`) utilizing smooth gradients, custom icons, and fluid layout transitions.
*   **🚀 Seamless Splash Experience**: Pre-configured dark background splash screens to guarantee no light flashes on boot, with a transparent logo assets copying script built directly into `metro.config.js`.

---

## 🛠 Project Structure

```text
WrapSpotify/
├── app/                  # Expo Router (File-Based Routing)
│   ├── (tabs)/           # Tab Bar Screens (index, artists, tracks, albums, genres, profile)
│   └── _layout.tsx       # Root Routing Layout & Spotify Context Injection
├── assets/               # Image & Font assets
│   └── images/           # App icons, splash screens, and favicons
├── components/           # Reusable UI components (Chart, Lists, HelloWave, Onboarding)
├── constants/            # Global theme styles and color palettes
├── contexts/             # React Context for Spotify Auth and Data sharing
├── hooks/                # Custom hooks (Auth state, Data fetching, Theme control)
├── app.json              # Expo Configuration
├── metro.config.js       # Metro Bundler config & automatic asset transcoder script
└── package.json          # Node dependencies and npm scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [Expo Go](https://expo.dev/go) app installed on your physical iOS or Android testing device.

### 2. Spotify Developer Setup
1.  Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2.  Log in and click **Create App**.
3.  Configure your app settings:
    *   **App Name**: `Wrap Spotify`
    *   **Redirect URIs**: Add the following redirect URIs:
        *   `exp://localhost:8081/--/redirect` *(for local web/emulator testing)*
        *   `exp://<YOUR_LOCAL_IP>:8081/--/redirect` *(for Expo Go on your physical phone)*
        *   `wrapspotify://redirect` *(required for standalone production builds)*
    *   **API Scopes**: The application requires:
        *   `user-top-read`
        *   `user-read-recently-played`
        *   `user-library-read`
4.  Copy your **Client ID**.

### 3. Environment Variables
Create a file named `.env` in the root of the project and add your Client ID:
```env
EXPO_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
```

### 4. Installation & Launch
Run the following commands in your terminal:

```bash
# 1. Install project dependencies
npm install

# 2. Automatically copy the transparent app logo assets
node metro.config.js

# 3. Start the Expo development server
npx expo start
```

Once the server is running:
*   Scan the QR code displayed in the terminal using the camera app (iOS) or the Expo Go app (Android) to open it on your physical device.
*   Press `w` to open the web version in your browser.
*   Press `a` for Android Emulator or `i` for iOS Simulator.

---

## 📦 Production Builds

This application is ready to be compiled into standalone production binaries (APK/AAB for Android, IPA for iOS) using **EAS Build**:

1.  Initialize EAS configuration:
    ```bash
    npm install -g eas-cli
    eas build:configure
    ```
2.  Run the build command:
    ```bash
    # Build Android APK
    eas build --platform android --profile preview

    # Build iOS App Store Package
    eas build --platform ios
    ```

> [!IMPORTANT]
> Make sure `wrapspotify://redirect` is successfully saved under your Spotify Developer Dashboard redirects settings before submitting production builds.
