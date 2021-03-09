
const admin = Cypress.env('mainOrgAdmin');
const webApi = Cypress.env('webApi');

describe("Check all elements", function () {
    let newToken;

    before(() => {
        cy.getWebApiToken(admin).then((result) => {
            return newToken = result;
        })
        cy.login(admin)
        cy.wait(2000)
        cy.get('a[data-field="monitoring_employees"]').click({force: true});

    


    })

    it("Check all the elements", function () {

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click({ force: true });


        cy.xpath('//*[@id="app-grid"]/div/header/section[1]/div')
            .should('have.text', 'Пользователи');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[1]/span[1]')
            .should('have.text', 'Подразделения');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[2]')
            .should('be.visible');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button')
            .should('be.visible')
            .should('have.text', 'Пользователь');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button')
            .should('be.visible')
            .should('have.text', 'Подразделение');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button')
            .should('be.visible')
            .should('have.text', 'Печать');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[4]/button')
            .should('be.visible')
            .should('have.text', 'Стоимость печати');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .should('be.visible')
            .should('have.text', 'Сбросить сортировки и фильтрации')
            .should('be.disabled');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[1]/button')
            .should('be.disabled')
            .should('be.visible');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[3]/button')
            .should('be.visible')
            .should('not.be.disabled');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button')
            .should('be.visible')
            .should('contain.text', 'Строк');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li/input')
            .should('be.visible')

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[1]/div/button[1]')
            .should('be.visible')
            .should('have.text', 'все')
            .should('be.disabled');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[1]/div/button[2]')
            .should('be.visible')
            .should('have.text', 'очистить')
            .should('not.be.disabled');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .should('exist');

        cy.xpath('//*[@id="aside-menu"]')
            .should('exist');
    })

    it("Click buttons", function () {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[1]/div/button[1]')
            .should('be.disabled');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[1]/div/button[2]')
            .click()
            .then(() => {
                cy.wait(2000);

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[1]/div/button[2]')
                    .should('be.visible')
                    .should('be.disabled');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[1]/div/button[1]')
                    .should('not.be.disabled')
                    .should('be.visible')


                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
                    .should('have.text', 'Пользователи не найдены')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[2]')
                    .children()
                    .each((button) => {
                        expect(button[0].getAttribute('data-active')).to.equal('false')
                    })

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul')
                    .children().each((el) => {
                        let elDisabled = false;

                        if (el[0].firstChild.disabled === true || el[0].firstChild.getAttribute('data-disabled') === "true") {

                            elDisabled = true;
                            cy.log("Disabled")
                        }

                        expect(elDisabled).true
                    })
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[1]/div/button[1]')
            .click()
            .then(() => {
                cy.wait(2000);

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[2]')
                    .children()
                    .each((button) => {
                        expect(button[0].getAttribute('data-active')).to.equal('true')
                    });

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]/p')
                    .should('not.exist');

            })

    })


})