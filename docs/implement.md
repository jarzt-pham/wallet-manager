<div style="text-align: center; font-size: 48px;">
  How do I analysis and Implement
</div>

# Introduction

This document provides:

- Domain and Database design
- Infrastructure design
- Source code structure
- Code feature workflow

# Getting Started

Based on the requirements of the company's evaluation, I can identify and plan the implementation of the database and the code flow. 
To update all employees in the system (table can has over 1 million records), which involves a large amount of processing, I will use a message queue to reduce the load. 

Since the task involves finance, I will use an RDBMS and apply normalization to store the data.

# Domain and Database design

According to the requirements, the problem needs to be solved for employees, so I need a table to store employee information (Employees). Since there are two types of employees, I will create a table to store information about the employee types, making it easier to extend in the future. For now, I will define two types of employees: part-time and full-time. Full-time corresponds to monthly, and part-time corresponds to daily. Later, other types such as temporary or freelance can be added.

To handle salaries, I will need to store important salary information for employees, so I will create a table (employee_salaries). For this test, I will only store basic salary information. Although I could store this in the employees table directly with just one field, it would be difficult to expand in the future, so I want to keep it separate. Fields like bonus and income_additional can be added to this table later on.

To calculate working days, I'm not sure about the specific calculation method, so I will assume that an API with webhooks will be used to manage this. I will store the working day information for employees in a separate table (employee_attendances). This table will track the attendance records of employees.

Next, for updating balances, I will create a separate table to store and update balances (employee_wallets). Additionally, I will create another table to log balance updates for employees (employee_wallet_logs).

I have implemented a message queue, so I also need to set up a table to store job information to monitor whether user data is fully updated.

So, i will have 7 tables for solve the core function.

- employees
- employee_types
- employee_salaries
- employee_wallets
- employee_wallet_logs
- employee_attendances
- jobs

At this point, I **will not create constraints** for my tables to save time and focus on the main features required by the evaluation. **I will describe how I would create constraints** for the columns and tables if I were to implement them.

## Describe Table
### Employee

For this table, I will only store the name and the type of employee.

Relationship: Employee (1,n) ---- (1,1) Employee Type

The structure of the table will be:

```
+---------------------+
|      employees      |
+---------------------+
| id PK               | // Auto increment
| name                |
| employee_type_id FK |
| created_at          |
| updated_at          |
+---------------------+
```

### Employee Type

For this table, I will store the type of employee.

The structure of the table will be:

```
+------------------+
|  employee_types  |
+------------------+
| id PK            | // Auto increment
| type             | // At this time has 2 records, full-time and part-time
| created_at       |
| updated_at       |
+------------------+
```

### Employee Salary

For this table, I will store the salary information of employee. An Employee only have a salary information.

Employee only has 1 salary information (CONSTRAINT UNIQUE employee_id)

Relationship: Employee 1 ---- 1 Salary.

The structure of the table will be:

```
+-------------------+
| employee_salaries |
+-------------------+
| id PK             | // Auto increment
| base_salary       | // Base salary value depends on employee type, if "full-time", it will base salary for monthly, otherwise for daily
| employee_id FK    |
| created_at        |
| updated_at        |
+-------------------+
```

### Employee Wallet

For this table, I will store the balance of employee.

Wallet must has balance (CONSTRAINT NOT NULL balance)

Employee only has 1 wallet (CONSTRAINT UNIQUE employee_id TABLE)

Relationship: Employee 1 ---- 1 Wallet.

The structure of the table will be:

```
+-------------------+
| employee_wallets  |
+-------------------+
| id PK             | // Auto increment
| balance           | // the current balance of employee
| employee_id FK    |
| created_at        |
| updated_at        |
+-------------------+
```

### Employee Wallet Log

For this table, I will store the action of wallet of employee.

Log must has previous_balance, new_balance, amount_changed, description and created_at (CONSTRAINT NOT NULL for each left column)

Relationship: Wallet (1,1) ---- (1,n) Wallet Log.

The structure of the table will be:

```
+-----------------------+
| employee_wallet_logs  |
+-----------------------+
| id PK                 | // Auto increment
| previous_balance      |
| new_balance           |
| amount_changed        | // amount_changed = new_balance - previous_balance
| description           | // store the message about the action of wallet. At this time, i only store message "Increase the wallet"
| wallet_id FK          |
| created_at            | // store the created day of logs
| updated_at            |
+-----------------------+
```

### Employee Attendance

For this table, I will store the working day of employee. The working day will have a status, this status will determine 
how the employee works that day, it can be normal work, vacation or unauthorized leave from which the working days in the month can be 
calculated for employee.

Each employee only has 1 day corresponds with 1 record in table. (CONSTRAINT UNIQUE (employee_id, date))

Status has 3 values: PRESENT, LEAVE and ABSENT (CONSTRAINT NOT NULL status TABLE) (and create enum for this column)

Relationship: Employee (1,1) ---- (1,n) Attendance.

The structure of the table will be:

```
+-----------------------+
| employee_attendances  |
+-----------------------+
| id PK                 | // Auto increment
| date                  | // The working day of employee, 
| status                |
| employee_id FK        |
| created_at            |
| updated_at            |
+-----------------------+
```

### Jobs

For this table, I will store the action of wallet of employee.

Job must has status, type (CONSTRAINT NOT NULL status TABLE), (CONSTRAINT NOT NULL type)

Relationship: Wallet (1,1) ---- (1,n) Wallet Log.

The structure of the table will be:

```
+-----------------------+
| jobs                  |
+-----------------------+
| id PK                 | // varchar - uuid
| status                | // At this time, job has 2 status are COMPLETED and FAILED
| type                  | // To determine the event of job. At this time, job has 2 types are UPDATE_WALLET and CREATE_WALLET_LOG
| payload               | // At this time, job only stores employee_id[], batch and paging, what is this? I will tell you after
| message               | // store the message about job, error or any thing. At this time, i only store error if function has error
| created_at            |
| updated_at            |
+-----------------------+
```

## Diagram

<img src="./assets/database_diagram.png">

## Seeds
I have to written the scripts to seed for 5 tables, you can read mock data and script to run seeding in the [folder seeds](../src/infrastructure/database/seeds/).

For:
- Employee: [mock data](../src/infrastructure/database/seeds/mocks/employee.json), create 3 employee records
- Employee type: [mock data](../src/infrastructure/database/seeds/mocks/employee-type.json), create 2 employee type records (full time and part time)
- Employee salary: [mock data](../src/infrastructure/database/seeds/mocks/employee-salary.json), create 3 salary Information for 3 employees
- Employee wallet: [mock data](../src/infrastructure/database/seeds/mocks/employee-wallet.json), create 3 wallets for 3 employees
- Employee attendance: [mock data 1](../src/infrastructure/database/seeds/mocks/employee-attendance-nguyen-van-a.json) |  [mock data 2](../src/infrastructure/database/seeds/mocks/employee-attendance-nguyen-van-b.json) | [mock data 3](../src/infrastructure/database/seeds/mocks/employee-attendance-pham-dong-b.json), create attendance for 3 employees

Script: I implemented [script](../src/infrastructure/database/seeds/scripts/employee.script.ts#L272) to [app.service](../src/app.service.ts#L30)

`
Every times you start the application, seed will runs and only create record if table doesn't have any records (at the first times)
`

## Infrastructure Design

