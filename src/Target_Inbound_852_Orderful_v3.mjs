import options  from "./data/Target_852_data.json" assert { type: "json"  };
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
  const sender = data[0].sender.isaId;
  const BHGID = data[0].receiver.isaId;
  const OrderfulID = data[0].id;
  const retailerID = "2276213"; // Set the RetailerID
  const interchangeDate = data[0].message.content.interchangeControlHeader[0].interchangeDate;
  const interchangeTime = data[0].message.content.interchangeControlHeader[0].interchangeTime;

  // Process transaction sets
  for (const transactionSet of data[0].message.content.transactionSets) {
    const reportingDate = convertDate(transactionSet.reportingDateAction[0].date);

    for (const LIN_loop_item of transactionSet.LIN_loop) {
      const productServiceID2 = LIN_loop_item.itemIdentification[0].productServiceID2;

      for (const ZA_loop_item of LIN_loop_item.ZA_loop) {
        const activityCode = ZA_loop_item.productActivityReporting[0].activityCode;

        for (const destinationQuantity of ZA_loop_item.destinationQuantity) {
          // Extract identification codes and quantities dynamically
          let i = 0;
          while (true) {
            const identificationCodeKey = `identificationCode${i !== 0 ? i : ''}`;
            const quantityKey = `quantity${i !== 0 ? i : ''}`;
            const identificationCode = destinationQuantity[identificationCodeKey];
            const quantity = destinationQuantity[quantityKey];
            
            if (identificationCode !== undefined && quantity !== undefined) {
              // Push processed data to flattenedData array
              flattenedData.push({
                RetailerId: retailerID,
                date: reportingDate,
                time: interchangeTime,
                item: productServiceID2,
                storeCode: identificationCode,
                quantity: quantity,
                activityCode: activityCode
              });
            } else {
              // Exit the loop if identificationCode or quantity is undefined
              break;
            }
            
            // Increment counter for next key
            i++;
          }
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