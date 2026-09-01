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
    expect(initial.sidebarPosition, `${viewport.name} dock positioning`).toBe(
      viewport.name === 'phone' ? 'fixed' : 'sticky',
    );
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

test('desktop sidebar slides from the correct edge in both languages', async ({ page }) => {
  for (const language of ['en', 'ar'] as const) {
    for (const width of [834, 1440]) {
      const testPage = await page.context().newPage();
      await testPage.setViewportSize({ width, height: width === 834 ? 1112 : 900 });
      await seedDemoSession(testPage, language);
      await testPage.goto('/');

      const closed = await measureLayout(testPage);
      expect(closed.sidebarPosition).toBe('sticky');
      expect(closed.sidebar?.width).toBe(0);
      expect(
        await testPage.locator('.smart-sidebar-scrim').evaluate(element => getComputedStyle(element).display),
      ).toBe('none');
      await expect(testPage.getByTestId('button-sidebar-toggle')).toBeHidden();

      await testPage.getByTestId('button-mobile-menu').click();
      await testPage.waitForTimeout(350);
      const open = await measureLayout(testPage);
      const shellBox = await testPage.locator('.app-shell').evaluate(element => {
        const box = element.getBoundingClientRect();
        return { left: box.left, right: box.right };
      });
      expect(open.sidebar?.width).toBeGreaterThan(200);
      expect(open.main?.width).toBeLessThan((closed.main?.width ?? width) - 100);
      expect(open.sidebar?.left).toBeGreaterThanOrEqual(0);
      expect(open.sidebar?.right).toBeLessThanOrEqual(shellBox.right);
      expect(open.sidebar?.left).toBeCloseTo(
        language === 'ar' ? shellBox.right - (open.sidebar?.width ?? 0) : shellBox.left,
        0,
      );
      expect(open.sidebar?.right).toBeCloseTo(
        language === 'ar' ? shellBox.right : shellBox.left + (open.sidebar?.width ?? 0),
        0,
      );
      await expect(testPage.getByTestId('button-sidebar-toggle')).toBeHidden();

      await testPage.getByTestId('button-mobile-menu').click();
      await testPage.waitForTimeout(350);
      const collapsed = await measureLayout(testPage);
      expect(collapsed.sidebar?.width).toBe(0);
      expect(collapsed.main?.width).toBeCloseTo(closed.main?.width ?? 0, 0);
      await testPage.close();
    }
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

test('keeps sidebar navigation clean and logout exclusive to its footer', async ({ page }) => {
  for (const [index, language] of ['ar', 'en'].entries()) {
    const testPage = index === 0 ? page : await page.context().newPage();
    await testPage.setViewportSize({ width: 390, height: 844 });
    await seedDemoSession(testPage, language);
    await testPage.goto('/');

    const cleanup = await testPage.evaluate(() => {
      const sidebarFooter = document.querySelector('.smart-sidebar__footer');
      return {
        sidebarLogoutCount: document.querySelectorAll('.smart-sidebar__logout').length,
        footerLogoutCount: document.querySelectorAll('.smart-sidebar__footer .smart-sidebar__logout').length,
        footerLastChildIsLogout: sidebarFooter?.lastElementChild?.classList.contains('smart-sidebar__logout') ?? false,
        topLogoutCount: document.querySelectorAll(
          '[data-testid="button-mobile-logout"], [data-testid="button-settings-logout"], .dashboard-topbar [aria-label*="Sign out"], .dashboard-topbar [aria-label*="تسجيل الخروج"]',
        ).length,
        removedNavLabels: Array.from(document.querySelectorAll('.smart-sidebar__link')).map(link => link.textContent?.trim()).filter(label =>
          label === 'Suggested recipes' || label === 'Favorites' || label === 'وصفات مقترحة' || label === 'المفضلة',
        ),
        logoCount: document.querySelectorAll('.smart-sidebar__brand-mark svg, .brand-mark svg').length,
      };
    });

    expect(cleanup.sidebarLogoutCount).toBe(1);
    expect(cleanup.footerLogoutCount).toBe(1);
    expect(cleanup.footerLastChildIsLogout).toBe(true);
    expect(cleanup.topLogoutCount).toBe(0);
    expect(cleanup.removedNavLabels).toEqual([]);
    expect(cleanup.logoCount).toBe(2);

    if (index > 0) await testPage.close();
  }
});

test('does not show a sidebar menu launcher on settings', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await seedDemoSession(page, 'en');
    await page.goto('/settings');

    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByTestId('button-page-menu')).toHaveCount(0);
    await expect(page.getByTestId('button-mobile-menu-legacy')).toHaveCount(0);
  }
});

