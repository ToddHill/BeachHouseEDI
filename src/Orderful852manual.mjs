/////////////////////////////////// BEGIN DEVELOPMENT CODE ///////////////////////////////////
import options from './data/DownloadedOrderful852.json' assert { type: "json" };
ZBpreSavePage(options);

//console.log(JSON.stringify(options, undefined, 2));

ZBpreSavePage(options);

// convertDate Function to change ANSI/EDIFACT Dates into NetSuite Importable Dates
function convertDate(date) {
  var year = date.slice(0, 4);
  var month = date.slice(4, 6);
  var day = date.slice(6, 8);
  return `${month}/${day}/${year}`;
}


function ZBpreSavePage(options) {
  if (options === undefined || options.length === 0) {
    return {
      output: "this has no items",
      errors: "EMPTY FILE"
    }
    console.log('blank file');
  }
  else {
  const data = options;
  const groupedData = {};
  const applicationReceiversCodeToRetailerID = {
    "BEACHHOUSEPTTN": "849509",
    "BEACHHOUSEMOON": "339086",
    "BHGNOYZ": "2319103",
    // Add more mappings here as needed, for example:
    // "ANOTHERCODE": "ANOTHERID",
  };
  const applicationReceiversCode = data.functionalGroupHeader[0].applicationReceiversCode;
  const retailerID = applicationReceiversCodeToRetailerID[applicationReceiversCode] || "test"; // Fallback to a default ID if not found

  // Process transaction sets
  for (const transactionSet of data.transactionSets) {
    const reportingDate = convertDate(transactionSet.reportingDateAction[0].date);
    const reportingDate1 = convertDate(transactionSet.reportingDateAction[0].date1);

    for (const LIN_loop_item of transactionSet.LIN_loop) {
      const productServiceID1 = LIN_loop_item.itemIdentification[0].productServiceID1;

      for (const ZA_loop_item of LIN_loop_item.ZA_loop) {
        let currentStoreCode; // Define currentStoreCode here
        let currentQuantity = 0; // Initialize currentQuantity
        let foundQA = false; // Flag to indicate if QA activity code is encountered

        for (const destinationQuantity of ZA_loop_item.destinationQuantity) {
          for (let i = 0; i <= 9; i++) {
            const identificationCodeKey = i === 0 ? 'identificationCode' : `identificationCode${i}`;
            const quantityKey = i === 0 ? 'quantity' : `quantity${i}`;
            const identificationCode = destinationQuantity[identificationCodeKey];
            const quantity = parseInt(destinationQuantity[quantityKey]);

            if (identificationCode !== undefined && !isNaN(quantity)) {
              currentStoreCode = identificationCode; // Assign currentStoreCode

              // Create a unique key based on date, item, and storeCode
              const key = `${reportingDate}_${productServiceID1}_${currentStoreCode}`;
              
              // If the key doesn't exist in groupedData, create a new record
              if (!groupedData[key]) {
                groupedData[key] = {
                  RetailerId: retailerID ,
                  date: reportingDate,
                  date1: reportingDate1,
                  item: productServiceID1,
                  storeCode: currentStoreCode,
                  currentQuantity: 0, // Set currentQuantity to zero initially
                  soldQuantity: 0,
                  onOrderQuantity: 0
                };
              }

              // Update the respective quantity based on activity code
              const activityCode = ZA_loop_item.productActivityReporting[0].activityCode;
              if (activityCode === 'QA') {
                groupedData[key].currentQuantity += quantity;
                foundQA = true; // Set foundQA flag to true
              } else if (activityCode === 'QS') {
                groupedData[key].soldQuantity += quantity;
              } else if (activityCode === 'QP') {
                groupedData[key].onOrderQuantity += quantity;
              }
            }
          }
        }

        // If no QA activity code is encountered, create a record with currentQuantity as zero
        if (!foundQA) {
          const key = `${reportingDate}_${productServiceID1}_${currentStoreCode}`;
          if (!groupedData[key]) {
            groupedData[key] = {
              RetailerId: retailerID,
              date: reportingDate,
              date1: reportingDate1,
              item: productServiceID1,
              storeCode: currentStoreCode,
              currentQuantity: 0,
              soldQuantity: 0,
              onOrderQuantity: 0
            };
          }
        }
      }
    }
  }

  // Convert groupedData object to array
  const flattenedData = Object.values(groupedData);
  flattenedData[0]['delivery'] = options.delivery
  
  console.log('---- Approval -------------------------');

  console.log('---- DATA ------- if applicable -------');
  //console.log(JSON.stringify(data, null, 2));

  return {
    data: flattenedData,
    errors: options.errors,
    abort: false,
    newErrorsAndRetryData: []
  };
}}
