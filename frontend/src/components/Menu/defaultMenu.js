import { Menubar } from 'primereact/menubar';
import "primeicons/primeicons.css";
import { useNavigate } from 'react-router-dom'
import logoMark from '../../assets/smalllogo.svg';
import './menue.css'
import { ROUTES } from '../../constants/routes';


export const DefaultMenu = () => {

    const navigate = useNavigate()

    const items = [
        {
            label: 'כניסה',
            icon: 'pi pi-user', items: [
                { label: 'הרשמה', command: () => { navigate(ROUTES.SIGN_UP) } },
                { label: 'התחברות', command: () => { navigate(ROUTES.LOGIN) } }
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
            <Menubar model={items} />
        </div>
    )
}
