# تشخیص خطای "Unable to schedule/sync data" — ROOK Health Connect (Android)

تاریخ: 2026-07-29
روش: بازبینی استاتیک کدِ Kotlin (`RookImplementation.kt` در `capacitor-rook-sdk@0.5.1`) + کد TypeScript
پروژه (`client/src/lib/rook.ts`, `client/src/pages/devices.tsx`, `client/src/App.tsx`) + مانیفست اندروید.
⚠️ در این مرحله به دستگاه/ایمولاتور اندروید و `adb logcat` دسترسی نداشتم (ترمینال این نشست کار
نمی‌کرد)، پس ستون «شواهد لاگ» برای مواردی که فقط با لاگ واقعی قابل تایید هستند، بر پایه‌ی
تحلیل مسیر کد مشخص شده، نه یک لاگ واقعی از دستگاه. برای موارد ۵ و ۶ و ۷ به لاگ واقعی نیاز داریم.

## خلاصه یافته‌ها (مهم‌ترین چیزی که پیدا شد)

دو باگ واقعی و مستند در مسیر Android Health Connect پیدا شد که هرکدام به‌تنهایی می‌توانند
دقیقاً باعث خطای "cannot schedule/sync data" و/یا گیر کردن (hang) کل فرآیند Connect/Sync شوند:

1. **تابع `requestAndroidBackgroundPermissions` که در `enablePlatformBackgroundSync` صدا زده
   می‌شد، اصلاً کاری با «Background Read Permission» ندارد.** طبق تعریف رسمی SDK
   (`dist/esm/modules/RookPermissions.js`)، این تابع `@deprecated` است و فقط نامِ دیگری برای
   `requestAndroidPermissions` (پرمیشن‌های عادی اندروید) است. یعنی مرحله‌ی ۴ چک‌لیست شما
   (Background Read Permission) عملاً **هیچ‌وقت به‌درستی چک/درخواست نمی‌شد** — این دقیقاً همان
   چیزی بود که حدس زده بودید.
2. **در چند نقطه از کد native، نتیجه‌ی `backgroundManager.schedule()` / `samsungManager.schedule()`
   بدون `try/catch` یا `.fold()` صدا زده می‌شد** (برخلاف بقیه‌ی توابع همان فایل که همه از
   الگوی `.fold(onSuccess, onFailure)` استفاده می‌کنند). یعنی اگر این تابع داخلی SDK به هر
   دلیلی (Quota، پرمیشن، وضعیت سیستم) exception پرتاب کند:
   - در تابع مستقل `scheduleBackground` (معادل JS: `scheduleHealthConnectBackGround`) —
     `call.resolve()`/`call.reject()` هیچ‌وقت صدا زده نمی‌شد → Promise سمت جاوااسکریپت
     برای همیشه معلق می‌ماند (hang) مگر با timeout سمت کلاینت قطع شود.
   - در `attemptToEnableBackgroundSync` که **داخل خودِ `initRook()`** به‌صورت خودکار صدا
     زده می‌شود (وقتی `enableBackgroundSync: true`) — یک exception همین‌جا می‌توانست کل
     Promise مربوط به `initRook()`/`updateUserId()` را هم بی‌جواب بگذارد. این تابع دقیقاً
     در مسیر «Sync Now» (`handleManualSync("platform")`) هم صدا زده می‌شود چون آن مسیر
     `enableBackgroundSync: true` پاس می‌دهد و هیچ `withTimeout` هم دورش نیست.

هر دوی این‌ها اکنون در فاز ۳ فیکس شدند (جزئیات پایین).

## جدول شرط به شرط

