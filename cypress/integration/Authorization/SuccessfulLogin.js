const admin = Cypress.env('mainOrgAdmin')

describe("Successful login", function () {
    it("Sign in", function () {
        cy.visit("/")
        cy.xpath('//*[@id="login-grid"]/div/header/h1')
            .should('have.text', 'Мониторинг и защита');

        cy.xpath('//*[@id="login-grid"]/div/footer/small')
            .should('have.text', 'Для создания новой учётной записи обратитесь к системному администратору.');

        cy.get('input[type="text"]')
            .should('have.attr', 'placeholder', 'логин')
            .type(admin.login);

        cy.get('input[type="password"]')
            .should('have.attr', 'placeholder', 'пароль')
            .type(admin.pass);


        cy.get('button[data-field="submit"]').click()
        cy.wait(2000)
        cy.get('ul[id="aside-menu"]', { timeout: 20000 })
            .should('be.visible');
        //проверяем что получили меню
        cy.contains("Выйти").click()
    })
})
