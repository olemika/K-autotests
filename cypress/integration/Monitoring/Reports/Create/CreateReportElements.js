
const admin = Cypress.env('mainOrgAdmin');
const months = ['Январь', "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
let date = new Date();
let day = date.getDate();
let year = date.getFullYear();
let month = months[date.getMonth()];

const groupsQuery = `SELECT Name
FROM DeviceGroups 
WHERE AccountId = ${admin.accountId} `


const userGroupsQuery = `SELECT DISTINCT(ISNULL(NULLIF(DepartmentString, ''), 'Без подразделения'))  AS DepartmentString
FROM Identities 
WHERE AccountId=${admin.accountId}
AND IsDeleted=0`

let reportsNames = ['Выберите вариант отчёта...', 'Пользователи: детальный отчёт за период',
    'Пользователи: журнал печати', 'Пользователи: отчёт для финансового директора',
    'Пользователи: сводный отчёт за период', 'Устройства: детальный отчёт за период',
    'Устройства: инциденты', 'Устройства: отчёт для финансового директора',
    'Устройства: планирование обслуживания устройств печати', 'Устройства: расход материалов',
    'Устройства: рекомендация к заказу расходных материалов', 'Устройства: сводный отчёт за период',
    'Устройства: сводный отчёт за период ЕМИАС', 'Устройства: состояние устройств']



describe("Check all elements in create-form", {
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


    it("Check all elements exist (Step 1)", () => {

        cy.xpath('//*[@id="app-grid"]/div/header/section[1]/div/h1')
            .should('have.text', 'Создать отчёт')
            .should('be.visible');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[1]/span[1]')
            .should('have.text', '1');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/label')
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


    it("Click all buttoms (Step 1)", () => {


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


                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                    .should('be.checked');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                    .should('be.visible')
                    .should('have.text', 'Фильтрация пользователей')
            })

        //Устройства: детальный отчёт за период
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[6]')
            .click()
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                    .should('not.exist');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]')
                    .should('be.visible');
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/div/div[2]/label[1]/span[1]/span[1]/input')
                    .should('be.checked')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                    .should('have.text', 'Фильтрация устройств');
            })
        //Устройства: инциденты
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[7]').click().then(() => {

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                .should('be.visible');
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                .should('be.checked');
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                .should('have.text', 'Фильтрация устройств');
        })
        // устройства для фин директора
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[8]').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]/label')
                .should('not.exist');
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                .should('be.visible');
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                .should('be.checked');
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                .should('have.text', 'Фильтрация устройств');
        })
        //Устройства: планирование обслуживания устройств печати
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[9]').click().then(() => {


            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                .should('be.visible');
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                .should('be.checked');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                .should('have.text', 'Фильтрация устройств');

        })
        //'Устройства: расход материалов'
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[10]')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]')
                    .should('not.exist');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                    .should('be.visible');
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                    .should('be.checked');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                    .should('have.text', 'Фильтрация устройств');
            })
        //Устройства: рекомендация к заказу расходных материалов
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[11]').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[2]/div[3]')
                .should('not.exist');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[2]/div/div/div/div/div/input')
                .should('be.disabled');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                .should('be.visible');
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                .should('be.checked');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                .should('have.text', 'Фильтрация устройств');
        })

        //Устройства: сводный отчёт за период
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[12]').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[2]')
                .should('not.exist');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                .should('be.visible');
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                .should('be.checked');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                .should('have.text', 'Фильтрация устройств');
        })
        //Устройства: сводный отчёт за период ЕМИАС
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[13]').click().then(() => {


            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                .should('be.visible');
            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                .should('be.checked');

            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                .should('have.text', 'Фильтрация устройств');
        })
        //Устройства: состояние устройств
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();

        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[14]')
            .click().then(() => {

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[2]/div[3]')
                    .should('not.exist');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label')
                    .should('have.text', 'Одно значение за период');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[3]/div[1]/label/span[1]/span[1]/input')
                    .should('be.checked');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
                    .should('have.text', 'Фильтрация устройств');

            })


        //календарь

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[2]/div/div/div/div/div/div/a').click().then(() => {
            cy.get('span[aria-current="date"]').then(span => {
                let a = span[0].getAttribute('aria-label')

                expect(a).to.equal(month + ' ' + day + ', ' + year)
                cy.log('Дата текущая совпадает с значением в первом календаре');
            })
        })

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


    it("Check all elements (Step 3) Пользователи", () => {

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        //шапка
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[1]/span[1]')
            .should('have.text', '3');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/h1')
            .should('have.text', 'Выберите пользователей для отчёта');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/h5')
            .should('contain.text', 'Пользователи');
        //все пользователи 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label')
            .should('have.text', 'Все пользователи')

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label/span[1]/span[1]/input')
            .should('be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/p')
            .should('have.text', 'Отчёт будет включать всех пользователей в системе')

        //подразделения
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label')
            .should('have.text', 'Подразделения');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label/span[1]/span[1]/input')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/p')
            .should('have.text', 'Отчёт будет включать всех пользователей из выбранных подразделений');

        //Отдельные пользователи
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label')
            .should('have.text', 'Отдельные пользователи');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label/span[1]/span[1]/input')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/p')
            .should('have.text', 'Отчёт будет включать только выбранных пользователей');

        //footer

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[1]')
            .should('have.attr', 'data-visible', 'true');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
            .should('have.attr', 'data-active', 'true');

    })


    it("Click all buttoms  (Step 3) Пользователи", () => {

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();

        let DBUserGroups = []
        let frontUserGroups = [];
        //подразделения 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label/span[2]')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label/span[1]/span[1]/input')
                    .should('not.be.checked');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label/span[1]/span[1]/input')
                    .should('be.checked');

                //groups 
                cy.task('queryDatabase', userGroupsQuery).then(val => {
                    for (let i = 0; i < val.recordset.length; i++) {
                        DBUserGroups.push(val.recordset[i]['DepartmentString'])
                    }
                })

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/div').children().each(kid => {

                    if (kid[0].querySelector('span').innerText != `​​Без подразделения`) {
                        frontUserGroups.push(kid[0].querySelector('span').innerText)
                    } else {
                        frontUserGroups.push('Без подразделения')
                    }
                    cy.get(kid).should('have.attr', 'data-active', 'false')
                    cy.get(kid).click().then(() => {
                        cy.get(kid).should('have.attr', 'data-active', 'true')
                    })
                }).then(() => {
                    //проверяем, что данные из базы про группам совпадает с тем, что мы видим
                    DBUserGroups.map(el => {
                        expect(frontUserGroups).to.include(el)
                    })
                })
            })
        //отдельные пользователи
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button[1]')
                    .should('have.text', 'Выбрать из списка');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button[2]')
                    .should('have.text', 'Выбрать по правилам')

                //выбрать из списка 
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button[1]')
                    .click().then(() => {

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[1]')
                            .should('have.attr', 'aria-selected', 'true');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .should('have.attr', 'placeholder', 'Поиск...');


                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .type(`${admin.login.split('@')[0]}{enter}`).then(() => {
                                cy.get('#app-grid > div > div > div > div > div:nth-child(3) > section:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div.semantic-list-container > table > tbody').children().each(kid => {
                                    expect(kid[0].querySelector('div[class="user-name-reports"]').innerText.toLowerCase()).to.contain(`${admin.login.split('@')[0]}`)
                                })
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .type(`!0192821221abcde{enter}`).then(() => {
                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[2]/p')
                                    .should('be.visible')
                                    .should('have.text', 'Пользователи не найдены')
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .clear()
                            .type(`${admin.login.split('@')[0]}{enter}`).then(() => {
                                let loginsFound = [];
                                cy.get('#app-grid > div > div > div > div > div:nth-child(3) > section:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div.semantic-list-container > table > tbody').children().each(kid => {
                                    cy.get(kid).click();
                                    loginsFound.push(kid)
                                })

                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[2]').click().then(() => {
                                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/table/tbody')
                                        .children().should('have.length', loginsFound.length)
                                })
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/table/tbody').children().each(kid => {
                            cy.get(kid[0].querySelector('button')).click();
                        })
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/p').should('have.text', 'Пользователи не выбраны')

                        //проверка что кнопка неактивна, пока не выберешь кого-то
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[1]')
                            .click().then(() => {
                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]').should('be.disabled');
                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[2]/table/tbody').
                                    children().click({ multiple: true });
                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]').should('not.be.disabled');
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[1]')
                            .click();
                    })

                //выбрать по правилам
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button[2]')
                    .click().then(() => {
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/header')
                            .should('have.text', 'Добавить новый параметр фильтрации пользователей');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/div/ul')
                            .should('have.text', 'Логин сотрудника');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[2]/div')
                            .should('have.text', 'Подразделение');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]')
                            .should('be.disabled');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul')
                            .children().click({ multiple: true })


                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]')
                            .should('not.be.disabled');
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]').click();

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/header/h3')
                            .should('have.text', 'Настройка фильтра по пользователям');



                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[3]/div/button')
                            .click().then(() => {
                                cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[1]')
                                    .should('have.text', 'Содержит')
                                cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[2]')
                                    .should('have.text', 'Не содержит')

                                cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[3]/div/button[1]')
                                    .should('have.text', 'Всегда');

                                cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[3]/div/button[2]')
                                    .should('have.text', 'Хотя бы раз');

                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[1]/div/button')
                            .click({ force: true }).then(() => {
                                cy.xpath('//*[@id="reports-create-operation"]/div[3]/ul/li[1]').should('have.text', 'Включая');
                                cy.xpath('//*[@id="reports-create-operation"]/div[3]/ul/li[2]').should('have.text', 'Исключая');

                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[4]/input')
                            .should('have.attr', 'placeholder', 'значение');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[5]/div/button')
                            .click({ force: true }).then(() => {
                                cy.xpath('//*[@id="reports-create-more"]/div[3]/ul/li[1]')
                                    .should('have.text', 'Дублировать');

                                cy.xpath('//*[@id="reports-create-more"]/div[3]/ul/li[2]')
                                    .should('have.text', 'Удалить');
                            })


                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]')
                            .should('have.text', 'Добавить новый параметр')
                    })

            })
    })

    it("Check all elements (Step 3) Устройства", () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[6]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/h1')
            .should('have.text', 'Выберите устройства для отчёта');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label')
            .should('have.text', 'Все устройства')
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label/span[1]/span[1]/input')
            .should('be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label')
        .should('have.text', 'Группы устройств');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label/span[1]/span[1]/input')
        .should('not.be.checked')

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label')
        .should('have.text', 'Модели устройств');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label/span[1]/span[1]/input')
        .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/label')
        .should('have.text', 'Отдельные устройства');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/label/span[1]/span[1]/input')
        .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
        .should('have.text', 'Фильтрация устройств');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/p')
        .should('have.text', 'Отчёт будет включать все устройства в системе');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/p')
        .should('have.text', 'Отчёт будет включать устройства из выбранных групп');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/p')
        .should('have.text', 'Отчёт будет включать устройства выбранных моделей');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/p')
        .should('have.text', 'Отчёт будет включать только выбранные устройства');


    })

    it("Click all buttoms (Step 3) Устройства", () => {
        let deviceGroups = [];
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[6]').click();
        cy.wait(600)
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.wait(200)
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();

        //группы устройств
        cy.task('queryDatabase', groupsQuery)
            .then((res) => {

                for (let i = 0; i < res.rowsAffected[0]; i++) {
                    deviceGroups.push(res.recordset[i].Name)
                }

            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label')
            .click().then(() => {
                cy.wait(3000)
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/div')
                    .children().each(kid => {
                        expect(deviceGroups).to.include(kid[0].getAttribute('title'))
                        cy.get(kid).should('have.attr', 'data-active', 'false')
                        cy.get(kid).click().then(() => {
                            cy.get(kid).should('have.attr', 'data-active', 'true')
                        })
                    })


            })

        //модели устройств
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label/span[1]/span[1]/input')
                    .should('be.checked')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button')
                    .should('be.visible')
                    .should('have.text', 'Выбрать из списка')
                //выбрать
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button').click().then(() => {
                    //очистить фильтр
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[1]/div/button[2]')
                        .click().then(() => {
                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/div/div/span')
                                .should('contain.text', 'Модели не найдены');

                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[2]')
                                .children().each(kid => {
                                    cy.get(kid).should('have.attr', 'data-active', 'false');
                                })

                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/footer/button[2]')
                                .should('be.disabled');
                        })
                    //все
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[1]/div/button[1]')
                        .click().then(() => {
                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[2]')
                                .children().each(kid => {
                                    cy.get(kid).should('have.attr', 'data-active', 'true');
                                })
                        })
                    //по одному
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[2]')
                        .children().each(kid => {
                            cy.get(kid).click();

                            cy.get(kid).should('have.attr', 'data-active', 'false')
                        })

                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/footer/button[1]')
                        .click();
                })
            })
        //отдельные устройства
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/label')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/label/span[1]/span[1]/input')
                    .should('be.checked')
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/div/button[1]')
                    .should('be.visible')
                    .should('have.text', 'Выбрать из списка');
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/div/button[2]')
                    .should('be.visible')
                    .should('have.text', 'Выбрать по правилам')

                //Выбрать из списка
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/div/button[1]').
                    click().then(() => {

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[2]')
                            .click();
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[1]')
                            .should('have.attr', 'aria-selected', 'false')
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/p')
                            .should('have.text', 'Устройства не выбраны');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[1]')
                            .click();
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[2]')
                            .should('have.attr', 'aria-selected', 'false')
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .should('have.attr', 'placeholder', 'Поиск...');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]')
                            .should('be.disabled');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[2]/table/tbody').children().click({ multiple: true })
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]')
                            .should('not.be.disabled');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[2]')
                            .click();

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/table/tbody')
                            .children().each(kid => {
                                cy.get(kid[0].querySelector('button')).click();
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/p')
                            .should('be.visible')
                            .should('have.text', 'Устройства не выбраны')

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]')
                            .should('be.disabled')

                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[1]').click();
                    })
            })

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