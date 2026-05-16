# מרכז הגמחים — פרויקט Full Stack

אפליקציית Web לריכוז וניהול מידע על גמ״חים לפי קטגוריות: צפייה ברשימות ופרטי קשר, סינון והצגת מוצרים לפי גמ״ח, וממשק ניהול מלא (הוספה / עריכה / מחיקה) לאחר התחברות מאובטחת.

---

## Tech Stack

### Frontend

- **React** (Create React App)
- **Redux Toolkit** — ניהול מצב גלובלי
- **Material UI** ו־**PrimeReact** — רכיבי UI
- **React Router** — ניווט בצד הלקוח

### Backend

- **ASP.NET Core Web API** (.NET 6)
- **Entity Framework Core** — ORM

### Database

- **Microsoft SQL Server**

---

## מבנה המאגר (Repository structure)

```
final project/
├── init.sql              # סכמת DB וקטגוריות התחלתיות להקמה נקייה
├── sql/                  # סקריפטים משלימים (כולל מיגרציות)
├── docs/screenshots/     # צילומי מסך להצגה בגיטהאב
├── frontend/             # קוד לקוח — React
├── c#/                   # פתרון .NET — Web API, BLL, DAL
│   ├── projectC#/        # פרויקט ה־API הראשי
│   ├── BLL/              # לוגיקה עסקית
│   └── Dal/              # גישה לנתונים
└── README.md
```

---

## דרישות קדם (Prerequisites)

- [.NET 6 SDK](https://dotnet.microsoft.com/download) (או גרסה תואמת לפרויקט)
- [Node.js](https://nodejs.org/) (LTS) ו־npm
- SQL Server (למשל Express או LocalDB); מסד בשם `gmach` לאחר הרצת הסקריפט (או התאמת מחרוזת החיבור)

---

## הגדרה והרצה מקומית

### 1. מסד נתונים

בשורש המאגר קיים **`init.sql`**: יוצר את מסד `gmach`, את הטבלאות, ומזין קטגוריות התחלתיות בלבד.

יש להריץ את הסקריפט במלואו ב־SQL Server Management Studio או בכלי ניהול דומה מול השרת הרצוי.

קיים גם **`sql/create_database.sql`** (תוכן מקביל). **`sql/alter_gmach_add_owner_email.sql`** — לעדכון מסדי נתונים קיימים ללא עמודת `custEmail` בטבלת `Gmach`.

נתוני משתמשים, גמ״חים ומוצרים נוצרים דינמית דרך ממשק ההרשמה והאתר.

### 2. Backend — מחרוזת חיבור ואבטחה

הגדרות החיבור ב־`c#/projectC#/appsettings.json`.

ברירת המחדל במאגר: חיבור מקומי עם **Trusted_Connection** (אימות Windows). דוגמה ל־SQL Express:

```
Server=.\SQLEXPRESS;Database=gmach;Trusted_Connection=True;TrustServerCertificate=True
```

בסביבה חדשה ניתן להעתיק את **`c#/projectC#/appsettings.example.json`** ל־`appsettings.json` ולערוך את השרת לפי הצורך.

**אבטחת מידע:** קבצי קונפיגורציה מקומיים עם סודות אינם חלק מהמאגר הציבורי — השארת סיסמאות ומפתחות מחוץ לקומיט מוגדרת ב־`.gitignore` (למשל `appsettings.*.local.json`). לסביבות פיתוח מומלץ גם [User Secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets).

### 3. הרצת ה־API

```bash
cd c#/projectC#
dotnet run
```

כתובות ברירת מחדל נפוצות של השרת: `https://localhost:7223/api` ו־`http://localhost:5118/api` (לוגיקת לקוח: `frontend/src/config/apiBase.js`).

### 4. הרצת ה־Frontend

```bash
cd frontend
npm install
npm start
```

האפליקציה נפתחת בדרך כלל ב־`http://localhost:3000`.

דריסת כתובת ה־API — קובץ `.env` בתיקיית `frontend`:

```env
REACT_APP_API_URL=https://localhost:YOUR_PORT/api
REACT_APP_API_HTTP_URL=http://localhost:YOUR_HTTP_PORT/api
```

### בניית Frontend לפרודקשן

```bash
cd frontend
npm run build
```

פלט הבנייה: `frontend/build/`.

---

## צילומי מסך (Screenshots)

נתיבי התמונות יחסיים לשורש המאגר ומתאימים לתצוגה בגיטהאב.

### דף הבית

<p align="center">
  <img src="docs/screenshots/home.jpg" alt="דף הבית — מרכז הגמחים" width="920">
</p>

### דפים ציבוריים — קטגוריות, רשימה ואודות

| דף קטגוריות | רשימת גמ״חים בקטגוריה |
|:-----------:|:---------------------:|
| ![קטגוריות](docs/screenshots/categories.png) | ![רשימת גמ״חים](docs/screenshots/list.png) |
| ![אודות](docs/screenshots/about.png) | |

### התחברות, הרשמה ואזור אישי

| התחברות | הרשמה |
|:-------:|:-----:|
| ![דף התחברות](docs/screenshots/login.png) | ![דף הרשמה](docs/screenshots/register.png) |
| ![אזור אישי — הגמ״חים שלי](docs/screenshots/profile.png) | |

### הוספת גמ״ח

<p align="center">
  <img src="docs/screenshots/addGmach.png" alt="טופס הוספת גמ״ח" width="920">
</p>

---

## פריסה (Deployment)

הפרויקט כולל **Frontend**, **Backend** ומסד נתונים. פריסת Frontend בלבד תציג את הממשק, אך קריאות API ייכשלו כל עוד לא הוגדרה כתובת API ציבורית במשתני הסביבה של הלקוח.

**Frontend (למשל Vercel / Netlify)**

- תיקיית שורש לבנייה: `frontend`
- פקודה: `npm run build`
- תיקיית פלט: `build`
- `frontend/public/_redirects` (Netlify) ו־`frontend/vercel.json` (Vercel) מוגדרים כדי לתמוך ב־React Router ולמנוע 404 בריענון דף.

**Backend ומסד נתונים**

פריסה מלאה בענן דורשת אירוח של ASP.NET Core ושל SQL Server (למשל Azure App Service ו־Azure SQL). לאחר הפריסה יש לעדכן את `REACT_APP_API_URL` (ו־HTTP במידת הצורך) לכתובת ה־API הציבורית.

---

## רישיון ושימוש

פרויקט שנוצר במסגרת לימודים ותיק עבודות — ניתן להציג במאגר ציבורי ובקורות חיים. המאגר מוגדר עם **`.gitignore`** שמונע העלאה של סיסמאות, מפתחות ומחרוזות חיבור רגישות (`appsettings.*.local.json` וקבצים דומים).
