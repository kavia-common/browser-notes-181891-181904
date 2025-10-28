import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar title', () => {
  render(<App />);
  const title = screen.getByText(/Browser Notes/i);
  expect(title).toBeInTheDocument();
});
