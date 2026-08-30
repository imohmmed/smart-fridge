# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-layout.spec.ts >> keeps sidebar icons and labels adjacent in RTL and LTR
- Location: tests/responsive-layout.spec.ts:180:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "rtl"
Received: "ltr"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - main [ref=e6]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - button "Open menu" [ref=e9] [cursor=pointer]
        - generic [ref=e11]:
          - strong [ref=e12]: Welcome back
          - generic [ref=e13]: Sunday, August 30
      - generic "Daily summary" [ref=e14]:
        - generic [ref=e18]:
          - generic [ref=e19]: Daily goal
          - strong [ref=e20]: 2,000 kcal
        - generic [ref=e21]:
          - strong [ref=e23]: 100%
          - generic [ref=e24]:
            - generic [ref=e25]: Calories eaten
            - strong [ref=e26]: 2,428 kcal
        - generic [ref=e31]:
          - generic [ref=e32]: Water intake
          - strong [ref=e33]: 4 / 8 cups
      - generic [ref=e34]:
        - generic [ref=e35]:
          - button "Notifications، 21 new" [ref=e36] [cursor=pointer]
          - generic [ref=e40]: "21"
        - link "Open profile settings" [ref=e41] [cursor=pointer]:
          - /url: /settings
          - generic [ref=e42]: R
    - heading "Your fridge contents" [level=2] [ref=e44]
    - generic [ref=e47]:
      - generic [ref=e48]:
        - region [ref=e49]:
          - generic [ref=e50]:
            - generic [ref=e51]:
              - generic [ref=e52]: 🍗
              - generic [ref=e53]:
                - heading "Proteins" [level=4] [ref=e54]
                - paragraph [ref=e55]: Ready to cook
            - generic [ref=e56]: 1 items
          - generic "Proteins" [ref=e57]:
            - button "Chicken breast، 2 قطعة" [ref=e58] [cursor=pointer]:
              - generic [ref=e59]: "2"
              - generic [ref=e63]: Chicken breast
        - region [ref=e64]:
          - generic [ref=e65]:
            - generic [ref=e66]:
              - generic [ref=e67]: 🥗
              - generic [ref=e68]:
                - heading "Vegetables" [level=4] [ref=e69]
                - paragraph [ref=e70]: Fresh and crisp
            - generic [ref=e71]: 2 items
          - generic "Vegetables" [ref=e72]:
            - button "Fresh lettuce، 1 رأس" [ref=e73] [cursor=pointer]:
              - generic [ref=e74]: "1"
              - generic [ref=e78]: Fresh lettuce
            - button "Cherry tomatoes، 9 حبة" [ref=e79] [cursor=pointer]:
              - generic [ref=e80]: "9"
              - generic [ref=e84]: Cherry tomatoes
        - region [ref=e85]:
          - generic [ref=e86]:
            - generic [ref=e87]:
              - generic [ref=e88]: 🍎
              - generic [ref=e89]:
                - heading "Fruits" [level=4] [ref=e90]
                - paragraph [ref=e91]: Chilled and fresh
            - generic [ref=e92]: 5 items
          - generic "Fruits" [ref=e93]:
            - button "Red apples، 4 حبة" [ref=e94] [cursor=pointer]:
              - generic [ref=e95]: "4"
              - generic [ref=e99]: Red apples
            - button "Oranges، 3 حبة" [ref=e100] [cursor=pointer]:
              - generic [ref=e101]: "3"
              - generic [ref=e105]: Oranges
            - button "Strawberries، 6 حبة" [ref=e106] [cursor=pointer]:
              - generic [ref=e107]: "6"
              - generic [ref=e111]: Strawberries
            - button "Cherries، 12 حبة" [ref=e112] [cursor=pointer]:
              - generic [ref=e113]: "12"
              - generic [ref=e117]: Cherries
            - button "Grapes، 1 عنقود" [ref=e118] [cursor=pointer]:
              - generic [ref=e119]: "1"
              - generic [ref=e123]: Grapes
        - region [ref=e124]:
          - generic [ref=e125]:
            - generic [ref=e126]:
              - generic [ref=e127]: 🥛
              - generic [ref=e128]:
                - heading "Dairy" [level=4] [ref=e129]
                - paragraph [ref=e130]: Kept chilled
            - generic [ref=e131]: 3 items
          - generic "Dairy" [ref=e132]:
            - button "Fresh milk، 1 علبة" [ref=e133] [cursor=pointer]:
              - generic [ref=e134]: "1"
              - generic [ref=e138]: Fresh milk
            - button "Farm eggs، 8 حبة" [pressed] [ref=e139] [cursor=pointer]:
              - generic [ref=e140]: "8"
              - generic [ref=e144]: Farm eggs
            - button "White cheese، 1 علبة" [ref=e145] [cursor=pointer]:
              - generic [ref=e146]: "1"
              - generic [ref=e150]: White cheese
        - region [ref=e151]:
          - generic [ref=e152]:
            - generic [ref=e153]:
              - generic [ref=e154]: 🧃
              - generic [ref=e155]:
                - heading "Drinks" [level=4] [ref=e156]
                - paragraph [ref=e157]: Ready to serve
            - generic [ref=e158]: 2 items
          - generic "Drinks" [ref=e159]:
            - button "Orange juice، 1 عبوة" [ref=e160] [cursor=pointer]:
              - generic [ref=e161]: "1"
              - generic [ref=e165]: Orange juice
            - button "Water، 4 عبوة" [ref=e166] [cursor=pointer]:
              - generic [ref=e167]: "4"
              - generic [ref=e171]: Water
        - region [ref=e172]:
          - generic [ref=e173]:
            - generic [ref=e174]:
              - generic [ref=e175]: 🍱
              - generic [ref=e176]:
                - heading "Ready meals" [level=4] [ref=e177]
                - paragraph [ref=e178]: Quick and easy
            - generic [ref=e179]: 1 items
          - generic "Ready meals" [ref=e180]:
            - button "Ready hummus، 1 علبة" [ref=e181] [cursor=pointer]:
              - generic [ref=e182]: "1"
              - generic [ref=e186]: Ready hummus
      - generic [ref=e187]:
        - generic [ref=e188]: Your space is organized
        - strong [ref=e192]: 14 items stored
    - generic [ref=e193]:
      - generic "Nutrient distribution statistic" [ref=e194]:
        - generic [ref=e195]: Nutrients
        - generic [ref=e196]:
          - generic [ref=e197]:
            - text: Protein
            - generic [ref=e199]: 35%
          - generic [ref=e200]:
            - text: Carbohydrates
            - generic [ref=e202]: 40%
          - generic [ref=e203]:
            - text: Healthy fats
            - generic [ref=e205]: 25%
      - generic "Daily tip" [ref=e206]:
        - generic [ref=e210]:
          - generic [ref=e211]: Tip of the day
          - strong [ref=e212]: Eat vegetables with every mealfor better health.
  - region "Notifications (F8)":
    - list
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
  180 | test('keeps sidebar icons and labels adjacent in RTL and LTR', async ({ page }) => {
  181 |   for (const [index, language] of ['en', 'ar'].entries()) {
  182 |     const testPage = index === 0 ? page : await page.context().newPage();
  183 |     await testPage.setViewportSize({ width: 390, height: 844 });
  184 |     await seedDemoSession(testPage, language);
  185 |     await testPage.goto('/');
  186 |     await testPage.getByTestId('button-mobile-menu').click();
  187 |     await testPage.waitForTimeout(350);
  188 | 
  189 |     const layout = await testPage.getByTestId('link-nav-ثلاجتي').evaluate(link => {
  190 |       const icon = link.querySelector<HTMLElement>('.smart-sidebar__icon')!.getBoundingClientRect();
  191 |       const label = link.querySelector<HTMLElement>('.smart-sidebar__label')!.getBoundingClientRect();
  192 |       const styles = getComputedStyle(link);
  193 |       return {
  194 |         direction: styles.direction,
  195 |         gap: styles.gap,
  196 |         justifyContent: styles.justifyContent,
  197 |         marginInlineStart: styles.marginInlineStart,
  198 |         marginInlineEnd: styles.marginInlineEnd,
  199 |         iconLeft: icon.left,
  200 |         iconRight: icon.right,
  201 |         labelLeft: label.left,
  202 |         labelRight: label.right,
  203 |       };
  204 |     });
  205 | 
> 206 |     expect(layout.direction).toBe(language === 'ar' ? 'rtl' : 'ltr');
      |                              ^ Error: expect(received).toBe(expected) // Object.is equality
  207 |     expect(layout.gap).toBe('12px');
  208 |     expect(layout.justifyContent).toBe('flex-start');
  209 |     expect(layout.marginInlineStart).toBe('0px');
  210 |     expect(layout.marginInlineEnd).toBe('0px');
  211 |     if (language === 'ar') {
  212 |       expect(layout.iconLeft - layout.labelRight).toBeCloseTo(12, 0);
  213 |     } else {
  214 |       expect(layout.labelLeft - layout.iconRight).toBeCloseTo(12, 0);
  215 |     }
  216 | 
  217 |     await testPage.locator('.smart-sidebar-scrim').click({ position: { x: 5, y: 422 } });
  218 |     if (index > 0) await testPage.close();
  219 |   }
  220 | });
```