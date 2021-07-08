import { sub } from 'date-fns';
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();
const reportCode = 'EmployeeSingleValueForPrintingPriceReport';
import {getTemplateIdQuery} from "../../../../../fixtures/queries";
let code;


describe('Create reports ("EmployeeSingleValueForPrintingPriceReport" template)', {
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

        })

    })

    it("Create standart report (EmployeeSingleValueForPrintingPriceReport)", () => {
        let monthAgo = sub(today, {
            months: 1
        });
        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет (одно значение на период), за последний месяц,  все пользователи, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": code,
                "name": `STANDART-${autoName} Пользователи - отчёт для финансового директора`,
                "description": `Report created by autotest. From ${monthAgo.toLocaleString()} to ${today.toLocaleString()}, standard semantics, granularity - one value, employees - all`,
                "grouping": "one",
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
                "semantics": ["cd15e402-2a63-4d6d-9370-141c3af39551"]
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