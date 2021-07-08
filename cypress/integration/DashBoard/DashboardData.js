const admin = Cypress.env('mainOrgAdmin');
const webApi = Cypress.env('webApi');

const usersQuery = `SELECT * FROM Identities WHERE  accountid=${admin.accountId} AND IsDeleted=0`;

const totalDevicesQuery = `SELECT * FROM LogicDevicePoints ldp JOIN Agents a ON a.Id = ldp.AgentId 
WHERE a.AccountId = ${admin.accountId} 
AND a.Disabled=0 
AND a.Deleted=0 
AND ldp.Disabled=0
AND ldp.Deleted=0`;

const employeePrintQuery = `SELECT agr.EmployeeId, MAX(CONVERT(INT, agr.Value)) as Value
FROM EmployeeMinutelyAggregatedValues agr
JOIN PrintJobLogins pjl ON pjl.id = agr.EmployeeId 
JOIN Identities i ON i.Login = pjl.Login  
WHERE  i.accountid=${admin.accountId} AND i.IsDeleted=0 AND i.isBanned=0
AND agr.SemanticsId = '3C135858-6997-4742-A783-5D0AD7CEEA58'
GROUP BY agr.EmployeeId;`;

const printingPriceQuery = `SELECT DISTINCT(ldp.id), pp.BlackPrice
FROM PrintingPrices pp
JOIN MinutelyAggregatedValues agr ON agr.SupportedDeviceId = pp.SupportedDeviceId
JOIN LogicDevicePoints ldp ON ldp.Id = agr.LogicDevicePointId
JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.AgentId IN (Select id FROM Agents WHERE AccountId=${admin.accountId})
AND pp.AccountId=${admin.accountId}
  AND agr.SupportedDeviceId NOT IN (0, 1000000)`;


