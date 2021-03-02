const admin = Cypress.env('mainOrgAdmin');
const webApi = Cypress.env('webApi');

const totalDevicesQuery = `SELECT * FROM LogicDevicePoints ldp JOIN Agents a ON a.Id = ldp.AgentId 
WHERE a.AccountId = ${admin.accountId} 
AND a.Disabled=0 
AND a.Deleted=0 
AND ldp.Disabled=0
AND ldp.Deleted=0`;

const deviceNamesDB = `SELECT ldp.id, ISNULL(NULLIF(ds.Value, ''), ' ') AS Value, s.Name
FROM LogicDevicePoints ldp 
LEFT OUTER JOIN (SELECT * FROM  DeviceStates  WHERE  SemanticId = 'AC142B83-2EC7-4714-ABE0-97D22F6F9A1E') ds  ON ldp.Id = ds.LogicDevicePointId
LEFT OUTER  JOIN Semantics s ON s.id = ds.SemanticId
LEFT OUTER  JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.Deleted=0 AND ldp.Disabled=0
AND a.Deleted=0
AND a.AccountId=${admin.accountId}
AND ds.Reliability=1
ORDER BY ds.Value`

const directionQuery = `SELECT ldp.id, ISNULL(ds.Value, ' ') AS Value
FROM LogicDevicePoints ldp 
LEFT OUTER JOIN (SELECT * FROM  DeviceStates  WHERE  SemanticId = '66CE66FF-E3A3-4D02-AB81-3BE3518EB450') ds  ON ldp.Id = ds.LogicDevicePointId
LEFT OUTER  JOIN Semantics s ON s.id = ds.SemanticId
LEFT OUTER  JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.Deleted=0 AND ldp.Disabled=0
AND a.AccountId=${admin.accountId}
AND a.Deleted=0
ORDER BY ds.Value`

const groupsQuery = `SELECT Name
FROM DeviceGroups 
WHERE AccountId = ${admin.accountId} `

const ipAdressQuery = `SELECT ldp.id, ds.Value AS Value, s.Name
FROM LogicDevicePoints ldp 
LEFT OUTER JOIN (SELECT * FROM  DeviceStates  WHERE  SemanticId = '40EB7178-7EAF-48F4-AC2A-6DD1052A1EFB' ) ds  ON ldp.Id = ds.LogicDevicePointId
LEFT OUTER  JOIN Semantics s ON s.id = ds.SemanticId
LEFT OUTER  JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.Deleted=0 AND ldp.Disabled=0
AND a.AccountId=${admin.accountId}
AND a.Deleted=0
AND ds.Reliability=1
ORDER BY ds.Value`

const tonerQuery = ` SELECT ldp.id, ISNULL(ds.Value, 0) AS Value 
FROM LogicDevicePoints ldp 
LEFT OUTER JOIN (SELECT LogicDevicePointId, MIN(CONVERT(INT, Value)) AS Value FROM  DeviceStates  WHERE ColumnId=4 GROUP BY LogicDevicePointId) ds  ON ldp.Id = ds.LogicDevicePointId
LEFT OUTER  JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.Deleted=0 AND ldp.Disabled=0
AND a.AccountId=${admin.accountId}
AND a.Deleted=0
ORDER BY ds.Value`

const groupNameQuery = `SELECT ldp.id, ISNULL(ds.Value, ' ') AS Value, s.Name
FROM LogicDevicePoints ldp 
LEFT OUTER JOIN (SELECT * FROM  DeviceStates  WHERE  SemanticId = '3AE30C7E-5A0C-4E99-B895-08D6E8F10CC0' AND Reliability=1) ds  ON ldp.Id = ds.LogicDevicePointId
LEFT OUTER  JOIN Semantics s ON s.id = ds.SemanticId
LEFT OUTER  JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.Deleted=0 AND ldp.Disabled=0
AND a.AccountId=${admin.accountId}
AND a.Deleted=0
ORDER BY ds.Value`

