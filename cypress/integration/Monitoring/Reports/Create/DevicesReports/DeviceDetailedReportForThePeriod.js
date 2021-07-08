import { sub } from 'date-fns';
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();
const reportCode = 'DeviceDetailedReportForThePeriod';
import {getTemplateIdQuery} from "../../../../../fixtures/queries";
let code;

describe('Create reports ("DeviceDetailedReportForThePeriod" template)', {
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

        cy.task('queryDatabase', getTemplateIdQuery(reportCode)).then(res => {

            code = res[0]['Id'];
            console.log (">>>>>>>>>" + code)
        })

    })

    it("Create standart report (DeviceDetailedReportForThePeriod) DAYS", () => {
        let monthAgo = sub(today, {
            months: 1
        });

        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет по дням, за последний месяц,  все устройства, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": code,
                "name": `STANDART-DAYS-${autoName} Устройства - детальный отчёт за период`,
                "description": `Report created by autotest. From ${monthAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - days, devices - all`,
                "grouping": "day",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": monthAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": {
                    "mode": "all",
                    "groups": null,
                    "models": null,
                    "selected": null,
                    "filters": null
                },
                "employees": null,
                "semantics": ["5d41c6a2-84f7-4d9e-a3e3-14e128cd1e57", "80132e7b-785b-4d95-98ff-a09af505dcf2", "8d6413be-7904-4d1c-b8a9-7d42075fdb31", "56e82788-58eb-4eb2-8c35-f86b813ec30b", "3c229510-2ad9-45ec-92a6-75a2b226774a", "2c62ac6f-e29a-43c7-9097-31cf5025181b", "c26d2453-d95e-43e2-8cc3-d363fd80b8c8", "32edd58e-ba56-4c9f-bdac-7be511305a1d"]
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

    it("Create standart report (DeviceDetailedReportForThePeriod) WEEKS", () => {
        let monthAgo = sub(today, {
            months: 1
        });

        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет по неделям, за последний месяц,  все устройства, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": code,
                "name": `STANDART-WEEKS-${autoName} Устройства - детальный отчёт за период`,
                "description": `Report created by autotest. From ${monthAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - weeks, devices - all`,
                "grouping": "week",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": monthAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": {
                    "mode": "all",
                    "groups": null,
                    "models": null,
                    "selected": null,
                    "filters": null
                },
                "employees": null,
                "semantics": ["5d41c6a2-84f7-4d9e-a3e3-14e128cd1e57", "80132e7b-785b-4d95-98ff-a09af505dcf2", "8d6413be-7904-4d1c-b8a9-7d42075fdb31", "56e82788-58eb-4eb2-8c35-f86b813ec30b", "3c229510-2ad9-45ec-92a6-75a2b226774a", "2c62ac6f-e29a-43c7-9097-31cf5025181b", "c26d2453-d95e-43e2-8cc3-d363fd80b8c8", "32edd58e-ba56-4c9f-bdac-7be511305a1d"]
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

    it("Create standart report (DeviceDetailedReportForThePeriod) MONTHS", () => {
        let yearAgo = sub(today, {
            years: 1
        });

        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет по месяцам, за последний год,  все устройства, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": code,
                "name": `STANDART-MONTHS-${autoName} Устройства - детальный отчёт за период`,
                "description": `Report created by autotest. From ${yearAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - months, devices - all`,
                "grouping": "month",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": yearAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": {
                    "mode": "all",
                    "groups": null,
                    "models": null,
                    "selected": null,
                    "filters": null
                },
                "employees": null,
                "semantics": ["5d41c6a2-84f7-4d9e-a3e3-14e128cd1e57", "80132e7b-785b-4d95-98ff-a09af505dcf2", "8d6413be-7904-4d1c-b8a9-7d42075fdb31", "56e82788-58eb-4eb2-8c35-f86b813ec30b", "3c229510-2ad9-45ec-92a6-75a2b226774a", "2c62ac6f-e29a-43c7-9097-31cf5025181b", "c26d2453-d95e-43e2-8cc3-d363fd80b8c8", "32edd58e-ba56-4c9f-bdac-7be511305a1d"]
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

    it("Create standart report (DeviceDetailedReportForThePeriod) HOURS", () => {
        let dayAgo = sub(today, {
            days: 2
        })

        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет по часам, за последние два дня,  все устройства, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": code,
                "name": `STANDART-HOURS-${autoName} Устройства - детальный отчёт за период`,
                "description": `Report created by autotest. From ${dayAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - hours, devices - all`,
                "grouping": "hour",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": dayAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": {
                    "mode": "all",
                    "groups": null,
                    "models": null,
                    "selected": null,
                    "filters": null
                },
                "employees": null,
                "semantics": ["5d41c6a2-84f7-4d9e-a3e3-14e128cd1e57", "80132e7b-785b-4d95-98ff-a09af505dcf2", "8d6413be-7904-4d1c-b8a9-7d42075fdb31", "56e82788-58eb-4eb2-8c35-f86b813ec30b", "3c229510-2ad9-45ec-92a6-75a2b226774a", "2c62ac6f-e29a-43c7-9097-31cf5025181b", "c26d2453-d95e-43e2-8cc3-d363fd80b8c8", "32edd58e-ba56-4c9f-bdac-7be511305a1d"]
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

    it("Create standart report (DeviceDetailedReportForThePeriod) MINUTES", () => {
        let dayAgo = sub(today, {
            days: 1
        })

        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет по минутам, за последние сутки,  все устройства, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": code,
                "name": `STANDART-MINUTES-${autoName} Устройства - детальный отчёт за период`,
                "description": `Report created by autotest. From ${dayAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - minutes, devices - all`,
                "grouping": "minute",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": dayAgo.toISOString(),
                    "dateTo": today.toISOString(),
                },
                "devices": {
                    "mode": "all",
                    "groups": null,
                    "models": null,
                    "selected": null,
                    "filters": null
                },
                "employees": null,
                "semantics": ["5d41c6a2-84f7-4d9e-a3e3-14e128cd1e57", "80132e7b-785b-4d95-98ff-a09af505dcf2", "8d6413be-7904-4d1c-b8a9-7d42075fdb31", "56e82788-58eb-4eb2-8c35-f86b813ec30b", "3c229510-2ad9-45ec-92a6-75a2b226774a", "2c62ac6f-e29a-43c7-9097-31cf5025181b", "c26d2453-d95e-43e2-8cc3-d363fd80b8c8", "32edd58e-ba56-4c9f-bdac-7be511305a1d"]
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