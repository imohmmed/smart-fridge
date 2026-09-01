# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-layout.spec.ts >> desktop sidebar slides from the correct edge in both languages
- Location: tests/responsive-layout.spec.ts:182:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 16
```

# Test source

```ts
  92  | 
  93  |     expectContained([initial.main!], initial.viewportWidth, `${viewport.name} dashboard`);
  94  |     expectContained([initial.shelf!], initial.viewportWidth, `${viewport.name} Smart Shelf`);
  95  |     expectContained(initial.categories, initial.viewportWidth, `${viewport.name} Smart Shelf category`);
  96  |     expectContained(initial.bottomCards, initial.viewportWidth, `${viewport.name} bottom card`);
  97  | 
  98  |     await expect(page.locator('.smart-shelf-section')).toHaveCount(shelfTones.length);
  99  |     for (const tone of shelfTones) {
  100 |       await expect(page.locator(`[data-testid="shelf-items-${tone}"]`)).toBeVisible();
  101 |     }
  102 |     await expect(page.locator('.dashboard-footer > .macro-stat')).toBeVisible();
  103 |     await expect(page.locator('.dashboard-footer > .health-tip')).toBeVisible();
  104 |     const addFoodButton = page.locator('.dashboard-footer > .floating-add');
  105 |     if (viewport.name !== 'desktop') {
  106 |       await expect(addFoodButton).toBeHidden();
  107 |     }
  108 |     await page.locator('.fridge-end-sentinel').scrollIntoViewIfNeeded();
  109 |     await expect(addFoodButton).toBeVisible();
  110 | 
  111 |     if (viewport.name === 'phone') {
  112 |       const mainWidthBeforeDock = initial.main?.width;
  113 |       const scrollWidthBeforeDock = initial.documentScrollWidth;
  114 | 
  115 |       await expect(page.getByTestId('button-mobile-menu')).toBeVisible();
  116 |       await page.getByTestId('button-mobile-menu').click();
  117 |       await expect(page.locator('.smart-sidebar-scrim')).toHaveClass(/is-open/);
  118 |       await expect
  119 |         .poll(() => page.locator('.smart-sidebar').evaluate(element => element.getBoundingClientRect().right))
  120 |         .toBeGreaterThan(0);
  121 | 
  122 |       const open = await measureLayout(page);
  123 |       expect(open.sidebarPosition, 'open mobile dock positioning').toBe('fixed');
  124 |       expect(open.sidebar).not.toBeNull();
  125 |       expect(Number(open.sidebarZIndex), 'open mobile dock should layer above content').toBeGreaterThan(0);
  126 |       expect(open.sidebar!.right).toBeGreaterThan(open.main!.left);
  127 |       expect(open.sidebar!.left).toBeLessThan(open.main!.right);
  128 |       expect(open.sidebar!.top + open.sidebar!.height).toBeGreaterThan(open.main!.top);
  129 |       expect(open.sidebar!.top).toBeLessThan(open.main!.top + open.main!.height);
  130 |       expect(open.main?.width).toBeCloseTo(mainWidthBeforeDock ?? 0, 0);
  131 |       expect(open.documentScrollWidth).toBeLessThanOrEqual(open.viewportWidth + 1);
  132 |       expect(open.documentScrollWidth).toBe(scrollWidthBeforeDock);
  133 |       expect(open.main?.width).toBeLessThanOrEqual(open.viewportWidth + 1);
  134 |       expect(
  135 |         await page.locator('.smart-sidebar-scrim').evaluate(element => getComputedStyle(element).display),
  136 |       ).toBe('block');
  137 |       expectContained([open.main!, open.shelf!], open.viewportWidth, 'open mobile content');
  138 | 
  139 |       await page.locator('.smart-sidebar-scrim').click({
  140 |         position: { x: viewport.width - 20, y: Math.floor(viewport.height / 2) },
  141 |       });
  142 |       await expect(page.locator('.smart-sidebar-scrim')).not.toHaveClass(/is-open/);
  143 |     }
  144 |   });
  145 | }
  146 | 
  147 | test('mobile sidebar slides from the correct edge in both languages', async ({ page }) => {
  148 |   for (const [index, language] of ['en', 'ar'].entries()) {
  149 |     const testPage = index === 0 ? page : await page.context().newPage();
  150 |     await testPage.setViewportSize({ width: 390, height: 844 });
  151 |     await seedDemoSession(testPage, language);
  152 |     await testPage.goto('/');
  153 |     await testPage.getByTestId('button-mobile-menu').click();
  154 |     await expect(testPage.locator('.smart-sidebar')).toBeVisible();
  155 |     await expect(testPage.locator('.smart-sidebar-scrim')).toHaveClass(/is-open/);
  156 |     await testPage.waitForTimeout(400);
  157 | 
  158 |     const openBox = await testPage.locator('.smart-sidebar').evaluate(element => {
  159 |       const box = element.getBoundingClientRect();
  160 |       return { left: box.left, right: box.right };
  161 |     });
  162 |     expect(openBox.left).toBeGreaterThanOrEqual(0);
  163 |     expect(openBox.right).toBeLessThanOrEqual(390);
  164 |     expect(await testPage.locator('html').getAttribute('dir')).toBe(language === 'ar' ? 'rtl' : 'ltr');
  165 | 
  166 |     await testPage.locator('.smart-sidebar-scrim').click({ position: { x: 5, y: Math.floor(844 / 2) } });
  167 |     await expect(testPage.locator('.smart-sidebar-scrim')).not.toHaveClass(/is-open/);
  168 |     await testPage.waitForTimeout(400);
  169 |     const closedBox = await testPage.locator('.smart-sidebar').evaluate(element => {
  170 |       const box = element.getBoundingClientRect();
  171 |       return { left: box.left, right: box.right };
  172 |     });
  173 |     if (language === 'ar') {
  174 |       expect(closedBox.left).toBeGreaterThanOrEqual(390);
  175 |     } else {
  176 |       expect(closedBox.right).toBeLessThanOrEqual(0);
  177 |     }
  178 |     if (index > 0) await testPage.close();
  179 |   }
  180 | });
  181 | 
  182 | test('desktop sidebar slides from the correct edge in both languages', async ({ page }) => {
  183 |   for (const language of ['en', 'ar'] as const) {
  184 |     for (const width of [834, 1440]) {
  185 |       const testPage = await page.context().newPage();
  186 |       await testPage.setViewportSize({ width, height: width === 834 ? 1112 : 900 });
  187 |       await seedDemoSession(testPage, language);
  188 |       await testPage.goto('/');
  189 | 
  190 |       const closed = await measureLayout(testPage);
  191 |       expect(closed.sidebarPosition).toBe('sticky');
> 192 |       expect(closed.sidebar?.width).toBe(0);
      |                                     ^ Error: expect(received).toBe(expected) // Object.is equality
  193 |       expect(
  194 |         await testPage.locator('.smart-sidebar-scrim').evaluate(element => getComputedStyle(element).display),
  195 |       ).toBe('none');
  196 |       await expect(testPage.getByTestId('button-sidebar-toggle')).toBeHidden();
  197 | 
  198 |       await testPage.getByTestId('button-mobile-menu').click();
  199 |       await testPage.waitForTimeout(350);
  200 |       const open = await measureLayout(testPage);
  201 |       expect(open.sidebar?.width).toBeGreaterThan(200);
  202 |       expect(open.main?.width).toBeLessThan((closed.main?.width ?? width) - 100);
  203 |       expect(open.sidebar?.left).toBeGreaterThanOrEqual(0);
  204 |       expect(open.sidebar?.right).toBeLessThanOrEqual(width);
  205 |       expect(open.sidebar?.left).toBeCloseTo(language === 'ar' ? width - (open.sidebar?.width ?? 0) : 0, 0);
  206 |       expect(open.sidebar?.right).toBeCloseTo(language === 'ar' ? width : open.sidebar?.width ?? 0, 0);
  207 |       await expect(testPage.getByTestId('button-sidebar-toggle')).toBeHidden();
  208 | 
  209 |       await testPage.getByTestId('button-mobile-menu').click();
  210 |       await testPage.waitForTimeout(350);
  211 |       const collapsed = await measureLayout(testPage);
  212 |       expect(collapsed.sidebar?.width).toBe(0);
  213 |       expect(collapsed.main?.width).toBeCloseTo(closed.main?.width ?? 0, 0);
  214 |       await testPage.close();
  215 |     }
  216 |   }
  217 | });
  218 | 
  219 | test('keeps sidebar icons and labels adjacent in RTL and LTR', async ({ page }) => {
  220 |   for (const [index, language] of ['en', 'ar'].entries()) {
  221 |     const testPage = index === 0 ? page : await page.context().newPage();
  222 |     await testPage.setViewportSize({ width: 390, height: 844 });
  223 |     await seedDemoSession(testPage, language);
  224 |     await testPage.goto('/');
  225 |     await testPage.getByTestId('button-mobile-menu').click();
  226 |     await testPage.waitForTimeout(350);
  227 | 
  228 |     const layout = await testPage.getByTestId('link-nav-ثلاجتي').evaluate(link => {
  229 |       const icon = link.querySelector<HTMLElement>('.smart-sidebar__icon')!.getBoundingClientRect();
  230 |       const label = link.querySelector<HTMLElement>('.smart-sidebar__label')!.getBoundingClientRect();
  231 |       const styles = getComputedStyle(link);
  232 |       return {
  233 |         direction: styles.direction,
  234 |         gap: styles.gap,
  235 |         justifyContent: styles.justifyContent,
  236 |         marginInlineStart: styles.marginInlineStart,
  237 |         marginInlineEnd: styles.marginInlineEnd,
  238 |         iconLeft: icon.left,
  239 |         iconRight: icon.right,
  240 |         labelLeft: label.left,
  241 |         labelRight: label.right,
  242 |       };
  243 |     });
  244 | 
  245 |     expect(layout.direction).toBe(language === 'ar' ? 'rtl' : 'ltr');
  246 |     expect(layout.gap).toBe('12px');
  247 |     expect(layout.justifyContent).toBe('flex-start');
  248 |     expect(layout.marginInlineStart).toBe('0px');
  249 |     expect(layout.marginInlineEnd).toBe('0px');
  250 |     if (language === 'ar') {
  251 |       expect(layout.iconLeft - layout.labelRight).toBeCloseTo(12, 0);
  252 |     } else {
  253 |       expect(layout.labelLeft - layout.iconRight).toBeCloseTo(12, 0);
  254 |     }
  255 | 
  256 |     await testPage.locator('.smart-sidebar-scrim').click({ position: { x: 5, y: 422 } });
  257 |     if (index > 0) await testPage.close();
  258 |   }
  259 | });
  260 | 
  261 | test('keeps the responsive header greeting and profile avatar contained', async ({ page }) => {
  262 |   for (const viewport of viewports) {
  263 |     await page.setViewportSize({ width: viewport.width, height: viewport.height });
  264 |     await seedDemoSession(page, 'en');
  265 |     await page.goto('/');
  266 | 
  267 |     const header = page.locator('.dashboard-topbar');
  268 |     const headerBox = await header.evaluate(element => {
  269 |       const box = element.getBoundingClientRect();
  270 |       return { left: box.left, right: box.right };
  271 |     });
  272 |     const avatar = page.locator('.dashboard-profile .profile-avatar-sticker');
  273 |     const avatarBox = await avatar.evaluate(element => {
  274 |       const box = element.getBoundingClientRect();
  275 |       return { left: box.left, right: box.right };
  276 |     });
  277 | 
  278 |     expect(headerBox, `${viewport.name} header should exist`).not.toBeNull();
  279 |     expect(avatarBox, `${viewport.name} profile avatar should exist`).not.toBeNull();
  280 |     expect(headerBox!.left).toBeGreaterThanOrEqual(-1);
  281 |     expect(headerBox!.right).toBeLessThanOrEqual(viewport.width + 1);
  282 |     expect(avatarBox!.left).toBeGreaterThanOrEqual(-1);
  283 |     expect(avatarBox!.right).toBeLessThanOrEqual(viewport.width + 1);
  284 |     await expect(page.locator('.dashboard-welcome')).toContainText('Welcome back, Responsive Test');
  285 | 
  286 |     if (viewport.name === 'phone') {
  287 |       await expect(page.locator('.dashboard-profile > div:last-child')).toBeHidden();
  288 |     } else {
  289 |       await expect(page.locator('.dashboard-profile > div:last-child')).toBeVisible();
  290 |     }
  291 |   }
  292 | });
```