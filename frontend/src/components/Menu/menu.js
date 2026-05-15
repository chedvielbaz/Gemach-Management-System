import { Outlet } from "react-router-dom";
import "primeicons/primeicons.css";
import { useSelector } from "react-redux";
import { UserMenu } from "./userMenu";
import { DefaultMenu } from "./defaultMenu";
import './menue.css'
 

export const Menu = () => {

    const currentUser = useSelector(s=> s.users.currentUser)

    return (
        <div   className="homepage">
            {currentUser ? <UserMenu  /> : <DefaultMenu  />}
            <Outlet />
        </div>
    )
}