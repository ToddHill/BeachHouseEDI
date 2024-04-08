import options  from "./data/Target_852_data_shortform.json" assert { type: "json"  };
preSavePage(options);

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
  const flattenedData = [];

  // Retrieve relevant data
  const retailerID = "2276213"; // Set the RetailerID

  // Process transaction sets
  for (const transactionSet of data[0].message.content.transactionSets) {
    const reportingDate = convertDate(transactionSet.reportingDateAction[0].date);

    for (const LIN_loop_item of transactionSet.LIN_loop) {
      const productServiceID2 = LIN_loop_item.itemIdentification[0].productServiceID2;

      for (const ZA_loop_item of LIN_loop_item.ZA_loop) {
        let currentQuantity = 0;
        let soldQuantity = 0;
        let onOrderQuantity = 0;

        for (const activity of ZA_loop_item.productActivityReporting) {
          const qty = ZA_loop_item.destinationQuantity[0].quantity;

          if (activity.activityCode === "QA") {
            currentQuantity = parseInt(qty);
          } else if (activity.activityCode === "QS") {
            soldQuantity = parseInt(qty);
          } else if (activity.activityCode === "QP") {
            onOrderQuantity = parseInt(qty);
          }
        }

        for (const destinationQuantity of ZA_loop_item.destinationQuantity) {
          const identificationCode = destinationQuantity.identificationCode;

          // Push processed data to flattenedData array
          flattenedData.push({
            RetailerId: retailerID,
            date: reportingDate,
            item: productServiceID2,
            storeCode: identificationCode,
            currentQuantity: currentQuantity,
            soldQuantity: soldQuantity,
            onOrderQuantity: onOrderQuantity
          });
        }
      }
    }
  }

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