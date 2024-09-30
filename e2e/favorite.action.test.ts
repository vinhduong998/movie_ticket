import { expect, device, element, waitFor } from "detox"

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should click favorite button', async () => {
    await waitFor(element(by.id('welcome'))).not.toBeVisible()
    const listID = 'list-home'

    await waitFor(element(by.id('loading-home'))).not.toBeVisible();

    // first movie in home screen
    await waitFor(element(by.id('home-0'))).toBeVisible()
      .whileElement(by.id('list-home'))
      .scroll(100, 'down');

    await expect(element(by.id('home-0'))).toBeVisible()

    await expect(element(by.id('home-button-0'))).toBeVisible();

    // Check if the button at index 0 has the text "Save" or "Saved"
    const saveButton = element(by.id('home-button-0'));

    // Try checking if the button has text "Save"
    try {
      await expect(element(by.text('Save')).atIndex(0)).toBeVisible();
      // If text is "Save", tap it to change it to "Saved"
      await saveButton.tap();
      // Verify that the button now shows "Saved"
      await expect(element(by.text('Saved')).atIndex(0)).toBeVisible();
    } catch (e) {
      // If the text was not "Save", it might be "Saved"
      await expect(element(by.text('Saved')).atIndex(0)).toBeVisible();
      debugger;
      // If text is "Saved", tap it to change it to "Save"
      await saveButton.tap();
      // Verify that the button now shows "Save"
      await expect(element(by.text('Save')).atIndex(0)).toBeVisible();
    }
  });
});
