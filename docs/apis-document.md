<p style="text-align: center; font-size: 48px;">
  APIs Documentation
</p>

## Introduction

This document provides documentation for the APIs of our project. The APIs allow users to interact with various functionalities of the system.

### Importing Postman Collection

To import the [POSTMAN](https://www.postman.com/) collection, follow these steps:

1. Get the v5 Postman collection file from [link-to-collection](./assets/salary-hero.postman-collection.json).
2. Open Postman.
3. Click on the "Import" button in the top-left corner.
4. Choose the downloaded collection file.
5. The collection will be imported into your Postman workspace.

## API Endpoints

## Employee

<details>

#### Find all

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/employees</code></summary>

#### Overview
List all Employee in app

##### Parameters

> None

##### Response

```
{
  "id": number,
  "name": string,
  "type": string,
  "base_salary": number,
  "current_balance": number,
  "day_of_works": number
}[]
```

## </details>

#### Create an employee

<details>
 <summary><code>POST</code> <code><b>/v1</b></code> <code>/employees</code></summary>

##### Parameters

> None

##### Body

> | property      | required | description                        |
> | ------------- | -------- | ---------------------------------- |
> | `name`        | `yes`    | `a name of employee` |
> | `employee_type_id`        | `yes`    | `an id of employee type` |
> | `base_salary`        | `yes`    | `a base salary of employee, it will be monthly or daily depends on employee type` |
> | `balance`        | `yes`    | `a current balance of employee` |

##### Response

```
{
    "id": number,
    "name": string,
    "employee_type": {
        "id": number,
        "type": string
    },
    "salary": {
        "id": number,
        "base_salary": number
    },
    "wallet": {
        "id": number,
        "ballance": number
    }
}
```

</details>


#### Create an attendance for employee

<details>
 <summary><code>POST</code> <code><b>/v1</b></code> <code>/employees/attendances</code></summary>

##### Parameters

> None

##### Body

> | property      | required | description                        |
> | ------------- | -------- | ---------------------------------- |
> | `date`        | `yes`    | `a date of working` |
> | `status`        | `yes`    | `a status of date of working. Available value [PRESENT, LEAVE, ABSENT]` |
> | `employee_id`        | `yes`    | `an id of employee` |

##### Response

```
{
    "id": number,
    "date": Date,
    "status": string,
    "employee": {
        "id": number,
        "name": string
    }
}
```

</details>

## </details>

## Wallet

<details>

#### Trigger testing to update balance for first employee in table

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/wallets/trigger</code></summary>

##### Parameters

> None

</details>

## </details>

## System

<details>

#### Manual updating balance

<details>
 <summary><code>POST</code> <code><b>/v1</b></code> <code>/update-balance</code></summary>

##### Parameters

> None

</details>

## </details>

## Related Documents

- [Instructions Documentation](../README.md)
- [My thought about "How to implement this application"?](./implement.md)
- [Additional information](./additional.md)