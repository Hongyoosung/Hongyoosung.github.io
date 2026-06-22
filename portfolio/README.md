# Portfolio site

This GitHub Pages site is built with Vite and React. The deployment workflow in
`../.github/workflows/hugo.yaml` runs `npm run build` in this directory and publishes
`dist/`; the root-level Hugo configuration is not used by the deployed portfolio.

## Editing project details

Project detail copy lives in `content/projects` as localized Markdown files:

- `projectN.en.md`
- `projectN.ko.md`

The application parses GitHub Flavored Markdown with `marked`, so headings, emphasis,
lists, fenced code blocks, and Markdown tables render automatically. Raw HTML may be
used for layout-only structures such as media grids, `<figure>`, and `<img>`.

Run `npm run dev` for local editing or `npm run build` to verify the production output.
Pushing to `main` triggers the existing GitHub Pages workflow.
