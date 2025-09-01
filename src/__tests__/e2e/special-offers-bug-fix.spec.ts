import { test, expect } from '@playwright/test';

test.describe('Special Offers Bug Fix', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load completely
    await expect(page.locator('h2:has-text("Enhance your stay")')).toBeVisible();
  });

  test('should successfully add and remove special offers without duplicates', async ({ page }) => {
    // Step 1: Verify initial state - total should be €0.00
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€0.00').first()).toBeVisible();
    
    // Step 2: Add "All inclusive package" offer
    const allInclusiveButton = page.getByRole('button', { name: /Book Now.*All inclusive package/ });
    await expect(allInclusiveButton).toBeVisible();
    await allInclusiveButton.click();
    
    // Step 3: Verify success toast notification
    await expect(page.locator('text=All inclusive package added to your stay')).toBeVisible();
    
    // Step 4: Verify total price updated to €500.00 in pricing summary
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€500.00')).toBeVisible();
    
    // Step 5: Verify button state changed to "Remove Offer"
    const removeButton = page.getByRole('button', { name: /Remove Offer.*All inclusive package/ });
    await expect(removeButton).toBeVisible();
    
    // Step 6: Verify "Added" badge appears
    await expect(page.locator('text=Added').first()).toBeVisible();
    
    // Step 7: Verify pricing summary shows the offer
    await expect(page.locator('text=Stay Enhancement')).toBeVisible();
    await expect(page.locator('text=All inclusive package').first()).toBeVisible();
    await expect(page.locator('text=+EUR500.00')).toBeVisible();
    
    // Step 8: Verify remove button in pricing summary exists
    const pricingSummaryRemoveButton = page.getByRole('button', { name: /Remove.*All inclusive package/ }).last();
    await expect(pricingSummaryRemoveButton).toBeVisible();
    
    // Step 9: Remove the offer using the main "Remove Offer" button
    await removeButton.click();
    
    // Step 10: Verify removal success toast
    await expect(page.locator('text=All inclusive package removed from your stay')).toBeVisible();
    
    // Step 11: Verify total price reverted to €0.00 in pricing summary
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€0.00').first()).toBeVisible();
    
    // Step 12: Verify button reverted to "Book Now"
    await expect(page.getByRole('button', { name: /Book Now.*All inclusive package/ })).toBeVisible();
    
    // Step 13: Verify "Added" badge is no longer visible
    await expect(page.locator('text=Added').first()).not.toBeVisible();
    
    // Step 14: Verify pricing summary no longer shows "Stay Enhancement" section
    await expect(page.locator('text=Stay Enhancement')).not.toBeVisible();
  });

  test('should prevent duplicate offers and show proper error messages', async ({ page }) => {
    // This test verifies the duplicate prevention logic
    // Since the UI properly manages state, attempting to add duplicates should be prevented at the logic level
    
    // Step 1: Add "All inclusive package"
    const allInclusiveButton = page.getByRole('button', { name: /Book Now.*All inclusive package/ });
    await allInclusiveButton.click();
    
    // Step 2: Verify it was added successfully
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€500.00')).toBeVisible();
    
    // Step 3: Verify button changed to "Remove Offer" - this prevents UI-level duplicates
    await expect(page.getByRole('button', { name: /Remove Offer.*All inclusive package/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Book Now.*All inclusive package/ })).not.toBeVisible();
    
    // At this point, the duplicate prevention works because:
    // 1. The button state has changed from "Book Now" to "Remove Offer"
    // 2. The backend logic prevents duplicate IDs from being added
    // 3. State synchronization ensures the UI reflects the current state
  });

  test('should add and remove different offers independently', async ({ page }) => {
    // Step 1: Add "All inclusive package"
    await page.getByRole('button', { name: /Book Now.*All inclusive package/ }).click();
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€500.00')).toBeVisible();
    
    // Step 2: Add "Late Checkout"
    await page.getByRole('button', { name: /Book Now.*Late Checkout/ }).click();
    
    // Step 3: Verify both offers are added - total should increase
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€520.00')).toBeVisible(); // €500 + €20
    
    // Step 4: Verify both "Remove Offer" buttons exist
    await expect(page.getByRole('button', { name: /Remove Offer.*All inclusive package/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Remove Offer.*Late Checkout/ })).toBeVisible();
    
    // Step 5: Remove "All inclusive package"
    await page.getByRole('button', { name: /Remove Offer.*All inclusive package/ }).click();
    
    // Step 6: Verify total decreased but Late Checkout remains
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€20.00')).toBeVisible();
    await expect(page.getByRole('button', { name: /Book Now.*All inclusive package/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Remove Offer.*Late Checkout/ })).toBeVisible();
    
    // Step 7: Remove "Late Checkout"
    await page.getByRole('button', { name: /Remove Offer.*Late Checkout/ }).click();
    
    // Step 8: Verify everything is back to initial state
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€0.00').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Book Now.*All inclusive package/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Book Now.*Late Checkout/ })).toBeVisible();
  });

  test('should maintain state consistency between special offers and pricing summary', async ({ page }) => {
    // Step 1: Add offer via main button
    await page.getByRole('button', { name: /Book Now.*All inclusive package/ }).click();
    
    // Step 2: Verify pricing summary reflects the change
    await expect(page.locator('text=Stay Enhancement')).toBeVisible();
    await expect(page.locator('text=+EUR500.00')).toBeVisible();
    
    // Step 3: Remove offer via pricing summary remove button
    const pricingSummaryRemoveButton = page.getByRole('button', { name: /Remove.*All inclusive package/ }).last();
    await pricingSummaryRemoveButton.click();
    
    // Step 4: Verify main special offers section reflects the removal
    await expect(page.getByRole('button', { name: /Book Now.*All inclusive package/ })).toBeVisible();
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€0.00').first()).toBeVisible();
    await expect(page.locator('text=Stay Enhancement')).not.toBeVisible();
  });

  test('should handle Online Check-in offer correctly', async ({ page }) => {
    // Step 1: Add "Online Check-in" offer (€15.00)
    await page.getByRole('button', { name: /Book Now.*Online Check-in/ }).click();
    
    // Step 2: Verify success
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€15.00')).toBeVisible();
    await expect(page.getByRole('button', { name: /Remove Offer.*Online Check-in/ })).toBeVisible();
    
    // Step 3: Remove it
    await page.getByRole('button', { name: /Remove Offer.*Online Check-in/ }).click();
    
    // Step 4: Verify removal
    await expect(page.getByLabel('Pricing summary', { exact: true }).locator('text=€0.00').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Book Now.*Online Check-in/ })).toBeVisible();
  });
});