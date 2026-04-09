import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './App.css';
import { routeTree } from './routeTree.gen';
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'

// Create the router
const router = createRouter({ routeTree });

// Register for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
      </ReduxProvider>
    </StrictMode>
  );
}