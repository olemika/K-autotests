/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const dbConfig = require('../../cypress.json');

module.exports = (on, config) => {
  tasks = sqlServer.loadDBPlugin(dbConfig.db);
  on('task', tasks);
  return tasks;
}

//database ms sql
const mssql = require('mssql');


  async function queryDB (connectionInfo, query) {

  const connection = new mssql.ConnectionPool(connectionInfo);
  await connection.connect()

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        return reject(error)
      }

      connection.close()

      return resolve(results)
    })
  })
}
module.exports = (on, config) => {
  on('task', {
    // destructure the argument into the individual fields
    queryDatabase (query) {
      const connectionInfo = dbConfig.db

      if (!connectionInfo) {
        throw new Error(`Do not have DB connection`)
      }

      return queryDB(connectionInfo, query)
    }
  })
}