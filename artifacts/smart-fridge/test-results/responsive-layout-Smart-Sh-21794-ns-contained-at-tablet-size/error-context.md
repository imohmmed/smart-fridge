# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-layout.spec.ts >> Smart Shelf remains contained at tablet size
- Location: tests/responsive-layout.spec.ts:76:3

# Error details

```
Error: tablet dock positioning

expect(received).toBe(expected) // Object.is equality

Expected: "fixed"
Received: "sticky"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - complementary "Sidebar navigation" [ref=e5]:
      - generic [ref=e6]:
        - button "Open menu" [ref=e8] [cursor=pointer]
        - navigation "Main navigation":
          - link "My fridge" [ref=e10] [cursor=pointer]:
            - /url: /
          - link "My meals" [ref=e15] [cursor=pointer]:
            - /url: /meals
          - link "Daily analysis" [ref=e20] [cursor=pointer]:
            - /url: /daily-analysis
          - link "Shopping list" [ref=e24] [cursor=pointer]:
            - /url: /shopping
            - generic [ref=e25]: "2"
          - link "Suggested recipes" [ref=e33] [cursor=pointer]:
            - /url: /recipes
          - link "Favorites" [ref=e37] [cursor=pointer]:
            - /url: /favorites
        - generic:
          - link "Settings" [ref=e41] [cursor=pointer]:
            - /url: /settings
          - button "Sign out" [ref=e46] [cursor=pointer]
    - main [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e54]:
          - button "Open menu" [ref=e55] [cursor=pointer]
          - generic [ref=e57]:
            - generic [ref=e58]: Today at a glance
            - strong [ref=e59]:
              - generic [ref=e60]: Welcome back,
              - generic [ref=e61]: Responsive Test
        - generic "Daily summary" [ref=e62]:
          - generic [ref=e66]:
            - generic [ref=e67]: Daily goal
            - strong [ref=e68]: 2,000 kcal
          - generic [ref=e69]:
            - strong [ref=e71]: 100%
            - generic [ref=e72]:
              - generic [ref=e73]: Calories eaten
              - strong [ref=e74]: 2,428 kcal
          - generic [ref=e79]:
            - generic [ref=e80]: Water intake
            - strong [ref=e81]: 4 / 8 cups
        - generic [ref=e82]:
          - generic [ref=e83]:
            - button "Notifications، 21 new" [ref=e84] [cursor=pointer]
            - generic [ref=e88]: "21"
          - link "Open profile information" [ref=e89] [cursor=pointer]:
            - /url: /settings?section=profile
            - generic [ref=e102]:
              - strong [ref=e103]: Responsive Test
              - generic [ref=e104]: Profile Information
      - heading "Your fridge contents" [level=2] [ref=e106]
      - generic [ref=e109]:
        - generic [ref=e110]:
          - region [ref=e111]:
            - generic [ref=e112]:
              - generic [ref=e113]:
                - generic [ref=e114]: 🍗
                - generic [ref=e115]:
                  - heading "Proteins" [level=4] [ref=e116]
                  - paragraph [ref=e117]: Ready to cook
              - generic [ref=e118]: 1 items
            - generic "Proteins" [ref=e119]:
              - button "Chicken breast، 2 قطعة" [ref=e120] [cursor=pointer]:
                - generic [ref=e121]: "2"
                - generic [ref=e125]: Chicken breast
          - region [ref=e126]:
            - generic [ref=e127]:
              - generic [ref=e128]:
                - generic [ref=e129]: 🥗
                - generic [ref=e130]:
                  - heading "Vegetables" [level=4] [ref=e131]
                  - paragraph [ref=e132]: Fresh and crisp
              - generic [ref=e133]: 2 items
            - generic "Vegetables" [ref=e134]:
              - button "Fresh lettuce، 1 رأس" [ref=e135] [cursor=pointer]:
                - generic [ref=e136]: "1"
                - generic [ref=e140]: Fresh lettuce
              - button "Cherry tomatoes، 9 حبة" [ref=e141] [cursor=pointer]:
                - generic [ref=e142]: "9"
                - generic [ref=e146]: Cherry tomatoes
          - region [ref=e147]:
            - generic [ref=e148]:
              - generic [ref=e149]:
                - generic [ref=e150]: 🍎
                - generic [ref=e151]:
                  - heading "Fruits" [level=4] [ref=e152]
                  - paragraph [ref=e153]: Chilled and fresh
              - generic [ref=e154]: 5 items
            - generic "Fruits" [ref=e155]:
              - button "Red apples، 4 حبة" [ref=e156] [cursor=pointer]:
                - generic [ref=e157]: "4"
                - generic [ref=e161]: Red apples
              - button "Oranges، 3 حبة" [ref=e162] [cursor=pointer]:
                - generic [ref=e163]: "3"
                - generic [ref=e167]: Oranges
              - button "Strawberries، 6 حبة" [ref=e168] [cursor=pointer]:
                - generic [ref=e169]: "6"
                - generic [ref=e173]: Strawberries
              - button "Cherries، 12 حبة" [ref=e174] [cursor=pointer]:
                - generic [ref=e175]: "12"
                - generic [ref=e179]: Cherries
              - button "Grapes، 1 عنقود" [ref=e180] [cursor=pointer]:
                - generic [ref=e181]: "1"
                - generic [ref=e185]: Grapes
          - region [ref=e186]:
            - generic [ref=e187]:
              - generic [ref=e188]:
                - generic [ref=e189]: 🥛
                - generic [ref=e190]:
                  - heading "Dairy" [level=4] [ref=e191]
                  - paragraph [ref=e192]: Kept chilled
              - generic [ref=e193]: 3 items
            - generic "Dairy" [ref=e194]:
              - button "Fresh milk، 1 علبة" [ref=e195] [cursor=pointer]:
                - generic [ref=e196]: "1"
                - generic [ref=e200]: Fresh milk
              - button "Farm eggs، 8 حبة" [pressed] [ref=e201] [cursor=pointer]:
                - generic [ref=e202]: "8"
                - generic [ref=e206]: Farm eggs
              - button "White cheese، 1 علبة" [ref=e207] [cursor=pointer]:
                - generic [ref=e208]: "1"
                - generic [ref=e212]: White cheese
          - region [ref=e213]:
            - generic [ref=e214]:
              - generic [ref=e215]:
                - generic [ref=e216]: 🧃
                - generic [ref=e217]:
                  - heading "Drinks" [level=4] [ref=e218]
                  - paragraph [ref=e219]: Ready to serve
              - generic [ref=e220]: 2 items
            - generic "Drinks" [ref=e221]:
              - button "Orange juice، 1 عبوة" [ref=e222] [cursor=pointer]:
                - generic [ref=e223]: "1"
                - generic [ref=e227]: Orange juice
              - button "Water، 4 عبوة" [ref=e228] [cursor=pointer]:
                - generic [ref=e229]: "4"
                - generic [ref=e233]: Water
          - region [ref=e234]:
            - generic [ref=e235]:
              - generic [ref=e236]:
                - generic [ref=e237]: 🍱
                - generic [ref=e238]:
                  - heading "Ready meals" [level=4] [ref=e239]
                  - paragraph [ref=e240]: Quick and easy
              - generic [ref=e241]: 1 items
            - generic "Ready meals" [ref=e242]:
              - button "Ready hummus، 1 علبة" [ref=e243] [cursor=pointer]:
                - generic [ref=e244]: "1"
                - generic [ref=e248]: Ready hummus
        - generic [ref=e249]:
          - generic [ref=e250]: Your space is organized
          - strong [ref=e254]: 14 items stored
      - generic [ref=e255]:
        - generic "Nutrient distribution statistic" [ref=e256]:
          - generic [ref=e257]: Nutrients
          - generic [ref=e258]:
            - generic [ref=e259]:
              - text: Protein
              - generic [ref=e261]: 35%
            - generic [ref=e262]:
              - text: Carbohydrates
              - generic [ref=e264]: 40%
            - generic [ref=e265]:
              - text: Healthy fats
              - generic [ref=e267]: 25%
        - generic "Daily tip" [ref=e268]:
          - generic [ref=e272]:
            - generic [ref=e273]: Tip of the day
            - strong [ref=e274]: Eat vegetables with every mealfor better health.
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
  1   | import { expect, test, type Page } from '@playwright/test';
  2   | 
  3   | const viewports = [
  4   |   { name: 'phone', width: 390, height: 844 },
  5   |   { name: 'tablet', width: 834, height: 1112 },
  6   |   { name: 'desktop', width: 1440, height: 900 },
  7   | ] as const;
  8   | 
  9   | const shelfTones = ['protein', 'vegetables', 'fruit', 'dairy', 'drinks', 'ready'];
  10  | 
  11  | async function seedDemoSession(page: Page, language: 'ar' | 'en' = 'en') {
  12  |   await page.addInitScript((initialLanguage: 'ar' | 'en') => {
  13  |     const user = {
  14  |       id: 'responsive-layout-test-user',
  15  |       name: 'Responsive Test',
  16  |       email: 'responsive@example.test',
  17  |       password: 'test-password',
  18  |       gender: 'female',
  19  |     };
  20  | 
  21  |     localStorage.setItem('smart_fridge_users', JSON.stringify([user]));
  22  |     localStorage.setItem('smart_fridge_session', user.id);
  23  |     localStorage.setItem('smart_fridge_language', initialLanguage);
  24  |     localStorage.removeItem('smart_fridge_read_notifications');
  25  |   }, language);
  26  | }
  27  | 
  28  | async function measureLayout(page: Page) {
  29  |   return page.evaluate(() => {
  30  |     const rect = (selector: string) => {
  31  |       const element = document.querySelector<HTMLElement>(selector);
  32  |       if (!element) return null;
  33  |       const box = element.getBoundingClientRect();
  34  |       return { left: box.left, right: box.right, width: box.width, top: box.top, height: box.height };
  35  |     };
  36  | 
  37  |     return {
  38  |       viewportWidth: window.innerWidth,
  39  |       documentScrollWidth: document.documentElement.scrollWidth,
  40  |       bodyScrollWidth: document.body.scrollWidth,
  41  |       main: rect('.dashboard-main'),
  42  |       shelf: rect('.smart-shelf-card'),
  43  |       categories: Array.from(document.querySelectorAll<HTMLElement>('.smart-shelf-section')).map(element => {
  44  |         const box = element.getBoundingClientRect();
  45  |         return { left: box.left, right: box.right, width: box.width, height: box.height };
  46  |       }),
  47  |       bottomCards: Array.from(document.querySelectorAll<HTMLElement>('.dashboard-footer > *')).map(element => {
  48  |         const box = element.getBoundingClientRect();
  49  |         return { left: box.left, right: box.right, width: box.width, height: box.height };
  50  |       }),
  51  |       sidebar: rect('.smart-sidebar'),
  52  |       sidebarPosition: getComputedStyle(document.querySelector('.smart-sidebar')!).position,
  53  |       sidebarZIndex: getComputedStyle(document.querySelector('.smart-sidebar')!).zIndex,
  54  |       sidebarLabels: Array.from(document.querySelectorAll<HTMLElement>('.smart-sidebar__label')).map(
  55  |         element => getComputedStyle(element).display,
  56  |       ),
  57  |     };
  58  |   });
  59  | }
  60  | 
  61  | function expectContained(
  62  |   boxes: Array<{ left: number; right: number; width: number; height: number }> | null,
  63  |   viewportWidth: number,
  64  |   label: string,
  65  | ) {
  66  |   expect(boxes, `${label} should exist`).not.toBeNull();
  67  |   for (const box of boxes ?? []) {
  68  |     expect(box.width, `${label} should have width`).toBeGreaterThan(0);
  69  |     expect(box.height, `${label} should have height`).toBeGreaterThan(0);
  70  |     expect(box.left, `${label} should not start outside the viewport`).toBeGreaterThanOrEqual(-1);
  71  |     expect(box.right, `${label} should not exceed the viewport`).toBeLessThanOrEqual(viewportWidth + 1);
  72  |   }
  73  | }
  74  | 
  75  | for (const viewport of viewports) {
  76  |   test(`Smart Shelf remains contained at ${viewport.name} size`, async ({ page }) => {
  77  |     await page.setViewportSize({ width: viewport.width, height: viewport.height });
  78  |     await seedDemoSession(page);
  79  |     await page.goto('/');
  80  |     await expect(page.locator('.smart-shelf-card')).toBeVisible();
  81  | 
  82  |     const initial = await measureLayout(page);
  83  | 
  84  |     expect(initial.documentScrollWidth, `${viewport.name} document width`).toBeLessThanOrEqual(
  85  |       initial.viewportWidth + 1,
  86  |     );
  87  |     expect(initial.bodyScrollWidth, `${viewport.name} body width`).toBeLessThanOrEqual(initial.viewportWidth + 1);
> 88  |     expect(initial.sidebarPosition, `${viewport.name} dock positioning`).toBe('fixed');
      |                                                                          ^ Error: tablet dock positioning
  89  |     expect(initial.sidebarLabels.every(display => display === 'none')).toBe(true);
  90  | 
  91  |     expectContained([initial.main!], initial.viewportWidth, `${viewport.name} dashboard`);
  92  |     expectContained([initial.shelf!], initial.viewportWidth, `${viewport.name} Smart Shelf`);
  93  |     expectContained(initial.categories, initial.viewportWidth, `${viewport.name} Smart Shelf category`);
  94  |     expectContained(initial.bottomCards, initial.viewportWidth, `${viewport.name} bottom card`);
  95  | 
  96  |     await expect(page.locator('.smart-shelf-section')).toHaveCount(shelfTones.length);
  97  |     for (const tone of shelfTones) {
  98  |       await expect(page.locator(`[data-testid="shelf-items-${tone}"]`)).toBeVisible();
  99  |     }
  100 |     await expect(page.locator('.dashboard-footer > .macro-stat')).toBeVisible();
  101 |     await expect(page.locator('.dashboard-footer > .health-tip')).toBeVisible();
  102 |     const addFoodButton = page.locator('.dashboard-footer > .floating-add');
  103 |     if (viewport.name !== 'desktop') {
  104 |       await expect(addFoodButton).toBeHidden();
  105 |     }
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
```