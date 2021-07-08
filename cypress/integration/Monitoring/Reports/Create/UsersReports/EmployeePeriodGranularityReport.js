import { sub } from 'date-fns';
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();
const reportCode = 'EmployeePeriodGranularityReport';
import {getTemplateIdQuery} from "../../../../../fixtures/queries";
let code;

//Пользователи - детальный отчёт за период
describe('Create reports ("EmployeePeriodGranularityReport" template)', {
    // retries: {
    //     runMode: 1,
    //     openMode: 1,
    // }
}, () => {
    let newToken;

    beforeEach(() => {
        cy.loginToken(admin)

        cy.getWebApiToken(admin)
            .then((result) => {
                return newToken = result;
            })
        cy.task('queryDatabase', getTemplateIdQuery(reportCode)).then(res => {

            code = res[0]['Id'];

        })
    })

    it("Create standart report (EmployeePeriodGranularityReport, DAYS)", () => {
        let monthAgo = sub(today, {
            months: 1
        });
        const autoName = `Auto${Math.floor(Math.random() * 999999)}`

        //Стандартный отчет по дням, за последний месяц,  все пользователи, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": code,
                "name": `STANDART-DAYS-${autoName} -  Пользователи - детальный отчёт за период`,
                "description": `Report created by autotest. From ${monthAgo.toLocaleDateString()} to ${today.toLocaleDateString()}, standard semantics, granularity - days, employees - all`,
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
                "semantics": ["792cd56a-7da6-4ced-a9b7-943dd79d5cc8",
                    "cd15e402-2a63-4d6d-9370-141c3af39551",
                    "991e43f8-0e72-44c8-bd45-a9a542da5bf1",
                    "4a104351-e122-40e8-bc22-a44abb9d0607",
                    "7683ac33-c0f5-4b0a-90c5-4fc64b4fcf8a",
                    "268e1409-6f7f-4c1c-9152-034cf23cce13"]
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
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody/tr/td[4]/div/button', { timeout: 600000 * 2.9 }).should('be.visible');
            }))
    })

    it("Create standart report (EmployeePeriodGranularityReport, WEEKS)", () => {
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
                "template": code,
                "name": `STANDART-WEEKS-${autoName}  - Пользователи - детальный отчёт за период`,
                "description": `Report created by autotest. From ${monthAgo.toLocaleDateString()} to ${today.toLocaleDateString()}, standard semantics, granularity - weeks, employees - all`,
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
                "semantics": ["792cd56a-7da6-4ced-a9b7-943dd79d5cc8",
                    "cd15e402-2a63-4d6d-9370-141c3af39551",
                    "991e43f8-0e72-44c8-bd45-a9a542da5bf1",
                    "4a104351-e122-40e8-bc22-a44abb9d0607",
                    "7683ac33-c0f5-4b0a-90c5-4fc64b4fcf8a",
                    "268e1409-6f7f-4c1c-9152-034cf23cce13"]
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
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/table/tbody/tr/td[4]/div/button', { timeout: 600000 * 2.9 }).should('be.visible');
            }))
    })

    it("Create standart report (EmployeePeriodGranularityReport, MONTHS)", () => {
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
                "template": code,
                "name": `STANDART-MONTHS-${autoName}  - Пользователи - детальный отчёт за период`,
                "description": `Report created by autotest. From ${yearAgo.toLocaleDateString()} to ${today.toLocaleDateString()}, standard semantics, granularity - months, employees - all`,
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
                "semantics": ["792cd56a-7da6-4ced-a9b7-943dd79d5cc8",
                    "cd15e402-2a63-4d6d-9370-141c3af39551",
                    "991e43f8-0e72-44c8-bd45-a9a542da5bf1",
                    "4a104351-e122-40e8-bc22-a44abb9d0607",
                    "7683ac33-c0f5-4b0a-90c5-4fc64b4fcf8a",
                    "268e1409-6f7f-4c1c-9152-034cf23cce13"]
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

    it("Create standart report (EmployeePeriodGranularityReport, HOURS)", () => {
        let twoDaysAgo = sub(today, {
            days: 2
        });
        const autoName = `Auto${Math.floor(Math.random() * 999999)}`

        //Стандартный отчет по неделям, за последний месяц,  все пользователи, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": code,
                "name": `STANDART-HOURS-${autoName}  - Пользователи - детальный отчёт за период`,
                "description": `Report created by autotest. From ${twoDaysAgo.toLocaleDateString()} to ${today.toLocaleDateString()}, standard semantics, granularity - hours, employees - all`,
                "grouping": "hour",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": twoDaysAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": null,
                "employees": {
                    "mode": "all",
                    "groups": null,
                    "selected": null,
                    "filters": null
                },
                "semantics": ["792cd56a-7da6-4ced-a9b7-943dd79d5cc8",
                    "cd15e402-2a63-4d6d-9370-141c3af39551",
                    "991e43f8-0e72-44c8-bd45-a9a542da5bf1",
                    "4a104351-e122-40e8-bc22-a44abb9d0607",
                    "7683ac33-c0f5-4b0a-90c5-4fc64b4fcf8a",
                    "268e1409-6f7f-4c1c-9152-034cf23cce13"]
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

    it("Create standart report (EmployeePeriodGranularityReport, MINUTES)", () => {
        let dayAgo = sub(today, {
            days: 1
        });
        const autoName = `Auto${Math.floor(Math.random() * 999999)}`

        //Стандартный отчет по неделям, за последний месяц,  все пользователи, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": code,
                "name": `STANDART-MINUTES-${autoName}  - Пользователи - детальный отчёт за период`,
                "description": `Report created by autotest. From ${dayAgo.toLocaleDateString()} to ${today.toLocaleDateString()}, standard semantics, granularity - minutes, employees - all`,
                "grouping": "minute",
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
                "semantics": ["792cd56a-7da6-4ced-a9b7-943dd79d5cc8",
                    "cd15e402-2a63-4d6d-9370-141c3af39551",
                    "991e43f8-0e72-44c8-bd45-a9a542da5bf1",
                    "4a104351-e122-40e8-bc22-a44abb9d0607",
                    "7683ac33-c0f5-4b0a-90c5-4fc64b4fcf8a",
                    "268e1409-6f7f-4c1c-9152-034cf23cce13"]
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