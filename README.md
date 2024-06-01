<p align="center">
  >> Wallet Manager <<
</p>

  <p align="center">Project belongs <a src='https://www.salary-hero.com/'>Salary Hero.</a></p>

## Description

An application to calculate and update daily balances for monthly and daily wage workers in Thailand.

## Built With

<p align="center" style="font-size: 18px"> 
  NodeJS  |
  NestJS  | 
  Postgres  | 
  BullMQ  | 
  Redis  |
  Docker
</p>

## Getting Started

### Installing

1. Clone Repository: Copy & paste below script to your terminal

```bash
git clone https://github.com/jarzt-pham/salary-hero.git && cd ./salary-hero
```

2. You have to install below technologies, you also have 2 ways, **i recommend you choose the second way**:
    1. Manual install related technology, following technology document and set up it on your machine: 
        1. [Download Postgres](https://www.postgresql.org/download/)
        2. [Download Redis](https://redis.io/downloads/)
        3. [Download NodeJS](https://nodejs.org/en/download/package-manager)
    2. With Docker _(Encourage)_ : Following [technology document and set up](https://www.docker.com/products/docker-desktop/) it on your machine
  
3. Install lib node_modules
```bash
npm install
```

After installing above repository and set up, move to below section


### Setup Environment
Copy & paste below script to your terminal

```bash
echo "
# Database
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_HOST=

# App
APP_PORT=

# Function
NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY=
" > .env
```

You can get an example value [here](./.example.env)

### Build and Run

Open your terminal and make sure you stay in project folder, you have 2 ways to start this project:

- With manual: 
```bash
npm run start:dev
```

- With Docker: 
```bash
docker compose up
```

### Testing 

Open your terminal and make sure you stay in project folder, you have 2 ways to start this project:
```bash
npm run test
```

## Documentations

You can read all documentation in the [folder docs](./docs/)

But, i think you should read the documents in the order below for the deepest understanding

1. [My thought about "How to implement this application"?](./docs/implement.md)
2. [APIs document](./docs/apis-document.md)
3. [Additional information](./docs/additional.md)
