<p align="left">
  <img src="https://raw.githubusercontent.com/arroznatwitch/TLSPlugin/main/assets/logotipo_tls.jpg" width="120" alt="TLS Logo">
</p>

# The Last Survivor - Website

Official website for *The Last Survivor*, built in React. Leaderboard, streams and event info. Deployed via Cloudflare Pages.

Website: [playthelastsurvivor.com](https://playthelastsurvivor.com)

## Stack

React 18, Parcel, ESLint

## Running locally

```bash
git clone https://github.com/arroznatwitch/TLSWebsite.git
cd TLSWebsite
npm install
npm run dev
```

Runs on `localhost:1234`.

Production build:
```bash
npm run build
```
Outputs to `dist/`.

`npm run lint` for eslint, `npm run clean` to wipe cache and build.

## Notes

- `seasons.json` holds everything that changes between seasons (players, teams, casters)
- translations all live in `useLang.jsx`

---

<a href="https://ko-fi.com/playtls" target="_blank">
  <img src="https://storage.ko-fi.com/cdn/brandasset/kofi_button_blue.png" height="55" alt="Support on Ko-fi">
</a>
