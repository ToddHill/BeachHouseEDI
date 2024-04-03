import options  from "./Target_852_data.json" assert { type: "json"  };
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
*/
//////////////////////////////////////////////////////////////////////////////////////////////

function preSavePage(options) {
  const data = options.data;
  let headerdata = [];  
  let headerobject = {};
  const sender = data[0].sender.isaId;
  const BHGID = data[0].receiver.isaId;
  const OrderfulID = data[0].id;
  headerobject.id = OrderfulID;
  headerobject.sender = sender;
  headerobject.receiver = BHGID;
  headerdata.push(headerobject);
  const content = data[0].message.content;
  const retailerID = "2276213"; // Set the RetailerID

  let flattenedData = []; // The array to hold the flattened data

  const transactionSet = content.transactionSets[0];
  const reportingDate = convertDate(transactionSet.reportingDateAction[0].date);
  for (const item of transactionSet.LIN_loop) {
    const productServiceID2Object = item.itemIdentification.find(id => id.productServiceIDQualifier2 === "VA");
    const productServiceID2 = productServiceID2Object ? productServiceID2Object.productServiceID2 : null;
    const UPCObject = item.itemIdentification.find(id => id.productServiceIDQualifier === "UP");
    const UPC = UPCObject ? UPCObject.productServiceID : null;
    let currentQuantity = 0;
    let soldQuantity = 0;
    let onOrderQuantity = 0;
    for (const za of item.ZA_loop) {
      for (const activity of za.productActivityReporting) {
        for (const quantity of za.destinationQuantity) {
          for (let i = 0; i <= 9; i++) {
            const identificationCodeKey = `identificationCode${i !== 0 ? i : ''}`;
            const quantityKey = `quantity${i !== 0 ? i : ''}`;
            const identificationCode = quantity[identificationCodeKey];
            const qty = quantity[quantityKey];

            if (identificationCode !== undefined && qty !== undefined) {
              if (activity.activityCode === "QA") {
                currentQuantity = parseInt(qty);
              } else if (activity.activityCode === "QS") {
                soldQuantity = parseInt(qty);
              } else if (activity.activityCode === "QP") {
                onOrderQuantity = parseInt(qty);
              }
            }
          }
          const locationCode = quantity.identificationCode; // Extract location code
          const ImportData = {
            RetailerId: retailerID,
            date: reportingDate,
            item: productServiceID2,
            storeCode: locationCode, // Set storeCode to location code
            currentQuantity: currentQuantity,
            soldQuantity: soldQuantity,
            onOrderQuantity: onOrderQuantity
          };
          flattenedData.push(ImportData);
        }
      }
    }
  }

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

