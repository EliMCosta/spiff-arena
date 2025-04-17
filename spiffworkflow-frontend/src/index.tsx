import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';

import './index.scss';
import './index.css';
import reportWebVitals from './reportWebVitals';

// @ts-expect-error TS(2345) FIXME: Argument of type 'HTMLElement | null' is not assig... Remove this comment to see the full error message
const root = ReactDOMClient.createRoot(document.getElementById('root'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Creates an instance of the MUI theme that can be fed to the top-level ThemeProvider.
 * Nested ThemeProviders can be used to override specific components.
 * This override implements a tooltip that fits the overall app theme.
 */
const defaultTheme = createTheme();
const overrideTheme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          '&::before': {
            color: '#F5F5F5',
            border: '1px solid grey',
          },
        },
        tooltip: {
          fontSize: '.8em',
          color: 'black',
          backgroundColor: '#F5F5F5',
          padding: '5px',
          border: '1px solid  grey',
        },
      },
    },
  },
});

const doRender = () => {
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={defaultTheme}>
          <ThemeProvider theme={overrideTheme}>
            <App />
          </ThemeProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </React.StrictMode>,
  );
};

doRender();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// @ts-expect-error TS(2554) FIXME: Expected 1 arguments, but got 0.
reportWebVitals();
