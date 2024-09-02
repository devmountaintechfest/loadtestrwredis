const autocannon = require('autocannon');
const { faker } = require('@faker-js/faker');
var reporter = require('autocannon-reporter')
const index = 2
var reportOutputPath = `./reports/test-bun-redis${index}.html`
const loadData = require('./data/loaddata.json')
const uuids = require('./data/uuids.json')
// API endpoint
const apiEndpoint = 'http://localhost:8200/set';
const { v4: uuidv4 } = require('uuid');
const topics = ['TransferIntraBank']

let id = 0;

function getLastId() {
  id++;
  return 'key_' + id
}
function createMessage() {
  return {
    key: getLastId(),
    value: JSON.stringify({
      id: uuidv4(),
      namespace: "Banking Transaction",
      topic: topics[0],
      content: JSON.stringify(genTransferMessage()),
      remark: "TranferIntraBank",
      createdAt: faker.date.recent(),
      createdBy: faker.person.firstName().substring(0, 50),
      sign: 1
    }),
    ttl: 3600
  };
}

function genTransferMessage() {
  senderAccount = uuids[faker.number.int({ min: 0, max: 99 })];
  receiverAccount = uuids[faker.number.int({ min: 0, max: 99 })];
  const amount = parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 }))
  return {
    transactionDate: faker.date.recent().toISOString(),
    amount: amount, // Amount between 100 and 1000 with 2 decimal places
    senderAccountId: senderAccount,
    "receiverAccountId": receiverAccount,
    "sourceInstitution": "Our Bank",
    destinationInstitution: "Our Bank",
    actBy: senderAccount,
    actAt: faker.date.recent().toISOString(),
    description: `Transfer Money from ${senderAccount} to ${receiverAccount} amount is ${amount}.`,
    createdBy: senderAccount
  }
}

// Options for autocannon
const opts = {
  url: apiEndpoint,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  setupClient: (client) => {
    client.on('request', (requestParams) => {

      const request = createMessage();
      client.setBody(JSON.stringify(request));
    });
  },
  // Set a title for the load test
  title: `Load Test Bun Redis -${index}`,
  duration: 300,
  connections: loadData[index - 1].connections,
  amount: loadData[index - 1].amount
};

async function start() {
  // Run load test using autocannon
  autocannon(opts, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(result);
    let html = reporter.buildReport(result) // the html structure
    reporter.writeReport(html, reportOutputPath, (err, res) => {
      if (err) console.err('Error writting report: ', err)
      else console.log('Report written to: ', reportOutputPath)
    }) //write the report

  });
}

start();
