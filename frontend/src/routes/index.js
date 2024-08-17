import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Verify from '../pages/Verify';
import EventPage from '../pages/EventPage';
import EventCategoryPage from '../pages/EventCategory';
import Cart from '../pages/Cart';
import Search from '../pages/Search';
import Testimonials from '../pages/Testimonials';
import Favorite from '../pages/Favorite';
import Contact from '../pages/Contact';
import AdminPanel from '../pages/AdminPanel';
import Users from '../pages/admin/Users';
import Places from '../pages/admin/Places';
import Categories from '../pages/admin/Categories';
import Event from '../pages/admin/Events';
import Banners from '../pages/admin/Banners';
import Contacts from '../pages/admin/Contacts';
import AdminLogin from '../components/AdminLogin';
import PrivateRoute from '../components/PrivateRoute'; // Import the PrivateRoute component

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/verify',
        element: <Verify />
      },
      {
        path: '/events',
        element: <EventCategoryPage />
      },
      {
        path: '/event/:id',
        element: <EventPage />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/search',
        element: <Search />
      },
      {
        path: '/testimonials',
        element: <Testimonials />
      },
      {
        path: '/favorite',
        element: <Favorite />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/admin/login',
        element: <AdminLogin />
      },
      {
        path: '/admin',
        element: (
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        ),
        children: [
          {
            path: 'users',
            element: <Users />
          },
          {
            path: 'places',
            element: <Places />
          },
          {
            path: 'categories',
            element: <Categories />
          },
          {
            path: 'events',
            element: <Event />
          },
          {
            path: 'banners',
            element: <Banners />
          },
          {
            path: 'contacts',
            element: <Contacts />
          },
        ]
      },
    ]
  }
]);

export default router;