const extraQuery = `SELECT ldp.id, ISNULL(ds.Value, ' ') AS Value, s.Name
FROM LogicDevicePoints ldp 
LEFT OUTER JOIN (SELECT * FROM  DeviceStates  WHERE  SemanticId = 'A87960EB-D098-4134-B896-08D6E8F10CC0') ds  ON ldp.Id = ds.LogicDevicePointId
LEFT OUTER  JOIN Semantics s ON s.id = ds.SemanticId
LEFT OUTER  JOIN Agents a ON a.Id = ldp.AgentId
WHERE ldp.Deleted=0 AND ldp.Disabled=0
AND a.AccountId=${admin.accountId}
AND a.Deleted=0
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

function compareNumbers(a, b) {
    return a - b;
}

describe("Check sort", function () {
    let newToken;
    before(() => {
        cy.getWebApiToken(admin).then((result) => {
            return newToken = result;
        })
        cy.login(admin)
        cy.wait(2000)
        cy.get('a[data-field="monitoring_devices"]').click({ force: true });
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
        let deviceNames = new Array();
        let deviceNamesDBvalues = [];

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })
        //descending 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button').click();
        cy.wait(2000);
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button/span[2]')
            .should('have.attr', 'data-value', 'desc');
            
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                

                for (let i = 0; i < kids.length; i++) {
                    if (kids[i].querySelectorAll('div[data-cell="device"]')[0].getAttribute('data-status') != "2") {
                        if (kids[i].querySelectorAll('div[data-cell="device"]')[0].querySelector('h6').getAttribute('data-reliability') != "false") {
                            deviceNames.push(kids[i].querySelector('h6').innerText.toLowerCase())
                        }
                    }  
                }


                cy.task('queryDatabase', deviceNamesDB).then((val) => {
                    let sameLength = []
                    for (let i = 0; i < val.recordset.length; i++) {
                        deviceNamesDBvalues.push(val.recordset[i]['Value'])
                    }
                    deviceNamesDBvalues.reverse();
                    for (let i = 0; i < deviceNames.length; i++) {
                        sameLength.push(deviceNamesDBvalues[i].toLowerCase())
                    }
                    expect(sameLength.join(";")).to.equal(deviceNames.join(";"))
                })


            });
    })

    it("Sorting by device's names asc", () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button').click();
        cy.wait(2000);
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button/span[2]')
            .should('have.attr', 'data-value', 'asc');


        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let deviceNames = new Array();
                let deviceNamesDBvalues = new Array();
                
                for (let i = 0; i < kids.length; i++) {
                    if (kids[i].querySelectorAll('div[data-cell="device"]')[0].getAttribute('data-status') != "2") {
                        if (kids[i].querySelectorAll('div[data-cell="device"]')[0].querySelector('h6').getAttribute('data-reliability') != "false") {
                            deviceNames.push(kids[i].querySelector('h6').innerText.toLowerCase())
                        }
                    }  
                }

                cy.task('queryDatabase', deviceNamesDB).then((val) => {
                    let sameLength = []
                    for (let i = 0; i < val.recordset.length; i++) {
                        deviceNamesDBvalues.push(val.recordset[i]['Value'])
                    }

                    for (let i = 0; i < deviceNames.length; i++) {
                        sameLength.push(deviceNamesDBvalues[i].toLowerCase())
                    }
                    expect(sameLength.join(";")).to.equal(deviceNames.join(";"))
                })

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
                cy.wait(2000)
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button/span[2]')
                    .should('have.attr', 'data-value', 'desc')
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
                    .children()
                    .then((kids) => {
                        let ipAdressesFront = new Array();
                        let ipAdressesDB = new Array();

                        for (let i = 0; i < kids.length; i++) {

                            if (kids[i].querySelectorAll('div[data-cell="two-rows"]')[0].querySelector('p').getAttribute('data-reliability') != "false") {
                                ipAdressesFront.push(kids[i].querySelectorAll('div[data-cell="two-rows"]')[0].querySelector('p').innerText)
                            }
                        }

                        cy.task('queryDatabase', ipAdressQuery)
                            .then((val) => {
                                let sameLength = [];
                                console.log(val.recordset.length)
                                for (let i = 0; i < val.recordset.length; i++) {
                                    if (val.recordset[i]['Value']) {
                                        ipAdressesDB.push(val.recordset[i]['Value'])
                                    }
                                }

                                ipAdressesDB.sort(compareIPAddresses).reverse();
                                for (let i = 0; i < ipAdressesFront.length; i++) {
                                    sameLength.push(ipAdressesDB[i])
                                }

                                expect(sameLength.join(';')).to.equal(ipAdressesFront.join(';'))
                            })

                    })
            })
    })

    it('Sorting by ip address asc', () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true }).then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button')
            .click().then(() => {
                cy.wait(2000)
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[2]/button/span[2]')
                    .should('have.attr', 'data-value', 'asc')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
                    .children()
                    .then((kids) => {
                        let ipAdressesFront = new Array();
                        let ipAdressesDB = new Array();
                        
                        for (let i = 0; i < kids.length; i++) {

                            if (kids[i].querySelectorAll('div[data-cell="two-rows"]')[0].querySelector('p').getAttribute('data-reliability') != "false") {
                                ipAdressesFront.push(kids[i].querySelectorAll('div[data-cell="two-rows"]')[0].querySelector('p').innerText)
                            }

                        }

                        cy.task('queryDatabase', ipAdressQuery)
                            .then((val) => {
                                
                                let sameLength = [];
                                for (let i = 0; i < val.recordset.length; i++) {
                                    if (val.recordset[i]['Value']) {
                                        ipAdressesDB.push(val.recordset[i]['Value'])
                                    }
                                }
                                ipAdressesDB.sort(compareIPAddresses);
                                for (let i = 0; i < ipAdressesFront.length; i++) {
                                    sameLength.push(ipAdressesDB[i])
                                }
                                expect(sameLength.join(';')).to.equal(ipAdressesFront.join(';'))
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
                            .click();
                    })
            })


    })


    it('Sorting by direction desc', () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true }).then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button')
            .click()
            .then(() => {
                cy.wait(2000)
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button/span[2]')
                    .should('have.attr', 'data-value', 'desc')


                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
                    .children()
                    .then((kids) => {
                        let directionsFront = new Array();
                        for (let i = 0; i < kids.length; i++) {
                            directionsFront.push(kids[i].querySelectorAll('div[data-cell="two-rows"]')[1].querySelector('p').innerText)
                        }
                        console.log('directionsFront ' + directionsFront)
                        console.log("kids length =", kids.length)
                        cy.task('queryDatabase', directionQuery)
                            .then((val) => {
                                let directionsDB = new Array();
                                let sameLength = [];
                                console.log(val)
                                for (let i = 0; i < val.recordset.length; i++) {
                                    directionsDB.push(val.recordset[i]['Value'])
                                }
                                directionsDB.reverse();
                                for (let i = 0; i < directionsFront.length; i++) {
                                    sameLength.push(directionsDB[i])
                                }
                                expect(directionsFront.join(';')).to.equal(sameLength.join(';'))

                            })
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
                cy.wait(2000)
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[3]/button/span[2]')
                    .should('have.attr', 'data-value', 'asc')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
                    .children()
                    .then((kids) => {
                        let directionsFront = new Array();
                        for (let i = 0; i < kids.length; i++) {
                            directionsFront.push(kids[i].querySelectorAll('div[data-cell="two-rows"]')[1].querySelector('p').innerText)
                        }
                        console.log('directionsFront ' + directionsFront)
                        console.log("kids length =", kids.length)
                        cy.task('queryDatabase', directionQuery)
                            .then((val) => {
                                let directionsDB = new Array();
                                let sameLength = [];
                                console.log(val)
                                for (let i = 0; i < kids.length; i++) {
                                    directionsDB.push(val.recordset[i]['Value'])
                                }
                                
                                for (let i = 0; i < directionsFront.length; i++) {
                                    sameLength.push(directionsDB[i])
                                }
                                expect(directionsFront.join(';')).to.equal(sameLength.join(';'))
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
                            .click();
                    })
            })


    })

    it("Sorting by toner's level desc", () => {
        let minTonerFront = [];
        let minTonerDB = [];

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true }).then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
        })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[4]/button').click().then(() => {
            cy.wait(2000)
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[4]/button/span[2]')
                .should('have.attr', 'data-value', 'desc')
        })

        cy.task('queryDatabase', tonerQuery).then((val) => {


            for (let i = 0; i < val.recordset.length; i++) {
                minTonerDB.push(val.recordset[i]['Value'])
            }
            minTonerDB.sort(compareNumbers);
            minTonerDB.reverse();
            console.log(minTonerDB)
        })


        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let sameLength = [];
                for (let i = 0; i < kids.length; i++) {
                    let valuesInOneDevice = []
                    kids[i].querySelectorAll('div[data-cell="meter"]')[0].querySelectorAll('li').forEach((val) => {

                        valuesInOneDevice.push(parseInt(val.getAttribute('data-value')))

                    })

                    let x = Math.min(...valuesInOneDevice);
                    console.log("Infinity! " + x)
                    if (x === Infinity) {
                        minTonerFront.push(0)
                    } else { minTonerFront.push(x) }


                }
                for (let i = 0; i < minTonerFront.length; i++) {
                    sameLength.push(minTonerDB[i])
                }

                expect(sameLength.join(';')).to.equal(minTonerFront.join(';'))

            })
    })


    it("Sorting by toner's level asc", () => {
        let minTonerFront = [];
        let minTonerDB = [];


        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[4]/button').click().then(() => {
            cy.wait(2000)
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[4]/button/span[2]')
                .should('have.attr', 'data-value', 'asc')
        })

        cy.task('queryDatabase', tonerQuery).then((val) => {


            for (let i = 0; i < val.recordset.length; i++) {
                minTonerDB.push(val.recordset[i]['Value'])
            }
            minTonerDB.sort(compareNumbers);
            console.log(minTonerDB)
        })


        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                let sameLength = [];
                for (let i = 0; i < kids.length; i++) {
                    let valuesInOneDevice = []
                    kids[i].querySelectorAll('div[data-cell="meter"]')[0].querySelectorAll('li').forEach((val) => {

                        valuesInOneDevice.push(parseInt(val.getAttribute('data-value')))

                    })

                    let x = Math.min(...valuesInOneDevice);

                    if (x === Infinity) {
                        minTonerFront.push(0)
                    } else { minTonerFront.push(x) }

                }
                for (let i = 0; i < minTonerFront.length; i++) {
                    sameLength.push(minTonerDB[i])
                }

                expect(sameLength.join(';')).to.equal(minTonerFront.join(';'))

            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click();
    })


    it("Sorting by group names desc", () => {
        let groupNamesDB = [];
        let groupNamesFront = [];

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[6]/button').click().then(() => {
            cy.wait(2000)
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[6]/button/span[2]')
                .should('have.attr', 'data-value', 'desc')

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
                .children()
                .then((kids) => {
                    for (let i = 0; i < kids.length; i++) {

                        groupNamesFront.push(kids[i].querySelectorAll('div[data-cell="plain"]')[0].querySelector('p').innerText)
                    }

                    cy.task('queryDatabase', groupNameQuery).then((val) => {
                        let sameLength = []
                        for (let i = 0; i < val.recordset.length; i++) {
                            groupNamesDB.push(val.recordset[i]['Value'])
                        }
                        console.log("before ", groupNamesDB)
                        groupNamesDB.reverse();
                        console.log("after ", groupNamesDB)

                        for (let i = 0; i < groupNamesFront.length; i++) {
                            sameLength.push(groupNamesDB[i])
                        }
                        expect(sameLength.join(";")).to.equal(groupNamesFront.join(";"))
                    })

                })
        })

    })


    it("Sorting by group names asc", () => {
        let groupNamesDB = [];
        let groupNamesFront = [];

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[6]/button').click().then(() => {
            cy.wait(2000)
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[6]/button/span[2]')
                .should('have.attr', 'data-value', 'asc')

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
                .children()
                .then((kids) => {
                    for (let i = 0; i < kids.length; i++) {

                        groupNamesFront.push(kids[i].querySelectorAll('div[data-cell="plain"]')[0].querySelector('p').innerText)
                    }
                    cy.task('queryDatabase', groupNameQuery).then((val) => {

                        for (let i = 0; i < kids.length; i++) {
                            groupNamesDB.push(val.recordset[i]['Value'])
                        }

                        expect(groupNamesDB.join(";")).to.equal(groupNamesFront.join(";"))
                    })

                })
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click();
    })


    it("Sorting by extras names desc", () => {
        let extrasDB = [];
        let extrasFront = [];

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[5]/button').click().then(() => {
            cy.wait(2000)
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[5]/button/span[2]')
                .should('have.attr', 'data-value', 'desc')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
                .children()
                .then((kids) => {
                    for (let i = 0; i < kids.length; i++) {
    
                        extrasFront.push(kids[i].querySelectorAll('div[data-cell="two-rows"]')[2].querySelector('p').innerText)
                    }
    
                    cy.task('queryDatabase', extraQuery).then((val) => {
                        let sameLength = []
                        for (let i = 0; i < val.recordset.length; i++) {
                            extrasDB.push(val.recordset[i]['Value'])
                        }
                        extrasDB.reverse();
                        for (let i = 0; i < kids.length; i++) {
                            sameLength.push(extrasDB[i])
                        }
                        expect(sameLength.join(";")).to.equal(extrasFront.join(";"))
                    })
    
                })
        })
        
    })


    it("Sorting by extras names asc", () => {
        let extrasDB = [];
        let extrasFront = [];

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })
        
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[5]/button').click().then(() => {
            cy.wait(2000)
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[5]/button/span[2]')
                .should('have.attr', 'data-value', 'asc')
                cy.wait(2000)
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
            .children()
            .then((kids) => {
                for (let i = 0; i < kids.length; i++) {

                    extrasFront.push(kids[i].querySelectorAll('div[data-cell="two-rows"]')[2].querySelector('p').innerText)
                }
                cy.task('queryDatabase', extraQuery).then((val) => {

                    for (let i = 0; i < kids.length; i++) {
                        extrasDB.push(val.recordset[i]['Value'])
                    }

                    expect(extrasDB.join(";")).to.equal(extrasFront.join(";"))
                })

            })
        })
        
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click();
    })

    // выпилим это?
    // it("Sorting by state  desc", () => {

    //     let stateFront = [];

    //     cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
    //         .then(() => {
    //             cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
    //         })

    //     cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[7]/button').click().then(() => {
    //         cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[7]/button/span[2]')
    //             .should('have.attr', 'data-value', 'desc')
    //     })
    //     cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
    //         .children()
    //         .then((kids) => {
    //             for (let i = 0; i < kids.length; i++) {

    //                 stateFront.push(kids[i].querySelectorAll('div')[6].querySelector('p').innerText)
    //             }

    //             let newStates = stateFront.slice();

    //             newStates.sort(sortAsc)
    //             newStates.reverse();

    //             expect(stateFront.join(";")).to.equal(newStates.join(";"))
    //         })
    // })


    // it("Sorting by state  asc", () => {
    //     let stateFront = [];

    //     cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
    //         .then(() => {
    //             cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
    //         })

    //     cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[7]/button').click().then(() => {
    //         cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[7]/button/span[2]')
    //             .should('have.attr', 'data-value', 'asc')
    //     })
    //     cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
    //         .children()
    //         .then((kids) => {
    //             for (let i = 0; i < kids.length; i++) {

    //                 stateFront.push(kids[i].querySelectorAll('div')[6].querySelector('p').innerText)
    //             }

    //             let newStates = stateFront.slice();

    //             newStates.sort(sortAsc)

    //             expect(stateFront.join(";")).to.equal(newStates.join(";"))

    //         })
    //     cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
    //         .click();
    // })


    it("Filter states ", () => {
        //Нет данных
        cy.xpath('//*[@id="app-grid"]/div/div')
            .scrollTo('right');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[1]/button').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[2]/ul/li[1]/button')
                .click({ force: true })
                cy.wait(2000)
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]').children().then((kids) => {
            let isCorrect = false;
            let statesSet = new Set();



            console.log(statesSet)
            if (kids[0].innerText != "Устройства не найдены") {
                for (let i = 0; i < kids.length; i++) {
                    statesSet.add(kids[i].querySelectorAll('div[data-cell="plain"]')[1].querySelector('p').innerText)
                }
                if (statesSet.size === 1 && statesSet.has('Нет данных')) {
                    isCorrect = true
                    cy.log('Нет данных')
                } else {
                    isCorrect = false
                    cy.log('Не сошлось')
                }
            } else {
                isCorrect = true
                cy.log('Устройства не найдены')
            }

            expect(isCorrect).to.equal(true)
        })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click();

        //доступен

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[1]/button').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[2]/ul/li[2]/button')
                .click({ force: true })
                cy.wait(2000)
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]').children().then((kids) => {
            let isCorrect = false;
            let statesSet = new Set();



            console.log(statesSet)
            if (kids[0].innerText != "Устройства не найдены") {
                for (let i = 0; i < kids.length; i++) {
                    statesSet.add(kids[i].querySelectorAll('div[data-cell="plain"]')[1].querySelector('p').innerText)
                }
                console.log("set " + [...statesSet][0] + " length = " + statesSet.size)
                if (statesSet.size === 1 && statesSet.has('Доступен')) {
                    isCorrect = true
                    cy.log('Доступен')
                } else {
                    isCorrect = false
                    cy.log('Не сошлось')
                }
            } else {
                isCorrect = true
                cy.log('Устройства не найдены')
            }

            expect(isCorrect).to.equal(true)
        })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click();

        //Недоступен 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[1]/button').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[2]/ul/li[3]/button')
                .click({ force: true })
                cy.wait(2000)
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]').children().then((kids) => {
            let isCorrect = false;
            let statesSet = new Set();

            console.log(statesSet)
            if (kids[0].innerText != "Устройства не найдены") {
                for (let i = 0; i < kids.length; i++) {
                    statesSet.add(kids[i].querySelectorAll('div[data-cell="plain"]')[1].querySelector('p').innerText)
                }
                console.log("set " + [...statesSet][0] + " length = " + statesSet.size)
                if (statesSet.size === 1 && statesSet.has('Недоступен')) {
                    isCorrect = true
                    cy.log('Недоступен')
                } else {
                    isCorrect = false
                    cy.log('Не сошлось')
                }
            } else {
                isCorrect = true
                cy.log('Устройства не найдены')
            }

            expect(isCorrect).to.equal(true)
        })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click();


        //Требует обслуживания 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[1]/button').click().then(() => {
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[2]/ul/li[4]/button')
                .click({ force: true })
                cy.wait(2000)
        })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]').children().then((kids) => {
            let isCorrect = false;
            let statesSet = new Set();

            console.log(statesSet)
            if (kids[0].innerText != "Устройства не найдены") {
                for (let i = 0; i < kids.length; i++) {
                    statesSet.add(kids[i].querySelectorAll('div[data-cell="plain"]')[1].querySelector('p').innerText)
                }
                console.log("set " + [...statesSet][0] + " length = " + statesSet.size)
                if (statesSet.size === 1 && statesSet.has('Требует обслуживания')) {
                    isCorrect = true
                    cy.log('Требует обслуживания')
                } else {
                    isCorrect = false
                    cy.log('Не сошлось')
                }
            } else {
                isCorrect = true
                cy.log('Устройства не найдены')
            }

            expect(isCorrect).to.equal(true)
        })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button')
            .click();
    })

})
