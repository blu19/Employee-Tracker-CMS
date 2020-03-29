DROP DATABASE IF EXISTS human_resources_db;
CREATE DATABASE human_resources_db;
USE human_resources_db;
CREATE TABLE department
(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);
CREATE TABLE role
(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER,
    INDEX department_ind(department_id),
    CONSTRAINT dpartment_fk FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee
(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    INDEX role_ind (role_id),
    CONSTRAINT manager_fk FOREIGN KEY (manager_id) REFERENCES employee(id)
    manager_id INTEGER,
    INDEX manager_ind (manager_id)
    CONSTRAINT manager_fk FOREIGN KEY(manager_id) REFERENCES employee(id)
);