import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import Login from './pages/login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>,
  }
]);
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
