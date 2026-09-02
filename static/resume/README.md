# Resume files

Place the two PDFs here with exactly these names:

- `yoosung-hong-resume-en.pdf` — served to visitors on the English site
- `yoosung-hong-resume-ko.pdf` — served to visitors on the Korean site (`/ko/...`)

The header Resume button links to `/resume/<file>` and this folder is copied
into `portfolio/dist/resume/` at build time (see `staticAssetDirs` in
`portfolio/vite.config.js`). Filenames are configured in
`portfolio/src/data/navigation.js` (`resumeFiles`).
