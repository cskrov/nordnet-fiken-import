# Nordnet Fiken import

Hosted at [https://import.sourcecontrol.no](https://import.sourcecontrol.no).

1. Export CSV from Nordnet.
2. Upload Nordnet CSV-files.
3. Months without transactions are automatically filled in.
4. Generate preceeding months and change account numbers as needed.
5. Download automatically converted and validated Fiken CSV-files.
6. Import CSV in Fiken.

## Development

1. [Install Bun.](https://bun.sh)
2. Clone repository.
3. `bun install` - install dependencies.
4. `bun dev` - run locally.
5. [http://localhost:5173/](http://localhost:5173/) - open in browser.

### Commands

- `bun run lint --fix` - lint and fix code.
- `bun run typecheck` - typecheck code.
- `bun test` - run tests.
- `bun run build` - build for production.
