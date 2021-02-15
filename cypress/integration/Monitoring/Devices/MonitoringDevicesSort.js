const admin = Cypress.env('mainOrgAdmin');
const webApi = Cypress.env('webApi');

const totalDevicesQuery = `SELECT * FROM LogicDevicePoints ldp JOIN Agents a ON a.Id = ldp.AgentId 
WHERE a.AccountId = ${admin.accountId} 
AND a.Disabled=0 
AND a.Deleted=0 
AND ldp.Disabled=0
AND ldp.Deleted=0`;


const groupsQuery = `SELECT Name
FROM DeviceGroups 
WHERE AccountId = ${admin.accountId} `

describe("Check all elements", function () {
    let newToken;
    let deviceNames = [];
    let ipAdresses = [];
    let directions = [];
    let deviceGroups = new Set();

    before(() => {
        cy.getWebApiToken(admin).then((result) => {
            return newToken = result;
        })
        cy.login(admin);
        cy.wait(2000)
        cy.xpath('//*[@id="aside-menu"]/li[3]/div/a')
            .click();
        cy.wait(2000);

    })

    it("Check groups names", function () {

        cy.task('queryDatabase', groupsQuery)
            .then((res) => {

                for (let i = 0; i < res.rowsAffected[0]; i++) {
                    deviceGroups.add(res.recordset[i].Name)
                }

                deviceGroups.forEach(function (value) {
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[2]')
                        .should('contain.text', value)
                });

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[1]/div[2]')
                    .children()
                    .should('have.length', deviceGroups.size)
            })
    })

    it("Check sort of device's names", function () {
        let sizeOnFront;
        cy.request({
            method: 'POST',
            url: `${webApi}/v3/device/list`,
            headers: {
                AccountId: admin.accountId,
                Accept: 'application/json',
                Authorization: "Bearer " + newToken
            },
            body: { "filters": { "disabled": [false] }, "sort": [], "pagination": { "start": 0, "end": 9 } }
        }).then((response) => {

            console.log(response.body)
            
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]').children().its('length').then((val) => {
            sizeOnFront = val;
        });

      //  for (let i = 0; i <= sizeOnFront; i++) {
            // cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]').children().then((kids) => {
                
            //     for(let i = 0; i < sizeOnFront; i++) {
            //         cy.get(kids[i]).find('h6').then(($span) => {
            //             let text = $span.text()
            //             deviceNames.push(text)
            //         })
                   
            //     }
            //     console.log("dn size "+ deviceNames.length + " --- " + deviceNames)
            // })
            
            
      //  }
        
    })
})