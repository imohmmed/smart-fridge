import { expect, test, type Page } from '@playwright/test';

const viewports = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

const shelfTones = ['protein', 'vegetables', 'fruit', 'dairy', 'drinks', 'ready'];

async function seedDemoSession(page: Page, language: 'ar' | 'en' = 'en') {
  await page.addInitScript((initialLanguage: 'ar' | 'en') => {
    const user = {
      id: 'responsive-layout-test-user',
      name: 'Responsive Test',
      email: 'responsive@example.test',
      password: 'test-password',
      gender: 'female',
    };

    localStorage.setItem('smart_fridge_users', JSON.stringify([user]));
    localStorage.setItem('smart_fridge_session', user.id);
    localStorage.setItem('smart_fridge_language', initialLanguage);
    localStorage.removeItem('smart_fridge_read_notifications');
  }, language);
}

async function measureLayout(page: Page) {
  return page.evaluate(() => {
    const rect = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right, width: box.width, top: box.top, height: box.height };
    };

    return {
      viewportWidth: window.innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      main: rect('.dashboard-main'),
      shelf: rect('.smart-shelf-card'),
      categories: Array.from(document.querySelectorAll<HTMLElement>('.smart-shelf-section')).map(element => {
        const box = element.getBoundingClientRect();
        return { left: box.left, right: box.right, width: box.width, height: box.height };
      }),
      bottomCards: Array.from(document.querySelectorAll<HTMLElement>('.dashboard-footer > *')).map(element => {
        const box = element.getBoundingClientRect();
        return { left: box.left, right: box.right, width: box.width, height: box.height };
      }),
      sidebar: rect('.smart-sidebar'),
      sidebarPosition: getComputedStyle(document.querySelector('.smart-sidebar')!).position,
      sidebarZIndex: getComputedStyle(document.querySelector('.smart-sidebar')!).zIndex,
      sidebarLabels: Array.from(document.querySelectorAll<HTMLElement>('.smart-sidebar__label')).map(
        element => getComputedStyle(element).display,
      ),
    };
  });
}

function expectContained(
  boxes: Array<{ left: number; right: number; width: number; height: number }> | null,
  viewportWidth: number,
  label: string,
) {
  expect(boxes, `${label} should exist`).not.toBeNull();
  for (const box of boxes ?? []) {
    expect(box.width, `${label} should have width`).toBeGreaterThan(0);
    expect(box.height, `${label} should have height`).toBeGreaterThan(0);
    expect(box.left, `${label} should not start outside the viewport`).toBeGreaterThanOrEqual(-1);
    expect(box.right, `${label} should not exceed the viewport`).toBeLessThanOrEqual(viewportWidth + 1);
  }
}

for (const viewport of viewports) {
  test(`Smart Shelf remains contained at ${viewport.name} size`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await seedDemoSession(page);
    await page.goto('/');
    await expect(page.locator('.smart-shelf-card')).toBeVisible();

    const initial = await measureLayout(page);

    expect(initial.documentScrollWidth, `${viewport.name} document width`).toBeLessThanOrEqual(
      initial.viewportWidth + 1,
    );
    expect(initial.bodyScrollWidth, `${viewport.name} body width`).toBeLessThanOrEqual(initial.viewportWidth + 1);
    expect(initial.sidebarPosition, `${viewport.name} dock positioning`).toBe('fixed');
    expect(initial.sidebarLabels.every(display => display === 'none')).toBe(true);

    expectContained([initial.main!], initial.viewportWidth, `${viewport.name} dashboard`);
    expectContained([initial.shelf!], initial.viewportWidth, `${viewport.name} Smart Shelf`);
    expectContained(initial.categories, initial.viewportWidth, `${viewport.name} Smart Shelf category`);
    expectContained(initial.bottomCards, initial.viewportWidth, `${viewport.name} bottom card`);

    await expect(page.locator('.smart-shelf-section')).toHaveCount(shelfTones.length);
    for (const tone of shelfTones) {
      await expect(page.locator(`[data-testid="shelf-items-${tone}"]`)).toBeVisible();
    }
    await expect(page.locator('.dashboard-footer > .macro-stat')).toBeVisible();
    await expect(page.locator('.dashboard-footer > .health-tip')).toBeVisible();
    const addFoodButton = page.locator('.dashboard-footer > .floating-add');
    if (viewport.name !== 'desktop') {
      await expect(addFoodButton).toBeHidden();
    }
    await page.locator('.fridge-end-sentinel').scrollIntoViewIfNeeded();
    await expect(addFoodButton).toBeVisible();

    if (viewport.name === 'phone') {
      const mainWidthBeforeDock = initial.main?.width;
      const scrollWidthBeforeDock = initial.documentScrollWidth;

      await expect(page.getByTestId('button-mobile-menu')).toBeVisible();
      await page.getByTestId('button-mobile-menu').click();
      await expect(page.locator('.smart-sidebar-scrim')).toHaveClass(/is-open/);
      await expect
        .poll(() => page.locator('.smart-sidebar').evaluate(element => element.getBoundingClientRect().right))
        .toBeGreaterThan(0);

      const open = await measureLayout(page);
      expect(open.sidebarPosition, 'open mobile dock positioning').toBe('fixed');
      expect(open.sidebar).not.toBeNull();
      expect(Number(open.sidebarZIndex), 'open mobile dock should layer above content').toBeGreaterThan(0);
      expect(open.sidebar!.right).toBeGreaterThan(open.main!.left);
      expect(open.sidebar!.left).toBeLessThan(open.main!.right);
      expect(open.sidebar!.top + open.sidebar!.height).toBeGreaterThan(open.main!.top);
      expect(open.sidebar!.top).toBeLessThan(open.main!.top + open.main!.height);
      expect(open.main?.width).toBeCloseTo(mainWidthBeforeDock ?? 0, 0);
      expect(open.documentScrollWidth).toBeLessThanOrEqual(open.viewportWidth + 1);
      expect(open.documentScrollWidth).toBe(scrollWidthBeforeDock);
      expect(open.main?.width).toBeLessThanOrEqual(open.viewportWidth + 1);
      expect(
        await page.locator('.smart-sidebar-scrim').evaluate(element => getComputedStyle(element).display),
      ).toBe('block');
      expectContained([open.main!, open.shelf!], open.viewportWidth, 'open mobile content');

      await page.locator('.smart-sidebar-scrim').click({
        position: { x: viewport.width - 20, y: Math.floor(viewport.height / 2) },
      });
      await expect(page.locator('.smart-sidebar-scrim')).not.toHaveClass(/is-open/);
    }
  });
}

