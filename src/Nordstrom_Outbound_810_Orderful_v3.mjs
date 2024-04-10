////////////////////////////// BEGIN DEVELOPMENT CODE //////////////////////////////
// import options to the development environment
// and execute the function that will build the data for the Orderful platform.
import options from './data/Nordstrom_810_data.json' assert { type: "json" };
preSavePage(options);


////////////////////////////// END DEVELOPMENT CODE ////////////////////////////////

////////////////////////////// BEGIN CELIGO CODE ///////////////////////////////////
// ITEMS AND TOTAL VALUE FUNCTION
function getItems(node, ValueTotal) {
  let OrderTotal = 0;
  const items = node.map(record => {
    OrderTotal = record.IT102 * record.IT104;
    ValueTotal += OrderTotal;
    return {
      baselineItemDataInvoice: [
        {
          assignedIdentification: record.IT101,
          quantityInvoiced: record.IT102,
          unitOrBasisForMeasurementCode: record.IT103,
          unitPrice: record.IT104,
          basisOfUnitPriceCode: record.IT105,
          productServiceIDQualifier: record.IT106,
          productServiceID: record.IT107
        }
      ],
      PID_loop: [
        {
          productItemDescription: [
            {
              itemDescriptionTypeCode: record.PID01,
              description: record.PID05
            }
          ]
        }
      ]
    };
  });

  return {
    items,
    ValueTotal
  };
}
// REFERENCE INFORMATION FUNCTION
function getReferenceInformation(node) {
      const referenceInformation = [];
    // Make sure it is an array.  Then loop through it. If not
    // write the single records and move on.
      if (Array.isArray(node.REF01)) {
        node.REF01.forEach((ref01, index) => {
          // For each value in node.REF01, we're going to create a new... OBJECT

          const referenceInformationObject = {};
          referenceInformationObject.referenceIdentificationQualifier = ref01;
          if (node.REF02.length >= index) {
            // If there's a corresponding value in node.REF02, we're going to add that data
            // to the OBJECT
            referenceInformationObject.referenceIdentification = node.REF02[index];
          }
          if (node.REF03 && node.REF03.length >= index) {
            // If there's a corresponding value in node.REF03, we're going to add that data
            // to the OBJECT
            referenceInformationObject.description = node.REF03[index];
          }
          // Then we're going to push the OBJECT onto the referenceInformation ARRAY
          referenceInformation.push(referenceInformationObject);
        })
      } else {

        const referenceInformationObject = {};
        referenceInformationObject.referenceIdentificationQualifier = node.REF01;
        referenceInformationObject.referenceIdentification = node.REF02;
        referenceInformationObject.description = node.REF03;
        referenceInformation.push(referenceInformationObject);   
      }
      return referenceInformation;
}
//DATETIME INFORMATION FUNCTION
function getDateInformation(node) {
      const dateInformation = [];
    // Make sure it is an array.  Then loop through it. If not
    // write the single records and move on.
      if (Array.isArray(node.DTM01)) {
        node.DTM01.forEach((DTM01, index) => {
          // For each value in node.DTM01, we're going to create a new... OBJECT
          const dateInformationObject = {};

          dateInformationObject.dateTimeQualifier = DTM01;
          if (node.DTM02.length >= index) {
            // If there's a corresponding value in node.DTM02, we're going to add that data
            // to the OBJECT
            dateInformationObject.date = node.DTM02[index];
          }
          if (node.DTM03 && node.DTM03.length >= index) {
            // If there's a corresponding value in node.DTM03, we're going to add that data
            // to the OBJECT
            dateInformationObject.description = node.DTM03[index];
          }
          // Then we're going to push the OBJECT onto the dateInformation ARRAY
          dateInformation.push(dateInformationObject);
        })
      } else {
        const dateInformationObject = {};
        dateInformationObject.dateTimeQualifier = node.DTM01;
        dateInformationObject.date = node.DTM02;
        dateInformationObject.description = node.DTM03;
        dateInformation.push(dateInformationObject);   
      }
      return dateInformation;
}
// ADDRESS INFORMATION FUNCTION
function getAddressInformation(node) {
  const addressInformation = [];
  const partyIdentification = [];
  const N1_loop = [];    

  node.N101.forEach((n101, index) => {
    const addressInformationObject = {};
    const partyIdentificationObject = {};
    addressInformationObject.entityIdentifierCode = n101;
    
    // Check if node.N102 is defined and has elements before accessing its elements
    if (node.N102 && node.N102[index]) {
      addressInformationObject.name = node.N102[index];
    }
    
    // Check if node.N103 is defined and has elements before accessing its elements
    if (node.N103 && node.N103[index]) {
      addressInformationObject.identificationCodeQualifier = node.N103[index];
    }
    
    // Check if node.N104 is defined and has elements before accessing its elements
    if (node.N104 && node.N104[index]) {
      addressInformationObject.identificationCode = node.N104[index];
    }
    addressInformation.push(addressInformationObject);
    partyIdentificationObject.partyIdentification = [addressInformationObject];
    N1_loop.push(partyIdentificationObject);
  });

  
  // Return the address information object
  return N1_loop;
}
// PRESAVE PAGE - where the work gets done.
// it returns the main response that will be sent to Orderful for processing.
function preSavePage(options) {
  const data = []; 
  const Orderful = []; // Initialize array to store package objects
  const updaterec = []; // Initialize array to store updateid objects

  // Group items by N104[1]
  const groupedItems = {};
  options.data.forEach(item => {
    const key = item.N104[1];
    if (!groupedItems[key]) {
      groupedItems[key] = [];
    }
    groupedItems[key].push(item);
  });
  
  // Iterate over grouped items
  for (const key in groupedItems) {
    const groupedItemsArray = groupedItems[key];
    let ValueTotal = 0; // Initialize ValueTotal here
    const numberOfLineItems = groupedItemsArray.length;
    
    // Calculate total value
    groupedItemsArray.forEach(record => {
      const OrderTotal = record.IT102 * record.IT104;
      ValueTotal += OrderTotal;
    });
    // Calculate totalMonetaryValueSummary for this group
    const totalMonetaryValueSummary = {
      amount: ValueTotal.toFixed(2).replace('.', '')
    };
    
    // Iterate over grouped items array to create response objects 
    groupedItemsArray.forEach(item => {
      // Get items
      const { items, ValueTotal: updatedValueTotal } = getItems(groupedItemsArray, ValueTotal);
      const N1_loop = getAddressInformation(item);
      
      // Construct the package object  
      const packageObject = {
        sender: { isaId: item.ISA06 },
        receiver: { isaId: item.ISA08 },
        type: { name: item.typeName },
        stream: item.stream,
        message: {
          transactionSets: [
            {
              transactionSetHeader: [
                { transactionSetIdentifierCode: '810', transactionSetControlNumber: '0001' }
              ],
              beginningSegmentForInvoice: [
                {
                  date: item.BIG01,
                  invoiceNumber: item.id,
                  date1: item.BIG03,
                  purchaseOrderNumber: item.BIG04,
                  releaseNumber: item.BIG05,
                  changeOrderSequenceNumber: item.BIG06,
                  transactionTypeCode: item.BIG07
                }
              ],
              referenceInformation: getReferenceInformation(item),
              N1_loop, // Call getAddressInformation here
              termsOfSaleDeferredTermsOfSale: [
                { termsTypeCode: item.ITD01, termsBasisDateCode: item.ITD02 }
              ],
              dateTimeReference: getDateInformation(item),
              IT1_loop: items,
              totalMonetaryValueSummary: [totalMonetaryValueSummary],
              carrierDetails: [
                {
                  transportationMethodTypeCode: item.CAD01,
                  standardCarrierAlphaCode: item.CAD04,
                  referenceIdentificationQualifier: item.CAD07,
                  referenceIdentification: item.CAD08
                }
              ],
              transactionTotals: [{ numberOfLineItems: numberOfLineItems.toString() }]
            }
          ]
        }
      };
      
      // Push package object to Orderful array
      Orderful.push({ package: packageObject });

      // Push updateid objects to updaterec array
      updaterec.push({ updateid: item.id });
    });
  } 
  
  // Push Orderful and updaterec arrays into the data array
  data.push(Orderful);
  data.push(updaterec);
  console.log(JSON.stringify(data, null, 2));
  
  // Return the final response
  return {
    data: data,
    errors: options.errors,
    settings: options.settings,
    testMode: options.testMode
  };
}

////////////////////////////// END CELIGO CODE ////////////////////////////////////~
