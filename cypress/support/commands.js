// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const webApi = Cypress.env('webApi')

 function getToken(usr) {
    return cy.request('POST', `${webApi}/v3/Auth/Login`, {
        "login": usr.login,
        "password": usr.pass
    }).then((response) => {
        const token = response.body.accessToken;
    return token
    })
    
}

Cypress.Commands.add("login", (user) => { 
    cy.visit("/")
    cy.get('input[type="text"]').type(user.login)
    cy.get('input[type="password"]').type(user.pass)
    cy.get('button[data-field="submit"]').click()
 });

 Cypress.Commands.add("getWebApiToken", getToken);