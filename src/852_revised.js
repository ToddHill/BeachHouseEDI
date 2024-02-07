function preSavePage(options) {
  const data = options.data;
  let groupedData = {}; // The object to hold the grouped data by productServiceID2

  data.forEach(record => {
    record.transactionSets.forEach(transactionSet => {
      const reportingDate = convertDate(transactionSet.reportingDateAction[0].date);
      transactionSet.LIN_loop.forEach(item => {
        const productServiceID2Object = item.itemIdentification.find(id => id.productServiceIDQualifier2 === "VA");
        const productServiceID2 = productServiceID2Object ? productServiceID2Object.productServiceID2 : null;
        const UPCObject = item.itemIdentification.find(id => id.productServiceIDQualifier === "UP");
        const UPC = UPCObject ? UPCObject.productServiceID : null;

        if (!productServiceID2) return; // Skip if productServiceID2 is not found

        item.ZA_loop.forEach(za => {
          za.productActivityReporting.forEach(activity => {
            if (!groupedData[productServiceID2]) {
              groupedData[productServiceID2] = {};
            }

            za.destinationQuantity.forEach(quantity => {
              for (let i = 0; i <= 9; i++) {
                const identificationCodeKey = `identificationCode${i !== 0 ? i : ''}`;
                const quantityKey = `quantity${i !== 0 ? i : ''}`;
                const identificationCode = quantity[identificationCodeKey];
                const qty = quantity[quantityKey];

                if (identificationCode !== undefined && qty !== undefined) {
                  if (!groupedData[productServiceID2][identificationCode]) {
                    groupedData[productServiceID2][identificationCode] = [];
                  }

                  const ImportData = {
                    date: reportingDate,
                    StoreCode: identificationCode,
                    CurrentQuantity: qty,
                    SoldQuantity: 0, // Initialize SoldQuantity
                    OnOrderQuantity: 0 // Initialize OnOrderQuantity
                  };

                  // Handle different activity codes
                  if (activity.activityCode === "QA") {
                    ImportData.CurrentQuantity = qty;
                  } else if (activity.activityCode === "QS") {
                    ImportData.SoldQuantity = qty;
                  } else if (activity.activityCode === "QP") {
                    ImportData.OnOrderQuantity = qty;
                  }

                  groupedData[productServiceID2][identificationCode].push(ImportData);
                }
              }
            });
          });
        });
      });
    });
  });

  console.log(JSON.stringify(groupedData, null, 2));

  return {
    data: [groupedData], // Modified to return the new structured data
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