test('does not show a sidebar menu launcher on meals or shopping', async ({ page }) => {
  for (const path of ['/meals', '/shopping']) {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await seedDemoSession(page, 'en');
      await page.goto(path);

      await expect(page.locator('.page-heading')).toBeVisible();
      await expect(page.getByTestId('button-page-menu')).toHaveCount(0);
      await expect(page.getByTestId('button-mobile-menu-legacy')).toHaveCount(0);
    }
  }
});

test('keeps settings options free of secondary copy', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedDemoSession(page, 'en');
  await page.goto('/settings');

  for (const sectionTestId of [
    'button-settings-عام',
    'button-settings-معلومات الملف الشخصي',
    'button-settings-المظهر',
    'button-settings-التنبيهات',
    'button-settings-الخصوصية',
  ]) {
    await page.getByTestId(sectionTestId).click();
    await expect(page.locator('.page-heading p')).toHaveCount(0);
    await expect(page.locator('.settings-grid .card-title p, .settings-grid .setting-line p, .settings-grid .settings-profile-heading p, .settings-grid .settings-profile-actions > span')).toHaveCount(0);
  }
});

test('keeps settings vertical with simple labels', async ({ page }) => {
  for (const [language, labels] of [
    ['ar', ['عام', 'الحساب', 'المظهر', 'التنبيهات', 'الخصوصية']],
    ['en', ['General', 'Profile', 'Theme', 'Alerts', 'Privacy']],
  ] as const) {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedDemoSession(page, language);
    await page.goto('/settings');

    const gridColumns = await page.locator('.settings-grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length);
    expect(gridColumns).toBe(1);
    await expect(page.locator('.settings-nav')).toHaveCSS('flex-direction', 'column');
    await expect(page.locator('.settings-nav button')).toHaveText([...labels]);
  }
});

test('keeps dark mode surfaces and text readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedDemoSession(page, 'en');
  await page.goto('/settings');
  await page.getByTestId('button-settings-المظهر').click();
  await page.getByTestId('toggle-dark-mode').click();
  await expect(page.locator('.theme-dark')).toHaveClass(/(^|\s)theme-dark(\s|$)/);
  await expect(page.locator('.theme-dark .card').first()).toHaveCSS('background-color', 'rgb(27, 39, 52)');

  const styles = await page.evaluate(() => {
    const app = document.querySelector('.theme-dark')!;
    const card = document.querySelector('.theme-dark .settings-grid > .card.card-pad')!;
    const heading = document.querySelector('.theme-dark .settings-grid .card-title h3')!;
    const settingTitle = document.querySelector('.theme-dark .settings-grid .setting-line strong')!;
    return {
      filter: getComputedStyle(app).filter,
      appBackground: getComputedStyle(app).backgroundColor,
      cardBackground: getComputedStyle(card).backgroundColor,
      cardColor: getComputedStyle(card).color,
      headingColor: getComputedStyle(heading).color,
      settingTitleColor: getComputedStyle(settingTitle).color,
      cardBorder: getComputedStyle(card).borderTopColor,
    };
  });

  expect(styles.filter).toBe('none');
  expect(styles.appBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(styles.cardBackground).not.toBe('rgb(255, 255, 255)');
  expect(styles.cardColor).not.toBe('rgb(32, 48, 36)');
  expect(styles.headingColor).not.toBe('rgb(32, 48, 36)');
  expect(styles.settingTitleColor).not.toBe('rgb(32, 48, 36)');
  expect(styles.cardBorder).not.toBe('rgba(0, 0, 0, 0)');
});

test('keeps dark mode surfaces softly rounded', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedDemoSession(page, 'en');
  await page.goto('/settings');
  await page.getByTestId('button-settings-المظهر').click();
  await page.getByTestId('toggle-dark-mode').click();
  await page.getByTestId('button-settings-عام').click();

  for (const [selector, expectedRadius] of [
    ['.settings-grid > .card.card-pad', '22px'],
    ['.settings-nav', '22px'],
    ['.settings-nav button', '12px'],
    ['.search-box', '12px'],
  ] as const) {
    await expect(page.locator(`.theme-dark ${selector}`).first()).toHaveCSS('border-radius', expectedRadius);
  }
});

