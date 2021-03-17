import { sub } from 'date-fns';
const webApi = Cypress.env('webApi');
const admin = Cypress.env('mainOrgAdmin');
const today = new Date();


describe('Create reports ("Incidents" template)', {
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

    it("Create standart report (Incidents)", () => {
        let monthAgo = sub(today, {
            months: 1
        });
        let todayString = today.toISOString();
        const autoName = `Auto${Math.floor(Math.random() * 99999)}`

        //Стандартный отчет (Одно значение за период), за последний месяц,  все устройства, XLSX
        let options = {
            method: 'POST',
            url: `${webApi}/v3/history/create-report`,
            body: {
                "fileFormat": "xlsx",
                "template": 13,
                "name": `STANDART-${autoName} Устройства - инциденты`,
                "description": `Report created by autotest. From ${monthAgo.toLocaleString()} to ${today.toLocaleString()}, ALL semantics , granularity - one value, devices - all`,
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
                "semantics": ["a1f1e761-b866-493b-8cda-7faa2e9cb011", "698bbc70-3fc6-46e8-9ccc-f3c137d696b1"]
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