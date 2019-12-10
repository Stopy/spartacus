import * as myCoupons from '../../../helpers/my-coupons';
import * as cartCoupon from '../../../helpers/cart-coupon';

describe('My coupons test for anonymous user', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
  });

  it('enter my coupons using anonymous user', () => {
    myCoupons.verifyMyCouponsAsAnonymous();
  });

  it('should apply customer coupon failed for anonymous user', () => {
    cartCoupon.addProductToCart(cartCoupon.productCode4);
    cartCoupon.applyMyCouponAsAnonymous(cartCoupon.myCouponCode2);
  });

  describe('claim coupon test for anonymous user', () => {
    beforeEach(() => {
      cy.window().then(win => win.sessionStorage.clear());
      cy.reload();
      myCoupons.registerUser();
    });
    it('claim customer coupon successfully for anonymous user', () => {
      myCoupons.verifyClaimCouponSuccessAsAnonymous(myCoupons.validCouponCode);
    });

    it('claim customer coupon failed for anonymous user', () => {
      myCoupons.verifyClaimCouponFailedAsAnonymous(myCoupons.invalidCouponCode);
    });
  });
});

describe('My coupons test for login user', () => {
  beforeEach(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.requireLoggedIn();
    cy.visit('/');
  });

  it('claim customer coupon, switch notification button and find product', () => {
    cy.selectUserMenuOption({
      option: 'My Coupons',
    });
    myCoupons.verifyMyCoupons();
  });

  it('should list customer coupons and able to filter and apply at cart', () => {
    const stateAuth = JSON.parse(localStorage.getItem('spartacus-local-data'))
      .auth;
    cartCoupon.addProductToCart(cartCoupon.productCode4);
    cartCoupon.verifyEmptyCoupons();
    cartCoupon.claimCoupon(cartCoupon.myCouponCode1);
    cartCoupon.claimCoupon(cartCoupon.myCouponCode2);

    cartCoupon.navigateToCartPage();
    cartCoupon.verifyMyCoupons();
    cartCoupon.filterAndApplyMyCoupons('autumn', cartCoupon.myCouponCode2);
    cartCoupon.applyCoupon(cartCoupon.couponCode1);
    //don't verify the total price which easy to changed by sample data
    cartCoupon.verifyCouponAndSavedPrice(cartCoupon.myCouponCode2, '$30');

    cartCoupon.placeOrder(stateAuth).then(orderData => {
      cartCoupon.verifyOrderHistoryForCouponAndPrice(
        orderData,
        cartCoupon.myCouponCode2,
        '$30'
      );
    });
  });

  it('should remove customer coupon from cart', () => {
    const stateAuth = JSON.parse(localStorage.getItem('spartacus-local-data'))
      .auth;
    cartCoupon.addProductToCart(cartCoupon.productCode4);
    cartCoupon.claimCoupon(cartCoupon.myCouponCode2);
    cartCoupon.filterAndApplyMyCoupons('autumn', cartCoupon.myCouponCode2);
    cartCoupon.verifyCouponAndSavedPrice(cartCoupon.myCouponCode2, '$20');

    cartCoupon.navigateToCheckoutPage();
    cartCoupon.navigateToCartPage();
    cartCoupon.removeCoupon(cartCoupon.myCouponCode2);

    cartCoupon.placeOrder(stateAuth).then(orderData => {
      cartCoupon.varifyOrderHistory(orderData);
    });
  });
});

describe('My coupons test for pagination and sort', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.login(myCoupons.testUser, myCoupons.testPassword);
    cy.visit('/');
    cy.selectUserMenuOption({
      option: 'My Coupons',
    });
  });

  it('should page and sort my coupon list', () => {
    myCoupons.verifyPagingAndSorting();
  });
});