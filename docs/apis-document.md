<div style="text-align: center; font-size: 48px;">
  APIs Documentation
</div>

## Introduction

This document provides documentation for the APIs of our project. The APIs allow users to interact with various functionalities of the system.

### Importing Postman Collection

To import the [POSTMAN](https://www.postman.com/) collection, follow these steps:

1. Get the v5 Postman collection file from [link-to-collection](./).
2. Open Postman.
3. Click on the "Import" button in the top-left corner.
4. Choose the downloaded collection file.
5. The collection will be imported into your Postman workspace.

## API Endpoints

## Employee

<details>

#### List all

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/factors</code></summary>

##### Parameters

> None

## </details>

## </details>

## Wallet

### Emission Source

<details>

#### List all

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code></summary>

##### Parameters

> None

## </details>

#### Find one by id

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code></summary>

##### Parameters

> | name                 | type     | data type | description                  |
> | -------------------- | -------- | --------- | ---------------------------- |
> | `emission_source_id` | required | int       | The specific emission source |

## </details>

#### Creating

<details>
 <summary><code>POST</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code></summary>

##### Parameters

> None

##### Body

> | property      | required | description                        |
> | ------------- | -------- | ---------------------------------- |
> | `description` | `yes`    | `a description of emission source` |

</details>

#### Update

<details>
 <summary><code>PATCH</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code></summary>

##### Parameters

> | name                 | type     | data type | description                  |
> | -------------------- | -------- | --------- | ---------------------------- |
> | `emission_source_id` | required | int       | The specific emission source |

##### Body

> | property      | required | description                        |
> | ------------- | -------- | ---------------------------------- |
> | `description` | `yes`    | `a description of emission source` |

</details>

#### Delete

<details>
 <summary><code>DELETE</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code></summary>

##### Parameters

> | name                 | type     | data type | description                  |
> | -------------------- | -------- | --------- | ---------------------------- |
> | `emission_source_id` | required | int       | The specific emission source |

</details>

</details>

---

### Emission Consumption

<details>

#### List all

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/consumptions</code></summary>

##### Parameters

> | name                 | type     | data type | description                   |
> | -------------------- | -------- | --------- | ----------------------------- |
> | `emission_source_id` | required | int       | A specific of emission source |

##### Query Parameter

> | name        | type     | data type | description                                        |
> | ----------- | -------- | --------- | -------------------------------------------------- |
> | `from_year` | required | int       | From year which you want to list (pass to current) |
> | `to_year`   | required | int       | From year which you want to list (pass to current) |

## </details>

#### Total emission

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/consumptions</code> <code>/total</code></summary>

##### Parameters

> | name                 | type     | data type | description                   |
> | -------------------- | -------- | --------- | ----------------------------- |
> | `emission_source_id` | required | int       | A specific of emission source |

##### Query Parameter

> | name        | type     | data type | description                        |
> | ----------- | -------- | --------- | ---------------------------------- |
> | `from_year` | required | int       | a Year which you want to get total |

## </details>

#### Creating

<details>
 <summary><code>POST</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/consumptions</code></summary>

##### Parameters

> | name                 | type     | data type | description                   |
> | -------------------- | -------- | --------- | ----------------------------- |
> | `emission_source_id` | required | int       | A specific of emission source |

##### Body

> | property  | required | data type | description                                         |
> | --------- | -------- | --------- | --------------------------------------------------- |
> | `year`    | `yes`    | int       | `a year which consumption`                          |
> | `value`   | `yes`    | float     | `a year which consumption`                          |
> | `unit_id` | `yes`    | int       | `a primary key of unit measurement which fuel uses` |
> | `fuel_id` | `yes`    | int       | `a primary key of fuel`                             |

</details>

#### Update

<details>
 <summary><code>PATCH</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/consumptions</code> <code>/:consumption_id</code></summary>

##### Parameters

> | name                      | type     | data type | description                       |
> | ------------------------- | -------- | --------- | --------------------------------- |
> | `emission_source_id`      | required | int       | The specific emission source      |
> | `emission_consumption_id` | required | int       | The specific emission consumption |

##### Body

> | property  | required | data type | description                                         |
> | --------- | -------- | --------- | --------------------------------------------------- |
> | `year`    | `yes`    | int       | `a year which consumption`                          |
> | `value`   | `yes`    | float     | `a year which consumption`                          |
> | `unit_id` | `yes`    | int       | `a primary key of unit measurement which fuel uses` |
> | `fuel_id` | `yes`    | int       | `a primary key of fuel`                             |

</details>

#### Delete

<details>
 <summary><code>DELETE</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/consumptions</code> <code>/:emission_consumption_id</code></summary>

##### Parameters

> | name                      | type     | data type | description                       |
> | ------------------------- | -------- | --------- | --------------------------------- |
> | `emission_source_id`      | required | int       | The specific emission source      |
> | `emission_consumption_id` | required | int       | The specific emission consumption |

</details>

</details>

---

### Wallet

<details>

#### List all

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/reductions</code></summary>

##### Parameters

> | name                 | type     | data type | description                   |
> | -------------------- | -------- | --------- | ----------------------------- |
> | `emission_source_id` | required | int       | A specific of emission source |

## </details>

#### Creating

<details>
 <summary><code>POST</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/reductions</code></summary>

##### Parameters

> | name                 | type     | data type | description                   |
> | -------------------- | -------- | --------- | ----------------------------- |
> | `emission_source_id` | required | int       | A specific of emission source |

##### Body

> | property      | required | data type | description                                         |
> | ------------- | -------- | --------- | --------------------------------------------------- |
> | `year`        | `yes`    | int       | `a year which you want to reduce`                   |
> | `description` | `yes`    | string    | `a description of reduction`                        |
> | `value`       | `yes`    | float     | `a year which consumption`                          |
> | `unit_id`     | `yes`    | int       | `a primary key of unit measurement which fuel uses` |
> | `fuel_id`     | `yes`    | int       | `a primary key of fuel`                             |

</details>

#### Update

<details>
 <summary><code>PATCH</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/reductions</code> <code>/:reduction_id</code></summary>

##### Parameters

> | name                 | type     | data type | description                     |
> | -------------------- | -------- | --------- | ------------------------------- |
> | `emission_source_id` | required | int       | The specific emission source    |
> | `reduction_id`       | required | int       | The specific emission reduction |

##### Body

> | property      | required | data type | description                                         |
> | ------------- | -------- | --------- | --------------------------------------------------- |
> | `year`        | `yes`    | int       | `a year which consumption`                          |
> | `description` | `no`     | string    | `a description of reduction`                        |
> | `value`       | `yes`    | float     | `a year which consumption`                          |
> | `unit_id`     | `yes`    | int       | `a primary key of unit measurement which fuel uses` |
> | `fuel_id`     | `yes`    | int       | `a primary key of fuel`                             |

</details>

#### Delete

<details>
 <summary><code>DELETE</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/consumptions</code> <code>/:reduction_id</code></summary>

##### Parameters

> | name                 | type     | data type | description                     |
> | -------------------- | -------- | --------- | ------------------------------- |
> | `emission_source_id` | required | int       | The specific emission source    |
> | `reduction_id`       | required | int       | The specific emission reduction |

</details>

</details>

---

### Emission Utils

<details>

#### Prediction

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/inventory/emission-sources</code> <code>/:emission_source_id</code> <code>/predictions</code></summary>

##### Parameters

> | name                 | type     | data type | description                   |
> | -------------------- | -------- | --------- | ----------------------------- |
> | `emission_source_id` | required | int       | A specific of emission source |

##### Query Parameter

> | name      | type        | data type        | description                                                                                   |
> | --------- | ----------- | ---------------- | --------------------------------------------------------------------------------------------- |
> | `by`      | no required | enum(ai, manual) | This api has 2 options to calculate predicted value use model ai and algo growth rate formula |
> | `to_year` | required    | int              | The end of year which you want to predictions                                                 |

## </details>

#### Total Emission

<details>
 <summary><code>GET</code> <code><b>/v1</b></code> <code>/inventory</code><code>/total-emission</code></summary>

##### Query Parameter

> | name      | type        | data type  | description                                                                                   |
> | --------- | ----------- | ---------- | --------------------------------------------------------------------------------------------- |
> | `by`      | no required | ai, manual | This api has 2 options to calculate predicted value use model ai and algo growth rate formula |
> | `to_year` | required    | int        | The end of year which you want to predictions                                                 |

</details>

## Related Documents

- Instructions Documentation: [link](../../README.md)
- Project Documentation: [link](../core/readme.md)
- Database Diagram: [link](./documents/core/db-diagram.png)