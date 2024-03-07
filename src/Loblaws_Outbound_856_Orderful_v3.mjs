import options from './Loblaws_856_data.json' assert { type: "json" };
preSavePage(options);


//////// BEGIN CELIGO SCRIPT HEADER BLOCK ////////
function preSavePage(options) {
  // Author: Todd Hill - 07.19.2023
  //
  // UPDATE: 7.27.2023  - Looping Issue Resolved
  //                      Bug still exists on JSON nested array
  // UPDATE: 3.7.2024   - Added additional comments for clarity
  //                      Added additional error handling
  let hierarchicalIDCounter = 3;
  const subarray = options.data;
  const data = [];
  if (subarray && subarray.length) {
    const actual = subarray[0];
    const totalitems = subarray[0].length;
    const hierarchicalLevels = options.data[0].map((record, index) => {
        const hierarchical3MaN = record.hierarchical3MaN;
        const TLevel = {
            hierarchicalLevel: [
                {
                    hierarchicalIDNumber: hierarchicalIDCounter.toString(),
                    hierarchicalLevelCode: "T"
                }
            ],
            marksAndNumbersInformation: [
                {
                    marksAndNumbersQualifier: "GM",
                    marksAndNumbers: hierarchical3MaN
                }
            ]
        };

        hierarchicalIDCounter++; // Increment the counter

        const ILevel = {
            hierarchicalLevel: [
                {
                    hierarchicalIDNumber: hierarchicalIDCounter.toString(),
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
                }
            ]
        };

        hierarchicalIDCounter++; // Increment the counter

        return {
            TLevel,
            ILevel
        };
    });

    // Group ILevels under corresponding TLevels
    const groupedLevels = hierarchicalLevels.reduce((acc, level) => {
        if (!acc[level.TLevel.hierarchicalLevel[0].marksAndNumbersInformation[0].marksAndNumbers]) {
            acc[level.TLevel.hierarchicalLevel[0].marksAndNumbersInformation[0].marksAndNumbers] = [];
        }
        acc[level.TLevel.hierarchicalLevel[0].marksAndNumbersInformation[0].marksAndNumbers].push(level.ILevel);
        return acc;
    }, {});

    // Construct transformed data with grouped TLevels and their associated ILevels
    const transformedData = Object.entries(groupedLevels).map(([marksAndNumbers, ILevels]) => {
        return {
            TLevel: {
                hierarchicalLevel: [
                    {
                        hierarchicalIDNumber: hierarchicalIDCounter.toString(),
                        hierarchicalLevelCode: "T"
                    }
                ],
                marksAndNumbersInformation: [
                    {
                        marksAndNumbersQualifier: "GM",
                        marksAndNumbers: marksAndNumbers
                    }
                ]
            },
            ILevels
        };
    });
      // Flatten LINdata and include it in HL_loop section
      const flattenedLINdata = LINdata.flatMap(item => {
          const result = [];
          if (item.TLevel) {
              result.push(item.TLevel);
          }
          if (item.ILevel) {
              result.push(item.ILevel);
          }
          return result;
      });
      // for conversion to EDI .X12 transformedData will be your final Output
      // Start with the Initial Header Information
      const finalTransformedData = [{
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
                          ...flattenedLINdata,
                      ],
                      transactionTotals: [
                          {
                              numberOfLineItems: totalitems.toString()
                          }
                      ]
                  }
              ]
          }
      }];
      finalTransformedData[0].updaterec = actual[0].SO_InternalID;
      data.push(finalTransformedData);

      //
      // Return the transformed data along with the errors
      // as a ready-made Orderful JSON for 856 data.
      console.log(JSON.stringify(finalTransformedData, null, 2));
      return {
          data,
          errors: options.errors,

          abort: false
      };
  } else
      return {
          data,
          errors: options.errors,

          abort: false
      };
}









  
  
  