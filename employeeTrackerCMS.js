//separate file for functions?

var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table") ;

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
        "Add a new department",
        "Add a new role",
        "Add a new employee",
        "View a new department",
        "View a new role",
        "View a new employee",
        //"View employees by manager"
        "Update employee roles",
        //"Update employee managers"
        //"Delete a department"
        //"Delete a role"
        //"Delete an employee"
        //"View the total utilized department budget"        
        "Done, nothing more to do"
      ]
    })
    .then(function(answer) {
        switch (answer.choice) {
            case "Add a new department":
                newDepartment();
                break;
            case "Add a new role":
                newRole();
                break;
            case "Add a new employee":
                newEmployee();
                break;
            case "View a new department":
                viewDept();
                break;
            case "View a new role":
                viewNewRole();
                break;
            case "View a new employee":
                viewNewEmployee();
                break;
            //case "View employees by manager":
            //  viewEmployeeByManager();
            //  break;
            case "Update employee roles":
                updateEmployeeRoles();
                break;
            //case "Update employee managers":
            //  updateEmployeeManager();
            //  break;
            //case "Delete a department":
            //  deleteDepartment();
            //  break;
            //case "Delete a role":
            //  deleteRole();
            //  break;
            //case "Delete an employee":
            //  deleteEmployee();
            //  break;
            //case "View the total utilized department budget":
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
        //no need for user to view this
        //var query = "SELECT name FROM department";
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
//var fullName = "employee.first_name, employee.last_name"
//"SELECT * FROM employee WHERE role.id = employee.role_id",
function newEmployee() {
    connection.query("SELECT role.id, role.title FROM role", 
    function(err, res) {
        var roleChoices = res.map(({id, title}) => ({value:id, name:title}))
        // var managerChoices = res.map(({id, manager_id})=>({value:id, name:managr_id}))
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
          }
        ])
        // {
        //     name: "managerId",
        //     type: "list",
        //     message: "What is the manager id for the employee you're adding?"
        // })
        .then(function(answer) {
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.roleId
              // manager_id: answer.managerId
            },
            function(err) {
              if (err) throw err;
              console.log("You created a new employee");
              hr();
            }
          );
        });
    });
}

