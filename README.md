# tds-landingpage

Marketing landing page for Tracht Digital Solutions. Astro 5 +
React islands + Tailwind v4. Deploys to **netcup Webhosting 8000**
as static HTML at `tracht-digital.de`.

## Local dev

```bash
npm install         # NPM_TOKEN must be in env (read:packages on
                    # @tracht-digital-solutions GitHub Packages)
npm run dev         # http://localhost:4321
npm run build       # outputs to dist/
npm run preview     # serve dist/
npm run type-check  # astro check
```

## Deploy

Push to `main`. GitHub Actions:

1. `npm ci` (uses `NPM_TOKEN` to fetch `@tracht-digital-solutions/tds-shared`)
2. `npm run type-check`
3. `npm run build` → static `dist/`
4. Drops `.deploy-complete` marker into `dist/`
5. SFTP-uploads contents of `dist/` to `~/sites/tracht-digital.de/releases/<TS>/`
6. Hits `install.php?action=install-static&target=tracht-digital.de&release=<TS>`

## Required GitHub secrets / vars

- `secrets.NETCUP_FTP_HOST` / `NETCUP_FTP_USER` / `NETCUP_FTP_PASSWORD`
- `secrets.INSTALL_TOKEN`
- `vars.INSTALLER_URL`
- (CI uses `secrets.GITHUB_TOKEN` for the package registry, no separate
  PAT needed)

## Pages

| Path | Source | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | Single-page scroll layout (9 sections) |
| `/preise` | `src/pages/preise.astro` (TODO) | Pricing |
| `/legal/impressum` | TODO | Legal notice |
| `/legal/datenschutz` | TODO | Privacy policy |

See `AGENTS.md` for the porting checklist.
