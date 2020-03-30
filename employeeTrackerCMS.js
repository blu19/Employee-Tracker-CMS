//separate file for functions?
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "NewPassword",
    database: "human_resources_db"
})

connection.connect(function(err) {
    if (err) throw err;
    hr();
});

function hr() {
    inquirer.prompt({
      name: "choice",
      type: "rawlist",
      message: "What do you want to do?",
      choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View all departments",
        "View all roles",
        "View all employees",
        //"View employee by department",
        //"View employees by manager",
        "Update employee roles",
        //"Update employee managers",
        //"Delete department",
        //"Delete role",
        //"Delete employee",
        //"View total utilized department budget",        
        "Done, nothing more to do"
      ]
    })
    .then(function(answer) {
        switch (answer.choice) {
            case "Add department":
                newDepartment();
                break;
            case "Add role":
                newRole();
                break;
            case "Add employee":
                newEmployee();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            //case "View employees by department":
            //  viewEmployeesByDepartment();
            //  break;
            //case "View employees by manager":
            //  viewEmployeeByManager();
            //  break;
            case "Update employee roles":
                updateEmployeeRoles();
                break;
            //case "Update employee managers":
            //  updateEmployeeManager();
            //  break;
            //case "Delete department":
            //  deleteDepartment();
            //  break;
            //case "Delete role":
            //  deleteRole();
            //  break;
            //case "Delete employee":
            //  deleteEmployee();
            //  break;
            //case "View total utilized department budget":
            //  departmentBudget();
            //  break;
            case "Done, nothing more to do":
                connection.end();
                process.exit();
        }
    });
}

function newDepartment() {
    inquirer.prompt({
        name: "newDept",
        type: "input",
        message: "What is the name of the department would you like to add?"
    })   
    .then(function(answer) {
        connection.query("INSERT INTO department SET ?",
        {
            name: answer.newDept
        },
        function(err) {
            if (err) throw err;
            console.log("You created a new department")
            hr();
        })
    })
}

function newRole() {
    connection.query("SELECT department.id, department.name FROM department", 
    function(err, res) {
        //turn into array; use a key value array so that choices displays dept name, but key could 
        //represent the dept id. map function works well here.
        //mapping key value, name and value of what you want displayed
        var deptChoices = res.map(({id, name}) => ({value:id, name:name}))
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of the role you would like to add?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for the role you would like to add?"
        },
        {
          name: "deptId",
          type: "list",
          message: "What is the department for the role you would like to add?",
          choices: deptChoices
        }
      ])
      .then(function(answer) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.deptId
          },
          function(err) {
            if (err) throw err;
            console.log("You created a new role");
            hr();
          }
        );
      });
    })
}
//foreign key needed?
function newEmployee() {
    connection.query("SELECT role.id, role.title FROM role", 
    function(err, res) {
        var roleChoices = res.map(({id, title}) => ({value:id, name:title}))
    connection.query("SELECT first_name, last_name, employee.id FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = 'Manager'",
    function(err, res) {
        var managerList = res.map(({first_name, last_name, id}) => ({value:id, name:`${first_name} ${last_name}`}))
        inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "What is the first name of the employee you're adding?"
          },
          {
            name: "lastName",
            type: "input",
            message: "What is the last name of the employee you're adding"
          },
          {
            name: "roleId",
            type: "list",
            message: "What is the role for the employee you're adding?",
            choices: roleChoices
          },
          {
            name: "managerId",
            type: "list",
            message: "What is the manager id for the employee you're adding?",
            choices: managerList 
          }
        ])
        .then(function(answer) {
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.roleId,
              manager_id: answer.managerId
            },
            function(err) {
              if (err) throw err;
              console.log("You created a new employee");
              hr();
            }
          );
        });
    });
})}   

function viewDepartments() {
    connection.query("SELECT department.name FROM department", 
    function (err, res) {
        if (err) throw err;
        console.log("/n");
        console.table(res)
        hr();
    });
}
//fields
function viewRoles() {
    connection.query("SELECT role.title FROM role",
    function (err, res) {
        if (err) throw err;
        console.log("/n");
        console.table(res)
        hr();
    });
}

function viewEmployees() {
    connection.query(
      "SELECT employee.first_name, last_name, employee.id FROM employee",
    function(err, res) {
        // var employeeList = res.map(({first_name, last_name, id}) => ({value:id, name:`${first_name} ${last_name}`}))
        if (err) throw err;
        console.log("/n");
        console.table(res)
        hr();
    });
}

// // function viewEmployeesByDepartment() {

// // }
// // function viewEmployeeByManager() {

// // }

function updateEmployeeRoles() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name FROM employee", 
    function(err, res) {
      var empChoices = res.map(({ id, first_name, last_name }) => ({ value: id, name: `${first_name} ${last_name}` }));
    connection.query("SELECT id, title FROM role", 
    function(err, results) {
      var roleChoices = results.map(({ id, title }) => ({
        value: id,
        name: title
      }));
      inquirer
        .prompt([
          {
            name: "whichEmp",
            type: "list",
            message: "Which employee would you like to adjust the role for?",
            choices: empChoices
          },
          {
            name: "updatedEmpRole",
            type: "list",
            message: "What is their updated role?",
            choices: roleChoices
          }
        ])
        .then(function(answer) {
          console.log(answer.whichEmp, answer.updatedEmpRole)
          connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [answer.updatedEmpRole, answer.whichEmp],
            function(err) {
              if (err) throw err;
              console.log("You updated their role");
              hr();
            }
          );
        });
    });
    });
}

// function updateEmployeeRoles() {
//   inquirer.prompt([
//     {
//       name: "whichEmp",
//       type: "input",
//       message: "Please enter the employee's id to update their role:"
//     },
//     {
//       name: "roleChoice",
//       type: "input",
//       message: "What is the id of their new role?"
//     }
//   ])
//   .then(function(answer) {
//     connection.query("UPDATE employee SET ? WHERE ?", 
//     [{
//       role_id: answer.roleChoice
//     },
//     {
//       id: answer.whichEmp
//     }],
//     function (err) {
//       if (err) throw err;
//       console.log("Their role has been updated")
//       hr();
//     })
//  })
// }

// // function updateEmployeeManager() {

// // }

// // function deleteDepartment() {

// // }

// // function deleteRole() {

// // }

// // function deleteEmployee() {

// // }

// // function departmentBudget() {

// // }
