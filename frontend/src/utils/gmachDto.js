/** ערך שדה מבלי להסתמך על camelCase מול PascalCase מה־API */
export function gf(g, camel, pascal) {
    const v = g?.[camel] ?? g?.[pascal];
    return v ?? "";
}

/** תווית סוג גמ״ח מתוך רשימת הסוגים; אין התאמה — קוד כמחרוזת */
export function kindLabel(types, code) {
    if (code == null || code === "" || !Array.isArray(types)) return "—";
    const c = Number(code);
    const row = types.find(
        (t) => Number(t.gmachKindCode ?? t.GmachKindCode) === c
    );
    return row ? row.gmachTypes ?? row.GmachTypes : String(code);
}
