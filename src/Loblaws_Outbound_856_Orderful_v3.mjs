import options from './Loblaws_856_data.json' assert { type: "json" };
preSavePage(options);

//////// BEGIN CELIGO SCRIPT HEADER BLOCK ////////
function preSavePage(options) {

    // Author: Todd Hill - 07.19.2023
    // ---------------------------
    // For extracting the required fields from each record, and the
    // resulting Sub arrays.
    // Pull the items from the JSON Array, and place them in the
    // appropriate locations for direct transfer to Orderful API
    // Begin with Celigo's Default Output.
    //
    // UPDATE: 7.27.2023  - Looping Issue Resolved
    //                      Bug still exists on JSON nested array
    //
    const subarray = options.data;
    const data = [];
    if (subarray && subarray.length) {
    //
    // Because it is grouped, there is an unnamed subarray in "options.data"
    // Take Unnamed subarray, and grab the first record to get elements for
    // the header records that do not require being looped.
    const actual = subarray[0];
  
    //
    //
   
    // The length of the array should be the total number of packages/items
    // Set that information now.  It will be needed in the trailer
    const totalitems = subarray[0].length;
    //
    // First, establish a variable to store the looped data and one
    // to establish the HL Looping numbers.
    //
    // Make a loop of the items that ARE in the array that need
    // to be repeated.  This array has to be built FIRST so it can
    // be used as a variable itself in the final transformation
  
    const LINdata = options.data[0].map((record, index) => {
      return [
        {
          hierarchicalLevel: [
            {
              hierarchicalIDNumber: `${((index + 1) * 2) + 1}`,
              hierarchicalLevelCode: "T"
            }
          ],
          marksAndNumbersInformation: [
            {
              marksAndNumbersQualifier: "GM",
              marksAndNumbers: record.hierarchical3MaN
            }
          ]
        },
        {
          hierarchicalLevel: [
            {
              hierarchicalIDNumber: `${((index + 1) * 2) + 2}`,
              hierarchicalLevelCode: "I"
            }
          ],
          itemIdentification: [
            {
              productServiceIDQualifier: record.ProductServiceIDQualifier,
              productServiceID: record.ProductServiceID
            }
          ],
          itemDetailShipment: [
              {
                numberOfUnitsShipped: record.Quantity,
                unitOrBasisForMeasurementCode: 'EA'
              }
            ],
          productItemDescription: [
            {
              itemDescriptionTypeCode: 'F',
              productProcessCharacteristicCode: '08',
              description: record.Description
            }
          ],
          itemPhysicalDetails: [
            {
              pack: record.MasterCaseQtyPack
            }]
        }
      ];
    });
    //
    // The final transformation will include the BASIC header information
    // and then call on the looped items in the build.
    // This creates the Output JSON to be sent to Orderful
    // for conversion to EDI .X12 transformedData will be your final Output
    // Start with the Initial Header Information
    const transformedData = [{
      sender: {
        isaId: actual[0].sender
      },
      receiver: {
        isaId: actual[0].receiver
      },
      type: {
        name: actual[0].typeName
      },
      stream: actual[0].stream,
      message: {
        transactionSets: [
          {
            transactionSetHeader: [
              {
                transactionSetIdentifierCode: "856",
                transactionSetControlNumber: "0001"
              }
            ],
            beginningSegmentForShipNotice: [
              {
                transactionSetPurposeCode: actual[0].transactionPurposeCode,
                shipmentIdentification: actual[0].shipmentIdentification,
                date: actual[0].transactionDate,
                time: actual[0].transactionTime,
                hierarchicalStructureCode: actual[0].hierarchialStructureCode
              }
            ],
            HL_loop: [
              {
                hierarchicalLevel: [
                  {
                    hierarchicalIDNumber: "1",
                    hierarchicalLevelCode: "S"
                  }
                ],
                carrierDetailsQuantityAndWeight: [
                  {
                    packagingCode: "CTN",
                    ladingQuantity: actual[0].TotalLadingQuantity,
                    weightQualifier: actual[0].weightQualifier,
                    weight: actual[0].TotalLadingWeight,
                    unitOrBasisForMeasurementCode:
                      actual[0].UnitorBasisforMeasurementCode
                  }
                ],
                carrierDetailsRoutingSequenceTransitTime: [
                {
                  routingSequenceCode: 'B',
                  identificationCodeQualifier: '2',
                  identificationCode: 'CPU',
                  transportationMethodTypeCode: 'M',
                  routing: actual[0].ThirdPartyCarrier,
                  shipmentOrderStatusCode: 'CC'
                }
              ],
                carrierDetailsSpecialHandlingOrHazardousMaterialsOrBoth: [
                  {
                    specialHandlingCode: 'CC',
                  }
                ],
                referenceInformation: [
                  {
                    referenceIdentificationQualifier:
                      actual[0].referenceIdentificationQualifier,
                    referenceIdentification: actual[0].referenceIdentification
                  }
                ],
                dateTimeReference: [
                  {
                    dateTimeQualifier: actual[0].dateTimeQualifier,
                    date: actual[0].transactionDate,
                    time: actual[0].transactionTime
                  },
                                  {
                    dateTimeQualifier: actual[0].dateTimeQualifier2,
                    date: actual[0].transactionDate2,
                    time: actual[0].transactionTime2
                  }
                ],
                N1_loop: [
                  {
                    partyIdentification: [
                      {
                        entityIdentifierCode: actual[0].OrganizationID,
                        name: actual[0].ship_name,
                        identificationCodeQualifier: actual[0].IDCodeQualifier,
                        identificationCode: actual[0].IdentifierCode
                      }
                    ],
                    partyLocation: [
                      {
                        addressInformation: actual[0].ship_address1
                      }
                    ],
                    geographicLocation: [
                      {
                        cityName: actual[0].ship_city,
                        stateOrProvinceCode: actual[0].ship_stateProvince,
                        postalCode: actual[0].ship_zip,
                        countryCode: actual[0].ship_country
                      }
                    ]
                  },
                  {
                    partyIdentification: [
                      {
                        entityIdentifierCode: actual[0].OrganizationID1,
                        name: actual[0].from_name,
                        identificationCodeQualifier: actual[0].IDCodeQualifier1,
                        identificationCode: actual[0].IdentifierCode1
                      }
                    ],
                    partyLocation: [
                      {
                        addressInformation: actual[0].from_address
                      }
                    ],
                    geographicLocation: [
                      {
                        cityName: actual[0].from_city,
                        stateOrProvinceCode: actual[0].from_stateProvince,
                        postalCode: actual[0].from_postalcode,
                        countryCode: actual[0].from_CountryCode
                      }
                    ]
                  }
                ]
              },
              {
                hierarchicalLevel: [
                  {
                    hierarchicalIDNumber: "2",
                    hierarchicalLevelCode: "O"
                  }
                ],
                purchaseOrderReference: [
                  {
                    purchaseOrderNumber: actual[0].purchaseOrderNumber
                  }
                ],
                carrierDetailsQuantityAndWeight: [
                  {
                    packagingCode: "CTN",
                    ladingQuantity: actual[0].TotalLadingQuantity,
                    weightQualifier: actual[0].weightQualifier,
                    weight: actual[0].TotalLadingWeight,
                    unitOrBasisForMeasurementCode:
                      actual[0].UnitorBasisforMeasurementCode
                  }
                ],
                referenceInformation: [
                  {
                    referenceIdentificationQualifier: 'IT',
                    referenceIdentification: actual[0].IdentifierCode
                  }
                ],
              },
  //
  // This is where we include the loop data, flatten it and place
  // it into the main JSON for delivery.
              ...LINdata.flat(),
            ],
            transactionTotals: [
              {
                numberOfLineItems: totalitems.toString()
              }
            ]
          }
        ]
      }
    }
  ];
  transformedData[0].updaterec = actual[0].SO_InternalID;
  data.push(transformedData);
  
    //
    // Return the transformed data along with the errors
    // as a ready-made Orderful JSON for 856 data.
  console.log(JSON.stringify(transformedData, null, 2));
    return {
      data,
      errors: options.errors,
  
      abort: false
    };
  }
  
  else
  
      return {
      data,
      errors: options.errors,
  
      abort: false
    };
  
  }
  
  
  