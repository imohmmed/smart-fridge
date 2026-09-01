# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-layout.spec.ts >> keeps sidebar navigation clean and logout exclusive to its footer
- Location: tests/responsive-layout.spec.ts:271:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 2
Received: 0
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - main [ref=e6]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - button "فتح القائمة" [ref=e9] [cursor=pointer]
        - generic [ref=e11]:
          - strong [ref=e12]: أهلاً بعودتك، Responsive Test
          - generic [ref=e13]: الثلاثاء، 1 سبتمبر
      - generic "ملخص اليوم" [ref=e14]:
        - generic [ref=e18]:
          - generic [ref=e19]: الهدف اليومي
          - strong [ref=e20]: 2,000 سعرة
        - generic [ref=e21]:
          - strong [ref=e23]: 100%
          - generic [ref=e24]:
            - generic [ref=e25]: المتناول اليوم
            - strong [ref=e26]: 2,428 سعرة
        - generic [ref=e31]:
          - generic [ref=e32]: الماء اليوم
          - strong [ref=e33]: 4 / 8 أكواب
      - generic [ref=e34]:
        - generic [ref=e35]:
          - button "التنبيهات، 21 جديدة" [ref=e36] [cursor=pointer]
          - generic [ref=e40]: "21"
        - link "فتح معلومات الملف الشخصي" [ref=e41] [cursor=pointer]:
          - /url: /settings?section=profile
    - heading "محتويات ثلاجتك" [level=2] [ref=e55]
    - generic [ref=e58]:
      - generic [ref=e59]:
        - region [ref=e60]:
          - generic [ref=e61]:
            - generic [ref=e62]:
              - generic [ref=e63]: 🍗
              - generic [ref=e64]:
                - heading "البروتينات" [level=4] [ref=e65]
                - paragraph [ref=e66]: جاهز للطهي
            - generic [ref=e67]: 1 أصناف
          - generic "البروتينات" [ref=e68]:
            - button "صدور دجاج، 2 قطعة" [ref=e69] [cursor=pointer]:
              - generic [ref=e70]: "2"
              - generic [ref=e74]: صدور دجاج
        - region [ref=e75]:
          - generic [ref=e76]:
            - generic [ref=e77]:
              - generic [ref=e78]: 🥗
              - generic [ref=e79]:
                - heading "الخضروات" [level=4] [ref=e80]
                - paragraph [ref=e81]: طازجة ومقرمشة
            - generic [ref=e82]: 2 أصناف
          - generic "الخضروات" [ref=e83]:
            - button "خس طازج، 1 رأس" [ref=e84] [cursor=pointer]:
              - generic [ref=e85]: "1"
              - generic [ref=e89]: خس طازج
            - button "طماطم كرزية، 9 حبة" [ref=e90] [cursor=pointer]:
              - generic [ref=e91]: "9"
              - generic [ref=e95]: طماطم كرزية
        - region [ref=e96]:
          - generic [ref=e97]:
            - generic [ref=e98]:
              - generic [ref=e99]: 🍎
              - generic [ref=e100]:
                - heading "الفواكه" [level=4] [ref=e101]
                - paragraph [ref=e102]: باردة ومنعشة
            - generic [ref=e103]: 5 أصناف
          - generic "الفواكه" [ref=e104]:
            - button "تفاح أحمر، 4 حبة" [ref=e105] [cursor=pointer]:
              - generic [ref=e106]: "4"
              - generic [ref=e110]: تفاح أحمر
            - button "برتقال، 3 حبة" [ref=e111] [cursor=pointer]:
              - generic [ref=e112]: "3"
              - generic [ref=e116]: برتقال
            - button "فراولة، 6 حبة" [ref=e117] [cursor=pointer]:
              - generic [ref=e118]: "6"
              - generic [ref=e122]: فراولة
            - button "كرز، 12 حبة" [ref=e123] [cursor=pointer]:
              - generic [ref=e124]: "12"
              - generic [ref=e128]: كرز
            - button "عنب، 1 عنقود" [ref=e129] [cursor=pointer]:
              - generic [ref=e130]: "1"
              - generic [ref=e134]: عنب
        - region [ref=e135]:
          - generic [ref=e136]:
            - generic [ref=e137]:
              - generic [ref=e138]: 🥛
              - generic [ref=e139]:
                - heading "الألبان" [level=4] [ref=e140]
                - paragraph [ref=e141]: محفوظة ببرودة
            - generic [ref=e142]: 3 أصناف
          - generic "الألبان" [ref=e143]:
            - button "حليب طازج، 1 علبة" [ref=e144] [cursor=pointer]:
              - generic [ref=e145]: "1"
              - generic [ref=e149]: حليب طازج
            - button "بيض بلدي، 8 حبة" [pressed] [ref=e150] [cursor=pointer]:
              - generic [ref=e151]: "8"
              - generic [ref=e155]: بيض بلدي
            - button "جبن أبيض، 1 علبة" [ref=e156] [cursor=pointer]:
              - generic [ref=e157]: "1"
              - generic [ref=e161]: جبن أبيض
        - region [ref=e162]:
          - generic [ref=e163]:
            - generic [ref=e164]:
              - generic [ref=e165]: 🧃
              - generic [ref=e166]:
                - heading "المشروبات" [level=4] [ref=e167]
                - paragraph [ref=e168]: جاهزة للتقديم
            - generic [ref=e169]: 2 أصناف
          - generic "المشروبات" [ref=e170]:
            - button "عصير برتقال، 1 عبوة" [ref=e171] [cursor=pointer]:
              - generic [ref=e172]: "1"
              - generic [ref=e176]: عصير برتقال
            - button "ماء، 4 عبوة" [ref=e177] [cursor=pointer]:
              - generic [ref=e178]: "4"
              - generic [ref=e182]: ماء
        - region [ref=e183]:
          - generic [ref=e184]:
            - generic [ref=e185]:
              - generic [ref=e186]: 🍱
              - generic [ref=e187]:
                - heading "وجبات جاهزة" [level=4] [ref=e188]
                - paragraph [ref=e189]: حل سريع ولذيذ
            - generic [ref=e190]: 1 أصناف
          - generic "وجبات جاهزة" [ref=e191]:
            - button "حمص جاهز، 1 علبة" [ref=e192] [cursor=pointer]:
              - generic [ref=e193]: "1"
              - generic [ref=e197]: حمص جاهز
      - generic [ref=e198]:
        - generic [ref=e199]: مساحتك مرتبة
        - strong [ref=e203]: 14 أصناف محفوظة
    - generic [ref=e204]:
      - generic "إحصائية توزيع المغذيات" [ref=e205]:
        - generic [ref=e206]: توزيع المغذيات
        - generic [ref=e207]:
          - generic [ref=e208]:
            - text: بروتين
            - generic [ref=e210]: 35%
          - generic [ref=e211]:
            - text: كربوهيدرات
            - generic [ref=e213]: 40%
          - generic [ref=e214]:
            - text: دهون صحية
            - generic [ref=e216]: 25%
      - generic "نصيحة اليوم" [ref=e217]:
        - generic [ref=e221]:
          - generic [ref=e222]: نصيحة اليوم
          - strong [ref=e223]: تناول الخضروات في كل وجبةللحصول على صحة أفضل.
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
  199 |       await testPage.waitForTimeout(350);
  200 |       const open = await measureLayout(testPage);
  201 |       const shellBox = await testPage.locator('.app-shell').evaluate(element => {
  202 |         const box = element.getBoundingClientRect();
  203 |         return { left: box.left, right: box.right };
  204 |       });
  205 |       expect(open.sidebar?.width).toBeGreaterThan(200);
  206 |       expect(open.main?.width).toBeLessThan((closed.main?.width ?? width) - 100);
  207 |       expect(open.sidebar?.left).toBeGreaterThanOrEqual(0);
  208 |       expect(open.sidebar?.right).toBeLessThanOrEqual(shellBox.right);
  209 |       expect(open.sidebar?.left).toBeCloseTo(
  210 |         language === 'ar' ? shellBox.right - (open.sidebar?.width ?? 0) : shellBox.left,
  211 |         0,
  212 |       );
  213 |       expect(open.sidebar?.right).toBeCloseTo(
  214 |         language === 'ar' ? shellBox.right : shellBox.left + (open.sidebar?.width ?? 0),
  215 |         0,
  216 |       );
  217 |       await expect(testPage.getByTestId('button-sidebar-toggle')).toBeHidden();
  218 | 
  219 |       await testPage.getByTestId('button-mobile-menu').click();
  220 |       await testPage.waitForTimeout(350);
  221 |       const collapsed = await measureLayout(testPage);
  222 |       expect(collapsed.sidebar?.width).toBe(0);
  223 |       expect(collapsed.main?.width).toBeCloseTo(closed.main?.width ?? 0, 0);
  224 |       await testPage.close();
  225 |     }
  226 |   }
  227 | });
  228 | 
  229 | test('keeps sidebar icons and labels adjacent in RTL and LTR', async ({ page }) => {
  230 |   for (const [index, language] of ['en', 'ar'].entries()) {
  231 |     const testPage = index === 0 ? page : await page.context().newPage();
  232 |     await testPage.setViewportSize({ width: 390, height: 844 });
  233 |     await seedDemoSession(testPage, language);
  234 |     await testPage.goto('/');
  235 |     await testPage.getByTestId('button-mobile-menu').click();
  236 |     await testPage.waitForTimeout(350);
  237 | 
  238 |     const layout = await testPage.getByTestId('link-nav-ثلاجتي').evaluate(link => {
  239 |       const icon = link.querySelector<HTMLElement>('.smart-sidebar__icon')!.getBoundingClientRect();
  240 |       const label = link.querySelector<HTMLElement>('.smart-sidebar__label')!.getBoundingClientRect();
  241 |       const styles = getComputedStyle(link);
  242 |       return {
  243 |         direction: styles.direction,
  244 |         gap: styles.gap,
  245 |         justifyContent: styles.justifyContent,
  246 |         marginInlineStart: styles.marginInlineStart,
  247 |         marginInlineEnd: styles.marginInlineEnd,
  248 |         iconLeft: icon.left,
  249 |         iconRight: icon.right,
  250 |         labelLeft: label.left,
  251 |         labelRight: label.right,
  252 |       };
  253 |     });
  254 | 
  255 |     expect(layout.direction).toBe(language === 'ar' ? 'rtl' : 'ltr');
  256 |     expect(layout.gap).toBe('12px');
  257 |     expect(layout.justifyContent).toBe('flex-start');
  258 |     expect(layout.marginInlineStart).toBe('0px');
  259 |     expect(layout.marginInlineEnd).toBe('0px');
  260 |     if (language === 'ar') {
  261 |       expect(layout.iconLeft - layout.labelRight).toBeCloseTo(12, 0);
  262 |     } else {
  263 |       expect(layout.labelLeft - layout.iconRight).toBeCloseTo(12, 0);
  264 |     }
  265 | 
  266 |     await testPage.locator('.smart-sidebar-scrim').click({ position: { x: 5, y: 422 } });
  267 |     if (index > 0) await testPage.close();
  268 |   }
  269 | });
  270 | 
  271 | test('keeps sidebar navigation clean and logout exclusive to its footer', async ({ page }) => {
  272 |   for (const [index, language] of ['ar', 'en'].entries()) {
  273 |     const testPage = index === 0 ? page : await page.context().newPage();
  274 |     await testPage.setViewportSize({ width: 390, height: 844 });
  275 |     await seedDemoSession(testPage, language);
  276 |     await testPage.goto('/');
  277 | 
  278 |     const cleanup = await testPage.evaluate(() => {
  279 |       const sidebarFooter = document.querySelector('.smart-sidebar__footer');
  280 |       return {
  281 |         sidebarLogoutCount: document.querySelectorAll('.smart-sidebar__logout').length,
  282 |         footerLogoutCount: document.querySelectorAll('.smart-sidebar__footer .smart-sidebar__logout').length,
  283 |         footerLastChildIsLogout: sidebarFooter?.lastElementChild?.classList.contains('smart-sidebar__logout') ?? false,
  284 |         topLogoutCount: document.querySelectorAll(
  285 |           '[data-testid="button-mobile-logout"], [data-testid="button-settings-logout"], .dashboard-topbar [aria-label*="Sign out"], .dashboard-topbar [aria-label*="تسجيل الخروج"]',
  286 |         ).length,
  287 |         removedNavLabels: Array.from(document.querySelectorAll('.smart-sidebar__link')).map(link => link.textContent?.trim()).filter(label =>
  288 |           label === 'Suggested recipes' || label === 'Favorites' || label === 'وصفات مقترحة' || label === 'المفضلة',
  289 |         ),
  290 |         logoCount: document.querySelectorAll('.premium-fridge-logo').length,
  291 |       };
  292 |     });
  293 | 
  294 |     expect(cleanup.sidebarLogoutCount).toBe(1);
  295 |     expect(cleanup.footerLogoutCount).toBe(1);
  296 |     expect(cleanup.footerLastChildIsLogout).toBe(true);
  297 |     expect(cleanup.topLogoutCount).toBe(0);
  298 |     expect(cleanup.removedNavLabels).toEqual([]);
> 299 |     expect(cleanup.logoCount).toBe(2);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  300 | 
  301 |     if (index > 0) await testPage.close();
  302 |   }
  303 | });
  304 | 
  305 | test('does not show a sidebar menu launcher on settings', async ({ page }) => {
  306 |   for (const width of [390, 1440]) {
  307 |     await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  308 |     await seedDemoSession(page, 'en');
  309 |     await page.goto('/settings');
  310 | 
  311 |     await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  312 |     await expect(page.getByTestId('button-page-menu')).toHaveCount(0);
  313 |     await expect(page.getByTestId('button-mobile-menu-legacy')).toHaveCount(0);
  314 |   }
  315 | });
  316 | 
  317 | test('keeps dark mode surfaces and text readable', async ({ page }) => {
  318 |   await page.setViewportSize({ width: 390, height: 844 });
  319 |   await seedDemoSession(page, 'en');
  320 |   await page.goto('/settings');
  321 |   await page.getByTestId('button-settings-المظهر').click();
  322 |   await page.getByTestId('toggle-dark-mode').click();
  323 | 
  324 |   const styles = await page.evaluate(() => {
  325 |     const app = document.querySelector('.theme-dark')!;
  326 |     const card = document.querySelector('.theme-dark .card')!;
  327 |     const heading = document.querySelector('.theme-dark .card-title h3')!;
  328 |     const paragraph = document.querySelector('.theme-dark .card-title p')!;
  329 |     return {
  330 |       filter: getComputedStyle(app).filter,
  331 |       appBackground: getComputedStyle(app).backgroundColor,
  332 |       cardBackground: getComputedStyle(card).backgroundColor,
  333 |       cardColor: getComputedStyle(card).color,
  334 |       headingColor: getComputedStyle(heading).color,
  335 |       paragraphColor: getComputedStyle(paragraph).color,
  336 |       cardBorder: getComputedStyle(card).borderTopColor,
  337 |     };
  338 |   });
  339 | 
  340 |   expect(styles.filter).toBe('none');
  341 |   expect(styles.appBackground).not.toBe('rgba(0, 0, 0, 0)');
  342 |   expect(styles.cardBackground).not.toBe('rgb(255, 255, 255)');
  343 |   expect(styles.cardColor).not.toBe('rgb(32, 48, 36)');
  344 |   expect(styles.headingColor).not.toBe('rgb(32, 48, 36)');
  345 |   expect(styles.paragraphColor).not.toBe('rgb(170, 170, 170)');
  346 |   expect(styles.cardBorder).not.toBe('rgba(0, 0, 0, 0)');
  347 | });
  348 | 
  349 | test('keeps the active sidebar item flat without shadow artifacts', async ({ page }) => {
  350 |   await page.setViewportSize({ width: 390, height: 844 });
  351 |   await seedDemoSession(page, 'ar');
  352 |   await page.goto('/');
  353 | 
  354 |   const activeItem = page.getByTestId('link-nav-ثلاجتي');
  355 |   const styles = await activeItem.evaluate(element => {
  356 |     const computed = getComputedStyle(element);
  357 |     const before = getComputedStyle(element, '::before');
  358 |     const after = getComputedStyle(element, '::after');
  359 |     return {
  360 |       boxShadow: computed.boxShadow,
  361 |       filter: computed.filter,
  362 |       borderStyle: computed.borderStyle,
  363 |       backgroundImage: computed.backgroundImage,
  364 |       backgroundColor: computed.backgroundColor,
  365 |       beforeContent: before.content,
  366 |       afterBoxShadow: after.boxShadow,
  367 |       afterFilter: after.filter,
  368 |     };
  369 |   });
  370 | 
  371 |   expect(styles.boxShadow).toBe('none');
  372 |   expect(styles.filter).toBe('none');
  373 |   expect(styles.borderStyle).toBe('none');
  374 |   expect(styles.backgroundImage).toBe('none');
  375 |   expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  376 |   expect(styles.beforeContent).toBe('none');
  377 |   expect(styles.afterBoxShadow).toBe('none');
  378 |   expect(styles.afterFilter).toBe('none');
  379 | });
  380 | 
  381 | test('anchors the sidebar close button to the opposite header corner', async ({ page }) => {
  382 |   for (const [index, language] of ['ar', 'en'].entries()) {
  383 |     const testPage = index === 0 ? page : await page.context().newPage();
  384 |     await testPage.setViewportSize({ width: 390, height: 844 });
  385 |     await seedDemoSession(testPage, language);
  386 |     await testPage.goto('/');
  387 |     await testPage.getByTestId('button-mobile-menu').click();
  388 | 
  389 |     const layout = await testPage.locator('.smart-sidebar__head').evaluate(head => {
  390 |       const button = head.querySelector<HTMLElement>('.smart-sidebar__toggle')!;
  391 |       const box = head.getBoundingClientRect();
  392 |       const buttonBox = button.getBoundingClientRect();
  393 |       const styles = getComputedStyle(button);
  394 |       return {
  395 |         headLeft: box.left,
  396 |         headRight: box.right,
  397 |         buttonLeft: buttonBox.left,
  398 |         buttonRight: buttonBox.right,
  399 |         width: buttonBox.width,
```