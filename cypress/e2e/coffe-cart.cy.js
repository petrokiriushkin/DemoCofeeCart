const mochaCofeeType = 'Mocha';
const discountedMochaCofeeType = '(Discounted) Mocha';
const americanoCofeeType = 'Americano';
const espressoCofeeType = 'Espresso';
const promoIngredients = ['espresso', 'chocolate syrup', 'steamed milk', 'whipped cream'];
const expectedPromoText = "It's your lucky day! Get an extra cup of Mocha for $4.";
const yesButtonText = 'Yes, of course!';
const noButtonText = 'Nah, I\'ll skip.';
const paymentDetailsDialogTitle = 'Payment details';
const promoMochaPrice = 4;

describe('Coffee Cart Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should add items to the cart and check the lucky day offer', () => {
        let expectedCartItems = [];
        let totalPrice = 0;

        cy.addCoffeeToCart(mochaCofeeType).then(() => {
            expectedCartItems.push({ name: mochaCofeeType, quantity: 1 });
            cy.checkCart(expectedCartItems);
            cy.getCoffeePrice(mochaCofeeType).then((price) => {
                totalPrice += price;
                cy.checkTotalPrice(totalPrice);
            });
        });

        cy.addCoffeeToCart(americanoCofeeType).then(() => {
            expectedCartItems.push({ name: americanoCofeeType, quantity: 1 });
            expectedCartItems.sort((a, b) => a.name.localeCompare(b.name));
            cy.checkCart(expectedCartItems);
            cy.getCoffeePrice(americanoCofeeType).then((price) => {
                totalPrice += price;
                cy.checkTotalPrice(totalPrice);
            });
        });

        cy.addOneItemToCart(mochaCofeeType).then(() => {
            const existingItem = expectedCartItems.find(item => item.name === mochaCofeeType);
            if (existingItem) {
                existingItem.quantity += 1;
            }
            cy.checkCart(expectedCartItems);
            cy.getCoffeePrice(mochaCofeeType).then((price) => {
                totalPrice += price;
                cy.checkTotalPrice(totalPrice);
            });
        });

        for (let i = 0; i < 3; i++) {
            cy.addCoffeeToCart(espressoCofeeType).then(() => {
                const existingItem = expectedCartItems.find(item => item.name === espressoCofeeType);
                if (existingItem) {
                    existingItem.quantity += 1
                }
                else {
                    expectedCartItems.push({ name: espressoCofeeType, quantity: 1 });
                    expectedCartItems.sort((a, b) => a.name.localeCompare(b.name));
                } 
                cy.checkCart(expectedCartItems);
                cy.getCoffeePrice(espressoCofeeType).then((price) => {
                    totalPrice += price;
                    cy.checkTotalPrice(totalPrice);
                });
            });
        }

        cy.checkPromo(expectedPromoText, yesButtonText, noButtonText, promoIngredients);

        cy.acceptPromo().then(() => {
            expectedCartItems.push({ name: discountedMochaCofeeType, quantity: 1 });
            expectedCartItems.sort((a, b) => a.name.localeCompare(b.name));
            cy.checkCart(expectedCartItems);
            totalPrice += promoMochaPrice;
            cy.checkTotalPrice(totalPrice);
        });

        cy.clickTotal().then(() => {
            cy.checkPaimentDetailsDialog(paymentDetailsDialogTitle);
        });
    });
});