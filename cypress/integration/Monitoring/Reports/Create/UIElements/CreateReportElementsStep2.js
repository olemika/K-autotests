const admin = Cypress.env('mainOrgAdmin');


describe("Check all elements in create-form (step 2)", {
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

    it("Check all elements (Step  2)", () => {

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[2]').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[1]/span[1]')
                .should('have.text', '2');


            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/h1')
                .should('have.text', 'Выберите данные для отчёта')


            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/h5').should('contain', 'Пользователи');


            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[1]')
                .should('have.attr', 'data-visible', 'true');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[2]/button')
                .should('have.attr', 'data-active', 'true');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[2]')
                .should('have.text', 'Выбранные')
                .should('have.attr', 'aria-selected', 'true');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[1]')
                .should('have.text', 'Все')
                .should('have.attr', 'aria-selected', 'false');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[1]').click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[1]')
                    .should('have.attr', 'aria-selected', 'true');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/div/header', { timeout: 10000 })
                    .should('be.visible')
                    .should('have.text', 'Параметры');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/aside/div/div[1]/span[1]')
                    .should('be.visible')
                    .should('have.text', 'Группы');


                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/div/div/ul/li[2]/input')
                    .should('be.visible')
                    .should('have.attr', 'placeholder', 'Поиск');

            })

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                .should('have.text', 'Фильтрация пользователей');
        })
    })


    it("Click all buttoms (Step 2)", () => {
        let selectedSemantics = [];
        let selectedSemanticsAll = [];

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();

        //выбранные


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[2]')
            .click().then(() => {


                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[2]')
                    .should('have.attr', 'aria-selected', 'true');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[1]')
                    .should('have.attr', 'aria-selected', 'false');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[2]/div/div/ul').children().each((kid) => {
                    cy.get(kid[0]).children('button').should('be.visible');
                    selectedSemantics.push(kid[0].querySelector('span').innerText)
                })

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[1]').click().then(() => {
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/div/div/div/ul/li').children('ul[data-active="true"]').each((kid) => {

                        selectedSemanticsAll.push(kid[0].querySelector('strong').innerText)

                    }).then(() => {
                        //проверяем, что выбранные семантики соответствуют тем, что уже отмечены во вкладке "Все"
                        expect(selectedSemantics.join('')).to.equal(selectedSemanticsAll.join(''))
                    })
                })


            })


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[1]').click();

        //выделить все
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/div/div/ul/li[1]/span/span[1]/input')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/div/div/div/ul/li').children('ul').each((kid) => {

                    cy.get(kid[0]).should('have.attr', 'data-active', 'true')

                })
            })
        // снять все галочки
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/div/div/ul/li[1]/span/span[1]/input')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/div/div/div/ul/li').children('ul').each((kid) => {

                    cy.get(kid[0]).should('have.attr', 'data-active', 'false')

                })
            })
        //очистить фильтры
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/aside/div/div[1]/div/button[2]')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/aside/div/div[1]/div/button[2]')
                    .should('be.disabled');


                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/aside/div/div[1]/div/button[1]')
                    .should('not.be.disabled');


                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/div/div/span')
                    .should('be.visible')
                    .should('contain.text', 'Параметры не найдены')


                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[2]')
                    .click().then(() => {
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[2]/div/p').should('have.text', 'Не выбраны параметры для вывода в отчёт...');
                    })

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[1]/div/div/div/button[1]').click().then(() => {
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/aside/div/div[1]/div/button[1]').click();
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[2]/section[2]/div/div/div[2]/div/div[1]/div/div/div/div/div/ul/li[1]/span/span[1]/input').click();
                })

            })
    })
})