| # | شرط | برقرار است؟ | شواهد کد | اگر نه، دلیل دقیق |
|---|-----|--------------|----------|---------------------|
| 1 | `initRook()` قبل از schedule **موفق** بوده (نه فقط صدا زده شده) | ✅ بله، ساختار کد درست است | `initializeRookForUser` (`client/src/lib/rook.ts:97-119`) با `await` صبر می‌کند تا `RookConfig.initRook()` resolve شود؛ در صورت reject، `resetRookInitialization()` صدا زده و throw می‌شود، پس ادامه‌ی زنجیره (`executeConnection`) اجرا نمی‌شود. سمت native، `handelInitResult` فقط وقتی `rookResult.isSuccess` باشد ادامه می‌دهد. | — |
| 2 | `updateUserID(userID)` قبل از schedule صدا زده شده و userID خالی/نامعتبر نیست | ✅ بله | ترتیب در `initializeRookForUser`: `initRook()` → `updateUserId({ userId })` (خط ۹۸-۱۰۸). خودِ `executeConnection` قبل از هر چیز `clientInformation?.id` را چک می‌کند و اگر خالی باشد اصلاً ادامه نمی‌دهد (`devices.tsx:489-497`). | — |
| 3 | پرمیشن‌های معمولی Health Connect (READ_STEPS, READ_SLEEP, ...) با `requestHealthConnectPermissions` گرفته شده‌اند | ✅ بله، ترتیب درست است | `requestPlatformHealthPermissions()` قبل از `enablePlatformBackgroundSync()` صدا زده می‌شود (`devices.tsx:505-514`) و داخلش `RookPermissions.requestAllHealthConnectPermissions()` را صدا می‌زند. | — |
| 4 | **Background Read Permission** (جدا از پرمیشن‌های عادی) درخواست/چک شده | ❌ **باگ تایید‌شده** | کد قبلی فقط `RookPermissions.requestAndroidBackgroundPermissions()` را صدا می‌زد. طبق تعریف SDK (`dist/esm/modules/RookPermissions.js` خط ۵۲-۵۹): `@deprecated please use requestAndroidPermissions function instead` — یعنی این تابع فقط `requestAndroidPermissions()` عادی را دوباره صدا می‌زند و **هیچ ربطی به `READ_HEALTH_DATA_IN_BACKGROUND` ندارد**. تابع درستِ چک‌کردن این وضعیت `RookHealthConnect.checkBackgroundReadStatus()` است که در کد پروژه **اصلاً صدا زده نمی‌شد**. | دلیل دقیق: تابع اشتباه صدا زده می‌شد؛ هیچ‌جا وضعیت واقعی Background Read چک نمی‌شد، پس `scheduleHealthConnectBackGround()` کورکورانه صدا زده می‌شد بدون اینکه معلوم باشد پرمیشن لازم گرفته شده یا نه. |
| 5 | Quota پر نشده (`RequestQuotaExceededException`) | ❓ نیاز به لاگ واقعی | در کد فعلی هیچ retry/backoff یا تشخیص این exception خاص وجود نداشت؛ چون `scheduleBackground` بدون `.fold`/`try-catch` بود، حتی اگر این exception رخ می‌داد، پیام دقیقش هیچ‌وقت به JS/toast نمی‌رسید (Promise فقط hang می‌کرد). بعد از فیکس فاز ۳، پیام exception حالا capture و به‌صورت `error` در نتیجه‌ی `enablePlatformBackgroundSync` برمی‌گردد و در کنسول لاگ می‌شود — دفعه‌ی بعد اگر Quota باشد، در `adb logcat` با متن exception قابل مشاهده است. | نمی‌توان بدون تست واقعی روی دستگاه تایید/رد کرد. |
| 6 | باتری/فضای دستگاه زیر threshold سیستمی نیست (Low Power Mode و غیره) | ❓ نیاز به تست دستگاه | این مورد کاملاً توسط سیستم‌عامل اندروید کنترل می‌شود، نه کد ما؛ در کد راهی برای چک کردن این وضعیت اضافه نشده (خارج از scope فیکس کد). | باید با دستگاه در حالت عادی (نه Low Power Mode، فضای آزاد کافی) دوباره تست شود. |
| 7 | اتصال اینترنت واقعی برقرار است | ❓ نیاز به تست دستگاه | خودِ عمل «schedule» یک WorkManager job محلی است و ذاتاً نیازی به اینترنت ندارد، اما اجرای واقعیِ sync (آپلود داده) به اینترنت نیاز دارد. کد فعلی وضعیت شبکه را قبل از schedule/sync چک نمی‌کند. | برای «schedule» بعید است اینترنت علت مستقیم باشد؛ ولی برای موفقیت واقعیِ آپلود داده لازم است. |
| 8 | Exception دقیق از `schedule()` با `.fold(onSuccess, onFailure)` capture شده (نه try/catch عمومی گنگ) | ❌ **باگ تایید‌شده** (حالا فیکس شد) | در نسخه‌ی قبلی: `fun scheduleBackground(call)` مستقیماً `backgroundManager!!.schedule(areLogsEnable)` را صدا می‌زد **بدون هیچ try/catch یا .fold** — برخلاف تمام توابع مشابه دیگر در همین فایل (`syncUserTimeZone`, `checkSamsungHealthAvailability`, ...) که همه از `.fold({...},{...})` استفاده می‌کنند. همین‌طور `attemptToEnableBackgroundSync` (که داخل `initRook()` خودکار صدا زده می‌شود) هم بدون محافظت بود. | دلیل: ناسازگاری/باگ در پیاده‌سازی نسخه ۰.۵.۱ SDK — نه در کد اپلیکیشن شما. الان با patch محلی (`patches/capacitor-rook-sdk+0.5.1.patch`) اصلاح شد. |