test('mobile sidebar slides from the correct edge in both languages', async ({ page }) => {
  for (const [index, language] of ['en', 'ar'].entries()) {
    const testPage = index === 0 ? page : await page.context().newPage();
    await testPage.setViewportSize({ width: 390, height: 844 });
    await seedDemoSession(testPage, language);
    await testPage.goto('/');
    await testPage.getByTestId('button-mobile-menu').click();
    await expect(testPage.locator('.smart-sidebar')).toBeVisible();
    await expect(testPage.locator('.smart-sidebar-scrim')).toHaveClass(/is-open/);
    await testPage.waitForTimeout(400);

    const openBox = await testPage.locator('.smart-sidebar').evaluate(element => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right };
    });
    expect(openBox.left).toBeGreaterThanOrEqual(0);
    expect(openBox.right).toBeLessThanOrEqual(390);
    expect(await testPage.locator('html').getAttribute('dir')).toBe(language === 'ar' ? 'rtl' : 'ltr');

    await testPage.locator('.smart-sidebar-scrim').click({ position: { x: 5, y: Math.floor(844 / 2) } });
    await expect(testPage.locator('.smart-sidebar-scrim')).not.toHaveClass(/is-open/);
    await testPage.waitForTimeout(400);
    const closedBox = await testPage.locator('.smart-sidebar').evaluate(element => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right };
    });
    if (language === 'ar') {
      expect(closedBox.left).toBeGreaterThanOrEqual(390);
    } else {
      expect(closedBox.right).toBeLessThanOrEqual(0);
    }
    if (index > 0) await testPage.close();
  }
});

test('keeps sidebar icons and labels adjacent in RTL and LTR', async ({ page }) => {
  for (const [index, language] of ['en', 'ar'].entries()) {
    const testPage = index === 0 ? page : await page.context().newPage();
    await testPage.setViewportSize({ width: 390, height: 844 });
    await seedDemoSession(testPage, language);
    await testPage.goto('/');
    await testPage.getByTestId('button-mobile-menu').click();
    await testPage.waitForTimeout(350);

    const layout = await testPage.getByTestId('link-nav-ثلاجتي').evaluate(link => {
      const icon = link.querySelector<HTMLElement>('.smart-sidebar__icon')!.getBoundingClientRect();
      const label = link.querySelector<HTMLElement>('.smart-sidebar__label')!.getBoundingClientRect();
      const styles = getComputedStyle(link);
      return {
        direction: styles.direction,
        gap: styles.gap,
        justifyContent: styles.justifyContent,
        marginInlineStart: styles.marginInlineStart,
        marginInlineEnd: styles.marginInlineEnd,
        iconLeft: icon.left,
        iconRight: icon.right,
        labelLeft: label.left,
        labelRight: label.right,
      };
    });

    expect(layout.direction).toBe(language === 'ar' ? 'rtl' : 'ltr');
    expect(layout.gap).toBe('12px');
    expect(layout.justifyContent).toBe('flex-start');
    expect(layout.marginInlineStart).toBe('0px');
    expect(layout.marginInlineEnd).toBe('0px');
    if (language === 'ar') {
      expect(layout.iconLeft - layout.labelRight).toBeCloseTo(12, 0);
    } else {
      expect(layout.labelLeft - layout.iconRight).toBeCloseTo(12, 0);
    }

    await testPage.locator('.smart-sidebar-scrim').click({ position: { x: 5, y: 422 } });
    if (index > 0) await testPage.close();
  }
});

test('keeps the responsive header greeting and profile avatar contained', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await seedDemoSession(page, 'en');
    await page.goto('/');

    const header = page.locator('.dashboard-topbar');
    const headerBox = await header.evaluate(element => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right };
    });
    const avatar = page.locator('.dashboard-profile .profile-avatar-sticker');
    const avatarBox = await avatar.evaluate(element => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right };
    });

    expect(headerBox, `${viewport.name} header should exist`).not.toBeNull();
    expect(avatarBox, `${viewport.name} profile avatar should exist`).not.toBeNull();
    expect(headerBox!.left).toBeGreaterThanOrEqual(-1);
    expect(headerBox!.right).toBeLessThanOrEqual(viewport.width + 1);
    expect(avatarBox!.left).toBeGreaterThanOrEqual(-1);
    expect(avatarBox!.right).toBeLessThanOrEqual(viewport.width + 1);
    await expect(page.locator('.dashboard-welcome')).toContainText('Welcome back, Responsive Test');

    if (viewport.name === 'phone') {
      await expect(page.locator('.dashboard-profile > div:last-child')).toBeHidden();
    } else {
      await expect(page.locator('.dashboard-profile > div:last-child')).toBeVisible();
    }
  }
});