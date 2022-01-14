const { ddbClient } = require('./ddbclient');
const { ScanCommand, PutItemCommand, QueryCommand, GetItemCommand, DeleteItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { param } = require('express/lib/application');
const {marshall, unmarshall}= require('@aws-sdk/util-dynamodb')

class EmployeeService {
    constructor() {
        this.TableName = process.env.TableName || "Employees"
    }

    async getAllEmployees() {
        let params = {
            TableName: this.TableName,
            Select: 'ALL_ATTRIBUTES', //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
            // FilterExpression: 'Department = :dept',
            // ExpressionAttributeValues: {
            // ':dept' : {S: 'IT'}
            // },
            // ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
            // ExpressionAttributeNames: {
            // "#Ename":"Name",
            // "#Loc":"Location"
            // }
        }
        //return ddbClient.send(new ScanCommand(params));
        let result = await ddbClient.send(new ScanCommand(params))
            .catch(err => {
                console.log("Cust err:" + err);
                return Promise.reject(err);
            });
            //console.log(result);
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
    }

    addEmployee(employee) {
        let params = {
            TableName: 'Employees',
            Item: {
                LocationID: { S: employee.LocationID }, //pk
                EmpCode: { S: employee.EmpCode }, //sk
                Name: { S: employee.Name },
                Age: { N: employee.Age },
                Location: { S: employee.Location },
                Designation: { S: employee.Designation },
                Department: { S: employee.Department },
                Address: { S: employee.Address }
            }
        }
        console.log(params.Items)
        return ddbClient.send(new PutItemCommand(params));
        // ddbClient.put(params, (err, data) => {
        //     if (err) console.log(err)
        //     else console.log("Success")
        // })

    }

    getEmployeesByLocation(LocationID) {
        var params = {
            TableName: this.TableName,
            KeyConditionExpression: "LocationID = :locId",
            ExpressionAttributeValues: {
                ":locId": { 'S': LocationID }
            }
        };
        return ddbClient.send(new QueryCommand(params));
    }

    async getEmployee(locationId, empCode) {
        var params = {
            TableName: this.TableName,
            Key: {
                "LocationID": { "S": locationId },
                "EmpCode": { "S": empCode }
            }
        };
        //return ddbClient.send(new GetItemCommand(params));
        let result = await ddbClient.send(new GetItemCommand(params))
            .catch(err => Promise.reject(err));
        return Promise.resolve(result.Item ? unmarshall(result.Item) : undefined)
    }

    deleteEmployee(locationId, empCode) {
        //implement here
        var params = {
            TableName: this.TableName,
            Key: {
                "LocationID": { "S": locationId },
                "EmpCode": { "S": empCode }
            }
        };
        return ddbClient.send(new DeleteItemCommand(params));
    }

    // updateEmployee(locationId, empCode, employee) {
    //     //implement here
    //     console.log(locationId)
    //     let params = {
    //         TableName: this.TableName,
    //         Key: {
    //             "LocationID": { "S": locationId },
    //             "EmpCode": { "S": empCode }
    //         },
    //         Item: {
    //             LocationID: { S: employee.LocationID }, //pk
    //             EmpCode: { S: employee.EmpCode }, //sk
    //             Name: { S: employee.Name },
    //             Age: { N: employee.Age },
    //             Location: { S: employee.Location },
    //             Designation: { S: employee.Designation },
    //             Department: { S: employee.Department },
    //             Address: { S: employee.Address }
    //         }
    //     }
    //     return ddbClient.send(new this.updateEmployee(params));
    //}
}

module.exports = { EmployeeService }

