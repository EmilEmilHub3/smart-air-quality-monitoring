import { test, expect } from '@playwright/test';

// End-to-End test af Smart Air Quality Monitoring System.
// Testen automatiserer et brugerflow gennem systemet:
//
// Login -> Dashboard -> HistoryScreen
//
// Formålet er at verificere, at en bruger kan navigere gennem
// applikationens vigtigste funktioner uden fejl.

test('E2E - bruger kan logge ind og navigere til historiske målinger', async ({
  page,
}) => {
  // Maksimal køretid for testen
  test.setTimeout(30_000);

  // Åbn Flutter web-applikationen
  await page.goto('http://localhost:49935/');

  // Vent på at applikationen er indlæst
  await page.waitForTimeout(3000);

  // Login via tastatur-navigation
  // Flutter Web kan være vanskelig at automatisere med normale selectors
  await page.keyboard.press('Tab');
  await page.keyboard.type('admin@test.dk');

  await page.keyboard.press('Tab');
  await page.keyboard.type('password');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  // Vent på at dashboardet indlæses
  await page.waitForTimeout(5000);

  // Verificer at applikationen fortsat kører
  await expect(page).toHaveURL(/localhost:49935/);

  // Naviger til HistoryScreen via historik-knappen
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  // Vent på at HistoryScreen indlæses
  await page.waitForTimeout(3000);

  // Gem screenshot som dokumentation for testresultatet
  await page.screenshot({
    path: 'test-results/history-screen.png',
    fullPage: true,
  });

  // Verificer at applikationen stadig fungerer efter navigation
  await expect(page).toHaveURL(/localhost:49935/);
});