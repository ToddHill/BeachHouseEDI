import options  from "./Target_852_data.json" assert { type: "json"  };
preSavePage(options);

//////////////////// BEGIN CELIGO SCRIPT BLOCK ////////////////////
function preSavePage(options) {
  const data = options.data;
  let flattenedData = []; // The array to hold the flattened data
  data.forEach(record => {


   


      const reportingDateAction = transactionSet.reportingDateAction;


      const reportingDate = convertDate(reportingDateAction[0].date);
      
      transactionSet.LIN_loop.forEach(item => {
        const productServiceID2Object = item.itemIdentification.find(id => id.productServiceIDQualifier2 === "VA");
        const productServiceID2 = productServiceID2Object ? productServiceID2Object.productServiceID2 : null;
        const UPCObject = item.itemIdentification.find(id => id.productServiceIDQualifier === "UP");
        const UPC = UPCObject ? UPCObject.productServiceID : null;

        if (!productServiceID2) return; // Skip if productServiceID2 is not found

        // Initialize quantities outside the loop
        let currentQuantity = 0;
        let soldQuantity = 0;
        let onOrderQuantity = 0;

        item.ZA_loop.forEach(za => {
          za.productActivityReporting.forEach(activity => {
            za.destinationQuantity.forEach(quantity => {
              for (let i = 0; i <= 9; i++) {
                const identificationCodeKey = `identificationCode${i !== 0 ? i : ''}`;
                const quantityKey = `quantity${i !== 0 ? i : ''}`;
                const identificationCode = quantity[identificationCodeKey];
                const qty = quantity[quantityKey];

                if (identificationCode !== undefined && qty !== undefined) {
                  // Update quantities based on activity code
                  if (activity.activityCode === "QA") {
                    currentQuantity += parseInt(qty);
                  } else if (activity.activityCode === "QS") {
                    soldQuantity += parseInt(qty);
                  } else if (activity.activityCode === "QP") {
                    onOrderQuantity += parseInt(qty);
                  }
                }
              }
            });
          });
        });

        // Create a single object with accumulated quantities
        const ImportData = {
          RetailerId: retailerID,
          date: reportingDate,
          item: productServiceID2,
          storeCode: UPC, // Assuming UPC as store code, modify as needed
          currentQuantity: currentQuantity,
          soldQuantity: soldQuantity,
          onOrderQuantity: onOrderQuantity
        };

        flattenedData.push(ImportData);
      });
    });
  );

  return {
    data: flattenedData,
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
//////////////////// END CELIGO SCRIPT BLOCK ////////////////////