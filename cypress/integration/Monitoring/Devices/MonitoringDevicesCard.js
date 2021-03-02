const admin = Cypress.env('mainOrgAdmin');

describe("Check elements on device-card", () => {
    let newToken;

    before(() => {
        cy.getWebApiToken(admin).then((result) => {
            return newToken = result;
        })
        cy.login(admin)
        cy.wait(2000)
        cy.get('a[data-field="monitoring_devices"]').click({force: true});
       
    })


    it("", () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children().first().click();

        cy.xpath('//*[@id="app-grid"]/div/header/section[1]/div/h1')
            .should('be.visible')
            .should('have.text', 'Информация об устройстве');

        cy.xpath('/html/body/div[2]/div/div/div/div/section[1]/div')
            .should('be.visible')
            .should('contain.text', 'Дата и время последнего опроса');

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/div/div[2]')
            .should('have.attr', 'data-field', 'last-revision');

    })
})