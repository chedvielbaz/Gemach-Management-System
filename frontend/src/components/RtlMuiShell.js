import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";

/** RTL רק לתת־עץ של MUI — מתאים לטפסי הרשמה/התחברות בלי להפוך טבלאות באתר */
const rtlCache = createCache({
  key: "muirtl-forms",
  prepend: true,
  stylisPlugins: [rtlPlugin],
});

const rtlTheme = createTheme({
  direction: "rtl",
});

export function RtlMuiShell({ children }) {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={rtlTheme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