## نتیجه‌گیری فاز ۲

- **علت اصلیِ محتمل و تایید‌شده با کد:** مورد ۴ (Background Read Permission هیچ‌وقت به‌درستی
  چک/گرفته نمی‌شد) + مورد ۸ (خطای native بدون `.fold` می‌توانست کل Promise را برای همیشه معلق
  نگه دارد یا حتی init را هنگ کند). این ترکیب دقیقاً با رفتار "not authorized / cannot schedule"
  که هم در Connect و هم به‌صورت بالقوه در «Sync Now» دیده می‌شد هم‌خوانی دارد.
- موارد ۱، ۲، ۳ در کد فعلی درست پیاده‌سازی شده‌اند و رد شدند (نیازی به تغییر نداشتند).
- موارد ۵، ۶، ۷ نیازمند تست روی دستگاه واقعی با لاگ‌گیری هستند؛ اکنون لاگ‌های واضح‌تری اضافه شده
  (`[Rook] ...` در کنسول کلاینت + پیام exception دقیق native) تا اگر مشکل تکرار شد، بشود دقیقاً
  کدام‌یک از این سه مورد است را تشخیص داد.

## فاز ۳ — فیکس‌های اعمال‌شده (فقط برای موارد تایید‌شده در فاز ۲)

### الف) پچ native (`patches/capacitor-rook-sdk+0.5.1.patch`, اعمال‌شده روی `node_modules/capacitor-rook-sdk/.../RookImplementation.kt`)

1. `fun scheduleBackground(call)` (معادل JS: `RookHealthConnect.scheduleHealthConnectBackGround()`):
   حالا `backgroundManager!!.schedule(...)` داخل `try/catch` است. در صورت خطا،
   `call.reject("We couldn't schedule Health Connect background sync: <exception message>")`
   صدا زده می‌شود (به‌جای هنگ کردن Promise برای همیشه).
2. `fun scheduleSamsungHealthBackGround(call)`: همان الگو، برای consistency و امنیت مشابه.
3. `attemptToEnableBackgroundSync(...)` (که داخل `initRook()` خودکار صدا زده می‌شود، هم در
   مسیر Connect و هم در مسیر «Sync Now»): حالا خطای احتمالی در schedule کردن پس‌زمینه
   **کل `initRook()`/`updateUserId()` را دیگر متوقف یا هنگ نمی‌کند** — خطا فقط لاگ می‌شود و
   ادامه‌ی init طبیعی جلو می‌رود.
4. در `handelInitResult`، صدا زدن `samsungManager!!.schedule(...)` هم داخل `try/catch` قرار
   گرفت تا مشابه بالا، خطای Samsung schedule هرگز کل init را قفل نکند.

