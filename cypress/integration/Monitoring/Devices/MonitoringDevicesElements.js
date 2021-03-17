const admin = Cypress.env('mainOrgAdmin');
const webApi = Cypress.env('webApi');

describe("Check all elements", function () {
    let newToken;

    before(() => {
        cy.getWebApiToken(admin).then((result) => {
            return newToken = result;
        })
        cy.loginToken(admin);
        cy.visit(`${admin.accountId}/monitoring/devices/`);

    })

    it("Check that all elements exist and have the correct statе", function () {


            cy.wait(2000)
            cy.xpath('//*[@id="app-grid"]/div/header/section[1]/div/h1')
                .should('be.visible')
                .should('have.text', 'Устройства');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[1]/span[1]')
                .should('be.visible')
                .should('have.text', 'Группы устройств');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header')
                .should('be.visible')


            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button')
                .should('be.visible')
                .should('have.text', 'Устройство');


            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button')
                .should('be.visible')
                .should('have.text', 'Адрес в сети');


            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button')
                .should('be.visible')
                .should('have.text', 'Расположение');


            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[4]/button')
                .should('be.visible')
                .should('have.text', 'Картридж');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[5]/button')
                .should('be.visible')
                .should('have.text', 'Дополнительно');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[6]/button')
                .should('be.visible')
                .should('have.text', 'Группа');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[7]/button')
                .should('exist')
                .should('have.text', 'Состояние');


            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]')
                .should('be.visible')



            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
                .should('be.visible')
                .should('have.text', 'Сбросить сортировки и фильтрации')



            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button')
                .should('exist')
                .should('contain', 'Строк')

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[1]/button')
                .should('exist')
                .should('be.disabled')

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[3]/button')
                .should('exist')
                .should('not.be.disabled')

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[2]')
                .should('not.be.visible')
                .should('exist')
                .should('contain', 'Нет данных')
                .should('contain', 'Доступен')
                .should('contain', 'Недоступен')
                .should('contain', 'Требует обслуживания')
       

    })

})