const cron = require("node-cron");
var SunnyPortal = require('./private/sunnyportal');
const axios = require('axios');
const driver = require('bigchaindb-driver');
const { latestNews } = require('./eventNews.js');
const { kwh_by_month } = require('./kwhByMonth.js');


const monthsArr = [
	'JAN', 'FEB', 'MAR', 'APR', 'MAY',
	'JUN', 'JUL', 'AUG', 'SEP', 'OCT',
	'NOV', 'DEC'
];

const assetID = process.env.assetID;
const API_PATH = process.env.apiPath;
const tracker_publicKey = process.env.tracker_publicKey;
const tracker_privateKey = process.env.tracker_privateKey;
const conn = new driver.Connection(API_PATH);


cron.schedule("0 3 * * *", async function() {
  solarImpactData = await retrieveKwh();
  const timestamp = Number(solarImpactData[0])
  const dateObj = new Date(timestamp*1000);
  const year = dateObj.getFullYear(); 
  const month = monthsArr[dateObj.getMonth()]; 


  let tx = (await getLastTransaction(API_PATH, assetID)).data[0];
	let kwh = Number(solarImpactData[1])


	let lastIndexMeas = tx.metadata.events == undefined ?  
	0 : tx.metadata.events.measurements.length-1;
	const lastTimestamp = tx.metadata.timestamp // before first measurement 
	|| tx.metadata.events.measurements[lastIndexMeas].timestamp; // else
	const lastDate = new Date(lastTimestamp);
	const oldMonth = monthsArr[lastDate.getMonth()];

	let metaNew; // special first metadata this script generates
	let metaAppend; // metadata variable reserved for all other cases
	let meta; // final metadata which will be uploaded
	
if(tx.metadata.event == 'OWNERSHIP_TRANSFER')
{ 
  
  tx.metadata = '';

  metaNew = {
		'summary': {
			'kwh_total': 0,
			'kwh_by_year': [{
				'year': year,
				'kwh': 0,
				'kwh_by_month': kwh_by_month
			}],
		},
		'events': {
			'measurements': [{
				'timestamp': timestamp,
				'output_in_kwh': kwh
			}],
			'news': null
		}
	}; 
} else 
{

  metaAppend = {
		'timestamp': timestamp,
		'output_in_kwh': kwh
  };
  
  if(oldMonth === 'JAN' & month === 'FEB'){ // critical transition january to february
		const newYear = {
			'year': year,
			'kwh': 0,
			'kwh_by_month': kwh_by_month
		}
		// prepare new entry
		tx.metadata.summary.kwh_by_year.push(newYear); 
	}

	let sum = 0;
	// get index of the newest kwh_by_year
	const lastIndexYears = tx.metadata.summary.kwh_by_year.length-1;
	// sum up all kwh of the past month
	for(let i = 0; i <= lastIndexMeas; i++) {
		sum += tx.metadata.events.measurements[i].output_in_kwh;
	}

	// add the summed up kwh of the past month to the summed up kwh of the year
	tx.metadata.summary.kwh_by_year[lastIndexYears].kwh += sum;

	// write sum of past month in reserved array cell
	tx.metadata.summary.kwh_by_year[lastIndexYears].kwh_by_month[lastDate.getMonth()].kwh = sum;



	
if(oldMonth != month) { // month changed
	// delete all metadata measurement entries of the past month
	// Bigchaindb doesn't support arbitrary long metadata!
	tx.metadata.events.measurements = [];
}

} 

	
	


if(tx.metadata != '') { // not the first entry
	tx.metadata.events.measurements.push(metaAppend);
	meta = tx.metadata;
} else { // first metadata entry
	meta = metaNew;
}

lastIndexMeas = meta.events.measurements.length -1;

meta.summary.kwh_total += meta.events.measurements[lastIndexMeas].output_in_kwh;

meta.events.news =  latestNews;

const transaction = await driver.Transaction.makeTransferTransaction(
	[{ tx: tx, output_index: 0 }],
	[driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(tracker_publicKey))],
	meta
);
console.log(transaction)
	
const txSigned = await driver.Transaction.signTransaction(transaction, tracker_privateKey);
await conn.postTransactionCommit(txSigned)


});



async function retrieveKwh(){
  console.log(new Date().toString() + " | Gathering SunnyPortal Data for: " + process.env.SPusername + "; Plant: " + process.env.SPplantID);
  var sunnyPortal = new SunnyPortal(process.env.SPusername, process.env.SPpassword, process.env.SPplantID);
  await sunnyPortal.init();
  let timestampMeasurement = new Date(sunnyPortal.PVyesterday[1]).getTime()/1000;
  let kwhMeasurement = sunnyPortal.PVyesterday[0];
  return [timestampMeasurement, kwhMeasurement];
}

async function getLastTransaction(API_PATH, assetID){
    lastTxURL = API_PATH +  "transactions?last_tx=true&asset_id=" + assetID;
    return (await axios.get(lastTxURL))
}