test('keeps Quick Stats spaced and softly rounded', async ({ page }) => {
  for (const width of [390, 1366]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await seedDemoSession(page, 'en');
    await page.goto('/');

    await expect(page.locator('.dashboard-metrics')).toBeVisible();
    await expect(page.locator('.dashboard-metrics .dashboard-stat')).toHaveCount(3);
    await expect(page.locator('.dashboard-metrics')).toHaveCSS('gap', width === 390 ? '10px' : '12px');
    const metricsWidth = await page.locator('.dashboard-metrics').evaluate((element) => element.getBoundingClientRect().width);
    if (width === 1366) {
      expect(metricsWidth).toBeLessThanOrEqual(680);
    } else {
      const topbarWidth = await page.locator('.dashboard-topbar').evaluate((element) => element.getBoundingClientRect().width);
      expect(metricsWidth).toBeLessThan(topbarWidth);
    }
    for (const stat of await page.locator('.dashboard-metrics .dashboard-stat').all()) {
      await expect(stat).toHaveCSS('border-radius', '18px');
    }
  }
});

test('keeps Daily Analysis centered, responsive, and menu-free', async ({ page }) => {
  for (const [language, width] of [
    ['ar', 390],
    ['en', 390],
    ['en', 1366],
  ] as const) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await seedDemoSession(page, language);
    await page.goto('/daily-analysis');

    await expect(page.locator('.daily-analysis-page .page-heading h2')).toBeVisible();
    await expect(page.locator('.daily-analysis-page .page-heading-menu')).toHaveCount(0);
    if (width === 390) {
      await expect(page.locator('.mobile-topbar-daily-analysis .menu-toggle')).toHaveCount(0);
      const logoCenter = await page.locator('.mobile-topbar-daily-analysis .brand').evaluate(element => {
        const rect = element.getBoundingClientRect();
        return (rect.left + rect.right) / 2;
      });
      const barCenter = await page.locator('.mobile-topbar-daily-analysis').evaluate(element => {
        const rect = element.getBoundingClientRect();
        return (rect.left + rect.right) / 2;
      });
      expect(Math.abs(logoCenter - barCenter)).toBeLessThanOrEqual(1);
    }
    await expect(page.locator('.daily-analysis-page .daily-analysis-card')).toHaveCount(3);
    await expect(page.locator('.daily-analysis-page .daily-ring')).toHaveCount(3);
    await expect(page.locator('.daily-analysis-page .recharts-area-curve')).toHaveCount(1);

    const layout = await page.evaluate(() => {
      const heading = document.querySelector('.daily-analysis-page .page-heading').getBoundingClientRect();
      const title = document.querySelector('.daily-analysis-page .page-heading h2').getBoundingClientRect();
      const copy = document.querySelector('.daily-analysis-page .page-heading-copy').getBoundingClientRect();
      const date = document.querySelector('.daily-analysis-page .page-heading-action').getBoundingClientRect();
      return {
        headingCenter: (heading.left + heading.right) / 2,
        titleCenter: (title.left + title.right) / 2,
        copyTop: copy.top,
        copyBottom: copy.bottom,
        dateTop: date.top,
        documentScrollWidth: document.documentElement.scrollWidth,
      };
    });

    expect(layout.documentScrollWidth).toBeLessThanOrEqual(width + 1);
    if (width === 1366) {
      expect(Math.abs(layout.titleCenter - layout.headingCenter)).toBeLessThanOrEqual(1);
    } else {
      expect(layout.dateTop).toBeGreaterThan(layout.copyBottom);
    }
  }
});

test('centers the mobile site mark on meals, shopping, and analysis', async ({ page }) => {
  for (const language of ['ar', 'en'] as const) {
    for (const path of ['/meals', '/shopping', '/daily-analysis', '/settings']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await seedDemoSession(page, language);
      await page.goto(path);

      await expect(page.locator('.mobile-topbar-centered .brand')).toHaveCount(1);
      await expect(page.getByTestId('button-mobile-menu-legacy')).toHaveCount(0);

      const header = await page.locator('.mobile-topbar-centered').evaluate(element => {
        const headerRect = element.getBoundingClientRect();
        const brandRect = element.querySelector('.brand')!.getBoundingClientRect();
        return {
          brandCenter: (brandRect.left + brandRect.right) / 2,
          headerCenter: (headerRect.left + headerRect.right) / 2,
          direction: getComputedStyle(element).direction,
          documentDirection: document.documentElement.dir,
        };
      });

      expect(Math.abs(header.brandCenter - header.headerCenter)).toBeLessThanOrEqual(1);
      expect(header.direction).toBe('ltr');
      expect(header.documentDirection).toBe(language === 'ar' ? 'rtl' : 'ltr');
    }
  }
});

