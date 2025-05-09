import { defineAbility } from '@casl/ability';

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AbilityContext } from './contexts/Can';
import APIErrorProvider from './contexts/APIErrorContext';
import ContainerForExtensions from './ContainerForExtensions';
import PublicRoutes from './views/PublicRoutes';

const queryClient = new QueryClient();

export default function App() {
  const ability = defineAbility(() => {});
  const routeComponents = () => {
    return [
      { path: 'public/*', element: <PublicRoutes /> },
      {
        path: '*',
        element: <ContainerForExtensions />,
      },
    ];
  };

  /**
   * Note that QueryClientProvider is React Query, now branded under the Tanstack packages.
   * https://tanstack.com/query/latest
   */
  const layout = () => {
    return (
      <div className="cds--white">
        <QueryClientProvider client={queryClient}>
          <APIErrorProvider>
            <AbilityContext.Provider value={ability}>
              <Outlet />
            </AbilityContext.Provider>
          </APIErrorProvider>
        </QueryClientProvider>
      </div>
    );
  };
  const router = createBrowserRouter([
    {
      path: '*',
      Component: layout,
      children: routeComponents(),
    },
  ]);
  return <RouterProvider router={router} />;
}
