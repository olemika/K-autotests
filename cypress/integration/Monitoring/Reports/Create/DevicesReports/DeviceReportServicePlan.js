import { sub } from 'date-fns';
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();

//Устройства - планирование обслуживания устройств печати
describe('Create reports ("DeviceReportServicePlan" template)', {
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

    it("Create standart report (DeviceReportServicePlan)", () => {
        let monthAgo = sub(today, {
            months: 1
        });
        let todayString = today.toISOString();
        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет по дням, за последний месяц,  все устройства, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": 7,
                "name": `STANDART-${autoName} Устройства - планирование обслуживания устройств печати`,
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
                "semantics": ["ac142b83-2ec7-4714-abe0-97d22f6f9a1e", "66ce66ff-e3a3-4d02-ab81-3be3518eb450", "f0bd4929-48a6-4fe1-899e-013b97c98c6e"]
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