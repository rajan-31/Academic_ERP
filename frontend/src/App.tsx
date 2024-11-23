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
import axios from "axios";
import StudentDetails from "./pages/StudentDetails";
import { AuthProvider } from "./components/AuthContext";

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
				path: "/students/:studentId",
				element: <StudentDetails />
			},
			{
				path: "/employee",
				element: <Employee />
			}
		]
	}
],
{
	// to suppress warnings
	future: {
		v7_fetcherPersist: true,
		v7_normalizeFormMethod: true,
		v7_partialHydration: true,
		v7_relativeSplatPath: true,
		v7_skipActionErrorRevalidation: true
	}
}
);

function App() {
	axios.defaults.baseURL = "http://localhost:8080/api/v1"

	return (
		<div>
			<AuthProvider>
				<RouterProvider router={router} future={{v7_startTransition: true}} />
			</AuthProvider>
		</div>
	);
}

export default App;
