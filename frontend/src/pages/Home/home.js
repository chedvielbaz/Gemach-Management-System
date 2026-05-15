import { Link } from "react-router-dom"
import './style.css'
import { ROUTES } from '../../constants/routes';

export const Home = () => {
    return (
        <main className='home-page'>
            <section className="hero-section">
                <div className="hero-content">
                    <p className="hero-kicker">מרכז השאלות קהילתי</p>
                    <h1>כל הגמ"חים במקום אחד</h1>
                    <p className="hero-subtitle">
                        מוצאים ציוד, מוסיפים גמ"ח חדש, ומחברים בין אנשים שרוצים לעזור לבין מי שצריך בדיוק עכשיו.
                    </p>
                    <div className="hero-actions">
                        <Link className="primary-action" to={ROUTES.KATEGORY}>חיפוש גמ"ח</Link>
                        <Link className="secondary-action" to={ROUTES.LOGIN_OR_SIGN_UP}>הוספת גמ"ח</Link>
                    </div>
                </div>

                <div className="hero-visual" aria-hidden="true">
                    <img className="imghome" src="/images/hero-gmach.svg" alt="" />
                </div>
            </section>

            <section className="home-stats" aria-label="יתרונות מרכז הגמחים">
                <article>
                    <strong>מהיר</strong>
                    <span>מוצאים לפי קטגוריה</span>
                </article>
                <article>
                    <strong>מסודר</strong>
                    <span>פרטי קשר וזמני השאלה</span>
                </article>
                <article>
                    <strong>קהילתי</strong>
                    <span>כל אחד יכול להוסיף גמ"ח</span>
                </article>
            </section>
        </main>
    )
}