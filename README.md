# Opening Hours Admin Tool (Angular + TypeScript)

A runnable Angular app for configuring business opening hours.

## Features

- Typed schedule model (`Weekday`, `OpeningHoursSlot`, `OpeningHoursSchedule`).
- Signal-backed `OpeningHoursService` with sensible defaults.
- Standalone admin component with reactive forms:
  - edit timezone and effective date,
  - enable/disable each day,
  - add/remove multiple opening slots per day,
  - preview JSON payload before saving.

## Run locally

```bash
npm install
npm start
```

Then open: `http://localhost:4200/admin/opening-hours`

## Build

```bash
npm run build
```

Build output is written to `dist/opening-hours-admin-tool`.

## Project files

- `src/app/opening-hours-admin/opening-hours.model.ts`
- `src/app/opening-hours-admin/opening-hours.service.ts`
- `src/app/opening-hours-admin/opening-hours-admin.component.ts`
- `src/app/opening-hours-admin/opening-hours-admin.component.html`
- `src/app/opening-hours-admin/opening-hours-admin.component.scss`
- `src/main.ts`
- `angular.json`
- `package.json`
