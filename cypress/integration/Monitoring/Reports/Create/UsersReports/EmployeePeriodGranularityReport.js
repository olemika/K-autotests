import { sub } from 'date-fns';
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();

//Пользователи - детальный отчёт за период
describe('Create reports ("EmployeePeriodGranularityReport" template)', {
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

    it("Create standart report (EmployeePeriodGranularityReport)", () => {
        let monthAgo = sub(today, {
            months: 1
        });
        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет по дням, за последний месяц,  все пользователи, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": 9,
                "name": `STANDART-${autoName} Пользователи - детальный отчёт за период`,
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
        }))
    })
})