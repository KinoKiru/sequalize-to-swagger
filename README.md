# @kinokiru/sequalize-to-swagger

Generate Swagger docs from Sequelize models.

## Installation

```bash
npm install @kinokiru/sequalize-to-swagger
```

## Semantic Versioning

This project uses [Semantic Versioning](https://semver.org/) and automated releases based on [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

Use the following commit message format to automatically trigger version bumps:

- `feat: description` - Creates a new **minor** version (e.g., 1.0.0 → 1.1.0)
- `fix: description` - Creates a new **patch** version (e.g., 1.0.0 → 1.0.1)
- `perf: description` - Creates a new **patch** version
- `docs: description` - Creates a new **patch** version
- Any commit with `BREAKING CHANGE:` in the footer - Creates a new **major** version (e.g., 1.0.0 → 2.0.0)

Commits without a conventional prefix (e.g., `chore:`, `ci:`, `test:`) will not trigger a release.

### Release Process

1. Make changes and commit using conventional commit format
2. Push to the `main` branch
3. The Semantic Release workflow automatically:
   - Analyzes commits since the last release
   - Determines the next version number
   - Updates `package.json` and `CHANGELOG.md`
   - Creates a GitHub release and git tag
   - Triggers the publish workflow to push to npm

### Manual Releases

You can also manually create releases via the GitHub UI:
1. Go to Releases → Draft a new release
2. Create a new tag with format `vX.Y.Z` (e.g., `v1.0.1`)
3. The publish workflow will automatically update the package version and publish to npm

## Development

### Prerequisites

- Node.js >= 20.0.0 (use the version specified in `.nvmrc`)
- pnpm 10.17.1 (specified in `package.json`)

We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions:

```bash
# Install the correct Node.js version
nvm install
nvm use
```

### Setup

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Run tests
pnpm test
```

## License

ISC
