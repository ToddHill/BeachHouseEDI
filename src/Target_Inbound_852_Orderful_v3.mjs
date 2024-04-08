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
*/
///////////////////////////////// BEGIN CELIGO CODE /////////////////////////////////////////////////////////////
function preSavePage(options) {
  const data = options.data;
  const groupedData = {};

  // Process transaction sets
  for (const transactionSet of data[0].message.transactionSets) {
    const reportingDate = convertDate(transactionSet.reportingDateAction[0].date);

    for (const LIN_loop_item of transactionSet.LIN_loop) {
      const productServiceID2 = LIN_loop_item.itemIdentification[0].productServiceID2;

      for (const ZA_loop_item of LIN_loop_item.ZA_loop) {
        const storeCode = ZA_loop_item.destinationQuantity[0].identificationCode;

        for (const activity of ZA_loop_item.productActivityReporting) {
          const qty = parseInt(ZA_loop_item.destinationQuantity[0].quantity);

          let currentQuantity = 0;
          let soldQuantity = 0;
          let onOrderQuantity = 0;

          if (activity.activityCode === "QA") {
            currentQuantity = qty;
          } else if (activity.activityCode === "QS") {
            soldQuantity = qty;
          } else if (activity.activityCode === "QP") {
            onOrderQuantity = qty;
          }

          const key = `${reportingDate}_${productServiceID2}_${storeCode}`;
          if (!groupedData[key]) {
            groupedData[key] = {
              RetailerId: "2276213",
              date: reportingDate,
              item: productServiceID2,
              storeCode: storeCode,
              currentQuantity: 0,
              soldQuantity: 0,
              onOrderQuantity: 0
            };
          }

          // Update quantities for the same key
          groupedData[key].currentQuantity += currentQuantity;
          groupedData[key].soldQuantity += soldQuantity;
          groupedData[key].onOrderQuantity += onOrderQuantity;
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