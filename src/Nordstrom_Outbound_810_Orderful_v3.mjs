////////////////////////////// BEGIN DEVELOPMENT CODE //////////////////////////////
// import options to the development environment
// and execute the function that will build the data for the Orderful platform.
// revision 2
// adding verbose logging to Celigo code
import options from './data/Nordstrom_810_data.json' assert { type: "json" };
preSavePage(options);

////////////////////////////// END DEVELOPMENT CODE ////////////////////////////////

////////////////////////////// BEGIN CELIGO CODE ///////////////////////////////////

// ITEMS AND TOTAL VALUE FUNCTION
function getItems(node, ValueTotal) {
  let OrderTotal = 0;
  const items = node.map(record => {
    OrderTotal = parseFloat(record.IT102) * parseFloat(record.IT104);
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
  if (Array.isArray(node.REF01)) {
    node.REF01.forEach((ref01, index) => {
      const referenceInformationObject = {};
      referenceInformationObject.referenceIdentificationQualifier = ref01;
      if (node.REF02 && node.REF02.length > index) {
        referenceInformationObject.referenceIdentification = node.REF02[index];
      }
      if (node.REF03 && node.REF03.length > index) {
        referenceInformationObject.description = node.REF03[index];
      }
      referenceInformation.push(referenceInformationObject);
    });
  } else {
    const referenceInformationObject = {
      referenceIdentificationQualifier: node.REF01,
      referenceIdentification: node.REF02,
      description: node.REF03
    };
    referenceInformation.push(referenceInformationObject);
  }
  return referenceInformation;
}

// DATETIME INFORMATION FUNCTION

function getDateInformation(node) {
  const dateInformation = [];
  if (Array.isArray(node.DTM01)) {
    node.DTM01.forEach((DTM01, index) => {
      const dateInformationObject = {
        dateTimeQualifier: DTM01,
        date: node.DTM02 && node.DTM02.length > index ? node.DTM02[index] : undefined,
        description: node.DTM03 && node.DTM03.length > index ? node.DTM03[index] : undefined,
      };
      dateInformation.push(dateInformationObject);
    });
  } else {
    const dateInformationObject = {
      dateTimeQualifier: node.DTM01,
      date: node.DTM02,
      description: node.DTM03
    };
    dateInformation.push(dateInformationObject);
  }
  return dateInformation;
}

// ADDRESS INFORMATION FUNCTION
function getAddressInformation(node) {
  const N1_loop = [];
  node.N101.forEach((n101, index) => {
    const addressInformationObject = {
      entityIdentifierCode: n101,
      name: node.N102 && node.N102.length > index ? node.N102[index] : undefined,
      identificationCodeQualifier: node.N103 && node.N103.length > index ? node.N103[index] : undefined,
      identificationCode: node.N104 && node.N104.length > index ? node.N104[1] : undefined,
    };
    N1_loop.push({ partyIdentification: [addressInformationObject] });
  });
  return N1_loop;
}


function preSavePage(options) {
  const data = {
    Orderful: [],
    updaterec: []
  }

  // Group items by a composite key of BIG04 and N104[1]
  const groupedItems = {};
  options.data.forEach(item => {
    const key = item.BIG04 + '-' + item.N104[1]; // Composite key
    console.debug('Initial key:', JSON.stringify(key, null, 2));
    if (!groupedItems[key]) {
      groupedItems[key] = [];
    }
    groupedItems[key].push(item);
    console.debug('Current item:', JSON.stringify(item, null, 2));

  })

  // Iterate over the grouped items
  for (const key in groupedItems) {
    const groupedItemsArray = groupedItems[key];
    let ValueTotal = 0;
    groupedItemsArray.forEach(record => {
      const OrderTotal = parseFloat(record.IT102) * parseFloat(record.IT104);
      ValueTotal += OrderTotal;
    })

    const numberOfLineItems = groupedItemsArray.length;
    const totalMonetaryValueSummary = {
      amount: ValueTotal.toFixed(2).replace('.', '')
    };

    // For each group, create only one package object
    const { items } = getItems(groupedItemsArray, ValueTotal);
    const N1_loop = getAddressInformation(groupedItemsArray[0]);

    const packageObject = {
      sender: { isaId: groupedItemsArray[0].ISA06 },
      receiver: { isaId: groupedItemsArray[0].ISA08 },
      type: { name: groupedItemsArray[0].typeName },
      stream: groupedItemsArray[0].stream,
      message: {
        transactionSets: [{
          transactionSetHeader: [{ transactionSetIdentifierCode: '810', transactionSetControlNumber: '0001' }],
          beginningSegmentForInvoice: [{
            date: groupedItemsArray[0].BIG01,
            invoiceNumber: groupedItemsArray[0].BIG02,
            date1: groupedItemsArray[0].BIG03,
            purchaseOrderNumber: groupedItemsArray[0].BIG04,
            releaseNumber: groupedItemsArray[0].BIG05,
            changeOrderSequenceNumber: groupedItemsArray[0].BIG06,
            transactionTypeCode: groupedItemsArray[0].BIG07
          }],
          referenceInformation: getReferenceInformation(groupedItemsArray[0]),
          N1_loop,
          termsOfSaleDeferredTermsOfSale: [{ termsTypeCode: groupedItemsArray[0].ITD01, termsBasisDateCode: groupedItemsArray[0].ITD02 }],
          dateTimeReference: getDateInformation(groupedItemsArray[0]),
          IT1_loop: items,
          totalMonetaryValueSummary: [totalMonetaryValueSummary],
          carrierDetails: [{
            transportationMethodTypeCode: groupedItemsArray[0].CAD01,
            standardCarrierAlphaCode: groupedItemsArray[0].CAD04,
            referenceIdentificationQualifier: groupedItemsArray[0].CAD07,
            referenceIdentification: groupedItemsArray[0].CAD08
          }],
          transactionTotals: [{ numberOfLineItems: numberOfLineItems.toString() }]
        }]
      }
    };
    console.debug('Package object:', JSON.stringify(packageObject, null, 2));
    data.Orderful.push(packageObject);
    data.updaterec.push({ updateid: groupedItemsArray[0].id });
    console.debug('id sent:', JSON.stringify(groupedItemsArray[0].id, null, 2));
  }
  //console.debug(JSON.stringify(data, null, 2));
  return {
    data: [data],
    errors: options.errors,
    settings: options.settings,
    testMode: options.testMode
  }
}
////////////////////////////// END CELIGO CODE ////////////////////////////////////~