test('keeps inner-page headings centered in both languages', async ({ page }) => {
  for (const language of ['ar', 'en'] as const) {
    for (const path of ['/settings', '/meals', '/shopping', '/daily-analysis']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await seedDemoSession(page, language);
      await page.goto(path);

      const layout = await page.locator('.page-heading-centered').evaluate(element => {
        const heading = element.getBoundingClientRect();
        const title = element.querySelector('h2')!.getBoundingClientRect();
        return {
          titleCenter: (title.left + title.right) / 2,
          headingCenter: (heading.left + heading.right) / 2,
          textAlign: getComputedStyle(element.querySelector('.page-heading-copy')!).textAlign,
          direction: getComputedStyle(element).direction,
        };
      });

      expect(Math.abs(layout.titleCenter - layout.headingCenter)).toBeLessThanOrEqual(1);
      expect(layout.textAlign).toBe('center');
      expect(layout.direction).toBe(language === 'ar' ? 'rtl' : 'ltr');
    }
  }
});

test('keeps Shopping List compact and aligned in both directions', async ({ page }) => {
  for (const [language, width, darkMode] of [
    ['ar', 390, false],
    ['en', 768, true],
    ['en', 1366, false],
  ] as const) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await seedDemoSession(page, language);
    if (darkMode) {
      await page.addInitScript(() => localStorage.setItem('smart_fridge_data', JSON.stringify({ 'responsive-user': { darkMode: true } })));
    }
    await page.goto('/shopping');

    await expect(page.locator('.shopping-page .page-heading h2')).toBeVisible();
    await expect(page.locator('.shopping-page .page-heading-menu')).toHaveCount(0);
    await expect(page.locator('.shopping-page [data-testid="button-logout"]')).toHaveCount(0);
    await expect(page.locator('.shopping-page .shopping-layout')).toBeVisible();
    await expect(page.locator('.shopping-page #shopping-name')).toHaveAttribute('id', 'shopping-name');
    await expect(page.locator('.shopping-page label[for="shopping-name"]')).toBeAttached();

    const layout = await page.evaluate(() => {
      const heading = document.querySelector('.shopping-page .page-heading').getBoundingClientRect();
      const title = document.querySelector('.shopping-page .page-heading h2').getBoundingClientRect();
      const description = document.querySelector('.shopping-page .page-heading p').getBoundingClientRect();
      const actions = document.querySelector('.shopping-page .page-actions').getBoundingClientRect();
      const listCard = document.querySelector('.shopping-page .shopping-list-card').getBoundingClientRect();
      return {
        titleCenter: (title.left + title.right) / 2,
        headingCenter: (heading.left + heading.right) / 2,
        actionsTop: actions.top,
        descriptionBottom: description.bottom,
        actionsWidth: actions.width,
        listCardHeight: listCard.height,
        documentScrollWidth: document.documentElement.scrollWidth,
      };
    });

    expect(Math.abs(layout.titleCenter - layout.headingCenter)).toBeLessThanOrEqual(1);
    expect(layout.actionsTop).toBeGreaterThan(layout.descriptionBottom);
    if (width === 390) expect(layout.actionsWidth).toBeLessThanOrEqual(281);
    expect(layout.documentScrollWidth).toBeLessThanOrEqual(width + 1);
    expect(layout.listCardHeight).toBeLessThan(900);
  }
});

