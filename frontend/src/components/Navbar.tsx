import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

import {Menubar} from 'primereact/menubar';
import { MenuItem } from "primereact/menuitem";

const Navbar = () => {
    const navigate = useNavigate();
    const { loggedInUserType, setLoggedInUserType } = useAuth();
    
    const getMenuItems = (loggedInUserType: string): MenuItem[] => {
        const menuItems: MenuItem[] = [
            {
                label: 'Home',
                icon: 'pi pi-fw pi-home',
                command: () => {
                    navigate("/");
                }
            },
        ];

        if (!loggedInUserType) {
            menuItems.push(
                {
                    label: 'Login',
                    icon: 'pi pi-fw pi-user',
                    command: () => {
                        navigate("/login");
                    }
                },
                {
                    label: 'Register',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => {
                        navigate("/register");
                    }
                },
            );
        }

        if (loggedInUserType === "student") {
            menuItems.push(
                {
                    label: 'Student',
                    icon: 'pi pi-fw pi-user',
                    command: () => {
                        navigate("/student");
                    }
                },
            );
        }

        if (loggedInUserType === "employee") {
            menuItems.push(
                {
                    label: 'Employee',
                    icon: 'pi pi-fw pi-user',
                    command: () => {
                        navigate("/employee");
                    }
                },
            );
        }

        if (loggedInUserType) {
            menuItems.push(
                {
                    label: 'Logout',
                    icon: 'pi pi-fw pi-sign-out',
                    command: () => {
                        onLogout();
                    }
                },
            );
        }

        return menuItems;
    }
    
    const menuStart = <a
        onClick={ () => { navigate("/"); } }
        className="cursor-pointer"
    >
        <img alt="logo" src="/favicon.svg" 
            style={{width: "2.5rem", height: "2.5rem"}} className="mr-2"
        ></img>
    </a>;

    const onLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.setItem("userType", "");
        navigate("/login");
    }

    useEffect(() => {
        const userType = localStorage.getItem("userType");
        setLoggedInUserType(userType ? userType : "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setLoggedInUserType]);

    return (
        <Menubar model={getMenuItems(loggedInUserType)} start={menuStart} 
            pt={{
                menu: {className: "ml-auto"},
                button: {className: "ml-auto"}
            }}
            className="sticky top-0 shadow-md z-10"
        />
    );
}

export default Navbar;