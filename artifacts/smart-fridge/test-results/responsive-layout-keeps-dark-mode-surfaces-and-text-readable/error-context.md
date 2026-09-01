# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-layout.spec.ts >> keeps dark mode surfaces and text readable
- Location: tests/responsive-layout.spec.ts:317:1

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not "rgb(255, 255, 255)"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e5]:
    - banner [ref=e6]:
      - generic "Smart Fridge" [ref=e7]:
        - generic [ref=e11]:
          - strong [ref=e12]: Smart Fridge
          - generic [ref=e13]: Fresh space
    - main [ref=e14]:
      - generic [ref=e16]:
        - generic [ref=e17]: My daily space
        - heading "Settings" [level=2] [ref=e18]
        - paragraph [ref=e19]: Make Smart Fridge feel more like you.
      - generic [ref=e20]:
        - generic [ref=e21]:
          - button "General" [ref=e22] [cursor=pointer]
          - button "Profile Information" [ref=e23] [cursor=pointer]
          - button "Appearance" [ref=e24] [cursor=pointer]
          - button "Notifications" [ref=e25] [cursor=pointer]
          - button "Privacy" [ref=e26] [cursor=pointer]
        - generic [ref=e27]:
          - generic [ref=e29]:
            - heading "Smart Fridge appearance" [level=3] [ref=e30]
            - paragraph [ref=e31]: Choose the lighting that suits your day
          - generic [ref=e35]:
            - generic [ref=e36]:
              - strong [ref=e37]: Dark mode
              - paragraph [ref=e38]: Softens the fridge light for a calmer interior
            - button "Toggle dark mode" [active] [pressed] [ref=e39] [cursor=pointer]
          - strong [ref=e43]: Calm night lighting
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
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
  290 |         logoCount: document.querySelectorAll('.smart-sidebar__brand-mark svg, .brand-mark svg').length,
  291 |       };
  292 |     });
  293 | 
  294 |     expect(cleanup.sidebarLogoutCount).toBe(1);
  295 |     expect(cleanup.footerLogoutCount).toBe(1);
  296 |     expect(cleanup.footerLastChildIsLogout).toBe(true);
  297 |     expect(cleanup.topLogoutCount).toBe(0);
  298 |     expect(cleanup.removedNavLabels).toEqual([]);
  299 |     expect(cleanup.logoCount).toBe(2);
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
> 342 |   expect(styles.cardBackground).not.toBe('rgb(255, 255, 255)');
      |                                     ^ Error: expect(received).not.toBe(expected) // Object.is equality
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
  400 |         height: buttonBox.height,
  401 |         justifyContent: getComputedStyle(head).justifyContent,
  402 |         borderRadius: styles.borderRadius,
  403 |       };
  404 |     });
  405 | 
  406 |     expect(layout.justifyContent).toBe('space-between');
  407 |     expect(layout.borderRadius).toBe('50%');
  408 |     expect(layout.width).toBe(layout.height);
  409 |     if (language === 'ar') {
  410 |       expect(layout.buttonLeft - layout.headLeft).toBeCloseTo(0, 0);
  411 |     } else {
  412 |       expect(layout.headRight - layout.buttonRight).toBeCloseTo(0, 0);
  413 |     }
  414 | 
  415 |     if (index > 0) await testPage.close();
  416 |   }
  417 | });
  418 | 
  419 | test('keeps the responsive header greeting and profile avatar contained', async ({ page }) => {
  420 |   for (const viewport of viewports) {
  421 |     await page.setViewportSize({ width: viewport.width, height: viewport.height });
  422 |     await seedDemoSession(page, 'en');
  423 |     await page.goto('/');
  424 | 
  425 |     const header = page.locator('.dashboard-topbar');
  426 |     const headerBox = await header.evaluate(element => {
  427 |       const box = element.getBoundingClientRect();
  428 |       return { left: box.left, right: box.right };
  429 |     });
  430 |     const avatar = page.locator('.dashboard-profile .profile-avatar-sticker');
  431 |     const avatarBox = await avatar.evaluate(element => {
  432 |       const box = element.getBoundingClientRect();
  433 |       return { left: box.left, right: box.right };
  434 |     });
  435 | 
  436 |     expect(headerBox, `${viewport.name} header should exist`).not.toBeNull();
  437 |     expect(avatarBox, `${viewport.name} profile avatar should exist`).not.toBeNull();
  438 |     expect(headerBox!.left).toBeGreaterThanOrEqual(-1);
  439 |     expect(headerBox!.right).toBeLessThanOrEqual(viewport.width + 1);
  440 |     expect(avatarBox!.left).toBeGreaterThanOrEqual(-1);
  441 |     expect(avatarBox!.right).toBeLessThanOrEqual(viewport.width + 1);
  442 |     await expect(page.locator('.dashboard-welcome')).toContainText('Welcome back, Responsive Test');
```