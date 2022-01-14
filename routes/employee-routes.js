
const { Router } = require('express');
const { EmployeeService } = require('../helper/employee-helper')

var router = Router();
var empSvc = new EmployeeService();

//Get all employees
//GET /employees
router.get("/", async(req,res)=>{
    let emps = await empSvc.getAllEmployees()
        .catch(err=>{
            console.log(err);
            res.status(500).json({ 'message':'Unable to read the employees' });
        })
    res.status(200).json(emps);
});

//Add an employee
//POST /employees
router.post("/", async(req,res)=>{
    let employee = req.body;
    let result = await empSvc.addEmployee(employee)
        .catch(err=>{
            console.log(err);
            res.status(500).json({'message':'Unable to add new employee'})
        })
    if(result)
    {
        res.status(201).json({'message':'Employee added successfully'})
    }
})

//Get employees from a location
//GET /employees/location/:locId
router.get('/location/:locId', async(req,res)=>{
    let locationId = req.params["locId"];
    let result = await empSvc.getEmployeesByLocation(locationId)
        .catch(err=>{
            console.log(err);
            res.status(500).json({'message':'Error in fetching employees data'})
        })
    if(result){
        res.status(200).json(result);
    }
});

//Get a single employee
//GET /employees/location/:locId/empcode/:ecode
router.get("/location/:locId/empcode/:ecode",async(req,res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.getEmployee(locationId,empCode)
        .catch(err=>{
            console.log(err);
            res.status(500).json({ 'message': 'Unable to get employee details'})
        })
    if(result){
        res.status(200).json(result);
    }else{
        res.status(404).json({'message':'Employee not found'})
    }
});

//Delete the employee
//DELETE /employees/location/:locId/empcode/:ecode
router.delete("/location/:locId/empcode/:ecode",async(req,res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.deleteEmployee(locationId,empCode)
        .catch(err=>{
            console.log(err);
            res.status(500).json({'message':'Error in deleting'})
        })
    if(result){
        res.status(200).json({'message':'Deleted'})
    }

});

//Update the employee
//PUT /employees/location/:locId/empcode/:ecode
router.put("/location/:locId/empcode/:ecode",async(req,res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let employee = req.body;
    //Implement here

});

module.exports = router

// //Update the employee
// //PUT /employees/location/:locId/empcode/:ecode
// router.put("/location/:locId/empcode/:ecode", async (req, res) => {
//     let locationId = req.params["locId"];
//     let empCode = req.params["ecode"];
//     let employee = req.body;
//     let result = await empSvc.updateEmployee(locationId, empCode, employee)
//         .catch(err => res.status(500).json({ 'message': 'Unable to update the employee record' + err }))
//     if (result) {
//         return res.status(201).json({ 'message': 'Employee Updated successfully' });
//     }
//     console.log(employee);
//     //Implement here});
// })





// //Get a single employee
// //GET /employees/location/:locId/eid/:empId
// router.get(params)

//Add an employee
//POST /employees
//router.post();

// //Delete an employess
// //DELETE /employees/location/locId/:empId
// router.delete();

module.exports = router;