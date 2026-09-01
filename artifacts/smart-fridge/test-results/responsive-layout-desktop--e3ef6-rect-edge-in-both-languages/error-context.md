# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-layout.spec.ts >> desktop sidebar slides from the correct edge in both languages
- Location: tests/responsive-layout.spec.ts:180:1

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 0
Received:    16
```

# Test source

```ts
  106 |     await page.locator('.fridge-end-sentinel').scrollIntoViewIfNeeded();
  107 |     await expect(addFoodButton).toBeVisible();
  108 | 
  109 |     if (viewport.name === 'phone') {
  110 |       const mainWidthBeforeDock = initial.main?.width;
  111 |       const scrollWidthBeforeDock = initial.documentScrollWidth;
  112 | 
  113 |       await expect(page.getByTestId('button-mobile-menu')).toBeVisible();
  114 |       await page.getByTestId('button-mobile-menu').click();
  115 |       await expect(page.locator('.smart-sidebar-scrim')).toHaveClass(/is-open/);
  116 |       await expect
  117 |         .poll(() => page.locator('.smart-sidebar').evaluate(element => element.getBoundingClientRect().right))
  118 |         .toBeGreaterThan(0);
  119 | 
  120 |       const open = await measureLayout(page);
  121 |       expect(open.sidebarPosition, 'open mobile dock positioning').toBe('fixed');
  122 |       expect(open.sidebar).not.toBeNull();
  123 |       expect(Number(open.sidebarZIndex), 'open mobile dock should layer above content').toBeGreaterThan(0);
  124 |       expect(open.sidebar!.right).toBeGreaterThan(open.main!.left);
  125 |       expect(open.sidebar!.left).toBeLessThan(open.main!.right);
  126 |       expect(open.sidebar!.top + open.sidebar!.height).toBeGreaterThan(open.main!.top);
  127 |       expect(open.sidebar!.top).toBeLessThan(open.main!.top + open.main!.height);
  128 |       expect(open.main?.width).toBeCloseTo(mainWidthBeforeDock ?? 0, 0);
  129 |       expect(open.documentScrollWidth).toBeLessThanOrEqual(open.viewportWidth + 1);
  130 |       expect(open.documentScrollWidth).toBe(scrollWidthBeforeDock);
  131 |       expect(open.main?.width).toBeLessThanOrEqual(open.viewportWidth + 1);
  132 |       expect(
  133 |         await page.locator('.smart-sidebar-scrim').evaluate(element => getComputedStyle(element).display),
  134 |       ).toBe('block');
  135 |       expectContained([open.main!, open.shelf!], open.viewportWidth, 'open mobile content');
  136 | 
  137 |       await page.locator('.smart-sidebar-scrim').click({
  138 |         position: { x: viewport.width - 20, y: Math.floor(viewport.height / 2) },
  139 |       });
  140 |       await expect(page.locator('.smart-sidebar-scrim')).not.toHaveClass(/is-open/);
  141 |     }
  142 |   });
  143 | }
  144 | 
  145 | test('mobile sidebar slides from the correct edge in both languages', async ({ page }) => {
  146 |   for (const [index, language] of ['en', 'ar'].entries()) {
  147 |     const testPage = index === 0 ? page : await page.context().newPage();
  148 |     await testPage.setViewportSize({ width: 390, height: 844 });
  149 |     await seedDemoSession(testPage, language);
  150 |     await testPage.goto('/');
  151 |     await testPage.getByTestId('button-mobile-menu').click();
  152 |     await expect(testPage.locator('.smart-sidebar')).toBeVisible();
  153 |     await expect(testPage.locator('.smart-sidebar-scrim')).toHaveClass(/is-open/);
  154 |     await testPage.waitForTimeout(400);
  155 | 
  156 |     const openBox = await testPage.locator('.smart-sidebar').evaluate(element => {
  157 |       const box = element.getBoundingClientRect();
  158 |       return { left: box.left, right: box.right };
  159 |     });
  160 |     expect(openBox.left).toBeGreaterThanOrEqual(0);
  161 |     expect(openBox.right).toBeLessThanOrEqual(390);
  162 |     expect(await testPage.locator('html').getAttribute('dir')).toBe(language === 'ar' ? 'rtl' : 'ltr');
  163 | 
  164 |     await testPage.locator('.smart-sidebar-scrim').click({ position: { x: 5, y: Math.floor(844 / 2) } });
  165 |     await expect(testPage.locator('.smart-sidebar-scrim')).not.toHaveClass(/is-open/);
  166 |     await testPage.waitForTimeout(400);
  167 |     const closedBox = await testPage.locator('.smart-sidebar').evaluate(element => {
  168 |       const box = element.getBoundingClientRect();
  169 |       return { left: box.left, right: box.right };
  170 |     });
  171 |     if (language === 'ar') {
  172 |       expect(closedBox.left).toBeGreaterThanOrEqual(390);
  173 |     } else {
  174 |       expect(closedBox.right).toBeLessThanOrEqual(0);
  175 |     }
  176 |     if (index > 0) await testPage.close();
  177 |   }
  178 | });
  179 | 
  180 | test('desktop sidebar slides from the correct edge in both languages', async ({ page }) => {
  181 |   for (const language of ['en', 'ar'] as const) {
  182 |     for (const width of [834, 1440]) {
  183 |       const testPage = await page.context().newPage();
  184 |       await testPage.setViewportSize({ width, height: width === 834 ? 1112 : 900 });
  185 |       await seedDemoSession(testPage, language);
  186 |       await testPage.goto('/');
  187 |       await testPage.getByTestId('button-mobile-menu').click();
  188 |       await testPage.waitForTimeout(350);
  189 | 
  190 |       const openBox = await testPage.locator('.smart-sidebar').evaluate(element => {
  191 |         const box = element.getBoundingClientRect();
  192 |         return { left: box.left, right: box.right };
  193 |       });
  194 |       expect(openBox.left).toBeGreaterThanOrEqual(0);
  195 |       expect(openBox.right).toBeLessThanOrEqual(width);
  196 | 
  197 |       await testPage.getByTestId('button-sidebar-toggle').click();
  198 |       await testPage.waitForTimeout(350);
  199 |       const closedBox = await testPage.locator('.smart-sidebar').evaluate(element => {
  200 |         const box = element.getBoundingClientRect();
  201 |         return { left: box.left, right: box.right };
  202 |       });
  203 |       if (language === 'ar') {
  204 |         expect(closedBox.left).toBeGreaterThanOrEqual(width);
  205 |       } else {
> 206 |         expect(closedBox.right).toBeLessThanOrEqual(0);
      |                                 ^ Error: expect(received).toBeLessThanOrEqual(expected)
  207 |       }
  208 |       await testPage.close();
  209 |     }
  210 |   }
  211 | });
  212 | 
  213 | test('keeps sidebar icons and labels adjacent in RTL and LTR', async ({ page }) => {
  214 |   for (const [index, language] of ['en', 'ar'].entries()) {
  215 |     const testPage = index === 0 ? page : await page.context().newPage();
  216 |     await testPage.setViewportSize({ width: 390, height: 844 });
  217 |     await seedDemoSession(testPage, language);
  218 |     await testPage.goto('/');
  219 |     await testPage.getByTestId('button-mobile-menu').click();
  220 |     await testPage.waitForTimeout(350);
  221 | 
  222 |     const layout = await testPage.getByTestId('link-nav-ثلاجتي').evaluate(link => {
  223 |       const icon = link.querySelector<HTMLElement>('.smart-sidebar__icon')!.getBoundingClientRect();
  224 |       const label = link.querySelector<HTMLElement>('.smart-sidebar__label')!.getBoundingClientRect();
  225 |       const styles = getComputedStyle(link);
  226 |       return {
  227 |         direction: styles.direction,
  228 |         gap: styles.gap,
  229 |         justifyContent: styles.justifyContent,
  230 |         marginInlineStart: styles.marginInlineStart,
  231 |         marginInlineEnd: styles.marginInlineEnd,
  232 |         iconLeft: icon.left,
  233 |         iconRight: icon.right,
  234 |         labelLeft: label.left,
  235 |         labelRight: label.right,
  236 |       };
  237 |     });
  238 | 
  239 |     expect(layout.direction).toBe(language === 'ar' ? 'rtl' : 'ltr');
  240 |     expect(layout.gap).toBe('12px');
  241 |     expect(layout.justifyContent).toBe('flex-start');
  242 |     expect(layout.marginInlineStart).toBe('0px');
  243 |     expect(layout.marginInlineEnd).toBe('0px');
  244 |     if (language === 'ar') {
  245 |       expect(layout.iconLeft - layout.labelRight).toBeCloseTo(12, 0);
  246 |     } else {
  247 |       expect(layout.labelLeft - layout.iconRight).toBeCloseTo(12, 0);
  248 |     }
  249 | 
  250 |     await testPage.locator('.smart-sidebar-scrim').click({ position: { x: 5, y: 422 } });
  251 |     if (index > 0) await testPage.close();
  252 |   }
  253 | });
  254 | 
  255 | test('keeps the responsive header greeting and profile avatar contained', async ({ page }) => {
  256 |   for (const viewport of viewports) {
  257 |     await page.setViewportSize({ width: viewport.width, height: viewport.height });
  258 |     await seedDemoSession(page, 'en');
  259 |     await page.goto('/');
  260 | 
  261 |     const header = page.locator('.dashboard-topbar');
  262 |     const headerBox = await header.evaluate(element => {
  263 |       const box = element.getBoundingClientRect();
  264 |       return { left: box.left, right: box.right };
  265 |     });
  266 |     const avatar = page.locator('.dashboard-profile .profile-avatar-sticker');
  267 |     const avatarBox = await avatar.evaluate(element => {
  268 |       const box = element.getBoundingClientRect();
  269 |       return { left: box.left, right: box.right };
  270 |     });
  271 | 
  272 |     expect(headerBox, `${viewport.name} header should exist`).not.toBeNull();
  273 |     expect(avatarBox, `${viewport.name} profile avatar should exist`).not.toBeNull();
  274 |     expect(headerBox!.left).toBeGreaterThanOrEqual(-1);
  275 |     expect(headerBox!.right).toBeLessThanOrEqual(viewport.width + 1);
  276 |     expect(avatarBox!.left).toBeGreaterThanOrEqual(-1);
  277 |     expect(avatarBox!.right).toBeLessThanOrEqual(viewport.width + 1);
  278 |     await expect(page.locator('.dashboard-welcome')).toContainText('Welcome back, Responsive Test');
  279 | 
  280 |     if (viewport.name === 'phone') {
  281 |       await expect(page.locator('.dashboard-profile > div:last-child')).toBeHidden();
  282 |     } else {
  283 |       await expect(page.locator('.dashboard-profile > div:last-child')).toBeVisible();
  284 |     }
  285 |   }
  286 | });
  287 | 
  288 | test('keeps the desktop Arabic header in strict RTL group order', async ({ page }) => {
  289 |   for (const viewport of [{ width: 834, height: 1112 }, { width: 1440, height: 900 }]) {
  290 |     await page.setViewportSize(viewport);
  291 |     await seedDemoSession(page, 'ar');
  292 |     await page.goto('/');
  293 | 
  294 |     const groups = await page.locator('.dashboard-topbar').evaluate(header => {
  295 |       const getBox = (selector: string) => {
  296 |         const box = header.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
  297 |         return { left: box.left, right: box.right };
  298 |       };
  299 |       return {
  300 |         start: getBox('.dashboard-header-start'),
  301 |         metrics: getBox('.dashboard-metrics'),
  302 |         actions: getBox('.dashboard-actions'),
  303 |       };
  304 |     });
  305 | 
  306 |     expect(groups.start.left).toBeGreaterThan(groups.metrics.right);
```