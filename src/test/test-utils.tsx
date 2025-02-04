import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: ({ children }) => (
        <BrowserRouter>
          {children}
        </BrowserRouter>
      ),
    }),
  };
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render }; 