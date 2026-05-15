import { Menubar } from 'primereact/menubar';
// import "primeicons/primeicons.css";
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/users';
import logoMark from '../../assets/smalllogo.svg';
import './menue.css'
import { ROUTES } from '../../constants/routes';


function userDisplayName(user) {
    if (!user || typeof user !== 'object') return 'משתמש';
    const name = (user.custName ?? user.CustName ?? '').trim();
    if (name) return name.length > 18 ? `${name.slice(0, 16)}…` : name;
    const email = (user.custEmail ?? user.CustEmail ?? '').trim();
    if (email) {
        const local = email.split('@')[0] ?? email;
        return local.length > 16 ? `${local.slice(0, 14)}…` : local;
    }
    return 'משתמש';
}


export const UserMenu = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentUser = useSelector((s) => s.users.currentUser)
    const greetingName = userDisplayName(currentUser)

    const doLogout = () => {
        dispatch(logout())
        navigate(ROUTES.HOME)
    }

    const items = [
        {
            label: 'אזור אישי',
            icon: 'pi pi-user',
            items: [
                { label: 'האזור האישי שלי', icon: 'pi pi-home', command: () => { navigate(ROUTES.MY_GMACHES) } },
                { label: 'הוספת גמ״ח', icon: 'pi pi-plus', command: () => { navigate(ROUTES.ADD_GMACH) } },
                { separator: true },
                { label: 'התנתקות', icon: 'pi pi-sign-out', command: doLogout },
            ]
        },
        { label: 'בית', icon: 'pi pi-home', command: () => { navigate(ROUTES.HOME) } },
        { label: 'קטגוריות', icon: 'pi pi-th-large', command: () => { navigate(ROUTES.KATEGORY) } },
        { label: 'אודות', icon: 'pi pi-info-circle', command: () => { navigate(ROUTES.ABOUT) } }
    ]

    return (

        <div className="nav">
            <div className="brand" onClick={() => navigate(ROUTES.HOME)}>
                <img className="logoimage" src={logoMark} alt="" />
                <span>מרכז הגמחים</span>
            </div>
            <div
                className="nav-user-badge"
                role="status"
                aria-label={`מחובר כ-${greetingName}`}
            >
                <span className="nav-user-icon pi pi-check-circle" aria-hidden />
                <span className="nav-user-meta">
                    <span className="nav-user-status-label">מחובר</span>
                    <span className="nav-user-sep" aria-hidden>·</span>
                    <span className="nav-user-name" title={greetingName}>{greetingName}</span>
                </span>
            </div>
            <Menubar model={items} />
        </div>
    )
}