### ب) کد کلاینت (`client/src/lib/rook.ts` → `enablePlatformBackgroundSync`)

- دیگر به `requestAndroidBackgroundPermissions()` به‌عنوان «گرفتن پرمیشن بک‌گراند» اعتماد
  نمی‌شود (چون طبق مستندات SDK این تابع منسوخ و بی‌ربط است). به‌جایش صریحاً
  `RookHealthConnect.checkBackgroundReadStatus()` صدا زده و نتیجه (`PERMISSION_GRANTED` یا
  هر مقدار دیگر) لاگ می‌شود.
- صدا زدن `scheduleHealthConnectBackGround()` و `scheduleYesterdaySync()` هر دو داخل
  `try/catch` جداگانه قرار گرفتند تا خطای هرکدام **دیگر باعث Connection Failed کلی نشود**؛
  کاربر همچنان با موفقیت Connect می‌شود و از «Sync Now» به‌عنوان fallback استفاده می‌کند.
- تابع حالا یک آبجکت وضعیت برمی‌گرداند: `{ backgroundSyncEnabled, backgroundReadStatus, error }`
  تا لایه‌ی UI بتواند به کاربر پیام دقیق‌تری نشان دهد.

### ج) کد صفحه‌ی Devices (`client/src/pages/devices.tsx` → `executeConnection`)

- بعد از موفقیت Connect، اگر `backgroundSyncEnabled` روی اندروید `false` باشد، یک toast
  جداگانه‌ی غیرمسدودکننده با عنوان **"Background Sync Limited"** نشان داده می‌شود که از
  کاربر می‌خواهد در تنظیمات Health Connect دسترسی "Access data in the background" را فعال
  کند و در همین حین از «Sync Now» استفاده کند. این toast **مانع نمایش "Connected Successfully"
  نمی‌شود.**

## موارد بدون تغییر کد (فقط توضیح، طبق درخواست شما)

- **مورد ۵ (Quota):** اگر در تست بعدی در لاگ عبارتی شبیه `RequestQuotaExceededException` یا
  `Quota` دیده شد، این یک مشکل موقتی سیستمی است (باید ~۴۵ دقیقه صبر کرد)، نه یک باگ کد. در
  صورت تایید با لاگ واقعی، می‌توان retry با backoff اضافه کرد (فعلاً چون بدون شواهد واقعی
  بود، طبق دستور شما فیکس نشد).
- **مورد ۶ (باتری/فضا):** این کاملاً توسط اندروید کنترل می‌شود. لطفاً تست بعدی را با دستگاهی
  که در Low Power Mode نیست و فضای کافی دارد انجام دهید.
- **مورد ۷ (اینترنت واقعی):** لطفاً مطمئن شوید حین تست، اتصال اینترنت واقعی (نه فقط اتصال
  ظاهری Wi‑Fi) برقرار است.

## قدم بعدی پیشنهادی

⚠️ در این نشست امکان اجرای `npm install` / build گرفتن APK نبود چون ترمینال (PowerShell) این
نشست پاسخ نمی‌داد. تغییرات کد (هم پچ native در `node_modules` و هم TypeScript) اعمال شده و آماده‌اند،
اما هنوز **build و تست روی دستگاه انجام نشده**. لطفاً:
1. اجازه بدهید یک بار دیگر تلاش کنم APK بسازم (وقتی ترمینال دوباره کار کرد)، یا خودتان
   `npm install && npx cap sync android && cd android && ./gradlew assembleRelease` را اجرا کنید.
2. بعد از نصب APK جدید، دوباره تست Connect/Sync Now را انجام دهید و اگر باز هم خطا دیدید،
   خروجی `adb logcat | grep -i rook` را برایم بفرستید — با لاگ‌های جدید (`[Rook] ...`)
   می‌توانیم دقیقاً مشخص کنیم کدام‌یک از موارد ۵/۶/۷ رخ داده.
