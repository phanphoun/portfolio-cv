# Active Context: Portfolio CV

## Current State

This project is a customized Next.js resume and portfolio site for Phoun Phan.
The latest maintenance pass focused on making the default template behavior safer and more accurate without adding external services.

## Recent Changes

- Reworked the contact flow to hand off to the visitor's email app instead of falsely claiming server-side delivery
- Added server-side normalization and validation for contact form payloads
- Guarded optional profile fields so missing phone or website values do not render as undefined
- Updated print and text resume exports to build contact lines conditionally and use ASCII-safe separators
- Updated the PDF helper endpoint to derive its base URL from the incoming request when NEXT_PUBLIC_BASE_URL is unset
- Removed placeholder project links so visitors do not leave the site for demo/template destinations

## Known Considerations

- Project thumbnails still use placeholder gradients until real images are added under public/projects
- A real email delivery provider is still required if you want fully in-app contact submission instead of mailto handoff
- Local lint and typecheck could not run in this session because eslint and tsc executables were not available in the workspace

## Next Customization Areas

- Replace sample portfolio entries in src/data/projects.ts with real projects and real links
- Add project images under public/projects if you want visual thumbnails
- Install dependencies and run lint, typecheck, and build after the next environment setup step

## Session History

| Date | Activity |
|------|----------|
| 2026-03-04 | Stabilized contact and export behavior and removed placeholder external project links |
| 2026-01-22 | Memory bank updated to match .kilocode standard structure |
