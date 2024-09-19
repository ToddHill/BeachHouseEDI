import options from './data/Target_856_data.json' assert { type: "json" };
preSavePage(options);

//////// BEGIN CELIGO SCRIPT HEADER BLOCK ////////
function preSavePage(options) {


    const subarray = options.data;
    const holderbox = subarray[0];
    const data = [];
    if (subarray && subarray.length) {

        const actual = subarray[0];
        const totalitems = subarray[0].length;
        const hierarchicalLevels = {};
        let hierarchicalIDCounter = 2; // Initialize the counter
        const LINdata = actual.map((record, index) => {
        let TLevel, ILevel;


        if (!hierarchicalLevels[record.MAN02]) {
                // Create 'T' level if it doesn't exist
                hierarchicalIDCounter++; // Increment the counter for 'T' level
                TLevel = {
                    hierarchicalLevel: [
                        {
                            hierarchicalIDNumber: hierarchicalIDCounter.toString(),
                            hierarchicalParentIDNumber: "2",
                            hierarchicalLevelCode: "P"
                        }
                    ],
                    measurements: [
                        {
                          measurementQualifier: "WT",
                          measurementValue: record.PO406,
                          unitOrBasisForMeasurementCode: "LB"
                        }
                      ],
                    marksAndNumbersInformation: [
                        {
                            marksAndNumbersQualifier: "GM",
                            marksAndNumbers: record.MAN02
                        }
                    ]
                };
                hierarchicalLevels[record.MAN02] = hierarchicalIDCounter.toString(); // Save 'T' level ID for this 'hierarchical3MaN'
            }

            // Create 'I' level
            hierarchicalIDCounter++; // Increment the counter for 'I' level
            ILevel = {
                hierarchicalLevel: [
                    {
                        hierarchicalIDNumber: hierarchicalIDCounter.toString(),
                        hierarchicalParentIDNumber: hierarchicalLevels[record.MAN02],
                        hierarchicalLevelCode: "I"
                    }
                ],
                itemIdentification: [
                    {
                      assignedIdentification: record.LIN01,
                      productServiceIDQualifier1: record.LIN02,
                      productServiceID1: record.LIN03,
                      productServiceIDQualifier2: record.LIN04,
                      productServiceID2: record.LIN05,
                      productServiceIDQualifier: record.LIN06,
                      productServiceID: record.LIN07
                    }
                  ],
                itemDetailShipment: [
                    {
                        numberOfUnitsShipped: record.SN102,
                        unitOrBasisForMeasurementCode: record.SN103
                    }
                ],
                purchaseOrderReference: [
                    {
                        purchaseOrderNumber: actual[0].PRF01
                    }               
                ],
                itemPhysicalDetails: [
                    {
                        pack: record.PO401,
                        innerPack: record.PO414
                    }
                ],
                productItemDescription: [
                    {
                        itemDescriptionTypeCode: 'F',
                        productProcessCharacteristicCode: '08',
                        description: record.PID05
                    }
                ],

            };

            return {
                TLevel,
                ILevel
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

        // Now, include flattenedLINdata in the HL_loop section
        const transformedData = [{
            // Your existing code for transformedData here...
            HL_loop: [
                // Your existing code for HL_loop here...
                ...flattenedLINdata,
                // Your existing code for transactionTotals here...
            ]
        }];


        const finalTransformedData = [{
            sender: {
                isaId: actual[0].ISA06
            },
            receiver: {
                isaId: actual[0].ISA08
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
                                transactionSetPurposeCode: actual[0].BSN01,
                                shipmentIdentification: actual[0].BSN02,
                                date: actual[0].BSN03,
                                time: actual[0].BSN04,
                                hierarchicalStructureCode: actual[0].BSN05
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
                                        packagingCode: actual[0].TD101,
                                        ladingQuantity: totalitems.toString(),
                                        weightQualifier: actual[0].TD106,
                                        weight: actual[0].TD107,
                                        unitOrBasisForMeasurementCode: actual[0].TD108
                                    }
                                ],
                                carrierDetailsRoutingSequenceTransitTime: [
                                    {
                                        routingSequenceCode: 'B',
                                        identificationCodeQualifier: '2',
                                        identificationCode: actual[0].TD503,
                                        transportationMethodTypeCode: 'M',
                                        shipmentOrderStatusCode: 'CC'
                                    }
                                ],
                                referenceInformation: [
                                    {
                                        referenceIdentificationQualifier: actual[0].REF01,
                                        referenceIdentification: actual[0].REF02
                                    }
                                ],
                                dateTimeReference: [
                                    {
                                        dateTimeQualifier: actual[0].DTM01[0],
                                        date: actual[0].DTM02[0]
                                    }
                                ],
                                N1_loop: [
                                    {
                                        partyIdentification: [
                                            {
                                                entityIdentifierCode: actual[0].N101,
                                                name: actual[0].N102,
                                                identificationCodeQualifier: actual[0].N103,
                                                identificationCode: actual[0].N104
                                            }
                                        ],
                                        additionalNameInformation: [
                                            {
                                                name: actual[0].N301
                                            }
                                        ],
                                        geographicLocation: [
                                          {
                                                cityName: actual[0].N401,
                                                stateOrProvinceCode: actual[0].N402,
                                                postalCode: actual[0].N403,
                                                countryCode: actual[0].N404
                                          }
                                        ]
                                    }
                                ]
                            },
                            {
                                hierarchicalLevel: [
                                    {
                                        hierarchicalIDNumber: "2",
                                        hierarchicalParentIDNumber: "1",
                                        hierarchicalLevelCode: "O"
                                    }
                                ],
                                purchaseOrderReference: [
                                    {
                                        purchaseOrderNumber: actual[0].PRF01
                                    }
                                ],
                                carrierDetailsQuantityAndWeight: [
                                    {
                                        packagingCode: actual[0].TD101,
                                        ladingQuantity: actual[0].TD102,
                                        weightQualifier: actual[0].TD106,
                                        weight: actual[0].TD107,
                                        unitOrBasisForMeasurementCode: actual[0].TD108
                                    }
                                ],
                                referenceInformation: [
                                    {
                                        referenceIdentification: actual[0].BSN02
                                    }
                                ],
                                N1_loop: [
                                  {
                                    partyIdentification: [
                                    {
                                       entityIdentifierCode: 'BY',
                                       identificationCodeQualifier: actual[0].N103,
                                       identificationCode: actual[0].N104
                                    }  
                                    ]
                                  }  
                                ]
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
        finalTransformedData[0].updaterec = actual[0].updaterec;
        data.push(finalTransformedData);

        //
        // Return the transformed data along with the errors
        // as a ready-made Orderful JSON for 856 data.
        // following line is commented for debugging
        // console.log(JSON.stringify(finalTransformedData, null, 2));
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
//////// END CELIGO SCRIPT HEADER BLOCK //////////