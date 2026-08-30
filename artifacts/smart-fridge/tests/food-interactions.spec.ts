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
});