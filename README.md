# Load test Write/Read Redis
Load Test Write and Read to Redis

## Prerequisites
- Redis Docker
```sh
docker run --name redis -d -p 6379:6379 redis
```
## Project Structure
```sh
- elysia-redis 
# web api written by typescript, elysia and bun for write and read to Redis
- go-redis 
# web api written by go and standard http for write and read to Redis
- load-test 
# load test tool by autocannonjs
```

## Test Scenarios

| Total Users | 5 Trans per user | In 17 hours | Transaction/S | Test in 5 mins | Total Trans in 5 mins | Total Connections |
|-------------|------------------|-------------|---------------|----------------|----------------------|-------------------|
| 10,000      | 50000            | 61200       | 0.8169934641  | 300            | 246                  | 1                 |
| 50,000      | 250000           | 61200       | 4.08496732    | 300            | 1226                 | 5                 |
| 100,000     | 500000           | 61200       | 8.169934641   | 300            | 2451                 | 9                 |
| 500,000     | 2500000          | 61200       | 40.8496732    | 300            | 12255                | 41                |
| 1,000,000   | 5000000          | 61200       | 81.69934641   | 300            | 24510                | 82                |
| 2,000,000   | 10000000         | 61200       | 163.3986928   | 300            | 49020                | 164               |
| 2,500,000   | 12500000         | 61200       | 204.248366    | 300            | 61275                | 205               |
| 3,000,000   | 15000000         | 61200       | 245.0980392   | 300            | 73530                | 246               |
| 4,000,000   | 20000000         | 61200       | 326.7973856   | 300            | 98040                | 327               |
| 4,500,000   | 22500000         | 61200       | 367.6470588   | 300            | 110295               | 368               |
| 5,000,000   | 25000000         | 61200       | 408.496732    | 300            | 122550               | 409               |
| 8,000,000   | 40000000         | 61200       | 653.5947712   | 300            | 196079               | 654               |
| 9,000,000   | 45000000         | 61200       | 735.2941176   | 300            | 220589               | 736               |
| 10,000,000  | 50000000         | 61200       | 816.9934641   | 300            | 245099               | 817               |
| 12,000,000  | 60000000         | 61200       | 980.3921569   | 300            | 294118               | 981               |
| 14,000,000  | 70000000         | 61200       | 1143.79085    | 300            | 343138               | 1144              |
| 15,000,000  | 75000000         | 61200       | 1225.490196   | 300            | 367648               | 1226              |
| 16,000,000  | 80000000         | 61200       | 1307.189542   | 300            | 392157               | 1308              |
| 18,000,000  | 90000000         | 61200       | 1470.588235   | 300            | 441177               | 1471              |
| 20,000,000  | 100000000        | 61200       | 1633.986928   | 300            | 490197               | 1634              |
| 40,000,000  | 200000000        | 61200       | 3267.973856   | 300            | 980393               | 3268              |
| 50,000,000  | 250000000        | 61200       | 4084.96732    | 300            | 1225491              | 4085              |
| 70,000,000  | 350000000        | 61200       | 5718.954248   | 300            | 1715687              | 5719              |
| 100,000,000 | 500000000        | 61200       | 8169.934641   | 300            | 2450981              | 8170              |
| 200,000,000 | 1000000000       | 61200       | 16339.86928   | 300            | 4901961              | 16340             |

## Start Go Redis
1. download go-redis
```sh
go mod download
```
or
```sh
go get "github.com/go-redis/redis/v8"
```
2. cd `cmd`
3. run go api
```sh
go run main.go
```
Go api will listen on port 8100 
* make sure redis is running at localhost:6379
Before run load test try to restart redis server or clear all cached, then start load test tool.

## Start Load Test Tool
1. cd `load-test`
2. install dependencies
```sh
npm install
```
3. Run load test tool at `load-test` folder
```sh
node test-go-redis.js
```
4. After finished see report at `./reports` folder
Before run load test try to start with low index, then increase later after load test is done.
```js
const index = 2
var reportOutputPath = `./reports/test-redis-go${index}.html`
const loadData = require('./data/loaddata.json')
```
## Start Bun Redis
1. go to `elysia-redis` folder
2. install dependencies
```sh
bun install
```
3. run web api at elysia-redis folder
```sh
bun index.ts
```

## Start Load Test Bun Api
1. cd `load-test`
2. run command
```sh
node test-bun-redis.js
```






