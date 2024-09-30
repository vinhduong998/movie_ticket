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

  it('should navigate to detail screen from home', async () => {
    // welcome screen
    await waitFor(element(by.id('welcome'))).not.toBeVisible()

    // skeleton in home screen
    await waitFor(element(by.id('loading-home'))).not.toBeVisible();

    await expect(element(by.id('list-home'))).toBeVisible()

    // first movie in home screen
    await waitFor(element(by.id('home-0'))).toBeVisible()
      .whileElement(by.id('list-home'))
      .scroll(200, 'down');

    await expect(element(by.id('home-0'))).toBeVisible()

    // // tap first movie in home screen to navigate to detail screen
    await element(by.id('home-0')).tap();
    // // detail screen
    await expect(element(by.id('detail-movie'))).toBeVisible();
  });

  it('should navigate to detail screen from favorite', async () => {
    // welcome screen
    await waitFor(element(by.id('welcome'))).not.toBeVisible();

    // click favorite in bottom bar
    await expect(element(by.id('favorite-bottombar'))).toBeVisible();

    await element(by.id('favorite-bottombar')).tap()

    // skeleton
    await waitFor(element(by.id('loading-favorite'))).not.toBeVisible();

    await expect(element(by.id('favorite-list'))).toBeVisible()

    // first movie
    await waitFor(element(by.id('favorite-0'))).toBeVisible()
      .whileElement(by.id('favorite-list'))
      .scroll(200, 'down');

    await expect(element(by.id('favorite-0'))).toBeVisible()

    // // tap first movie
    await element(by.id('favorite-0')).tap();
    // // detail screen
    await expect(element(by.id('detail-movie'))).toBeVisible();
  });
});
