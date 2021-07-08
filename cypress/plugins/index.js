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
const env = require('../../cypress.env.json');
const dbType = env.dbType;

module.exports = (on, config) => {
  tasks = sqlServer.loadDBPlugin(dbConfig.db);
  on('task', tasks);
  return tasks;
}

//database ms sql
const mssql = require('mssql');
const { Pool } = require('pg');


async function queryDBpg(connectionInfo, query) {
  const pool = await new Pool(connectionInfo);



    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {

        if (error) {
          return reject(error)
          
        }

        return resolve(results.rows)
        
      })
    })
}

async function queryDBms(connectionInfo, query) {
  const connection = new mssql.ConnectionPool(connectionInfo);
  await connection.connect()

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        return reject(error)
      }

      connection.close()

      return resolve(results.recordset)
    })
  })
}
module.exports = (on, config) => {
  if(dbType === 'pg') {
    on('task', {
      queryDatabase(query) {
        const connectionInfo = dbConfig.dbpg
  
        if (!connectionInfo) {
          throw new Error(`Do not have DB connection`)
        }
  
        return queryDBpg(connectionInfo, query)
      }
    })
  } else if (dbType === 'mssql') {
    on('task', {
  
      queryDatabase(query) {
        const connectionInfo = dbConfig.dbmssql
  
        if (!connectionInfo) {
          throw new Error(`Do not have DB connection`)
        }
  
        return queryDBms(connectionInfo, query)
      }
    })
  }
  
}