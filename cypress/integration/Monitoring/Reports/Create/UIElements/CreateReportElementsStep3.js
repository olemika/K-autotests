const admin = Cypress.env('mainOrgAdmin');

import {getUserGroupsQuery, getDeviceGroupsQuery}  from "../../../../../fixtures/queries";




describe("Check all elements in create-form (step 3)", {
    retries: {
        runMode: 1,
        openMode: 1,
    }
}, () => {

    beforeEach(() => {

        cy.loginToken(admin);
        cy.visit(`/${admin.accountId}/monitoring/reports/create/`);
        cy.wait(1000)

    })

    it("Check all elements (Step 3) Пользователи", () => {

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        //шапка
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[1]/span[1]')
            .should('have.text', '3');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/h1')
            .should('have.text', 'Выберите пользователей для отчёта');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/h5')
            .should('contain.text', 'Пользователи');
        //все пользователи 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label')
            .should('have.text', 'Все пользователи')

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label/span[1]/span[1]/input')
            .should('be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/p')
            .should('have.text', 'Отчёт будет включать всех пользователей в системе')

        //подразделения
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label')
            .should('have.text', 'Подразделения');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label/span[1]/span[1]/input')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/p')
            .should('have.text', 'Отчёт будет включать всех пользователей из выбранных подразделений');

        //Отдельные пользователи
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label')
            .should('have.text', 'Отдельные пользователи');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label/span[1]/span[1]/input')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/p')
            .should('have.text', 'Отчёт будет включать только выбранных пользователей');

        //footer

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[1]')
            .should('have.attr', 'data-visible', 'true');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
            .should('have.attr', 'data-active', 'true');

    })


    it("Click all buttoms  (Step 3) Пользователи", () => {

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();

        let DBUserGroups = []
        let frontUserGroups = [];
        //подразделения 
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label/span[2]')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label/span[1]/span[1]/input')
                    .should('not.be.checked');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label/span[1]/span[1]/input')
                    .should('be.checked');

                //groups 
                cy.task('queryDatabase', getUserGroupsQuery(admin.accountId)).then(val => {
                    for (let i = 0; i < val.length; i++) {
                        DBUserGroups.push(val[i]['DepartmentString'])
                    }
                })

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/div').children({timeout: 3000}).each(kid => {

                  
                    if (kid[0].querySelector('span').innerText != `​​Без подразделения`) {
                        frontUserGroups.push(kid[0].querySelector('span').innerText)
                    } else {
                        frontUserGroups.push('Без подразделения')
                    }
                    cy.get(kid).should('have.attr', 'data-active', 'false')
                    cy.get(kid).click().then(() => {
                        cy.get(kid).should('have.attr', 'data-active', 'true')
                    })
                   
                }).then(() => {
                    //проверяем, что данные из базы про группам совпадает с тем, что мы видим
                    DBUserGroups.map(el => {
                        expect(frontUserGroups).to.include(el)
                    })
                })
            })
        //отдельные пользователи
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button[1]')
                    .should('have.text', 'Выбрать из списка');

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button[2]')
                    .should('have.text', 'Выбрать по правилам')

                //выбрать из списка 
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button[1]')
                    .click().then(() => {

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[1]')
                            .should('have.attr', 'aria-selected', 'true');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .should('have.attr', 'placeholder', 'Поиск...');


                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .type(`${admin.login.split('@')[0]}{enter}`).then(() => {
                                cy.get('#app-grid > div > div > div > div > div:nth-child(3) > section:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div.semantic-list-container > table > tbody').children().each(kid => {
                                    expect(kid[0].querySelector('div[class="user-name-reports"]').innerText.toLowerCase()).to.contain(`${admin.login.split('@')[0]}`)
                                })
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .type(`!0192821221abcde{enter}`).then(() => {
                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[2]/p')
                                    .should('be.visible')
                                    .should('have.text', 'Пользователи не найдены')
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .clear()
                            .type(`${admin.login.split('@')[0]}{enter}`).then(() => {
                                let loginsFound = [];
                                cy.get('#app-grid > div > div > div > div > div:nth-child(3) > section:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div.semantic-list-container > table > tbody').children().each(kid => {
                                    cy.get(kid).click();
                                    loginsFound.push(kid)
                                })

                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[2]').click().then(() => {
                                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/table/tbody')
                                        .children().should('have.length', loginsFound.length)
                                })
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/table/tbody').children().each(kid => {
                            cy.get(kid[0].querySelector('button')).click();
                        })
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/p').should('have.text', 'Пользователи не выбраны')

                        //проверка что кнопка неактивна, пока не выберешь кого-то
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[1]')
                            .click().then(() => {
                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]').should('be.disabled');
                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[2]/table/tbody').
                                    children().click({ multiple: true });
                                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]').should('not.be.disabled');
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[1]')
                            .click();
                    })

                //выбрать по правилам
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button[2]')
                    .click().then(() => {
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/header')
                            .should('have.text', 'Добавить новый параметр фильтрации пользователей');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/div/ul')
                            .should('have.text', 'Логин сотрудника');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[2]/div')
                            .should('have.text', 'Подразделение');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]')
                            .should('be.disabled');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul')
                            .children().click({ multiple: true })


                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]')
                            .should('not.be.disabled');
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]').click();

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/header/h3')
                            .should('have.text', 'Настройка фильтра по пользователям');



                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[3]/div/button')
                            .click().then(() => {
                                cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[1]')
                                    .should('have.text', 'Содержит')
                                cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[2]')
                                    .should('have.text', 'Не содержит')

                                cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[3]/div/button[1]')
                                    .should('have.text', 'Всегда');

                                cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[3]/div/button[2]')
                                    .should('have.text', 'Хотя бы раз');

                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[1]/div/button')
                            .click({ force: true }).then(() => {
                                cy.xpath('//*[@id="reports-create-operation"]/div[3]/ul/li[1]').should('have.text', 'Включая');
                                cy.xpath('//*[@id="reports-create-operation"]/div[3]/ul/li[2]').should('have.text', 'Исключая');

                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[4]/input')
                            .should('have.attr', 'placeholder', 'значение');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[5]/div/button')
                            .click({ force: true }).then(() => {
                                cy.xpath('//*[@id="reports-create-more"]/div[3]/ul/li[1]')
                                    .should('have.text', 'Дублировать');

                                cy.xpath('//*[@id="reports-create-more"]/div[3]/ul/li[2]')
                                    .should('have.text', 'Удалить');
                            })


                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]')
                            .should('have.text', 'Добавить новый параметр')
                    })

            })
    })

    it("Check all elements (Step 3) Устройства", () => {
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[6]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();


        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/h1')
            .should('have.text', 'Выберите устройства для отчёта');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label')
            .should('have.text', 'Все устройства')
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/label/span[1]/span[1]/input')
            .should('be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label')
            .should('have.text', 'Группы устройств');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label/span[1]/span[1]/input')
            .should('not.be.checked')

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label')
            .should('have.text', 'Модели устройств');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label/span[1]/span[1]/input')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/label')
            .should('have.text', 'Отдельные устройства');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/label/span[1]/span[1]/input')
            .should('not.be.checked');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/ul/li[3]/button')
            .should('have.text', 'Фильтрация устройств');

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[1]/p')
            .should('have.text', 'Отчёт будет включать все устройства в системе');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/p')
            .should('have.text', 'Отчёт будет включать устройства из выбранных групп');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/p')
            .should('have.text', 'Отчёт будет включать устройства выбранных моделей');
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/p')
            .should('have.text', 'Отчёт будет включать только выбранные устройства');


    })

    it("Click all buttoms (Step 3) Устройства", () => {
        let deviceGroups = [];
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[1]/section[2]/div/div[1]/div/div/div').click();
        cy.xpath('//*[@id="menu-"]/div[3]/ul/li[6]').click();
        cy.wait(600)
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();
        cy.wait(200)
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[5]/section/button[2]').click();

        //группы устройств
        cy.task('queryDatabase', getDeviceGroupsQuery(admin.accountId))
            .then((res) => {

                for (let i = 0; i < res.length; i++) {
                    deviceGroups.push(res[i]['Name'])
                }

            })

        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/label')
            .click().then(() => {
                cy.wait(2000)
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[2]/div')
                    .children().each(kid => {
                        expect(deviceGroups).to.include(kid[0].getAttribute('title'))
                        cy.get(kid).should('have.attr', 'data-active', 'false')
                        cy.get(kid).click().then(() => {
                            cy.get(kid).should('have.attr', 'data-active', 'true')
                        })
                    })


            })

        //модели устройств
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/label/span[1]/span[1]/input')
                    .should('be.checked')

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button')
                    .should('be.visible')
                    .should('have.text', 'Выбрать из списка')
                //выбрать
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[3]/div/button').click().then(() => {
                    //очистить фильтр
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[1]/div/button[2]')
                        .click().then(() => {
                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/div/div/span')
                                .should('contain.text', 'Модели не найдены');

                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[2]')
                                .children().each(kid => {
                                    cy.get(kid).should('have.attr', 'data-active', 'false');
                                })

                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/footer/button[2]')
                                .should('be.disabled');
                        })
                    //все
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[1]/div/button[1]')
                        .click().then(() => {
                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[2]')
                                .children().each(kid => {
                                    cy.get(kid).should('have.attr', 'data-active', 'true');
                                })
                        })
                    //по одному
                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div/aside/div/div[2]')
                        .children().each(kid => {
                            cy.get(kid).click();

                            cy.get(kid).should('have.attr', 'data-active', 'false')
                        })

                    cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/footer/button[1]')
                        .click();
                })
            })
        //отдельные устройства
        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/label')
            .click().then(() => {
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/label/span[1]/span[1]/input')
                    .should('be.checked')
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/div/button[1]')
                    .should('be.visible')
                    .should('have.text', 'Выбрать из списка');
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/div/button[2]')
                    .should('be.visible')
                    .should('have.text', 'Выбрать по правилам')

                //Выбрать из списка
                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/div/button[1]')
                    .click().then(() => {

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[2]')
                            .click();
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[1]')
                            .should('have.attr', 'aria-selected', 'false')
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/p')
                            .should('have.text', 'Устройства не выбраны');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[1]')
                            .click();
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[2]')
                            .should('have.attr', 'aria-selected', 'false')
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[1]/input')
                            .should('have.attr', 'placeholder', 'Поиск...');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]')
                            .should('be.disabled');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[1]/div/div[2]/table/tbody').children().click({ multiple: true })
                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]')
                            .should('not.be.disabled');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[1]/div/div/div/button[2]')
                            .click();

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/table/tbody')
                            .children().each(kid => {
                                cy.get(kid[0].querySelector('button')).click();
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[2]/div/div[2]/div/p')
                            .should('be.visible')
                            .should('have.text', 'Устройства не выбраны')

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[2]')
                            .should('be.disabled')

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/div[3]/button[1]').click();
                    })

                cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div[4]/div/button[2]')
                    .click().then(() => {

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/header/h3')
                            .should('have.text', 'Добавить новый параметр фильтрации устройств')

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]')
                            .should('be.disabled');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul')
                            .children().each(kid => {
                                cy.get(kid).click();
                            })

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]')
                            .should('not.be.disabled');

                        cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]').click().then(() => {
                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/header/h3')
                                .should('have.text', 'Настройка фильтра по устройствам')
                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[2]')
                                .should('be.visible');

                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[1]/div/button')
                                .click();
                            cy.xpath('//*[@id="reports-create-operation"]/div[3]/ul/li[1]')
                                .should('have.text', 'Включая');
                            cy.xpath('//*[@id="reports-create-operation"]/div[3]/ul/li[2]')
                                .should('have.text', 'Исключая');

                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[5]/div/button')
                                .click({ force: true });
                            cy.xpath('//*[@id="reports-create-more"]/div[3]/ul/li[1]')
                                .should('have.text', 'Дублировать');
                            cy.xpath('//*[@id="reports-create-more"]/div[3]/ul/li[2]')
                                .should('have.text', 'Удалить');

                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/div/ul/li[1]/ul/li/ul/li[3]/div/button')
                                .click({ force: true })
                            cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[1]')
                                .should('have.text', 'Содержит');
                            cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[2]')
                                .should('have.text', 'Не содержит');
                            cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[3]/div/button[1]')
                                .should('have.text', 'Всегда');
                            cy.xpath('//*[@id="reports-create-operators"]/div[3]/ul/li[3]/div/button[2]')
                                .should('have.text', 'Хотя бы раз');

                            cy.xpath('//*[@id="app-grid"]/div/div/div/div/div[3]/section[2]/div/footer/button[1]')
                                .click({force: true});
                        })
                    })


            })

    })

})