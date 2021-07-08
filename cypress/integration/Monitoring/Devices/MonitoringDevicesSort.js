
const admin = Cypress.env('mainOrgAdmin');
const webApi = Cypress.env('webApi');

import * as queries from "../../../fixtures/queries";

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

describe("Check sort", {
    retries: {
        runMode: 2,
        openMode: 2,
    }
}, function () {
   
    beforeEach(() => {
   
        cy.loginToken(admin)
        cy.visit(`${admin.accountId}/monitoring/devices/`)
        cy.wait(2000)
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button', {timeout: 10000}).click({force: true})
    })

    afterEach(() => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button', {timeout: 10000}).click({force: true})
    })

    it("Check groups names", function () {
        let deviceGroups = new Set();

        cy.task('queryDatabase', queries.groupsQuery)
            .then((res) => {

                for (let i = 0; i < res.length; i++) {
                    deviceGroups.add(res[i]['Name'])
                    console.log('res[i][name]' + res[i]['Name'])
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
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[1]/button/span[2]', {timeout: 5000})
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


                cy.task('queryDatabase', queries.deviceNamesDB).then((val) => {
                    let sameLength = []
                    for (let i = 0; i < val.length; i++) {
                        deviceNamesDBvalues.push(val[i]['value'])
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

                cy.task('queryDatabase', queries.deviceNamesDB).then((val) => {
                    let sameLength = []
                    for (let i = 0; i < val.length; i++) {
                        deviceNamesDBvalues.push(val[i]['value'])
                    }

                    for (let i = 0; i < deviceNames.length; i++) {
                        sameLength.push(deviceNamesDBvalues[i].toLowerCase())
                    }
                    expect(sameLength.join(";")).to.equal(deviceNames.join(";"))
                })

            })
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

                        cy.task('queryDatabase', queries.ipAdressQuery)
                            .then((val) => {
                                let sameLength = [];
                                console.log(val.length)
                                for (let i = 0; i < val.length; i++) {
                                    if (val[i]['value']) {
                                        ipAdressesDB.push(val[i]['value'])
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
            .click()
            cy.wait(2000)
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

                        cy.task('queryDatabase', queries.ipAdressQuery)
                            .then((val) => {
                                
                                let sameLength = [];
                                for (let i = 0; i < val.length; i++) {
                                    if (val[i]['value']) {
                                        ipAdressesDB.push(val[i]['value'])
                                    }
                                }
                                ipAdressesDB.sort(compareIPAddresses);
                                for (let i = 0; i < ipAdressesFront.length; i++) {
                                    sameLength.push(ipAdressesDB[i])
                                }
                                expect(sameLength.join(';')).to.equal(ipAdressesFront.join(';'))
                            })

                      
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
                        cy.task('queryDatabase', queries.directionQuery)
                            .then((val) => {
                                let directionsDB = new Array();
                                let sameLength = [];
                                console.log(val)
                                for (let i = 0; i < val.length; i++) {
                                    directionsDB.push(val[i]['value'])
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
            cy.wait(2000)
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
                        cy.task('queryDatabase', queries.directionQuery)
                            .then((val) => {
                                let directionsDB = new Array();
                                let sameLength = [];
                                console.log(val)
                                for (let i = 0; i < kids.length; i++) {
                                    directionsDB.push(val[i]['value'])
                                }
                                
                                for (let i = 0; i < directionsFront.length; i++) {
                                    sameLength.push(directionsDB[i])
                                }
                                expect(directionsFront.join(';')).to.equal(sameLength.join(';'))
                            })

                        
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

        cy.task('queryDatabase', queries.tonerQuery).then((val) => {


            for (let i = 0; i < val.length; i++) {
                minTonerDB.push(val[i]['value'])
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
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[4]/button').click()
            cy.wait(2000)
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[4]/button/span[2]')
                .should('have.attr', 'data-value', 'asc')
        })

        cy.task('queryDatabase', queries.tonerQuery).then((val) => {


            for (let i = 0; i < val.length; i++) {
                minTonerDB.push(val[i]['value'])
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

                    cy.task('queryDatabase', queries.groupNameQuery).then((val) => {
                        let sameLength = []
                        for (let i = 0; i < val.length; i++) {
                            groupNamesDB.push(val[i]['value'])
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
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[6]/button').click()
            cy.wait(2000)
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[6]/button/span[2]')
                .should('have.attr', 'data-value', 'asc')

            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[2]')
                .children()
                .then((kids) => {
                    for (let i = 0; i < kids.length; i++) {

                        groupNamesFront.push(kids[i].querySelectorAll('div[data-cell="plain"]')[0].querySelector('p').innerText)
                    }
                    cy.task('queryDatabase', queries.groupNameQuery).then((val) => {

                        for (let i = 0; i < kids.length; i++) {
                            groupNamesDB.push(val[i]['value'])
                        }

                        expect(groupNamesDB.join(";")).to.equal(groupNamesFront.join(";"))
                    })

                })
        })

   
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
    
                    cy.task('queryDatabase', queries.extraQuery).then((val) => {
                        let sameLength = []
                        for (let i = 0; i < val.length; i++) {
                            extrasDB.push(val[i]['value'])
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
            cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/header/ul/li[5]/button').click()
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
                cy.task('queryDatabase', queries.extraQuery).then((val) => {

                    for (let i = 0; i < kids.length; i++) {
                        extrasDB.push(val[i]['value'])
                    }

                    expect(extrasDB.join(";")).to.equal(extrasFront.join(";"))
                })

            })
        })
        
        
    })

   

    it("Filter states ", () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button').click({force: true});
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

        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button').click({force: true});

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
 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button').click({force: true});
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


        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/button').click({force: true});
        //Требует обслуживания 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/button').click({ force: true })
            .then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/footer/ul/li[4]/ul/li[1]/button').click({ force: true });
            })
        cy.xpath('//*[@id="app-grid"]/div/div/div/div[2]/div[1]/ul/li[7]/ul/li[1]/button', {timeout: 50000 }).click().then(() => {
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

    })

})
