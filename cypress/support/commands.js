const cartPreviewListSelector = '.cart-preview .list-item';
const checkoutSelector = '[data-test="checkout"]';
const promoSelector = '.promo';
const promoIngredientSelector = promoSelector + ' .ingredient';
const promoButtonsSelector = promoSelector + ' .buttons';
const promoSpanSelector = promoSelector + ' span';
const promoYesSelector = promoSelector + ' .yes';
const promoNoSelector = promoButtonsSelector + ' button';
const modalSelector = '.modal-content';

Cypress.Commands.add('addCoffeeToCart', (coffee) => {
    cy.get(`[data-test="${coffee}"]`).click();
});

Cypress.Commands.add('checkCart', (expectedItems) => {
    cy.get(cartPreviewListSelector).should('have.length', expectedItems.length);
    cy.get(cartPreviewListSelector).each(($el, index) => {
        const name = $el.find('div span').first().text();
        const quantityText = $el.find('div span').last().text();
        const quantity = parseInt(quantityText.replace(' x ', ''), 10);
        expect(name).to.equal(expectedItems[index].name);
        expect(quantity).to.equal(expectedItems[index].quantity);
    });
});

Cypress.Commands.add('checkTotalPrice', (expectedPrice) => {
    cy.get(checkoutSelector)
        .invoke('text')
        .then((text) => {
            const price = parseFloat(text.replace(/[^0-9.-]+/g, ""));
            expect(price).to.equal(expectedPrice); 
        });
});

Cypress.Commands.add('getCoffeePrice', (coffeeName) => {
    cy.contains('h4', coffeeName)
        .find('small')
        .invoke('text')
        .then((text) => {
            const price = parseFloat(text.replace(/[^0-9.-]+/g, ""));
            cy.wrap(price);
        });
});

Cypress.Commands.add('addOneItemToCart', (coffeeType) => {
    cy.get(checkoutSelector).trigger('mouseover');
    cy.get('button[aria-label="Add one ' + coffeeType + '"]')
        .click();
});

Cypress.Commands.add('checkPromo', (expectedPromotext, yesButtonText, noButtonText, expectedIngredients) => {
    cy.get(promoSelector).should('be.visible');
    cy.get(promoSpanSelector).contains(expectedPromotext);
    cy.get(promoIngredientSelector).should('have.length', expectedIngredients.length);
    expectedIngredients.forEach((ingredient, index) => {
        cy.get(promoIngredientSelector).eq(index).should('contain.text', ingredient);
    });
    cy.get(promoButtonsSelector).should('be.visible');
    cy.get(promoYesSelector).contains(yesButtonText);
    cy.get(promoNoSelector).contains(noButtonText);
});

Cypress.Commands.add('acceptPromo', () => {
    cy.get(promoYesSelector).click();
    cy.get('.promo').should('not.exist');
});

Cypress.Commands.add('clickTotal', () => {
    cy.get(checkoutSelector).click();
});

Cypress.Commands.add('checkPaimentDetailsDialog', (title) => {
    cy.get(modalSelector).should('be.visible');
    cy.get('h1').should('have.text', title);
});