# Testing Guide

This document provides comprehensive information about testing in this project.

## Test Setup

The project uses:
- **Jest** as the test runner
- **React Testing Library** for component testing
- **@testing-library/user-event** for user interaction simulation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for a specific file
npm test -- Login.test.jsx
```

## Test Coverage

The project maintains a minimum coverage threshold of 70% for:
- Branches
- Functions
- Lines
- Statements

View coverage report:
```bash
npm run test:coverage
```

Coverage report is generated in `coverage/` directory.

## Writing Tests

### Component Tests

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  test('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const button = screen.getByRole('button', { name: /click/i });
    await user.click(button);
    
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### API Tests

```javascript
import * as api from './api';
import axios from 'axios';

jest.mock('axios');

describe('API functions', () => {
  test('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    axios.get.mockResolvedValue({ data: mockData });
    
    const result = await api.getData();
    expect(result.data).toEqual(mockData);
  });
});
```

### Testing Hooks

```javascript
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  test('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );
    
    expect(result.current).toBe('initial');
    
    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });
    
    expect(result.current).toBe('updated');
  });
});
```

## Best Practices

### 1. Test User Behavior, Not Implementation
```javascript
// ❌ Bad: Testing implementation
expect(component.state.count).toBe(1);

// ✅ Good: Testing user-visible behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### 2. Use Accessible Queries
```javascript
// ✅ Preferred order:
// 1. getByRole
// 2. getByLabelText
// 3. getByPlaceholderText
// 4. getByText
// 5. getByTestId (last resort)

const button = screen.getByRole('button', { name: /submit/i });
```

### 3. Mock External Dependencies
```javascript
// Mock API calls
jest.mock('../api/auth');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
global.localStorage = localStorageMock;
```

### 4. Clean Up After Tests
```javascript
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
```

### 5. Test Error Cases
```javascript
test('handles API errors', async () => {
  api.fetchData.mockRejectedValue(new Error('API Error'));
  
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Test File Structure

```
src/
├── __tests__/
│   ├── api/
│   │   ├── auth.test.js
│   │   └── books.test.js
│   ├── auth/
│   │   ├── Login.test.jsx
│   │   └── ProtectedRoute.test.jsx
│   ├── components/
│   │   ├── ErrorBoundary.test.jsx
│   │   └── Navbar.test.jsx
│   └── pages/
│       └── Books.test.jsx
```

## Common Testing Patterns

### Testing Forms
```javascript
test('submits form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  
  render(<Form onSubmit={onSubmit} />);
  
  await user.type(screen.getByLabelText(/username/i), 'testuser');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({
    username: 'testuser',
    password: 'password123',
  });
});
```

### Testing Async Operations
```javascript
test('loads and displays data', async () => {
  const mockData = [{ id: 1, name: 'Item 1' }];
  api.fetchItems.mockResolvedValue({ data: mockData });
  
  render(<ItemsList />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
  
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
```

### Testing Protected Routes
```javascript
test('redirects when not authenticated', () => {
  localStorage.getItem = jest.fn(() => null);
  
  render(
    <MemoryRouter>
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>
    </MemoryRouter>
  );
  
  expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
});
```

## Debugging Tests

### View Rendered Output
```javascript
import { screen, debug } from '@testing-library/react';

render(<MyComponent />);
debug(); // Prints the entire DOM
debug(screen.getByRole('button')); // Prints specific element
```

### Use `screen.logTestingPlaygroundURL()`
```javascript
render(<MyComponent />);
screen.logTestingPlaygroundURL(); // Get suggested queries
```

## Continuous Integration

Tests run automatically on:
- Every push to main/develop branches
- Every pull request
- Multiple Node.js versions (18.x, 20.x)

See `.github/workflows/ci.yml` for configuration.

## Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
