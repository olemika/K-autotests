import { sub } from 'date-fns';
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();

//Устройства - сводный отчёт за период
describe('Create reports ("DeviceConsolidatedReportForThePeriod" template)', {
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

    it("Create standart report (DeviceConsolidatedReportForThePeriod)", () => {
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
                "template": 3,
                "name": `STANDART-${autoName} Устройства - сводный отчёт за период`,
                "description": `Report created by autotest. From ${monthAgo.toLocaleString()} to ${today.toLocaleString()}, standard (all) semantics, granularity - one value, devices - all`,
                "grouping": "one",
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
                "semantics": ["28b318fe-8537-44fe-9c26-fd8043536ff2", "28b318fe-8537-44fe-9c26-fd8043536ff1", "5d41c6a2-84f7-4d9e-a3e3-14e128cd1e57", "80132e7b-785b-4d95-98ff-a09af505dcf2", "8d6413be-7904-4d1c-b8a9-7d42075fdb31", "56e82788-58eb-4eb2-8c35-f86b813ec30b", "3c229510-2ad9-45ec-92a6-75a2b226774a", "2c62ac6f-e29a-43c7-9097-31cf5025181b", "c26d2453-d95e-43e2-8cc3-d363fd80b8c8", "32edd58e-ba56-4c9f-bdac-7be511305a1d"]
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