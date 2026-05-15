import { useSelector } from "react-redux";

/** מייל משתמש מחובר (camelCase / PascalCase) — ריק אם אין משתמש */
export function useOwnerEmail() {
    const currentUser = useSelector((state) => state.users.currentUser);
    return (
        currentUser?.custEmail ??
        currentUser?.CustEmail ??
        ""
    ).trim();
}
