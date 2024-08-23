////////////////////////////// BEGIN DEVELOPMENT CODE //////////////////////////////
// Designed for ULTA Retailer
// This code is designed to be used in the Celigo Integration App.
import options from './data/Target_810_data.json' assert { type: "json" };
preSavePage(options);
////////////////////////////// END DEVELOPMENT CODE ////////////////////////////////

////////////////////////////// BEGIN CELIGO CODE ////////////////////TARGET////////
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
        ],
        itemPhysicalDetails: [
            {
              pack: record.PO401,
              innerPack: record.PO414
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
  // PRESAVE PAGE - where the work gets done.
  function preSavePage(options) {
    // If there is no data, return an empty object
    if (options.data === undefined || options.data === null || options.data.length === 0) {
      return {
          data: [],
          errors: options.errors,
          settings: options.settings,
          testMode: options.testMode
      };
  }
  
    else
    // If there is data, get the first node and the main body   
    {
        const mainBody = options.data[0];
        const firstNode = mainBody[0];
        const IT_loop = getItems(mainBody);
        const numberOfLineItems = mainBody.length;
        const totalUnitsShipped = mainBody.reduce((total, record) => total + record.IT102, 0);

        // construct the response object  
        const response = {
          sender: {
            isaId: firstNode.ISA06
          },
          receiver: {
            isaId: firstNode.ISA08
          },
          type: {
            name: firstNode.typeName
          },
          stream: firstNode.stream,
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
                    date: firstNode.BIG01,
                    invoiceNumber: firstNode.BIG02,
                    date1: firstNode.BIG03,
                    purchaseOrderNumber: firstNode.BIG04
                  }
                ],         
                referenceInformation: getReferenceInformation(firstNode),
                N1_loop: [
                  {
                    partyIdentification: [
                      {
                        entityIdentifierCode: 'BY',
                        identificationCodeQualifier: '92',
                        identificationCode: firstNode.N104
                      }
                    ],
                    partyLocation: [
                      {
                        addressInformation: '222 Pacific Coast Highway 10th Floor'
                      }
                    ],
                    geographicLocation: [
                      {
                        cityName: 'El Segundo',
                        stateOrProvinceCode: 'CA',
                        postalCode: '90245',
                        countryCode: 'US'
                      }
                    ]
                  }
                ],
                termsOfSaleDeferredTermsOfSale: [
                  {
                    termsTypeCode: firstNode.ITD01,
                    termsBasisDateCode: firstNode.ITD02,
                    termsDiscountDaysDue: firstNode.ITD05,
                    termsNetDays: firstNode.ITD07,
                  }
                ],
                dateTimeReference: getDateInformation(firstNode),
                IT1_loop: IT_loop.items,
                totalMonetaryValueSummary: [
                    {
                        amount:  firstNode.TDS01.replace(/\./g, '')
                    }
                ],
                SAC_loop: [
                    {
                      servicePromotionAllowanceOrChargeInformation: [
                        {
                          allowanceOrChargeIndicatorCode: 'C',
                          servicePromotionAllowanceOrChargeCode: 'H850',
                          amount: '0',
                          description: 'TOTAL SALES TAX'
                        }
                      ]
                    }
                ],
                carrierDetails: [
                  {
                    transportationMethodTypeCode: firstNode.CAD01,
                    standardCarrierAlphaCode: firstNode.CAD04,
                    referenceIdentificationQualifier: firstNode.CAD07,
                    referenceIdentification: firstNode.CAD08
                  }
                ],
                ISS_loop: [
                  {
                    invoiceShipmentSummary: [
                      {
                        numberOfUnitsShipped: Number(totalUnitsShipped).toString(),
                        unitOrBasisForMeasurementCode: 'EA'
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

    response.updaterec = firstNode.id;
    console.log(JSON.stringify(response, null, 2));
    // return the response object 
      return {
        data: [response],
        errors: options.errors,
        settings: options.settings,
        testMode: options.testMode
      };
    } 
  }
  ////////////////////////////// END CELIGO CODE ////////////////////////////////////~