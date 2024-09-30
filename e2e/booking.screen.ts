import { expect, device, element, waitFor } from "detox"

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate from home screen to detail screen to booking screen', async () => {
    // welcome screen
    await waitFor(element(by.id('welcome'))).not.toBeVisible()

    // skeleton in home screen
    await waitFor(element(by.id('loading-home'))).not.toBeVisible();

    await expect(element(by.id('list-home'))).toBeVisible()

    // first movie
    await waitFor(element(by.id('home-0'))).toBeVisible()
      .whileElement(by.id('list-home'))
      .scroll(100, 'down');

    await expect(element(by.id('home-0'))).toBeVisible()

    // // tap first movie
    await element(by.id('home-0')).tap();
    // // detail screen
    await expect(element(by.id('detail-movie'))).toBeVisible();

    // tap booking button
    await element(by.id('detail-button-booking')).tap();

    // booking screen
    await expect(element(by.id('booking'))).toBeVisible();
  });


  it('should button book not showing in booking screen', async () => {
    // welcome screen
    await waitFor(element(by.id('welcome'))).not.toBeVisible()

    await expect(element(by.id('favorite-bottombar'))).toBeVisible();

    await element(by.id('favorite-bottombar')).tap()

    // skeleton in booking screen
    await waitFor(element(by.id('loading-booking'))).not.toBeVisible();

    await expect(element(by.id('booking-list'))).toBeVisible()

    // first movie in booking screen
    await waitFor(element(by.id('home-0'))).toBeVisible()
      .whileElement(by.id('booking-list'))
      .scroll(100, 'down');

    await expect(element(by.text('Book')).atIndex(0)).not.toBeVisible();
    await expect(element(by.text('Booked')).atIndex(0)).not.toBeVisible();
  });
});