test('keeps the active sidebar item flat without shadow artifacts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedDemoSession(page, 'ar');
  await page.goto('/');

  const activeItem = page.getByTestId('link-nav-ثلاجتي');
  const styles = await activeItem.evaluate(element => {
    const computed = getComputedStyle(element);
    const before = getComputedStyle(element, '::before');
    const after = getComputedStyle(element, '::after');
    return {
      boxShadow: computed.boxShadow,
      filter: computed.filter,
      borderStyle: computed.borderStyle,
      backgroundImage: computed.backgroundImage,
      backgroundColor: computed.backgroundColor,
      beforeContent: before.content,
      afterBoxShadow: after.boxShadow,
      afterFilter: after.filter,
    };
  });

  expect(styles.boxShadow).toBe('none');
  expect(styles.filter).toBe('none');
  expect(styles.borderStyle).toBe('none');
  expect(styles.backgroundImage).toBe('none');
  expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(styles.beforeContent).toBe('none');
  expect(styles.afterBoxShadow).toBe('none');
  expect(styles.afterFilter).toBe('none');
});

test('anchors the sidebar close button to the opposite header corner', async ({ page }) => {
  for (const [index, language] of ['ar', 'en'].entries()) {
    const testPage = index === 0 ? page : await page.context().newPage();
    await testPage.setViewportSize({ width: 390, height: 844 });
    await seedDemoSession(testPage, language);
    await testPage.goto('/');
    await testPage.getByTestId('button-mobile-menu').click();

    const layout = await testPage.locator('.smart-sidebar__head').evaluate(head => {
      const button = head.querySelector<HTMLElement>('.smart-sidebar__toggle')!;
      const box = head.getBoundingClientRect();
      const buttonBox = button.getBoundingClientRect();
      const styles = getComputedStyle(button);
      return {
        headLeft: box.left,
        headRight: box.right,
        buttonLeft: buttonBox.left,
        buttonRight: buttonBox.right,
        width: buttonBox.width,
        height: buttonBox.height,
        justifyContent: getComputedStyle(head).justifyContent,
        borderRadius: styles.borderRadius,
      };
    });

    expect(layout.justifyContent).toBe('space-between');
    expect(layout.borderRadius).toBe('50%');
    expect(layout.width).toBe(layout.height);
    if (language === 'ar') {
      expect(layout.buttonLeft - layout.headLeft).toBeCloseTo(0, 0);
    } else {
      expect(layout.headRight - layout.buttonRight).toBeCloseTo(0, 0);
    }

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

test('keeps the desktop Arabic header in strict RTL group order', async ({ page }) => {
  for (const viewport of [{ width: 834, height: 1112 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await seedDemoSession(page, 'ar');
    await page.goto('/');

    const groups = await page.locator('.dashboard-topbar').evaluate(header => {
      const getBox = (selector: string) => {
        const box = header.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
        return { left: box.left, right: box.right };
      };
      return {
        start: getBox('.dashboard-header-start'),
        metrics: getBox('.dashboard-metrics'),
        actions: getBox('.dashboard-actions'),
      };
    });

    expect(groups.start.left).toBeGreaterThan(groups.metrics.right);
    expect(groups.metrics.left).toBeGreaterThan(groups.actions.right);
  }
});

test('keeps notifications inside the viewport on every screen size and direction', async ({ page }) => {
  for (const language of ['ar', 'en'] as const) {
    for (const viewport of [{ width: 390, height: 844 }, { width: 834, height: 900 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(viewport);
      await seedDemoSession(page, language);
      await page.goto('/');
      await page.getByTestId('button-notifications').click();
      await expect(page.locator('.notification-dropdown')).toBeVisible();

      const layout = await page.locator('.notification-dropdown').evaluate(element => {
        const box = element.getBoundingClientRect();
        const styles = getComputedStyle(element);
        return {
          left: box.left,
          right: box.right,
          top: box.top,
          bottom: box.bottom,
          width: box.width,
          height: box.height,
          viewportWidth: document.documentElement.clientWidth,
          viewportHeight: window.innerHeight,
          position: styles.position,
          transform: styles.transform,
        };
      });

      expect(layout.position).toBe('fixed');
      expect(layout.left).toBeGreaterThanOrEqual(-1);
      expect(layout.right).toBeLessThanOrEqual(layout.viewportWidth + 1);
      expect(layout.top).toBeGreaterThanOrEqual(-1);
      expect(layout.bottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
      expect(layout.width).toBeGreaterThan(280);
      expect(layout.height).toBeGreaterThan(700);
      expect(layout.transform).toBe('matrix(1, 0, 0, 1, 0, 0)');

      await page.keyboard.press('Escape');
      await expect(page.locator('.notification-dropdown')).toBeHidden();
    }
  }
});