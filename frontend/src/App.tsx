import './App.css';
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Student from './pages/Student';
import Employee from './pages/Employee';
import Navbar from './components/Layout';
import Layout from './components/Layout';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Home />
			},
			{
				path: "/login",
				element: <Login />
			},
			{
				path: "/register",
				element: <Register />
			},
			{
				path: "/student",
				element: <Student />
			},
			{
				path: "/employee",
				element: <Employee />
			}
		]
	}
]);

function App() {
	return (
		<div>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
