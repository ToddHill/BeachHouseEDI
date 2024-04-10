import options  from "./data/Target_852_data.json" assert { type: "json"  };
preSavePage(options);
console.log(JSON.stringify(options, null, 2));
//////////////////////////////////////////////////////////////////////////////////////////
/*
Target 852 Processing

Placing the provided 852 information into the appropriate POS Custom Record
For use in the Analytic Features Built into NetSuite.
2.05.2024 - Initial First Tests to Asses functionality
2.06.2024 - Added loops written by Brian C to separate data within the loops
2.07.2024 - Adding Arrays and Making Changes to the Custom Record to account for the
           Addition of Data related to On Hand and On Order Data which is being
           Sent in the Original 852.
2.07.2024 - Initiated CHATGTP which shortended and completed the code. It was amazing
           to have it debug and simply post the code.
2.07.2024 - Added the convertDate function to change the ANSI/EDIFACT Dates into NetSuite Importable Dates
2.07.2024 - Added the RetailerID to the ImportData Object
2.07.2024 - Added the console.log to see the groupedData object
3.28.2024 - Complete rewrite of the code to account for the new JSON structure caused by the poller
4.08.2024 - Discovered that all indentificationCode and quantity fields are not being read. Added a loop to account for this.
4.09.2024 - Added a loop to account for BOTH the multiple identificationCode and quantity fields
4.09.2024 - Added a check to see if the QA activity code is found. If not, it will create a record with currentQuantity as zero
            this was needed because the QA activity code is not always present in the 852 file.
4.09.2024 - Added a check to see if the key exists in groupedData. If not, it will create a new record.
*/
///////////////////////////////// BEGIN CELIGO CODE ///////////////////////////////////////////////////////////
function preSavePage(options) {
  const data = options.data;
  const groupedData = {};

  // Process transaction sets
  for (const transactionSet of data[0].message.transactionSets) {
    const reportingDate = convertDate(transactionSet.reportingDateAction[0].date);

    for (const LIN_loop_item of transactionSet.LIN_loop) {
      const productServiceID2 = LIN_loop_item.itemIdentification[0].productServiceID2;

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
              const key = `${reportingDate}_${productServiceID2}_${currentStoreCode}`;
              
              // If the key doesn't exist in groupedData, create a new record
              if (!groupedData[key]) {
                groupedData[key] = {
                  RetailerId: "2276213",
                  date: reportingDate,
                  item: productServiceID2,
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
          const key = `${reportingDate}_${productServiceID2}_${currentStoreCode}`;
          if (!groupedData[key]) {
            groupedData[key] = {
              RetailerId: "2276213",
              date: reportingDate,
              item: productServiceID2,
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

  // Assign flattenedData to MainObject
  data[0].MainObject = flattenedData;

  console.log(JSON.stringify(data, null, 2));
  return {
    data: data,
    errors: options.errors,
    abort: false,
    newErrorsAndRetryData: []
  };
}

// convertDate Function to change ANSI/EDIFACT Dates into NetSuite Importable Dates
function convertDate(date) {
  var year = date.slice(0, 4);
  var month = date.slice(4, 6);
  var day = date.slice(6, 8);
  return `${month}/${day}/${year}`;
}
///////////////////////////////// END CELIGO CODE /////////////////////////////////////////////////////////////