import './App.css';
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import { PrimeReactProvider } from 'primereact/api';
// import 'primereact/resources/themes/tailwind-light/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Student from './pages/Student';
import Employee from './pages/Employee';
import Layout from './components/Layout';
import axios from "axios";
import StudentDetails from "./pages/StudentDetails";
import { AuthProvider } from "./context/AuthContext";

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
	axios.defaults.baseURL = `${process.env.REACT_APP_API_DOMAIN}${process.env.REACT_APP_API_PATH}`;

	const primeReactConfig = {
		ripple: true,
		CSSTransition: true,
	}

	return (
		<div>
			<PrimeReactProvider value={primeReactConfig}>
				<AuthProvider>
					<RouterProvider router={router} future={{v7_startTransition: true}} />
				</AuthProvider>
			</PrimeReactProvider>
		</div>
	);
}

export default App;
