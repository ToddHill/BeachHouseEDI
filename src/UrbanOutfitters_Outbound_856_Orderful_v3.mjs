import options from './data/UrbanOutfitters_856_data.json' assert { type: "json" };
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
        let boxcount = 0;
        let totalvolume = 0;
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
                    itemPhysicalDetails: [
                        {
                            weightQualifier: "G",
                            grossWeightPerPack: record.PO406,
                            unitOrBasisForMeasurementCode1: "KG"
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
                boxcount++;
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
                      productServiceIDQualifier: record.LIN02,
                      productServiceID: record.LIN03,
                      productServiceIDQualifier1: record.LIN04,
                      productServiceID1: record.LIN05,
                      productServiceIDQualifier2: record.LIN06,
                      productServiceID2: record.LIN07
                    }
                  ],
                itemDetailShipment: [
                    {
                        numberOfUnitsShipped: record.SN102,
                        unitOrBasisForMeasurementCode: record.SN103
                    }
                ],
                productItemDescription: [
                    {
                        itemDescriptionTypeCode: 'F',
                        description: record.PID05
                    }
                ],

            };
            if (!isNaN(record.LineVolume)) {
                totalvolume += parseFloat(record.LineVolume); // Choose your conversion method
            } else {
                // Handle the case where record.LineVolume is not a valid number
                console.error("Invalid LineVolume value:", record.LineVolume); 
            }
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
                        dateTimeReference: [
                            {
                                dateTimeQualifier: actual[0].DTM01,
                                date: actual[0].DTM02
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
                                        ladingQuantity: boxcount.toString(),
                                        weightQualifier: actual[0].TD106,
                                        weight: actual[0].TD107,
                                        unitOrBasisForMeasurementCode: actual[0].TD108,
                                        volume: totalvolume.toString(),
                                        unitOrBasisForMeasurementCode1: actual[0].TD110
                                    }
                                ],
                                carrierDetailsRoutingSequenceTransitTime: [
                                    {
                                        identificationCodeQualifier: '2',
                                        identificationCode: actual[0].TD503
                                    }
                                ],
                                referenceInformation: [
                                    {
                                        referenceIdentificationQualifier: actual[0].REF01,
                                        referenceIdentification: actual[0].REF02
                                    }
                                ],
                                N1_loop: [
                                    {
                                        partyIdentification: [
                                            {
                                                entityIdentifierCode: actual[0].N101[0],
                                                name: actual[0].N102[0],
                                                identificationCodeQualifier: actual[0].N103[0],
                                                identificationCode: actual[0].N104[0]
                                            }
                                        ],
                                        partyLocation: [
                                            {
                                                addressInformation: actual[0].N301[0],
                                                addressInformation1: actual[0].N302[0]
                                            }
                                        ],
                                        geographicLocation: [
                                            {
                                                cityName: actual[0].N401[0],
                                                stateOrProvinceCode: actual[0].N402[0],
                                                postalCode: actual[0].N403[0],
                                                countryCode: actual[0].N404[0]
                                            }
                                        ]
                                    },
                                    {
                                        partyIdentification: [
                                            {
                                                entityIdentifierCode: actual[0].N101[1],
                                                name: actual[0].N102[1]
                                            }
                                        ],
                                        partyLocation: [
                                            {
                                                addressInformation: actual[0].N301[1],
                                                addressInformation1: actual[0].N302[1]
                                            }
                                        ],
                                        geographicLocation: [
                                            {
                                                cityName: actual[0].N401[1],
                                                stateOrProvinceCode: actual[0].N402[1],
                                                postalCode: actual[0].N403[1],
                                                countryCode: actual[0].N404[1]
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
                                        purchaseOrderNumber: actual[0].PRF01,
                                        date: actual[0].PRF04
                                    }
                                ],
                                referenceInformation: [
                                    {
                                        referenceIdentificationQualifier: 'IA',
                                        referenceIdentification: actual[0].SREF02
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
        finalTransformedData[0].updaterec = actual[0].updaterec;
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
//////// END CELIGO SCRIPT HEADER BLOCK //////////