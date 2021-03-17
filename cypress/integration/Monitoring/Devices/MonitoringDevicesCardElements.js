
const admin = Cypress.env('mainOrgAdmin');
const months = ['Январь', "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
let date = new Date();
let day = date.getDate();
let year = date.getFullYear();
let month = months[date.getMonth()];
describe("Check elements on device-card", () => {
    let newToken;

    before(() => {
        // cy.getWebApiToken(admin).then((result) => {
        //     return newToken = result;
        // })

        cy.loginToken(admin);
        cy.visit(`${admin.accountId}/monitoring/devices/`);

    })


    it("Check all elements exist", () => {
        cy.get('a[data-field="monitoring_devices"]').click({ force: true });
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

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/button')
            .should('exist')
            .should('be.visible')

        cy.xpath('//*[@id="app-grid"]/div/div')
            .scrollTo('right');

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/nav/ul/li[1]/a')
            .should('be.visible')
            .should('have.text', 'Ресурсы')

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/nav/ul/li[2]/a')
            .should('be.visible')
            .should('have.text', 'Состояние')

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/nav/ul/li[3]/a')
            .should('be.visible')
            .should('have.text', 'Счётчики')

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/nav/ul/li[4]/a')
            .should('be.visible').
            should('have.text', 'Счётчики по форматам')

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/nav/ul/li[5]/a')
            .should('be.visible')
            .should('have.text', 'Об устройстве')

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/nav/ul/li[6]/a')
            .should('be.visible')
            .should('have.text', 'Картриджи')

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/a')
            .should('be.visible')


        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/div/ul[3]/li[2]/span[1]')
            .should('be.visible')
            .should('have.text', 'Агент мониторинга');

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/div/ul[2]/li[2]/span[1]')
            .should('be.visible')
            .should('have.text', 'Группа')

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/div/ul[1]/li[2]/span[1]')
            .should('be.visible')
            .should('have.text', 'IP адрес')

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/div/ul[1]/li[1]/span[1]')
            .should('be.visible')
            .should('have.text', 'Состояние')

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/h1')
            .should('be.visible')


        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/div/ul[2]/li[1]/div/div/div/div')
            .should('be.visible')
    })


    it("Click all buttons", () => {

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/button').click().then(() => {
            cy.xpath('/html/body/div[4]/div[3]/div')
                .should('be.visible');

            cy.xpath('/html/body/div[4]/div[3]/div/div[1]/h2')
                .should('contain.text', 'QR-code:');

            cy.xpath('//*[@id="qrCode"]')
                .should('be.visible');


            cy.xpath('/html/body/div[4]/div[3]/div/div[2]/div/button[1]')
                .should('have.text', 'Скачать как PNG');

            cy.xpath('/html/body/div[4]/div[3]/div/div[2]/div/button[2]')
                .should('have.text', 'Скачать как SVG');

            cy.xpath('/html/body/div[4]/div[3]/div/div[2]/div/button[3]')
                .should('have.text', 'Распечатать');


            cy.xpath('/html/body/div[4]/div[1]')
                .click('topRight', { force: true }).then(() => {
                    cy.xpath('/html/body/div[4]/div[3]/div')
                        .should('not.exist');
                })
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/div/ul[2]/li[1]/div/div/div/div/div/a')
            .click().then(() => {
                cy.xpath('/html/body/div[3]').should('be.visible')

                cy.get('span[aria-current="date"]').then(span => {
                    let a = span[0].getAttribute('aria-label')

                    expect(a).to.equal(month + ' ' + day + ', ' + year)
                })
                cy.get('span[aria-current="date"]').next().click().then(() => {
                    cy.xpath('/html/body/div[3]/div[4]/div/button[2]/span[1]').click();

                    cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/div/ul[2]/li[1]/button/span[1]')
                        .should('be.visible')
                        .should('have.text', 'Перейти к текущему состоянию');

                    cy.xpath('//*[@id="app-grid"]/div/div/div/section[2]/div[1]/div/ul[2]/li[1]/div[1]')
                        .should('be.visible')
                })

            })

    })
})