describe("Check the correctness of the data", function () {
    let newToken;
    let userCount;
    let deviceCount;
    let unavailableDeviceCount;
    let requireMaintenanceCount;

    before(() => {
       cy.getWebApiToken(admin)
            .then((result) => {
                return newToken = result;
            }) 
            cy.loginToken(admin)
            cy.visit(`${admin.accountId}/dashboard`)
    })


    it("Check the number of users", function () {
        cy.task('queryDatabase', usersQuery)
            .then(val => {

                userCount = val.length

                cy.get('span[data-field="employees-total-value"]')
                    .invoke('text')
                    .then((count) => {

                        const parsed = parseInt(count.replace(/\s/g, ''), 10);
                        expect(parsed).to.equal(userCount);
                    })
            })
    })




    it("Checking the number of devices", function () {

        cy.task('queryDatabase', totalDevicesQuery)
            .then(val => {
                deviceCount = val.length

                cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/div/div[1]/button/span[1]/div/ul/li[3]/ul/li[2]/span').then(($span) => {
                    const text = $span.text();
                    const parsed = parseInt(text.replace(/\s/g, ''), 10);

                    expect(parsed).to.equal(deviceCount);
                })

            })
    })

    it("Check the number of unavailable devices", function () {
        cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/div/div[2]/span')
            .click()
            .then(() => {
                cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div/div/input')
                    .invoke('val')
                    .then((value) => {
                        let newValue;
                        value = parseInt(value, 10)
                        if (value > 2) {
                            newValue = value - 1;
                        } else {
                            newValue = value + 1;
                        }
                        cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div/div/input')
                            .clear()
                            .type(newValue);
                        cy.xpath('/html/body/div[3]/div[3]/div/div[3]/div[1]/button/span[1]')
                            .click();
                        cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/div/div[2]/span')
                            .click();
                        cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div/div/input')
                            .clear()
                            .type(value);
                        cy.xpath('/html/body/div[3]/div[3]/div/div[3]/div[1]/button/span[1]')
                            .click();
                    })
            })
        cy.request({
            method: 'POST',
            url: `${webApi}/v3/device/list`,
            headers: {
                AccountId: admin.accountId,
                Accept: 'application/json',
                Authorization: "Bearer " + newToken
            },
            body: { "filters": { "accessible": [2], "disabled": [false] }, "sort": [], "pagination": { "start": 0, "end": 9 } }

        }).then((response) => {

            unavailableDeviceCount = response.body.totalCount;

        })


        cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/div/div[3]/button/span[1]/div/ul/li[3]/ul/li[2]/span').then(($span) => {
            const unavailableDevicesOnFront = parseInt($span.text().replace(/\s/g, ''), 10);
            expect(unavailableDeviceCount).to.equal(unavailableDevicesOnFront);
        })

    })

    it("Check the number of RequireMaintenance devices", function () {

        cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/div/div[2]/span')
            .click()
            .then(() => {

                cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div/div/input')
                    .invoke('val')
                    .then((value) => {
                        let newValue;
                        value = parseInt(value, 10)
                        if (value > 2) {
                            newValue = value - 1;
                        } else {
                            newValue = value + 1;
                        }

                        cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div/div/input')
                            .clear()
                            .type(newValue);

                        cy.xpath('/html/body/div[3]/div[3]/div/div[3]/div[1]/button/span[1]')
                            .click()
                            .then(() => {

                                cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/div/div[2]/span')
                                    .click();
                                cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div/div/input')
                                    .clear()
                                    .type(value);
                                cy.xpath('/html/body/div[3]/div[3]/div/div[3]/div[1]/button/span[1]')
                                    .click();

                            });

                    })
            })
        cy.request({
            method: 'POST',
            url: `${webApi}/v3/device/list`,
            headers: {
                AccountId: admin.accountId,
                Accept: 'application/json',
                Authorization: "Bearer " + newToken
            },
            body: { "filters": { "accessible": [4], "disabled": [false] }, "sort": [], "pagination": { "start": 0, "end": 9 } }
        })
            .then((response) => {

                requireMaintenanceCount = response.body.totalCount;

            })


        cy.xpath('//*[@id="app-grid"]/div/div/div/section[1]/div/div[2]/button/span[1]/div/ul/li[3]/ul/li[2]/span')
            .then(($span) => {

                const requireMaintenanceOnFront = parseInt($span.text().replace(/\s/g, ''), 10);
                expect(requireMaintenanceCount).to.equal(requireMaintenanceOnFront);

            })
    })

    it.skip("Checking the number of prints (all time)", function () { //skip пока не починят подсчет

        cy.xpath('/html/body/div[2]/div/div/div/div/section[3]/div/div[1]/span')
            .click()
            .then(() => {

                cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div/div/input')
                    .clear()
                    .type('0');

                cy.xpath('/html/body/div[3]/div[3]/div/div[3]/div[1]/button/span[1]')
                    .click();

            })


        cy.task('queryDatabase', employeePrintQuery).then(val => {

            let countDb = 0;

            for (let i = 0; i < val.rowsAffected[0]; i++) {
                countDb += val.recordset[i]['Value']
            }

            cy.xpath('/html/body/div[2]/div/div/div/div/section[3]/div/div[1]/button/span[1]/div/ul/li[3]/ul/li[2]/span')
                .then(($span) => {

                    const text = $span.text();
                    const countOfPrintsOnFront = parseInt(text.replace(/\s/g, ''), 10);

                    expect(countDb).to.equal(countOfPrintsOnFront)
                })
        })
    })

    it.skip("Checking price of prints (all time)", function () { //skip пока не починят подсчет

        let blackTotalPrice;
        let averagePrice;
        let countPrints;

        cy.xpath('/html/body/div[2]/div/div/div/div/section[3]/div/div[2]/span')
            .click()    //обнуляем настройки
            .then(() => {

                cy.xpath('/html/body/div[3]/div[3]/div/div[2]/div/ul/li/div/div/input')
                    .clear()
                    .type('0');

                cy.xpath('/html/body/div[3]/div[3]/div/div[3]/div[1]/button/span[1]')
                    .click();

            })

        //считаем кол-во отпечатков
        cy.task('queryDatabase', printingPriceQuery)
            .then(val => {

                blackTotalPrice = 0;

                for (let i = 0; i < val.rowsAffected[0]; i++) {
                    blackTotalPrice += parseFloat(val.recordset[i]['BlackPrice'])
                }

                averagePrice = (blackTotalPrice / val.rowsAffected[0]);
            })

        cy.task('queryDatabase', employeePrintQuery)
            .then(val => {

                countPrints = 0;

                for (let i = 0; i < val.rowsAffected[0]; i++) {
                    countPrints += val.recordset[i]['Value']
                }

            })

        cy.xpath('/html/body/div[2]/div/div/div/div/section[3]/div/div[2]/button/span[1]/div/ul/li[3]/ul/li[2]/span')
            .then(($span) => {

                const text = $span.text();

                const totalPriceOnFront = parseFloat(text.replace(/\s/g, ''), 10);

                const averageTotalPrice = parseFloat((countPrints * averagePrice).toFixed(2));

                expect(averageTotalPrice).to.equal(totalPriceOnFront);

            })

    })
})