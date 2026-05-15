/** רישום לקונסול רק בפיתוח — לא מציף את המשתמש בפרודקשן */
export function devError(...args) {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
}
