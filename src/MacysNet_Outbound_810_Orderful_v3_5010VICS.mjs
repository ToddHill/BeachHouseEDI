////////////////////////////// BEGIN DEVELOPMENT CODE //////////////////////////////
// import options to the development environment
// and execute the function that will build the data for the Orderful platform.
import options from './Bloomingdales_810_data.json' assert { type: "json" };
preSavePage(options);
////////////////////////////// END DEVELOPMENT CODE ////////////////////////////////

////////////////////////////// BEGIN CELIGO CODE ///////////////////////////////////
// ITEMS AND TOTAL VALUE FUNCTION
  function getItems(node) {
    let OrderTotal = 0;
    let numberOfLineItems = 0;
    const items = node.map(record => {
      OrderTotal = record.IT102 * record.IT104;
      numberOfLineItems++;
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
      numberOfLineItems
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
    
    if (node.N101 && Array.isArray(node.N101)) {
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
    }
    
    // Return the address information object
    return {
        N1_loop
    };
}
  // PRESAVE PAGE - where the work gets done.
  // it returns the main response that will be sent to Orderful for processing.
  function preSavePage(options) {
    const FirstNode = options.data[0];
    const mainBody = FirstNode[0];
    const itemData = getItems(FirstNode);
    const items = itemData.items;
    const numberOfLineItems = itemData.numberOfLineItems;
    const addressInformation = getAddressInformation(mainBody);
    const response = {
          sender: {
            isaId: mainBody.ISA06
          },
          receiver: {
            isaId: mainBody.ISA08
          },
          type: {
            name: mainBody.typeName
          },
          stream: mainBody.stream,
          message: {
            transactionSets: [
              {
                transactionSetHeader: [
                  {
                    transactionSetIdentifierCode: '810',
                    transactionSetControlNumber: '0001'
                  }
                ],
                beginningSegmentForInvoice: [
                  {
                    date: mainBody.BIG01, 
                    invoiceNumber: mainBody.BIG02,
                    purchaseOrderNumber: mainBody.BIG04
                  }
                ],
                referenceInformation: getReferenceInformation(mainBody),
                ...addressInformation, // Call getAddressInformation here
                termsOfSaleDeferredTermsOfSale: [
                  {
                    termsTypeCode: mainBody.ITD01,
                    termsBasisDateCode: mainBody.ITD02,
                    termsNetDueDate: mainBody.ITD06,
                    termsNetDays: mainBody.ITD07
                  }
                ],
                dateTimeReference: getDateInformation(mainBody),
                
                IT1_loop: items, 
                totalMonetaryValueSummary: [
                   {
                    amount: mainBody.TDS01,
                    amount1: mainBody.TDS01,
                   }
                ],
                carrierDetails: [
                  {
                    transportationMethodTypeCode: mainBody.CAD01,
                    standardCarrierAlphaCode: mainBody.CAD04,
                    routing: mainBody.CAD05,
                    referenceIdentificationQualifier: mainBody.CAD07,
                    referenceIdentification: mainBody.CAD08
                  }
                ],
                ISS_loop: [
                  {
                    invoiceShipmentSummary: [
                      {
                        numberOfUnitsShipped: mainBody.ISS01,
                        unitOrBasisForMeasurementCode: mainBody.ISS02
                      }
                    ]
                  }
                ],
                transactionTotals: [
                  {
                    numberOfLineItems: numberOfLineItems.toString()
                  }
                ]
              }
            ]
          }
        };

    response.updaterec = mainBody.id;
  
    // PUSH THE RESPONSE OBJECT INTO THE RESPONSES ARRAY 

        console.log(JSON.stringify(response, null, 2));
        return {
          data: [response],
          errors: options.errors,
          settings: options.settings,
          testMode: options.testMode
        };

      };
  ////////////////////////////// END CELIGO CODE ////////////////////////////////////~
  