const autocannon = require('autocannon');
const {faker} = require('@faker-js/faker');
var reporter = require('autocannon-reporter')
const index = 20
var reportOutputPath =  `./reports/test-bun-redis-read${index}.html`
const loadData = require('./data/loaddata.json')
// API endpoint
const apiEndpoint = 'http://localhost:8200';


function generateRandomKey() {
  return `key_${faker.number.int({min:1, max:loadData[index].amount})}`;
}

function finishedBench(err, res) {
  if (err) {
    console.error('Error during benchmark:', err);
  } else {
    console.log('Benchmark finished!');
    console.log('Latency (ms):');
    console.log('  Avg:', res.latency.average);
    console.log('  Min:', res.latency.min);
    console.log('  Max:', res.latency.max);
    console.log('Requests/sec:', res.requests.average);
    console.log('Total requests:', res.requests.total);
    console.log('2xx responses:', res['2xx']);
    console.log('Non 2xx responses:', res.non2xx);
  }
}


// Options for autocannon
const opts = {
  url: apiEndpoint ,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  // Set a title for the load test
  title: `Integration-Transition-${index}`,
  duration: 300,
  connections:loadData[index-1].connections,
  amount: loadData[index-1].amount,
  requests: [{
    method: 'GET',
    path: '/get?key={KEY}',
    setupRequest: (request) => {
      request.path = request.path.replace('{KEY}', generateRandomKey());
      return request
    }
    
  }
  ]
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
      
  }, finishedBench);
}

start();



