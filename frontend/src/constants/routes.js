/**
 * נתיבי האפליקציה — מקור יחיד לרוטר ול־navigate (פחות טעויות יחסי/מוחלט).
 * בתוך <Routes><Route path="/"> ההורים הצאצאים משתמשים בשם פרימנט ללא סלאש מוביל.
 */
export const ROUTE_SEGMENTS = {
    SIGN_UP: "signUp",
    LOGIN: "login",
    LOGIN_OR_SIGN_UP: "loginOrSighUp",
    MY_GMACHES: "myGmaches",
    ADD_GMACH: "addgmach",
    ABOUT: "about",
    KATEGORY: "kategory",
};

const seg = ROUTE_SEGMENTS;

/** נתיבים מוחלטים לשימוש ב־navigate וכדומה */
export const ROUTES = {
    HOME: "/",
    SIGN_UP: `/${seg.SIGN_UP}`,
    LOGIN: `/${seg.LOGIN}`,
    LOGIN_OR_SIGN_UP: `/${seg.LOGIN_OR_SIGN_UP}`,
    MY_GMACHES: `/${seg.MY_GMACHES}`,
    ADD_GMACH: `/${seg.ADD_GMACH}`,
    ABOUT: `/${seg.ABOUT}`,
    KATEGORY: `/${seg.KATEGORY}`,
};

/** רשימת גמ״חים בקטגוריה */
export function pathCategory(kindCode) {
    return `${ROUTES.KATEGORY}/${kindCode}`;
}

/** דף מוצרים של גמ״ח בתוך קטגוריה */
export function pathCategoryGmach(kindCode, gmachCode) {
    return `${ROUTES.KATEGORY}/${kindCode}/${gmachCode}`;
}
