# מרכז הגמחים — פרויקט Full Stack

אפליקציית ווב לריכוז מידע על גמ״חים לפי קטגוריות: צפייה ברשימות, פרטי קשר, מוצרים לפי גמ״ח, והוספה/עריכה/מחיקה (לאחר התחברות).

## טכנולוגיות

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | React, Redux Toolkit, Material UI, PrimeReact, React Router |
| Backend | ASP.NET Core Web API, Entity Framework Core |
| Database | Microsoft SQL Server |

## מבנה התיקייה

```
final project/
├── init.sql           # סכמת DB לשכפול נקי (מומלץ לגיטהאב)
├── sql/               # סקריפטים נוספים / גיבוי
├── docs/screenshots/  # צילומי מסך (מקושרים מסעיף «צילומי מסך»)
├── frontend/          # קליינט React (Create React App)
├── c#/                # פתרון .NET — API, BLL, DAL
│   ├── projectC#/     # פרויקט ה-Web API
│   ├── BLL/
│   └── Dal/
└── README.md
```

## דרישות מוקדמות

- [.NET 6 SDK](https://dotnet.microsoft.com/download) (או גרסה תואמת לפרויקט)
- [Node.js](https://nodejs.org/) (LTS מומלץ) + npm
- SQL Server (למשל Express) ומסד נתונים בשם `gmach` (או התאמה למחרוזת החיבור שלך)

## יצירת מסד הנתונים (SQL Server)

בשורש הפרויקט קיים **`init.sql`**: יוצר את מסד `gmach`, את כל הטבלאות, ומוסיף **רק קטגוריות דמה** (ללא משתמשים או מיילים אמיתיים).

1. פתחו את הקובץ ב־SQL Server Management Studio (או כלי דומה), התחברו לשרת המקומי.
2. הריצו את הסקריפט בשלמותו.
3. משתמשים, גמ״חים ומוצרים — דרך ההרשמה והממשק באתר.

קיים גם **`sql/create_database.sql`** (תוכן מקביל). **`sql/alter_gmach_add_owner_email.sql`** — רק למסדי נתונים ישנים בלי עמודת `custEmail` על `Gmach`.

## צילומי מסך

להלן צילומי מסך מהממשק (נתיבים יחסיים מ־שורש המאגר — מתאימים לגיטהאב):

<p align="center">
  <img src="docs/screenshots/home.jpg" alt="דף הבית — מרכז הגמחים" width="920">
</p>

| דף קטגוריות | רשימת גמ״חים בקטגוריה |
|:-----------:|:---------------------:|
| ![קטגוריות](docs/screenshots/categories.png) | ![רשימת גמ״חים](docs/screenshots/list.png) |
| ![אודות](docs/screenshots/about.png) | |

## מחרוזת חיבור וגיטהאב

- **`appsettings.json`** תומך בחיבור מקומי עם **Trusted_Connection** (אימות Windows) — ללא סיסמת משתמש SQL בקובץ.
- אם תעברו ל־**משתמש וסיסמה** של SQL (`User Id=...;Password=...`) — **אל תעלו** את זה לגיטהאב. השתמשו ב־[User Secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) או בקובץ מקומי שלא נכנס לקומיט (`appsettings.*.local.json` מוזכר ב־`.gitignore`).
- **`c#/projectC#/appsettings.example.json`** — תבנית להעתקה ל־`appsettings.json` בסביבה חדשה.

## הגדרת חיבור מהשרת ל-SQL

ערכו את מחרוזת החיבור ב־`c#/projectC#/appsettings.json`.

ברירת המחדל במאגר: `Server=localhost`. אם השרת הוא **SQL Express** על המחשב, לעיתים נדרש למשל:

`Server=.\\SQLEXPRESS;Database=gmach;Trusted_Connection=True;TrustServerCertificate=True`

## הרצה מקומית

### 1. שרת ה-API

```bash
cd c#/projectC#
dotnet run
```

ברירת המחדל של הקליינט מצפה ל־API ב־`https://localhost:7223/api` עם גיבוי ל־`http://localhost:5118/api` (ראו `frontend/src/config/apiBase.js`). אם הפורטים אצלכם שונים — הגדירו משתני סביבה בפרונט (ראו למטה).

### 2. הפרונט

```bash
cd frontend
npm install
npm start
```

הדפדפן ייפתח בדרך כלל על `http://localhost:3000`.

### דריסת כתובת ה-API (אופציונלי)

בתיקיית `frontend` ניתן ליצור קובץ `.env`:

```env
REACT_APP_API_URL=https://localhost:YOUR_PORT/api
REACT_APP_API_HTTP_URL=http://localhost:YOUR_HTTP_PORT/api
```

## בנייה לפרודקשן (פרונט בלבד)

```bash
cd frontend
npm run build
```

פלט בתיקייה `frontend/build/`.

## פריסה חיה — לינק שפותחים בדפדפן

הפרויקט הוא **פרונט + API + SQL**. כדי שהאתר **באמת יעבוד** (טפסים, רשימות), צריך גם לשרת את ה־API והמסד באינטרנט. אם תפרסמו רק את הפרונט — הממשק ייטען, אבל קריאות לשרת ייכשלו עד שתגדירו כתובת API ציבורית.

### שלב 1: העלאת הקוד ל־GitHub

1. צרו ריפו חדש ב־[GitHub](https://github.com/new) (בלי README אם כבר יש אצלכם מקומית).
2. בשורש הפרויקט (`final project/`):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

### שלב 2: פריסת הפרונט (חינם, מומלץ)

**אופציה א — [Vercel](https://vercel.com)**  

1. התחברו עם חשבון GitHub → Add New Project → בחרו את הריפו.  
2. **Root Directory:** `frontend`  
3. **Build Command:** `npm run build`  
4. **Output Directory:** `build`  
5. **Environment Variables:** אחרי שיש לכם API ציבורי (HTTPS), הוסיפו לפחות:

   - `REACT_APP_API_URL` = למשל `https://your-api.example.com/api`

6. Deploy — תקבלו כתובת כמו `https://something.vercel.app`.

**אופציה ב — [Netlify](https://www.netlify.com)**  

1. Sites → Import from Git → בחרו ריפו.  
2. Base directory: `frontend`, Build: `npm run build`, Publish: `frontend/build` (או לפי הממשק של Netlify).  
3. אותם משתני סביבה `REACT_APP_*` ב־Site settings → Environment variables.  
4. הקובץ `frontend/public/_redirects` כבר מוגדר כדי ש־React Router יעבוד ברענון דף.

קובץ `frontend/vercel.json` משרת את אותה מטרה ב־Vercel.

### שלב 3: ה־API והמסד (כדי שהכל «חי» באמת)

יש להריץ את שרת ה־.NET ו־SQL Server (או תואם) בסביבת ענן — למשל **Azure** (App Service + Azure SQL), או שירותים אחרים שתומכים ב־.NET ובמסד SQL. זה שלב נפרד עם עלות/הגדרות לפי הספק.

עד שלא פרסמתם API ציבורי, תוכלו עדיין להראות בקורות חיים את **קישור הריפו בגיטהאב** + צילום מסך או סרטון — ואת האתר החי ברגע שתוסיפו את כתובת ה־API במשתני הסביבה.

## רישיון / שימוש

פרויקט לימודי / תיק עבודות — ניתן להציג בגיטהאב ובקורות חיים. אין להעלות לריפו סיסמאות אמיתיות או קבצי `appsettings.*.local.json` עם סודות (הם מוזנים ב־`.gitignore` בשורש).
