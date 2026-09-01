# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-layout.spec.ts >> keeps Daily Analysis centered, responsive, and menu-free
- Location: tests/responsive-layout.spec.ts:439:1

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 1
Received:    96.984375
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - banner [ref=e6]:
        - generic "ثلاجتي الذكية" [ref=e7]
      - main [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: مساحتي اليومية
            - heading "تحليل يومي" [level=2] [ref=e15]
            - paragraph [ref=e16]: نظرة هادئة على اختياراتك، بدون أحكام.
          - generic [ref=e17]: الثلاثاء، 1 سبتمبر
        - generic [ref=e19]:
          - region [ref=e20]:
            - generic [ref=e22]:
              - heading "إيقاع السعرات" [level=3] [ref=e23]
              - paragraph [ref=e24]: آخر سبعة أيام
            - img "رسم يوضح إيقاع السعرات خلال آخر سبعة أيام" [ref=e28]:
              - img [ref=e31]:
                - generic [ref=e35]:
                  - generic [ref=e36]: ح
                  - generic [ref=e38]: ن
                  - generic [ref=e40]: ث
                  - generic [ref=e42]: ر
                  - generic [ref=e44]: خ
                  - generic [ref=e46]: ج
            - generic [ref=e54]:
              - generic [ref=e55]: هدفك اليومي
              - strong [ref=e57]: 2000 سعرة
          - region [ref=e58]:
            - generic [ref=e60]:
              - heading "توزيع المغذيات" [level=3] [ref=e61]
              - paragraph [ref=e62]: نسب متوازنة ليومك
            - generic [ref=e67]:
              - generic [ref=e68]:
                - generic "32%" [ref=e69]:
                  - strong [ref=e70]: 32%
                - generic [ref=e71]:
                  - generic [ref=e72]: بروتين
                  - generic [ref=e73]: من احتياجك اليومي
              - generic [ref=e74]:
                - generic "46%" [ref=e75]:
                  - strong [ref=e76]: 46%
                - generic [ref=e77]:
                  - generic [ref=e78]: كربوهيدرات
                  - generic [ref=e79]: من احتياجك اليومي
              - generic [ref=e80]:
                - generic "22%" [ref=e81]:
                  - strong [ref=e82]: 22%
                - generic [ref=e83]:
                  - generic [ref=e84]: دهون صحية
                  - generic [ref=e85]: من احتياجك اليومي
          - region [ref=e86]:
            - generic [ref=e88]:
              - heading "ملخص لطيف" [level=3] [ref=e89]
              - paragraph [ref=e90]: مقارنة بهدفك اليومي
            - generic [ref=e95]:
              - generic [ref=e96]:
                - strong [ref=e99]: 2,428
                - generic [ref=e100]: السعرات المتاحة في الثلاجة
              - generic [ref=e101]:
                - strong [ref=e105]: 4 / 8
                - generic [ref=e106]: أكواب الماء اليوم
              - generic [ref=e107]:
                - strong [ref=e111]: "2"
                - generic [ref=e112]: أصناف نباتية
              - generic [ref=e113]:
                - strong [ref=e116]: "0"
                - generic [ref=e117]: سعرة متبقية للهدف
    - region "Notifications (F8)":
      - list
  - generic [ref=e118]: ح
```

# Test source

```ts
  385 |       settingTitleColor: getComputedStyle(settingTitle).color,
  386 |       cardBorder: getComputedStyle(card).borderTopColor,
  387 |     };
  388 |   });
  389 | 
  390 |   expect(styles.filter).toBe('none');
  391 |   expect(styles.appBackground).not.toBe('rgba(0, 0, 0, 0)');
  392 |   expect(styles.cardBackground).not.toBe('rgb(255, 255, 255)');
  393 |   expect(styles.cardColor).not.toBe('rgb(32, 48, 36)');
  394 |   expect(styles.headingColor).not.toBe('rgb(32, 48, 36)');
  395 |   expect(styles.settingTitleColor).not.toBe('rgb(32, 48, 36)');
  396 |   expect(styles.cardBorder).not.toBe('rgba(0, 0, 0, 0)');
  397 | });
  398 | 
  399 | test('keeps dark mode surfaces softly rounded', async ({ page }) => {
  400 |   await page.setViewportSize({ width: 390, height: 844 });
  401 |   await seedDemoSession(page, 'en');
  402 |   await page.goto('/settings');
  403 |   await page.getByTestId('button-settings-المظهر').click();
  404 |   await page.getByTestId('toggle-dark-mode').click();
  405 |   await page.getByTestId('button-settings-عام').click();
  406 | 
  407 |   for (const [selector, expectedRadius] of [
  408 |     ['.settings-grid > .card.card-pad', '22px'],
  409 |     ['.settings-nav', '22px'],
  410 |     ['.settings-nav button', '12px'],
  411 |     ['.search-box', '12px'],
  412 |   ] as const) {
  413 |     await expect(page.locator(`.theme-dark ${selector}`).first()).toHaveCSS('border-radius', expectedRadius);
  414 |   }
  415 | });
  416 | 
  417 | test('keeps Quick Stats spaced and softly rounded', async ({ page }) => {
  418 |   for (const width of [390, 1366]) {
  419 |     await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  420 |     await seedDemoSession(page, 'en');
  421 |     await page.goto('/');
  422 | 
  423 |     await expect(page.locator('.dashboard-metrics')).toBeVisible();
  424 |     await expect(page.locator('.dashboard-metrics .dashboard-stat')).toHaveCount(3);
  425 |     await expect(page.locator('.dashboard-metrics')).toHaveCSS('gap', width === 390 ? '10px' : '12px');
  426 |     const metricsWidth = await page.locator('.dashboard-metrics').evaluate((element) => element.getBoundingClientRect().width);
  427 |     if (width === 1366) {
  428 |       expect(metricsWidth).toBeLessThanOrEqual(680);
  429 |     } else {
  430 |       const topbarWidth = await page.locator('.dashboard-topbar').evaluate((element) => element.getBoundingClientRect().width);
  431 |       expect(metricsWidth).toBeLessThan(topbarWidth);
  432 |     }
  433 |     for (const stat of await page.locator('.dashboard-metrics .dashboard-stat').all()) {
  434 |       await expect(stat).toHaveCSS('border-radius', '18px');
  435 |     }
  436 |   }
  437 | });
  438 | 
  439 | test('keeps Daily Analysis centered, responsive, and menu-free', async ({ page }) => {
  440 |   for (const [language, width] of [
  441 |     ['ar', 390],
  442 |     ['en', 390],
  443 |     ['en', 1366],
  444 |   ] as const) {
  445 |     await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  446 |     await seedDemoSession(page, language);
  447 |     await page.goto('/daily-analysis');
  448 | 
  449 |     await expect(page.locator('.daily-analysis-page .page-heading h2')).toBeVisible();
  450 |     await expect(page.locator('.daily-analysis-page .page-heading-menu')).toHaveCount(0);
  451 |     if (width === 390) {
  452 |       await expect(page.locator('.mobile-topbar-daily-analysis .menu-toggle')).toHaveCount(0);
  453 |       const logoCenter = await page.locator('.mobile-topbar-daily-analysis .brand').evaluate(element => {
  454 |         const rect = element.getBoundingClientRect();
  455 |         return (rect.left + rect.right) / 2;
  456 |       });
  457 |       const barCenter = await page.locator('.mobile-topbar-daily-analysis').evaluate(element => {
  458 |         const rect = element.getBoundingClientRect();
  459 |         return (rect.left + rect.right) / 2;
  460 |       });
  461 |       expect(Math.abs(logoCenter - barCenter)).toBeLessThanOrEqual(1);
  462 |     }
  463 |     await expect(page.locator('.daily-analysis-page .daily-analysis-card')).toHaveCount(3);
  464 |     await expect(page.locator('.daily-analysis-page .daily-ring')).toHaveCount(3);
  465 |     await expect(page.locator('.daily-analysis-page .recharts-area-curve')).toHaveCount(1);
  466 | 
  467 |     const layout = await page.evaluate(() => {
  468 |       const heading = document.querySelector('.daily-analysis-page .page-heading').getBoundingClientRect();
  469 |       const title = document.querySelector('.daily-analysis-page .page-heading h2').getBoundingClientRect();
  470 |       const copy = document.querySelector('.daily-analysis-page .page-heading-copy').getBoundingClientRect();
  471 |       const date = document.querySelector('.daily-analysis-page .page-heading-action').getBoundingClientRect();
  472 |       return {
  473 |         headingCenter: (heading.left + heading.right) / 2,
  474 |         titleCenter: (title.left + title.right) / 2,
  475 |         copyTop: copy.top,
  476 |         dateTop: date.top,
  477 |         documentScrollWidth: document.documentElement.scrollWidth,
  478 |       };
  479 |     });
  480 | 
  481 |     expect(layout.documentScrollWidth).toBeLessThanOrEqual(width + 1);
  482 |     if (width === 1366) {
  483 |       expect(Math.abs(layout.titleCenter - layout.headingCenter)).toBeLessThanOrEqual(1);
  484 |     } else {
> 485 |       expect(Math.abs(layout.copyTop - layout.dateTop)).toBeLessThanOrEqual(1);
      |                                                         ^ Error: expect(received).toBeLessThanOrEqual(expected)
  486 |     }
  487 |   }
  488 | });
  489 | 
  490 | test('centers the mobile site mark on meals, shopping, and analysis', async ({ page }) => {
  491 |   for (const language of ['ar', 'en'] as const) {
  492 |     for (const path of ['/meals', '/shopping', '/daily-analysis', '/settings']) {
  493 |       await page.setViewportSize({ width: 390, height: 844 });
  494 |       await seedDemoSession(page, language);
  495 |       await page.goto(path);
  496 | 
  497 |       await expect(page.locator('.mobile-topbar-centered .brand')).toHaveCount(1);
  498 |       await expect(page.getByTestId('button-mobile-menu-legacy')).toHaveCount(0);
  499 | 
  500 |       const header = await page.locator('.mobile-topbar-centered').evaluate(element => {
  501 |         const headerRect = element.getBoundingClientRect();
  502 |         const brandRect = element.querySelector('.brand')!.getBoundingClientRect();
  503 |         return {
  504 |           brandCenter: (brandRect.left + brandRect.right) / 2,
  505 |           headerCenter: (headerRect.left + headerRect.right) / 2,
  506 |           direction: getComputedStyle(element).direction,
  507 |           documentDirection: document.documentElement.dir,
  508 |         };
  509 |       });
  510 | 
  511 |       expect(Math.abs(header.brandCenter - header.headerCenter)).toBeLessThanOrEqual(1);
  512 |       expect(header.direction).toBe('ltr');
  513 |       expect(header.documentDirection).toBe(language === 'ar' ? 'rtl' : 'ltr');
  514 |     }
  515 |   }
  516 | });
  517 | 
  518 | test('keeps inner-page headings centered in both languages', async ({ page }) => {
  519 |   for (const language of ['ar', 'en'] as const) {
  520 |     for (const path of ['/settings', '/meals', '/shopping', '/daily-analysis']) {
  521 |       await page.setViewportSize({ width: 390, height: 844 });
  522 |       await seedDemoSession(page, language);
  523 |       await page.goto(path);
  524 | 
  525 |       const layout = await page.locator('.page-heading-centered').evaluate(element => {
  526 |         const heading = element.getBoundingClientRect();
  527 |         const title = element.querySelector('h2')!.getBoundingClientRect();
  528 |         return {
  529 |           titleCenter: (title.left + title.right) / 2,
  530 |           headingCenter: (heading.left + heading.right) / 2,
  531 |           textAlign: getComputedStyle(element.querySelector('.page-heading-copy')!).textAlign,
  532 |           direction: getComputedStyle(element).direction,
  533 |         };
  534 |       });
  535 | 
  536 |       expect(Math.abs(layout.titleCenter - layout.headingCenter)).toBeLessThanOrEqual(1);
  537 |       expect(layout.textAlign).toBe('center');
  538 |       expect(layout.direction).toBe(language === 'ar' ? 'rtl' : 'ltr');
  539 |     }
  540 |   }
  541 | });
  542 | 
  543 | test('keeps Shopping List compact and aligned in both directions', async ({ page }) => {
  544 |   for (const [language, width, darkMode] of [
  545 |     ['ar', 390, false],
  546 |     ['en', 768, true],
  547 |     ['en', 1366, false],
  548 |   ] as const) {
  549 |     await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  550 |     await seedDemoSession(page, language);
  551 |     if (darkMode) {
  552 |       await page.addInitScript(() => localStorage.setItem('smart_fridge_data', JSON.stringify({ 'responsive-user': { darkMode: true } })));
  553 |     }
  554 |     await page.goto('/shopping');
  555 | 
  556 |     await expect(page.locator('.shopping-page .page-heading h2')).toBeVisible();
  557 |     await expect(page.locator('.shopping-page .page-heading-menu')).toHaveCount(0);
  558 |     await expect(page.locator('.shopping-page [data-testid="button-logout"]')).toHaveCount(0);
  559 |     await expect(page.locator('.shopping-page .shopping-layout')).toBeVisible();
  560 |     await expect(page.locator('.shopping-page #shopping-name')).toHaveAttribute('id', 'shopping-name');
  561 |     await expect(page.locator('.shopping-page label[for="shopping-name"]')).toBeAttached();
  562 | 
  563 |     const layout = await page.evaluate(() => {
  564 |       const heading = document.querySelector('.shopping-page .page-heading').getBoundingClientRect();
  565 |       const title = document.querySelector('.shopping-page .page-heading h2').getBoundingClientRect();
  566 |       const description = document.querySelector('.shopping-page .page-heading p').getBoundingClientRect();
  567 |       const actions = document.querySelector('.shopping-page .page-actions').getBoundingClientRect();
  568 |       const listCard = document.querySelector('.shopping-page .shopping-list-card').getBoundingClientRect();
  569 |       return {
  570 |         titleCenter: (title.left + title.right) / 2,
  571 |         headingCenter: (heading.left + heading.right) / 2,
  572 |         actionsTop: actions.top,
  573 |         descriptionBottom: description.bottom,
  574 |         actionsWidth: actions.width,
  575 |         listCardHeight: listCard.height,
  576 |         documentScrollWidth: document.documentElement.scrollWidth,
  577 |       };
  578 |     });
  579 | 
  580 |     expect(Math.abs(layout.titleCenter - layout.headingCenter)).toBeLessThanOrEqual(1);
  581 |     expect(layout.actionsTop).toBeGreaterThan(layout.descriptionBottom);
  582 |     if (width === 390) expect(layout.actionsWidth).toBeLessThanOrEqual(281);
  583 |     expect(layout.documentScrollWidth).toBeLessThanOrEqual(width + 1);
  584 |     expect(layout.listCardHeight).toBeLessThan(900);
  585 |   }
```