const {v4:uuid} = require('uuid')


const data = {
    employees : require('../model/employees.json'),
    setEmployees: function(data) { this.employees = data }
    
};

const getAllEmployees = (req, res) =>{
    res.json(data.employees);
}

const createEmployee = (req,res) =>{
    const newEmployee = {
        "id": data.employees?.length? data.employees[data.employees.length-1].id + 1: 1,
        "firstname" : req.body.firstname,
        "lastname": req.body.lastname,
    };

    if(!newEmployee.firstname || !newEmployee.lastname){
        return res.status(400).json({message: "first name and last name are required."})
    }   
    data.setEmployees([...data.employees,newEmployee ]);
    res.status(201).json(data.employees)
}

const updateEmployee = (req, res) =>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if(!employee){
        return res.status(400).json({message: "employee does not exist"})
    }
    if(req.body.firstname) employee.firstname = req.body.firstname;
    if(req.body.lastname) employee.lastname = req.body.lastname;
    const filteredArr = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArr = [...filteredArr, employee]
    const sortedArr = unsortedArr.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
    data.setEmployees(sortedArr);
    res.json(data.employees);
    
}

const deleteEmployee = (req, res) =>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if(!employee){
        res.status(400).json({ message: "employee not found."});
    }
    const filteredArr = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees(filteredArr);
    res.json(data.employees);
}

const getEmployee = (req,res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if(!employee){
        res.status(400).json({message: "employee not found"})
    }
    res.status(200).json(employee)
}

module.exports = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
}