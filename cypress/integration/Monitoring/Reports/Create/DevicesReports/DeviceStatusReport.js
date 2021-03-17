
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();

//Устройства - состояние устройств
describe('Create reports ("DeviceStatus" template)', {
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

    it("Create standart report (DeviceStatus)", () => {
        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет Одно значение за период, дата - сегодня,  все устройства, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": 1,
                "name": `STANDART-${autoName} Устройства - состояние устройств`,
                "description": `Report created by autotest. Date: ${today.toLocaleString()}, standard (all) semantics, granularity - one value, devices - all`,
                "grouping": "one",
                "interval": {
                    "timeOffsetInMinutes": 180,
                    "dateFrom": null,
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
                "semantics":  ["40eb7178-7eaf-48f4-ac2a-6dd1052a1efb", "807e984c-d6c3-427f-b1a8-f9693a8bf7de", "a98fb502-2aa7-4871-988d-44669d054622", "338f1796-83ed-44be-99b7-6b58c85d460d", "a6d56c22-c6fe-491c-9b4f-4309f224791e", "ada08c65-5f0f-442c-bfa1-205461dc0201", "49a13b1c-5917-48e3-82e7-e1ab5bb8d766", "717f2f0b-d5a4-4b6b-93fb-0ac2517c3d94", "66ce66ff-e3a3-4d02-ab81-3be3518eb450", "f0bd4929-48a6-4fe1-899e-013b97c98c6e", "bcc3d81c-3776-474c-8bdb-923252ea4312"]
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