const admin = Cypress.env('mainOrgAdmin')

describe("Successful login", function() {
    it("Sign in", function() {
        cy.login(admin);
        cy.get('ul[id="aside-menu"]')
            .should('exist');
        //проверяем что получили меню
        cy.contains("Выйти").click()
    })
})
