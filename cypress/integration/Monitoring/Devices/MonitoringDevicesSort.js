const admin = Cypress.env('mainOrgAdmin');
const webApi = Cypress.env('webApi');

const totalDevicesQuery = `SELECT * FROM LogicDevicePoints ldp JOIN Agents a ON a.Id = ldp.AgentId 
WHERE a.AccountId = ${admin.accountId} 
AND a.Disabled=0 
AND a.Deleted=0 
AND ldp.Disabled=0
AND ldp.Deleted=0`;

const directionQuery = `SELECT ldp.id, ISNULL(ds.Value, ' ') AS Value
FROM LogicDevicePoints ldp 
LEFT OUTER JOIN (SELECT * FROM  DeviceStates  WHERE  SemanticId = '66CE66FF-E3A3-4D02-AB81-3BE3518EB450') ds  ON ldp.Id = ds.LogicDevicePointId
LEFT OUTER  JOIN Semantics s ON s.id = ds.SemanticId
LEFT OUTER  JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.Deleted=0 AND ldp.Disabled=0
AND a.AccountId=${admin.accountId}
ORDER BY ds.Value`

const groupsQuery = `SELECT Name
FROM DeviceGroups 
WHERE AccountId = ${admin.accountId} `

const ipAdressQuery = `SELECT ldp.id, ISNULL(ds.Value, ' ') AS Value, s.Name
FROM LogicDevicePoints ldp 
LEFT OUTER JOIN (SELECT * FROM  DeviceStates  WHERE  SemanticId = '40EB7178-7EAF-48F4-AC2A-6DD1052A1EFB' AND Reliability=1) ds  ON ldp.Id = ds.LogicDevicePointId
LEFT OUTER  JOIN Semantics s ON s.id = ds.SemanticId
LEFT OUTER  JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.Deleted=0 AND ldp.Disabled=0
AND a.AccountId=${admin.accountId}
ORDER BY ds.Value`

const tonerQuery = ` SELECT ldp.id, ISNULL(ds.Value, '0') AS Value 
FROM LogicDevicePoints ldp 
LEFT OUTER JOIN (SELECT LogicDevicePointId, MIN(Value) AS Value FROM  DeviceStates  WHERE ColumnId=4 GROUP BY LogicDevicePointId) ds  ON ldp.Id = ds.LogicDevicePointId
LEFT OUTER  JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.Deleted=0 AND ldp.Disabled=0
AND a.AccountId=${admin.accountId}
ORDER BY ds.Value`

function MySort(alphabet) {
    return function (a, b) {
        var index_a = alphabet.indexOf(a[0]),
            index_b = alphabet.indexOf(b[0]);

        if (index_a === index_b) {
            // same first character, sort regular
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            }
            return 0;
        } else {
            return index_a - index_b;
        }
    }
}


 function sortAsc(a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}
//const sortAsc = MySort(' \'-!"#$%&()*,./:;?@[\\]^_`{|}~+<=>№01234567989aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZаАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ');

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

describe("Check sort", function () {
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

                expect(copyDeviceNames.join(';')).to.equal(deviceNames.join(';'))

            });


       
    })

    it("Sorting by device's names asc", () => {
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

                expect(copyDeviceNames.join(';')).to.equal(deviceNames.join(';'))
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button').click();
    })

    it('Sorting by ip address desc', () => {

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true }).then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
        })
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
                let ipAdressesFront = new Array();

                for (let i = 0; i < kids.length; i++) {

                    if (kids[i].querySelector('.selectable p:nth-child(1)').getAttribute('data-reliability') == "false") {
                        ipAdressesFront.push(' ')
                    } else {
                        ipAdressesFront.push(kids[i].querySelector('.selectable p:nth-child(1)').innerText)
                    }

                }

                cy.task('queryDatabase', ipAdressQuery)
                    .then((val) => {
                        let ipAdressesDB = new Array();

                        for (let i = 0; i < kids.length; i++) {
                            ipAdressesDB.push(val.recordset[i]['Value'])
                        }
                        ipAdressesDB.sort(compareIPAddresses);
                        ipAdressesDB.reverse();
                        expect(ipAdressesDB.join(';')).to.equal(ipAdressesFront.join(';'))
                    })

            })
    })

    it('Sorting by ip address asc', () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true }).then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button/span[2]')
                    .should('have.attr', 'data-value', 'asc')
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let ipAdressesFront = new Array();
                // p:nth-child(10)
                for (let i = 0; i < kids.length; i++) {

                    if (kids[i].querySelector('.selectable p:nth-child(1)').getAttribute('data-reliability') == "false") {
                        ipAdressesFront.push(' ')
                    } else {
                        ipAdressesFront.push(kids[i].querySelector('.selectable p:nth-child(1)').innerText)
                    }

                }

                cy.task('queryDatabase', ipAdressQuery)
                    .then((val) => {
                        let ipAdressesDB = new Array();

                        for (let i = 0; i < kids.length; i++) {
                            ipAdressesDB.push(val.recordset[i]['Value'])
                        }
                        ipAdressesDB.sort(compareIPAddresses);

                        expect(ipAdressesDB.join(';')).to.equal(ipAdressesFront.join(';'))
                    })

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
                    .click();

            })
    })

    //Ждем доработку Артема
    it('Sorting by direction desc', () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true }).then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button')
            .click()
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button/span[2]')
                    .should('have.attr', 'data-value', 'desc')
            })





        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let directionsFront = new Array();
                for (let i = 0; i < kids.length; i++) {
                    directionsFront.push(kids[i].querySelectorAll('li')[2].querySelector('p').innerText)
                }
                console.log('directionsFront ' + directionsFront)
                console.log("kids length =", kids.length)
                cy.task('queryDatabase', directionQuery)
                    .then((val) => {
                        let directionsDB = new Array();
                        console.log(val)
                        for (let i = 0; i < kids.length; i++) {
                            directionsDB.push(val.recordset[i]['Value'])
                        }

                        console.log("directins " + directionsDB)

                        directionsDB.reverse();
                        expect(directionsFront.join(';')).to.equal(directionsDB.join(';'))

                    })

            })
    })

    it('Sorting by direction asc', () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true }).then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
        })

     
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button')
            .click()
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button/span[2]')
                    .should('have.attr', 'data-value', 'asc')
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let directionsFront = new Array();
                for (let i = 0; i < kids.length; i++) {
                    directionsFront.push(kids[i].querySelectorAll('li')[2].querySelector('p').innerText)
                }
                console.log('directionsFront ' + directionsFront)
                console.log("kids length =", kids.length)
                cy.task('queryDatabase', directionQuery)
                    .then((val) => {
                        let directionsDB = new Array();
                        console.log(val)
                        for (let i = 0; i < kids.length; i++) {
                            directionsDB.push(val.recordset[i]['Value'])
                        }
                        console.log("directins " + directionsDB)
                        expect(directionsFront.join(';')).to.equal(directionsDB.join(';'))
                    })

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
                    .click();
            })
    })

})
