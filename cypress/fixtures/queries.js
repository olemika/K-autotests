const admin = Cypress.env('mainOrgAdmin');

export const totalDevicesQuery = `SELECT * FROM "LogicDevicePoints" AS ldp JOIN "Agents" AS a ON a."Id" = ldp."AgentId" 
WHERE a."AccountId" = ${admin.accountId} 
AND a."Disabled"='false' 
AND a."Deleted"='false' 
AND ldp."Disabled"='false'
AND ldp."Deleted"='false'`;

export const deviceNamesDB = `SELECT ldp."Id", COALESCE(NULLIF("DeviceStates"."Value", ''), ' ') AS "value", "Semantics"."Name"
FROM "LogicDevicePoints" AS ldp
LEFT OUTER JOIN (SELECT * FROM  "DeviceStates"  WHERE  "SemanticId" = 'AC142B83-2EC7-4714-ABE0-97D22F6F9A1E') AS "DeviceStates"  ON ldp."Id" = "DeviceStates"."LogicDevicePointId"
LEFT OUTER  JOIN "Semantics"  ON "Semantics"."Id" = "DeviceStates"."SemanticId"
LEFT OUTER  JOIN "Agents" ON "Agents"."Id" = ldp."AgentId"
WHERE ldp."Deleted"='false' AND ldp."Disabled"='false'
AND "Agents"."Deleted"='false'
AND "Agents"."AccountId"=${admin.accountId}
AND "DeviceStates"."Reliability"='true'
ORDER BY "DeviceStates"."Value"`
//''
export const directionQuery = `SELECT ldp."Id", COALESCE(NULLIF(ds."Value", ''), ' ') AS "value"
FROM "LogicDevicePoints" AS ldp 
LEFT OUTER JOIN (SELECT * FROM  "DeviceStates"  WHERE  "SemanticId" = '66CE66FF-E3A3-4D02-AB81-3BE3518EB450') AS ds  ON ldp."Id" = ds."LogicDevicePointId"
LEFT OUTER  JOIN "Semantics" AS s ON s."Id" = ds."SemanticId"
LEFT OUTER  JOIN "Agents" AS a ON a."Id" = ldp."AgentId"
WHERE ldp."Deleted"='false' AND ldp."Disabled"='false'
AND a."AccountId"=${admin.accountId}
AND a."Deleted"='false'
ORDER BY ds."Value"`

export const groupsQuery = `SELECT "Name"
FROM "DeviceGroups" 
WHERE "AccountId" = ${admin.accountId} `

export const ipAdressQuery = `SELECT ldp."Id", ds."Value" AS "value", s."Name"
FROM "LogicDevicePoints" AS ldp 
LEFT OUTER JOIN (SELECT * FROM  "DeviceStates"  WHERE  "SemanticId" = '40EB7178-7EAF-48F4-AC2A-6DD1052A1EFB' ) AS ds  ON ldp."Id" = ds."LogicDevicePointId"
LEFT OUTER  JOIN "Semantics" AS s ON s."Id" = ds."SemanticId"
LEFT OUTER  JOIN "Agents" AS a ON a."Id" = ldp."AgentId"
WHERE ldp."Deleted"='false' AND ldp."Disabled"='false'
AND a."AccountId"=${admin.accountId}
AND a."Deleted"='false'
AND ds."Reliability"='true'
ORDER BY ds."Value"`

export const tonerQuery = ` SELECT ldp."Id", COALESCE(ds."Value", 0) AS "value" 
FROM "LogicDevicePoints" AS ldp 
LEFT OUTER JOIN (SELECT "LogicDevicePointId", MIN(CAST("Value" AS INTEGER)) AS "Value" FROM  "DeviceStates"  WHERE "ColumnId"=4 GROUP BY "LogicDevicePointId") AS ds  ON ldp."Id" = ds."LogicDevicePointId"
LEFT OUTER  JOIN "Agents" AS a ON a."Id" = ldp."AgentId"
WHERE ldp."Deleted"='false' AND ldp."Disabled"='false'
AND a."AccountId"=${admin.accountId}
AND a."Deleted"='false'
ORDER BY ds."Value"`

export const groupNameQuery = `SELECT ldp."Id", COALESCE(NULLIF(ds."Value", ''), ' ') AS "value", s."Name"
FROM "LogicDevicePoints" AS ldp 
LEFT OUTER JOIN (SELECT * FROM  "DeviceStates"  WHERE  "SemanticId" = '3AE30C7E-5A0C-4E99-B895-08D6E8F10CC0' AND "Reliability"='true') AS ds  ON ldp."Id" = ds."LogicDevicePointId"
LEFT OUTER  JOIN "Semantics" AS s ON s."Id" = ds."SemanticId"
LEFT OUTER  JOIN "Agents" AS a ON a."Id" = ldp."AgentId"
WHERE ldp."Deleted"='false' AND ldp."Disabled"='false'
AND a."AccountId"=${admin.accountId}
AND a."Deleted"='false'
ORDER BY ds."Value"`

export const extraQuery = `SELECT ldp."Id", COALESCE(NULLIF(ds."Value", ''), ' ') AS "value", s."Name"
FROM "LogicDevicePoints" AS ldp 
LEFT OUTER JOIN (SELECT * FROM  "DeviceStates"  WHERE  "SemanticId" = 'A87960EB-D098-4134-B896-08D6E8F10CC0') AS ds  ON ldp."Id" = ds."LogicDevicePointId"
LEFT OUTER  JOIN "Semantics" AS s ON s."Id" = ds."SemanticId"
LEFT OUTER  JOIN "Agents" AS a ON a."Id" = ldp."AgentId"
WHERE ldp."Deleted"='false' AND ldp."Disabled"='false'
AND a."AccountId"=${admin.accountId}
AND a."Deleted"='false'
ORDER BY ds."Value"`


 //DeviceReportForFinancialDirector

 export  function getTemplateIdQuery (reportCode) {
return `SELECT  "Id"
FROM "ReportTemplates" WHERE "Code"='${reportCode}'`
 }

 //create reports elements
 export  function getDeviceGroupsQuery (accountId) {
    return `SELECT "Name"
    FROM "DeviceGroups" 
    WHERE "AccountId" = ${accountId} `
 } 


export  function getUserGroupsQuery (accountId) {
    return `SELECT DISTINCT(COALESCE(NULLIF("DepartmentString", ''), 'Без подразделения'))  AS "DepartmentString"
    FROM "Identities" 
    WHERE "AccountId"=${accountId}
    AND "IsDeleted"=0`
 } 

export const ReportsNames = `SELECT "DispalayName"
FROM "ReportTemplates"
ORDER BY "DispalayName"`

//

