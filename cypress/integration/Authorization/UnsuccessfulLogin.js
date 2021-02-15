const login = Cypress.env('globalAdmin').login

describe("Unsuccessful login", function () {
    it("Login without domain", function () {
        cy.visit("")
        cy.get('input[type="text"]').type("admin")
        cy.get('input[type="password"]').type("admin")
        cy.get('button[data-field="submit"]').click()
        cy.contains('Вы ввели неправильную пару логин / пароль')
    })
    it("Login with invalid characters", function () {
        cy.visit("")
        cy.get('input[type="text"]').type(" ! \" # $ % & \' ( ) * + , - . / : ; < = > ?")
        cy.get('input[type="password"]').type(" ! \" # $ % & \' ( ) * + , - . / : ; < = > ?")
        cy.get('button[data-field="submit"]').click()
        cy.contains('Вы ввели неправильную пару логин / пароль')
    })
    it("Login attempts exceeded", function () {

        for (let i = 0; i < 10; i++) {
            cy.visit("")
            cy.get('input[type="text"]').type(login)
            cy.get('input[type="password"]').type("1")
            cy.get('button[data-field="submit"]').click()

        }
        cy.contains('Следующая попытка входа возможна не ранее, чем через')
        cy.wait(600000);

    })
    it("Successful login after timeout", function () {
        cy.visit("")
        cy.get('input[type="text"]').type("admin@demo")
        cy.get('input[type="password"]').type("admin")
        cy.get('button[data-field="submit"]').click()
        cy.get('ul[id="aside-menu"]')//проверяем что получили меню
        cy.contains("Выйти").click()
    })
})