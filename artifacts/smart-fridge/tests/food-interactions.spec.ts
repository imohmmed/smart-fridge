import { expect, test } from '@playwright/test';

async function seedDemoSession(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const user = {
      id: 'food-interaction-test-user',
      name: 'Food Test',
      email: 'food-interaction@example.test',
      password: 'test-password',
      gender: 'female',
    };

    localStorage.setItem('smart_fridge_users', JSON.stringify([user]));
    localStorage.setItem('smart_fridge_session', user.id);
    localStorage.setItem('smart_fridge_language', 'en');
    localStorage.removeItem('smart_fridge_read_notifications');
  });
}

test.describe('Smart Fridge food interactions', () => {
  test('reveals Add new food at the end of the fridge', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const addFoodButton = page.getByTestId('button-add-food-dashboard');
    await expect(addFoodButton).toBeHidden();

    await page.locator('.fridge-end-sentinel').scrollIntoViewIfNeeded();
    await expect(addFoodButton).toBeVisible();
    await expect(addFoodButton).toHaveAttribute('aria-hidden', 'false');
  });

  test('opens details and updates the selected food quantity', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByTestId('button-food-eggs').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByTestId('input-food-details-quantity')).toHaveValue('8');
    const dialogBox = await page.getByRole('dialog').boundingBox();
    expect(dialogBox?.width).toBeLessThanOrEqual(332);
    expect(dialogBox?.height).toBeLessThan(520);

    await page.getByTestId('input-food-details-quantity').fill('12');
    await page.getByTestId('button-save-food-details').click();

    await expect(page.getByTestId('input-food-details-quantity')).toHaveValue('12');
    await expect(page.getByTestId('button-food-eggs')).toHaveAttribute('aria-label', /12/);
  });

  test('persists a quantity update after reload', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByTestId('button-food-eggs').click();
    await page.getByTestId('input-food-details-quantity').fill('11');
    await page.getByTestId('button-save-food-details').click();
    await page.reload();

    await page.getByTestId('button-food-eggs').click();
    await expect(page.getByTestId('input-food-details-quantity')).toHaveValue('11');
  });

  test('confirms deletion and closes the details surface', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByTestId('button-food-eggs').click();
    await page.getByTestId('button-delete-food').click();
    await expect(page.getByTestId('button-confirm-delete-food')).toBeVisible();
    await page.getByTestId('button-confirm-delete-food').click();

    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByTestId('button-food-eggs')).toHaveCount(0);
  });

  test('closes food details with Escape', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByTestId('button-food-eggs').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('uses the side details panel instead of a dialog on desktop', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.getByTestId('button-food-eggs').click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.locator('.item-detail-panel')).toContainText('Farm eggs');
  });

  test('locks page scrolling while food details are open on phone', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByTestId('button-food-eggs').click();
    await expect.poll(() => page.evaluate(() => ({
      htmlOverflow: document.documentElement.style.overflow,
      bodyOverflow: document.body.style.overflow,
    }))).toEqual({ htmlOverflow: 'hidden', bodyOverflow: 'hidden' });

    await page.getByTestId('button-close-food-details').click();
    await expect.poll(() => page.evaluate(() => ({
      htmlOverflow: document.documentElement.style.overflow,
      bodyOverflow: document.body.style.overflow,
    }))).toEqual({ htmlOverflow: '', bodyOverflow: '' });
  });

  test('hides Add new food while the sidebar is open', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const addFoodButton = page.getByTestId('button-add-food-dashboard');
    await page.locator('.fridge-end-sentinel').scrollIntoViewIfNeeded();
    await expect(addFoodButton).toBeVisible();

    await page.getByTestId('button-mobile-menu').evaluate(element => (element as HTMLButtonElement).click());
    await expect(addFoodButton).toBeHidden();
    await expect(addFoodButton).toHaveAttribute('aria-hidden', 'true');

    await page.getByTestId('button-sidebar-toggle').click();
    await expect(addFoodButton).toBeVisible();
  });

  test('places the shopping count above its icon on the home page', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const icon = page.locator('.shopping-heading-icon');
    const countBadge = page.locator('.shopping-count-badge');
    await expect(icon).toBeVisible();
    await expect(countBadge).toBeVisible();
    const iconBox = await icon.boundingBox();
    const badgeBox = await countBadge.boundingBox();
    expect((badgeBox?.y ?? 0) + (badgeBox?.height ?? 0)).toBeLessThan((iconBox?.y ?? 0) + (iconBox?.height ?? 0) / 2);
    await expect(countBadge).toHaveAttribute('aria-label', /items remaining/);
  });

  test('floats the shopping count over the cart icon in the sidebar', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByTestId('button-mobile-menu').click();

    const shoppingLink = page.getByTestId('link-nav-قائمة التسوق');
    const iconWrapper = shoppingLink.locator('.smart-sidebar__shopping-icon');
    const countBadge = shoppingLink.locator('.smart-sidebar__count');

    await expect(iconWrapper).toBeVisible();
    await expect(countBadge).toBeVisible();
    await expect(iconWrapper).toHaveCSS('position', 'relative');
    await expect(countBadge).toHaveCSS('position', 'absolute');
    await expect(countBadge).toHaveCSS('top', '-4px');
    await expect(countBadge).toHaveCSS('right', '-4px');
    await expect(countBadge).toHaveCSS('z-index', '10');
    await expect(countBadge).toHaveCSS('display', 'flex');
    await expect(countBadge).toHaveCSS('border-top-width', '2px');
    await expect(countBadge).toHaveCSS('border-top-color', 'rgb(255, 255, 255)');
    await expect(countBadge).toHaveCSS('border-radius', '50%');

    const iconBox = await iconWrapper.boundingBox();
    const badgeBox = await countBadge.boundingBox();
    expect(badgeBox?.y).toBeLessThan((iconBox?.y ?? 0) + (iconBox?.height ?? 0));
    expect((badgeBox?.x ?? 0) + (badgeBox?.width ?? 0)).toBeGreaterThan((iconBox?.x ?? 0) + (iconBox?.width ?? 0) / 2);
  });

  test('returns to the dashboard with the native browser back button', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    for (const [testId, path] of [
      ['link-nav-وجباتي', '/meals'],
      ['link-nav-تحليل يومي', '/daily-analysis'],
      ['link-nav-قائمة التسوق', '/shopping'],
      ['link-nav-وصفات مقترحة', '/recipes'],
      ['link-nav-المفضلة', '/favorites'],
      ['link-nav-settings', '/settings'],
    ] as const) {
      await page.getByTestId('button-mobile-menu').click();
      await page.getByTestId(testId).click();
      await expect(page).toHaveURL(new RegExp(`${path.replace('/', '\\/')}$`));
      await expect(page.locator('.app-shell.sidebar-open')).toHaveCount(0);
      await expect(page.locator('main.app-main')).toHaveCount(1);

      await page.goBack();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator('main.dashboard-main')).toHaveCount(1);
      await expect(page.locator('main.app-main')).toHaveCount(1);
      await expect(page.locator('.app-shell.sidebar-open')).toHaveCount(0);
    }
  });

  test('opens editable account settings from the dashboard profile', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByTestId('link-dashboard-profile').click();
    await expect(page).toHaveURL(/\/settings\?section=profile$/);
    await expect(page.getByRole('heading', { name: 'Profile Information' })).toBeVisible();
    await expect(page.getByTestId('input-profile-name')).toHaveValue('Food Test');
    await expect(page.getByTestId('input-profile-email')).toHaveValue('food-interaction@example.test');
    await expect(page.getByTestId('input-profile-password')).toHaveValue('');

    await page.getByTestId('input-profile-name').fill('Updated Food Test');
    await page.getByTestId('input-profile-email').fill('updated-food@example.test');
    await page.getByTestId('input-profile-password').fill('new-password');
    await page.getByTestId('button-save-profile').click();
    await expect(page.getByTestId('status-notice')).toContainText(/Account details saved|تم حفظ بيانات الحساب/);

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('link-dashboard-profile')).toContainText('Updated Food Test');
  });

  test('organizes notifications into a labeled list', async ({ page }) => {
    await seedDemoSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByTestId('button-notifications').click();
    await expect(page.locator('.notification-dropdown')).toBeVisible();
    await expect(page.locator('.notification-head-copy')).toBeVisible();
    await expect(page.locator('.notification-list')).toBeVisible();
    await expect(page.locator('.notification-item')).not.toHaveCount(0);
  });
});