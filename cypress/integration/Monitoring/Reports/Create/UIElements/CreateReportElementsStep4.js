const admin = Cypress.env('mainOrgAdmin');


describe("Check all elements in create-form (step 4)", {
    retries: {
        runMode: 1,
        openMode: 1,
    }
}, () => {

    beforeEach(() => {

        cy.loginToken(admin);
        cy.visit(`/${admin.accountId}/monitoring/reports/create/`);
        cy.wait(1000)

    })

    it('Check all elements (Step 4) (All)', () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[7]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[1]/span[1]')
            .should('have.text', '4');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[2]/h1')
            .should('have.text', 'Укажите формат отчёта');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[2]/div/div[1]/div[1]/label')
            .should('have.text', 'Название отчёта')
            .should('be.visible');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[2]/div/div[1]/div[2]/label')
            .should('have.text', 'Формат отчёта')
            .should('be.visible');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[2]/div/div[2]/div/label')
            .should('have.text', 'Комментарий')
            .should('be.visible');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[2]/div/div[1]/div[1]/div/p')
            .should('have.text', 'Если не заполнять, присваивается автоматически')
            .should('be.visible');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[2]/div/div[2]/div/div/p')
            .should('have.text', 'Необязательный параметр')
            .should('be.visible');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[2]/div/div[2]/div/div/div/textarea[1]')
            .should('have.attr', 'placeholder', 'Введите комментарий');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[2]/div/div[3]/button')
            .should('be.visible')
            .should('have.text', 'Создать отчёт')
            .should('not.be.disabled');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[4]/button')
            .should('have.attr', 'data-active', 'true')


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[4]/section[2]/div/div[1]/div[2]/div/div')
            .click().then(() => {
                cy.xpath('//*[@id="menu-"]/div[3]/ul/li[1]').should('have.text', 'XLSX')
                cy.xpath('//*[@id="menu-"]/div[3]/ul/li[2]').should('have.text', 'CSV')
            })


    })


})