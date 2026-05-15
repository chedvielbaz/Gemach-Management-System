import React from "react";

export const About = () => {
    return (
        <main className="page-shell">
            <div className="surface-card about-card">
                <h1 className="page-heading">אודות — מרכז הגמ&quot;חים</h1>
                <p className="page-lead">
                    הרבה פעמים אדם זקוק לציוד או שירות שאינו יודע היכן למצוא — ובמקביל,
                    גמ&quot;ח מתאים כבר קיים, פשוט המידע עליו פזור. האתר הזה נועד לרכז הכל
                    במקום אחד: רשימה מסודרת לפי קטגוריות, עם כתובות ופרטי התקשרות, כדי שהמבקש
                    יגיע מהר ולנותן יהיה קל להגיש יד.
                </p>

                <div className="about-prose">
                    <section className="about-section" aria-labelledby="about-do-heading">
                        <h2 id="about-do-heading" className="about-section-title">
                            מה אפשר לעשות כאן
                        </h2>
                        <p>
                            לחפש גמ&quot;ח לפי קטגוריה, לראות מה הוא מציע, ולמצוא את פרטי
                            הקשר — הכל בלחיצה אחת. ולמי שרוצה לתרום — אפשר להירשם ולפרסם
                            גמ&quot;ח חדש, כדי שהשכונה תדע שיש לאן לפנות.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
};
