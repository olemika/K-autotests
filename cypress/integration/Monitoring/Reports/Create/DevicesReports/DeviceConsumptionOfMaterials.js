import { sub } from 'date-fns';
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();

//Устройства - расход материалов
describe('Create reports ("DeviceConsumptionOfMaterials" template)', {
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

    it("Create standart report (DeviceConsumptionOfMaterials)", () => {
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
                "template": 2,
                "name": `STANDART-${autoName} Устройства - расход материалов`,
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
                "semantics": ["f9bac9c8-79c4-4948-8b4c-af75b6e0e6f6", "d233b459-eda1-4dfc-ad72-4e18b83b78be", "a4a179ce-f529-4774-a368-9b48103a56a5", "8d6413be-7904-4d1c-b8a9-7d42075fdb31", "56e82788-58eb-4eb2-8c35-f86b813ec30b", "3c229510-2ad9-45ec-92a6-75a2b226774a"]
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