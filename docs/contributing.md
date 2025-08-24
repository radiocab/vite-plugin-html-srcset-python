# Contributing Guide

Thank you for your interest in contributing to vite-plugin-html-srcset! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher

### Installation

1. Fork and clone the repository
```bash
git clone https://github.com/your-username/vite-plugin-html-srcset.git
cd vite-plugin-html-srcset
```

2. Install dependencies
```bash
pnpm install
```

3. Build the plugin
```bash
pnpm run build
```

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage

# Run tests with UI
pnpm run test:ui
```

### Testing Examples

```bash
# Run basic example
pnpm run example:basic

# Run advanced example
pnpm run example:advanced

# Run playground
pnpm run playground
```

### Building

```bash
# Build the plugin
pnpm run build

# Build in watch mode
pnpm run dev
```

## Project Structure

```
├── src/                    # Plugin source code
│   ├── plugin.ts          # Main plugin logic
│   ├── image-processor.ts # Image processing utilities
│   ├── types.ts           # TypeScript type definitions
│   └── index.ts           # Main export
├── test/                  # Test files
│   ├── plugin.test.ts     # Plugin tests
│   ├── image-processor.test.ts
│   ├── types.test.ts
│   └── integration.test.ts
├── playground/            # Interactive playground
├── examples/              # Usage examples
│   ├── basic/            # Basic example
│   └── advanced/         # Advanced example
├── docs/                 # Documentation
└── dist/                 # Built plugin
```

## Code Style

We use ESLint and Prettier for code formatting. The configuration is included in the project.

### TypeScript

- Use strict TypeScript
- Provide proper type definitions
- Export types for public APIs

### Testing

- Write tests for new features
- Maintain high test coverage (>80%)
- Use descriptive test names
- Mock external dependencies

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Write code following the existing patterns
- Add tests for new functionality
- Update documentation if needed

3. **Test your changes**
```bash
pnpm run test:coverage
pnpm run build
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add new feature"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for test additions/changes
- `refactor:` for code refactoring

5. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

### PR Requirements

- All tests must pass
- Code coverage must be maintained
- Documentation must be updated
- Examples must work correctly

## Testing Guidelines

### Unit Tests

- Test individual functions and methods
- Mock external dependencies
- Cover edge cases and error conditions

### Integration Tests

- Test the plugin in real Vite builds
- Test with various image formats
- Test HTML transformation

### Coverage Requirements

Maintain at least 80% coverage for:
- Lines
- Functions
- Branches
- Statements

## Documentation

### Code Documentation

- Use JSDoc comments for public APIs
- Document complex algorithms
- Provide usage examples

### README Updates

Update the README when:
- Adding new features
- Changing configuration options
- Adding new examples

## Release Process

Releases are handled by maintainers:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release tag
4. Publish to npm

## Getting Help

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

## Code of Conduct

Be respectful and inclusive. We want this to be a welcoming project for all contributors.

Thank you for contributing! 🎉