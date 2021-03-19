import { sub } from 'date-fns';
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();


describe('Create reports ("EmployeePrintJobListReport" template)', {
    retries: {
        runMode: 1,
        openMode: 1,
    }
}, () => {
    let newToken;

    beforeEach(() => {
        cy.loginToken(admin)

        cy.getWebApiToken(admin)
            .then((result) => {
                return newToken = result;
            })

    })

    it("Create standart report (EmployeePrintJobListReport) DAYS", () => {
        let monthAgo = sub(today, {
            months: 1
        });
        const autoName = `Auto${Math.floor(Math.random() * 999999)}`

        //Стандартный отчет по дням, за последний месяц,  все пользователи, XLSX
        const options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": 23,
                "name": `STANDART-DAYS-${autoName} Пользователи - журнал печати`,
                "description": `Report created by autotest. From ${monthAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - days, employees - all`,
                "grouping": "day",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": monthAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": null,
                "employees": {
                    "mode": "all",
                    "groups": null,
                    "selected": null,
                    "filters": null
                },
                "semantics": ["92380430-a1f2-4d15-ac7d-f1faebea0e90"]
            },
            headers: {

                'AccountId': admin.accountId,
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application / json'
            }
        }

        cy.request(options).then(res => {

            expect(res.status).to.equal(200)
            cy.log("Отчет создан")
        })

        cy.visit(`${admin.accountId}/monitoring/reports/list/`)
        cy.xpath('//*[@id="app-grid"]/div/div/div/header/ul/li/input')
            .type(`${autoName}{enter}`)

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody')
            .children().first().then((el => {
                expect(el[0].querySelector('strong').innerText).to.contain(autoName);
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody/tr/td[4]/div/button', { timeout: 600000 * 2.9 })
                    .should('be.visible')
                    .and('not.be.disabled');
            }))
    })

    it("Create standart report (EmployeePrintJobListReport) WEEKS", () => {
        let monthAgo = sub(today, {
            months: 1
        });
        const autoName = `Auto${Math.floor(Math.random() * 999999)}`

        //Стандартный отчет по неделям, за последний месяц,  все пользователи, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": 23,
                "name": `STANDART-WEEKS-${autoName} Пользователи - журнал печати`,
                "description": `Report created by autotest. From ${monthAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - weeks, employees - all`,
                "grouping": "week",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": monthAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": null,
                "employees": {
                    "mode": "all",
                    "groups": null,
                    "selected": null,
                    "filters": null
                },
                "semantics": ["92380430-a1f2-4d15-ac7d-f1faebea0e90"]
            },
            headers: {

                'AccountId': admin.accountId,
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application / json'
            }
        }

        cy.request(options).then(res => {

            expect(res.status).to.equal(200)
            cy.log("Отчет создан")
        })

        cy.visit(`${admin.accountId}/monitoring/reports/list/`)
        cy.xpath('//*[@id="app-grid"]/div/div/div/header/ul/li/input')
            .type(`${autoName}{enter}`)

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody')
            .children().first().then((el => {
                expect(el[0].querySelector('strong').innerText).to.contain(autoName);
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody/tr/td[4]/div/button', { timeout: 600000 * 2.9 })
                    .should('be.visible')
                    .and('not.be.disabled');
            }))
    })

    it("Create standart report (EmployeePrintJobListReport) MONTHS", () => {
        let yearAgo = sub(today, {
            years: 1
        });
        const autoName = `Auto${Math.floor(Math.random() * 999999)}`

        //Стандартный отчет по неделям, за последний месяц,  все пользователи, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": 23,
                "name": `STANDART-MONTHS-${autoName} Пользователи - журнал печати`,
                "description": `Report created by autotest. From ${yearAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - months, employees - all`,
                "grouping": "month",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": yearAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": null,
                "employees": {
                    "mode": "all",
                    "groups": null,
                    "selected": null,
                    "filters": null
                },
                "semantics": ["92380430-a1f2-4d15-ac7d-f1faebea0e90"]
            },
            headers: {

                'AccountId': admin.accountId,
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application / json'
            }
        }

        cy.request(options).then(res => {

            expect(res.status).to.equal(200)
            cy.log("Отчет создан")
        })

        cy.visit(`${admin.accountId}/monitoring/reports/list/`)
        cy.xpath('//*[@id="app-grid"]/div/div/div/header/ul/li/input')
            .type(`${autoName}{enter}`)

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody')
            .children().first().then((el => {
                expect(el[0].querySelector('strong').innerText).to.contain(autoName);
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody/tr/td[4]/div/button', { timeout: 600000 * 2.9 })
                    .should('be.visible')
                    .and('not.be.disabled');
            }))
    })

    it("Create standart report (EmployeePrintJobListReport) HOURS", () => {
        let dayAgo = sub(today, {
            days: 2
        })
        const autoName = `Auto${Math.floor(Math.random() * 999999)}`

        //Стандартный отчет по неделям, за последний месяц,  все пользователи, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": 23,
                "name": `STANDART-HOURS-${autoName} Пользователи - журнал печати`,
                "description": `Report created by autotest. From ${dayAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - hours, employees - all`,
                "grouping": "hour",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": dayAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": null,
                "employees": {
                    "mode": "all",
                    "groups": null,
                    "selected": null,
                    "filters": null
                },
                "semantics": ["92380430-a1f2-4d15-ac7d-f1faebea0e90"]
            },
            headers: {

                'AccountId': admin.accountId,
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application / json'
            }
        }

        cy.request(options).then(res => {

            expect(res.status).to.equal(200)
            cy.log("Отчет создан")
        })

        cy.visit(`${admin.accountId}/monitoring/reports/list/`)
        cy.xpath('//*[@id="app-grid"]/div/div/div/header/ul/li/input')
            .type(`${autoName}{enter}`)

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody')
            .children().first().then((el => {
                expect(el[0].querySelector('strong').innerText).to.contain(autoName);
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody/tr/td[4]/div/button', { timeout: 600000 * 2.9 })
                    .should('be.visible')
                    .and('not.be.disabled');
            }))

    })
})