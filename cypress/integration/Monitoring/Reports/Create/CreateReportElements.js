const admin = Cypress.env('mainOrgAdmin');
const months = ['Январь', "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
let date = new Date();
let day = date.getDate();
let year = date.getFullYear();
let month = months[date.getMonth()];


let reportsNames = ['Выберите вариант отчёта...', 'Пользователи: детальный отчёт за период',
    'Пользователи: журнал печати', 'Пользователи: отчёт для финансового директора',
    'Пользователи: сводный отчёт за период', 'Устройства: детальный отчёт за период',
    'Устройства: инциденты', 'Устройства: отчёт для финансового директора',
    'Устройства: планирование обслуживания устройств печати', 'Устройства: расход материалов',
    'Устройства: рекомендация к заказу расходных материалов', 'Устройства: сводный отчёт за период',
    'Устройства: сводный отчёт за период ЕМИАС', 'Устройства: состояние устройств']

describe("Check all elements in create-form", () => {

    before(() => {
        // cy.getWebApiToken(admin).then((result) => {
        //     return newToken = result;
        // })
        cy.login(admin).then(() => { cy.wait(3000) })
        cy.xpath('//*[@id="monitoring-reports-create"]').click({ force: true });
    })
    it("Check all elements exist (Step 1)", () => {
        cy.xpath('//*[@id="app-grid"]/div/header/section[1]/div/h1')
            .should('have.text', 'Создать отчёт')
            .should('be.visible');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[1]/span[1]')
            .should('have.text', '1');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/label')
            .should('be.visible')
            .should('have.text', 'Вариант отчёта');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div/div')
            .should('be.visible')
            .should('have.text', 'Выберите вариант отчёта...');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[2]/div[1]/label')
            .should('be.visible')
            .should('have.text', 'Начало периода');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[2]/div[3]/label')
            .should('be.visible')
            .should('have.text', 'Конец периода');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
            .should('be.visible')
            .should('have.text', 'Одно значение за период')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/label')
            .should('be.visible')
            .should('have.text', 'Разбить на интервалы');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/div/div[1]/label[1]')
            .should('be.visible')
            .should('have.text', 'Минуты')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/div/div[1]/label[2]')
            .should('be.visible')
            .should('have.text', 'Часы')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/div/div[2]/label[1]')
            .should('be.visible')
            .should('have.text', 'Дни')
            .should('not.be.checked');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/div/div[2]/label[2]')
            .should('be.visible')
            .should('have.text', 'Недели')
            .should('not.be.checked');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/div/div[2]/label[3]')
            .should('be.visible')
            .should('have.text', 'Месяцы')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/section/button[1]')
            .should('not.be.visible')
            .should('have.attr', 'data-visible', 'false');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/section/button[2]')
            .should('be.visible')
            .should('have.attr', 'data-visible', 'true');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/ul/li[1]/button')
            .should('be.visible')
            .should('have.text', 'Вариант отчёта')
            .should('have.attr', 'data-active', 'true');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/ul/li[2]/button')
            .should('be.visible')
            .should('have.text', 'Данные для отчёта')
            .should('have.attr', 'data-active', 'false');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/ul/li[3]/button')
            .should('be.visible')
            .should('have.text', 'Фильтрация устройств')
            .should('have.attr', 'data-active', 'false');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/ul/li[4]/button')
            .should('be.visible')
            .should('have.text', 'Фильтрация пользователей')
            .should('have.attr', 'data-active', 'false');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/ul/li[5]/button')
            .should('be.visible')
            .should('have.text', 'Формат отчёта')
            .should('have.attr', 'data-active', 'false');

    })


    it("Click all buttoms (Step 1", () => {


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/ul/li[2]/button')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/ul/li[1]/button')
                    .should('have.attr', 'data-error', 'true');


                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/p')
                    .should('have.text', 'Шаблон не выбран')
                    .should('be.visible')
                    .should('have.css', 'color', 'rgb(244, 67, 54)')
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div')
            .click().then(() => {
                let step = 0;
                cy.xpath('//*[@id="menu-"]/div[3]/ul').children('li').each((kid) => {
                    cy.get(kid).should('be.visible').should('have.text', reportsNames[step])
                    step++;
                })
            })
        //Пользователи: детальный отчёт за период шаг 1, проверка изменения кнопок
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[2]')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                    .should('not.exist');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/ul/li[3]/button')
                    .should('not.exist');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/div/div[2]/label[1]/span[1]/span[1]/input')
                    .should('be.checked')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                    .should('be.visible')
                    .should('have.text', 'Фильтрация пользователей')
            })

        //Пользователи: журнал печати шаг 1
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[3]')
            .click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                    .should('not.exist');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[6]/ul/li[3]/button')
                    .should('not.exist');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/div/div[2]/label[1]/span[1]/span[1]/input')
                    .should('be.checked')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                    .should('be.visible')
                    .should('have.text', 'Фильтрация пользователей')
            })
        //Пользователи: отчёт для финансового директора шаг 1
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[4]')
            .click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]')
                    .should('not.exist')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                    .should('be.visible')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                    .should('be.checked');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                    .should('be.visible')
                    .should('have.text', 'Фильтрация пользователей')
            })

        //Пользователи: сводный отчёт за период

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[5]')
            .click()
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]')
                    .should('not.exist')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                    .should('be.visible')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                    .should('be.checked');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                    .should('be.visible')
                    .should('have.text', 'Фильтрация пользователей')
            })



    })

    it("Check all elements (Step 1, 2) Пользователи: детальный отчёт за период", () => {
        // cy.xpath('//*[@id="menu-"]/div[3]/ul/li[2]')
        // .click()
    })
})