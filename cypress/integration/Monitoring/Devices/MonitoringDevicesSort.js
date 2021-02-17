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


function sortAsc(a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
}


function compareIPAddresses(a, b) {
    const numA = Number(
        a.split('.')
            .map((num, idx) => num * Math.pow(2, (3 - idx) * 8))
            .reduce((a, v) => ((a += v), a), 0)
    );
    const numB = Number(
        b.split('.')
            .map((num, idx) => num * Math.pow(2, (3 - idx) * 8))
            .reduce((a, v) => ((a += v), a), 0)
    );
    return numA - numB;
}

describe("Check all elements", function () {
    let newToken;

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
        let deviceGroups = new Set();

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
        //descending 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button/span[2]')
            .should('have.attr', 'data-value', 'desc');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let deviceNames = new Array();

                for (let i = 0; i < kids.length; i++) {
                    deviceNames.push(kids[i].querySelector('h6').innerText.toLowerCase())
                }
                let copyDeviceNames = deviceNames.slice();

                copyDeviceNames.sort(sortAsc)
                copyDeviceNames.reverse();

                expect(copyDeviceNames.join('')).to.equal(deviceNames.join(''))

            });


        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button/span[2]')
            .should('have.attr', 'data-value', 'asc');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let deviceNames = new Array();

                for (let i = 0; i < kids.length; i++) {
                    deviceNames.push(kids[i].querySelector('h6').innerText.toLowerCase())
                }
                let copyDeviceNames = deviceNames.slice();

                copyDeviceNames.sort(sortAsc)

                expect(copyDeviceNames.join('')).to.equal(deviceNames.join(''))
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button').click();
    })

    it('Sorting by ip address', () => {
        //desc
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button')
            .click()
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button/span[2]')
                    .should('have.attr', 'data-value', 'desc')
            })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let ipAdresses = new Array();
                // p:nth-child(10)
                for (let i = 0; i < kids.length; i++) {
                    ipAdresses.push(kids[i].querySelector('.selectable p:nth-child(1)').innerText)
                }

                console.log(ipAdresses)

                let copyIP = ipAdresses.slice();

                copyIP.sort(compareIPAddresses)
                copyIP.reverse();

                expect(copyIP.join(';')).to.equal(ipAdresses.join(';'))
            })
        //asc
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button/span[2]')
                    .should('have.attr', 'data-value', 'asc')
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let ipAdresses = new Array();

                for (let i = 0; i < kids.length; i++) {
                    ipAdresses.push(kids[i].querySelector('.selectable p:nth-child(1)').innerText)
                }

                console.log(ipAdresses)

                let copyIP = ipAdresses.slice();

                copyIP.sort(compareIPAddresses)

                expect(copyIP.join(';')).to.equal(ipAdresses.join(';'))
            })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click();
    })

    //Ждем доработку Артема
    it('Sorting by direction', () => { 
    
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button')
            .click()
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button/span[2]')
                    .should('have.attr', 'data-value', 'desc')
            })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let directions = new Array();
                for (let i = 0; i < kids.length; i++) {
                    directions.push(kids[i].querySelectorAll('li')[2].querySelector('p').innerText)
                }
                console.log("directins " + directions)
                let copyDirections = directions.slice();
                copyDirections.sort(sortAsc)
                copyDirections.reverse();
                expect(copyDirections.join(';')).to.equal(directions.join(';'))
            })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click();
    })


})
