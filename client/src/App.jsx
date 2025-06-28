import HomePage from './Pages/HomePage/HomePage';
import NotFoundPafge from './Pages/NotFoundPage/NotFoundPafge';
import Logout from './Pages/LogoutPage/LogoutPage';
import Login from './Pages/LoginPage/LoginPage';
import Collection from './Pages/CollectionPage/CollectionPage';
import Register from './Pages/RegisterPage.jsx/RegisterPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import EmailContinue from './Pages/EmailContinue/EmailContinue';
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <HomePage/> , errorElement: <NotFoundPafge/> },
  { path: '/login', element: <Login/>, errorElement:<NotFoundPafge/> },
  { path: '/collections', element: <Collection/>, errorElement:<NotFoundPafge/> },
  { path: '/register', element: <Register/>, errorElement:<NotFoundPafge/> },
  { path: '/loginemail', element: <EmailContinue/>, errorElement:<NotFoundPafge/> },
  { path: '/logout', element: <Logout/>, errorElement: <NotFoundPafge/> },
  { path: '/profile', element: <ProfilePage/>, errorElement: <NotFoundPafge/> },
]);

function App() {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}
export default App