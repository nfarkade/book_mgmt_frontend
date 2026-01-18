# Contributing Guide

Thank you for considering contributing to the Book Management Frontend project!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the development server: `npm start`

## Code Standards

### Linting and Formatting

- Run `npm run lint` to check for linting errors
- Run `npm run lint:fix` to automatically fix linting issues
- Run `npm run format` to format code with Prettier

### Testing

- Write tests for all new features and bug fixes
- Run `npm test` to execute tests
- Aim for at least 70% code coverage
- Run `npm run test:coverage` to see coverage report

### Commit Messages

Follow conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for test additions/changes
- `refactor:` for code refactoring
- `style:` for formatting changes
- `chore:` for maintenance tasks

Example: `feat: add user authentication`

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Update documentation if needed
6. Submit a pull request with a clear description

## Code Review

All pull requests require:
- ✅ All tests passing
- ✅ No linting errors
- ✅ Code coverage maintained or improved
- ✅ Documentation updated if needed
- ✅ At least one approval from maintainers
