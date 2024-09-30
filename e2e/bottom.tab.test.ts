import { expect, device, element, waitFor } from "detox"

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have bottom bar', async () => {
    // welcome screen
    await waitFor(element(by.id('welcome'))).not.toBeVisible()

    // skeleton in home screen
    await expect(element(by.id('home-bottombar'))).toBeVisible();
    await expect(element(by.id('favorite-bottombar'))).toBeVisible();
    await expect(element(by.id('booking-bottombar'))).toBeVisible();
  });

  it('should navigate to favorite screen', async () => {
    // welcome screen
    await waitFor(element(by.id('welcome'))).not.toBeVisible()

    await expect(element(by.id('favorite-bottombar'))).toBeVisible();

    await element(by.id('favorite-bottombar')).tap()

    // skeleton in home screen
    await waitFor(element(by.id('loading-favorite'))).not.toBeVisible();

    await expect(element(by.id('favorite-list'))).toBeVisible()

    // first movie in home screen
    await waitFor(element(by.id('favorite-0'))).toBeVisible()
      .whileElement(by.id('favorite-list'))
      .scroll(100, 'down');

    await expect(element(by.id('favorite-0'))).toBeVisible()
  });

  it('should navigate to booking screen', async () => {
    // welcome screen
    await waitFor(element(by.id('welcome'))).not.toBeVisible()

    await expect(element(by.id('booking-bottombar'))).toBeVisible();

    await element(by.id('booking-bottombar')).tap()

    // skeleton in home screen
    await waitFor(element(by.id('loading-booking'))).not.toBeVisible();

    // first movie in home screen
    await waitFor(element(by.id('booking-0'))).toBeVisible()
      .whileElement(by.id('booking-loading'))
      .scroll(100, 'down');

    await expect(element(by.id('booking-0'))).toBeVisible()
  });
});
