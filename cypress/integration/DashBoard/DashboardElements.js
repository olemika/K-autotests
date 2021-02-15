const admin = Cypress.env('mainOrgAdmin')

describe("Check all elements", function () {

    before(() => {
        cy.login(admin);
    })

    it("Checking all elements", function () {
        cy.get('ul[id="aside-menu"]')
        //Раздел
        cy.get('li[class="sidebar-section-title"]')
            .should('contain.text', 'Мониторинг')
            .should('contain.text', 'Управление')
            .should('contain.text', 'Настройки');
        //Мониторинг
        cy.get('a[data-field="monitoring_dashboard"]')
            .should('have.text', 'Общая информация');
        cy.get('a[data-field="monitoring_devices"]')
            .should('have.text', 'Устройства');
        cy.get('a[data-field="monitoring_employees"]')
            .should('have.text', 'Пользователи');
        cy.get('a[data-field="monitoring_reports"]')
            .should('have.text', 'Отчёты');
        //Отчеты меню
        cy.get('a[data-field="monitoring-reports-create"]')
            .should('have.text', 'Создать');
        cy.get('a[data-field="monitoring-reports-list"]')
            .should('have.text', 'Архив');
        //Управление
        cy.get('a[data-field="management_employees"]')
            .should('have.text', 'Пользователи');
        cy.get('a[data-field="management_devices"]')
            .should('have.text', 'Устройства');
        //Устройства меню
        cy.get('a[data-field="management-devices-find"]')
            .should('have.text', 'Найти');
        cy.get('a[data-field="management-devices-plug"]')
            .should('have.text', 'Подключить');
        cy.get('a[data-field="management-devices-edit"]')
            .should('have.text', 'Редактировать');
        //
        cy.get('a[data-field="management_agents"]')
            .should('have.text', 'Подключения');
        //Подкючения меню
        cy.get('a[data-field="management_monitoring_agents"]')
            .should('have.text', 'Агенты мониторинга');
        //
        cy.get('a[data-field="management_cost"]')
            .should('have.text', 'Справочники');
        //Справочники меню
        cy.get('a[data-field="management-cost-printing"]')
            .should('have.text', 'Стоимость печати');
        //
        cy.get('a[data-field="management_users"]')
            .should('have.text', 'Профили')
        cy.get('a[data-field="settings_imports"]')
            .should('have.text', 'Импорты')
        cy.get('a[data-field="settings_notifications"]')
            .should('have.text', 'Уведомления')
        //Уведомления меню
        cy.get('a[data-field="settings_notifications_items"]')
            .should('contain.text', 'Список уведомлений')
        cy.get('a[data-field="settings_notifications_email_server"]')
            .should('contain.text', 'Почтовый сервер')

        //Dashboard
        cy.xpath('/html/body/div[2]/div/div/div/div/section[1]/div/div[1]/button/span[1]/div/ul/li[3]/ul/li[1]')
            .should('have.text', 'Всего устройств')
        cy.xpath('/html/body/div[2]/div/div/div/div/section[1]/div/div[2]/button/span[1]/div/ul/li[3]/ul/li[1]')
            .should('have.text', 'Требуют обслуживания')
        cy.xpath('/html/body/div[2]/div/div/div/div/section[1]/div/div[3]/button/span[1]/div/ul/li[3]/ul/li[1]')
            .should('have.text', 'Недоступных устройств')
        cy.xpath('/html/body/div[2]/div/div/div/div/section[2]/div/div/button/span[1]/div/ul/li[3]/ul/li[1]')
            .should('have.text', 'Всего пользователей')
        cy.xpath('/html/body/div[2]/div/div/div/div/section[3]/div/div[1]/button/span[1]/div/ul/li[3]/ul/li[1]')
            .should('have.text', 'Количество отпечатков')
        cy.xpath('/html/body/div[2]/div/div/div/div/section[3]/div/div[2]/button/span[1]/div/ul/li[3]/ul/li[1]')
            .should('have.text', 'Стоимость печати')

        cy.xpath('//*[@id="app-grid"]/div/header/section[1]/button').should('be.visible')

    })

    it("Click on the buttons", function () {

        //Бургер > клик (Меню скрыто > открыто)
        cy.xpath('//*[@id="app-grid"]/div/header/section[1]/button').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/aside').should('have.attr', 'data-minimized', 'true')
        })

        cy.xpath('//*[@id="app-grid"]/div/header/section[1]/button').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/aside').should('have.attr', 'data-minimized', 'false')
        })


        //Отчеты меню > клик  (скрыты > открыты)
        cy.get('a[data-field="monitoring-reports-create"]')
            .should('not.be.visible');
        cy.get('a[data-field="monitoring-reports-list"]')
            .should('not.be.visible');

        cy.get('a[data-field="monitoring_reports"]')
            .click().then(() => {
                cy.get('a[data-field="monitoring-reports-create"]')
                    .should('be.visible');
                cy.get('a[data-field="monitoring-reports-list"]')
                    .should('be.visible');
            })

        //Устройства меню > клик (скрыты > открыты)
        cy.get('a[data-field="management-devices-find"]')
            .should('not.be.visible');
        cy.get('a[data-field="management-devices-plug"]')
            .should('not.be.visible');
        cy.get('a[data-field="management-devices-edit"]')
            .should('not.be.visible');

        cy.get('a[data-field="management_devices"]')
            .click().then(() => {
                cy.get('a[data-field="management-devices-find"]')
                    .should('be.visible');
                cy.get('a[data-field="management-devices-plug"]')
                    .should('be.visible');
                cy.get('a[data-field="management-devices-edit"]')
                    .should('be.visible');
            })


        //Подкючения меню > клик 
        cy.get('a[data-field="management_monitoring_agents"]')
            .should('not.be.visible');
        cy.get('a[data-field="management_agents"]')
            .click().then(() => {
                cy.get('a[data-field="management_monitoring_agents"]')
                    .should('be.visible');
            })


        //Справочники меню > клик
        cy.get('a[data-field="management-cost-printing"]')
            .should('not.be.visible');
        cy.get('a[data-field="management_cost"]')
            .click().then(() => {
                cy.get('a[data-field="management-cost-printing"]')
                    .should('be.visible');
            })

        //Уведомления меню > клик 
        cy.get('a[data-field="settings_notifications_items"]')
            .should('not.be.visible')
        cy.get('a[data-field="settings_notifications_email_server"]')
            .should('not.be.visible')
        cy.get('a[data-field="settings_notifications"]')
            .click().then(() => {
                cy.get('a[data-field="settings_notifications_items"]')
                    .should('be.visible')
                cy.get('a[data-field="settings_notifications_email_server"]')
                    .should('be.visible')
            })

        //виджеты
        cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/div/div[2]/span').click().then(() => {
            cy.xpath('/html/body/div[3]/div[3]/div')
                .get('div[class="MuiDialogTitle-root"]')
                .should('contain', 'Настройки карточки \"Требуют обслуживания\"');
            cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div')
                .should('contain', 'Предупреждение о низком уровне,%');
            cy.xpath('/html/body/div[3]/div[3]/div/div[3]/div[2]/button/span[1]').click();
        })
        //количество отпечатков
        cy.xpath('//*[@id="app-grid"]/div/div/div/section[3]/div/div[1]/button/span[1]/div/ul/li[3]/ul/li[2]/span')
            .then(($span) => {
                const text = $span.text();
                console.log(">" + text);
                //проверяем что если 0 отпечатков, то и шестеренки нет, если же !=0 то тогда проверяем кнопку
                if (text == " 0") {
                    cy.xpath('//*[@id="app-grid"]/div/div/div/section[3]/div/div[1]/span').should('not.exist');
                } else {
                    cy.xpath('//*[@id="app-grid"]/div/div/div/section[3]/div/div[1]/span').click().then(() => {
                        cy.xpath('/html/body/div[3]/div[3]/div')
                            .should('be.visible')
                        cy.xpath('/html/body/div[3]/div[3]/div/div[1]')
                            .should('have.text', 'Настройки карточки \"Количество отпечатков\"');
                        cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div')
                            .should('have.text', 'Количество отпечатков за требуемое количество дней (0 - за всё время)');
                        cy.xpath('/html/body/div[3]/div[3]/div/div[3]/div[2]/button/span[1]').click();
                    })
                }
            })
        // стоимость печати 

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[3]/div/div[2]/button/span[1]/div/ul/li[3]/ul/li[2]/span').then(($span) => {
            const text = $span.text();
            console.log(">", text)
            if(text == " 0.00") {
                cy.xpath('//*[@id="app-grid"]/div/div/div/section[3]/div/div[2]/span').should('not.exist');
            } else {
                cy.xpath('//*[@id="app-grid"]/div/div/div/section[3]/div/div[2]/span').click().then(() => {
                    cy.xpath('/html/body/div[3]/div[3]/div')
                    .should('be.visible');

                    cy.xpath('/html/body/div[3]/div[3]/div/div[1]')
                    .should('have.text', 'Настройки карточки \"Стоимость печати\"');

                    cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div')
                    .should('have.text', 'Стоимость печати за требуемое количество дней (0 - за всё время)');

                    cy.xpath('/html/body/div[3]/div[3]/div/div[3]/div[2]/button/span[1]').click()
                })

            } 
        })
    })

})
