import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from '@store/store';
import 'react-toastify/dist/ReactToastify.css';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function AppProviders({ children }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
        <ToastContainer
          autoClose={3000}
          newestOnTop
          pauseOnFocusLoss={false}
          position="top-right"
          theme="light"
          toastStyle={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
          }}
        />
      </QueryClientProvider>
    </Provider>
  );
}

export default AppProviders;
