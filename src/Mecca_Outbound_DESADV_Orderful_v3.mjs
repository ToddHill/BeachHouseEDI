import options from './data/Mecca_DESADV_data.json' assert { type: "json" };
preSavePage(options);

function preSavePage(options) {
    const data = [];
    if (!options.data || options.data.length === 0) {
        // If no records, return empty response
        console.log('preSavePage', options.data);
        return {
            data: options.data,
            errors: options.errors,
            abort: false,
            newErrorsAndRetryData: []
        };
    } else {
    const mainBody = options.data[0];
    const getItems = mainBody.map(record => {
    return {
                consignmentPackingSequence: {
                hierarchicalStructureLevelId: "2",
                hierarchicalStructureParentId: "1",
                packagingLevelCode: "3"
                },
                package_group: [
                  {
                    package: {
                      packageQuantity: record.e7224,
                      packageType_composite: {
                        packageTypeDescriptionCode: "CT"
                      }
                    },
                    packageId_group: [
                      {
                        packageId: {
                        markingInstructionsCode: "33E"
                        },
                        goodsIdentityNumber_group: [
                          {
                            goodsIdentityNumber: {
                              objectIdCodeQualifier: "BJ",
                              identityNumberRange_composite: {
                                objectId: record.e7402b
                              }
                            }
                          }
                        ]
                      }
                    ]
                  }
                ],
                lineItem_group: [
                {
                    lineItem: {
                        lineItemId: record.e1082,
                        itemNumberId_composite: {
                            itemId: record.e7140a,
                            itemTypeIdCode: "SRV"
                            }
                    },
                    additionalProductId: [
                        {
                        productIdCodeQualifier: "1",
                        itemNumberId_composite: {
                            itemId: record.e7140c,
                            itemTypeIdCode: "SA"
                            }
                        },
                        {
                            productIdCodeQualifier: "5",
                            itemNumberId_composite: {
                            itemId: record.e7140b,
                            itemTypeIdCode: "IN"
                            }
                        }
                    ],
                    itemDescription: [
                        {
                            descriptionFormatCode: "F",
                            itemDescription_composite: {
                                itemDescription: record.e7008
                            }
                        }
                    ],
                    quantity: [
                        {
                            quantityDetails_composite: {
                                quantityTypeCodeQualifier: "113",
                                quantity: record.e6060,
                                measurementUnitCode: "PCE"
                                }
                        }
                    ],
                    dateTimePeriod: [
                        {
                            dateTimePeriod_composite: {
                                dateOrTimeOrPeriodFunctionCodeQualifier: "361",
                                dateOrTimeOrPeriodText: record.e2380,
                                dateOrTimeOrPeriodFormatCode: "102"
                                }
                        }
                    ],
                    reference_group: [
                        {
                            reference: {
                                reference_composite: {
                                    referenceCodeQualifier: "ON",
                                    referenceId: record.e1154,
                                    documentLineId: record.e1082
                                    }
                                }
                        }
                    ],
                    packageId_group: [
                        {
                            packageId: {
                            markingInstructionsCode: "36E"
                            },
                            goodsIdentityNumber_group: [
                                {
                                    goodsIdentityNumber: {
                                    objectIdCodeQualifier: "BX",
                                    identityNumberRange_composite: {
                                      objectId: record.e7402
                                      }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    });
  
// Provide the Main Object which this is stufed into for Delivery
  
        const MainObject = [{
            sender: {
                isaId: mainBody[0].ISA06
            },
            receiver: {
                isaId: mainBody[0].ISA08
            },
            type: {
                name: 'DESADV_DESPATCH_ADVICE'
            },
            stream: mainBody[0].stream,
            message: {
                beginningOfMessage: {
                    documentMessageName_composite: {
                        documentNameCode: "351"
                    },
                    documentMessageId_composite: {
                        documentId: mainBody[0].e1004
                    },
                    messageFunctionCode: "9"
                },
                dateTimePeriod: [
                    {
                        dateTimePeriod_composite: {
                            dateOrTimeOrPeriodFunctionCodeQualifier: "137",
                            dateOrTimeOrPeriodText: mainBody[0].e2380,
                            dateOrTimeOrPeriodFormatCode: "102"
                        }
                    }
                ],
                reference_group: [
                  {
                      reference: {
                          reference_composite: {
                              referenceCodeQualifier: "ON",
                              referenceId: mainBody[0].e1154
                          }
                      }
                  },
                  {
                    reference: {
                        reference_composite: {
                            referenceCodeQualifier: "CN",
                            referenceId: mainBody[0].e1154c
                        }
                    }
                }                  
              ],
                nameAndAddress_group: [
                    {
                        nameAndAddress: {
                            partyFunctionCodeQualifier: "ST",
                            partyIdDetails_composite: {
                                partyId: "WMSVIC",
                                codeListResponsibleAgencyCode: "92"
                            },
                            partyName_composite: {
                                partyName: "MECCA BRANDS PTY LTD"
                            },
                            street_composite: {
                                streetAndNumberOrPostOfficeBoxId: "107-113 Link Rd"
                            },
                            cityName: "Melbourne Airport",
                            countrySubdivisionDetails_composite: {
                                countrySubdivisionId: "VIC"
                            },
                            postalIdCode: "3045",
                            countryId: "AU"
                        }
                    },
                    {
                        nameAndAddress: {
                            partyFunctionCodeQualifier: "SU",
                            partyIdDetails_composite: {
                                partyId: mainBody[0].e3039,
                                codeListResponsibleAgencyCode: "92"
                            },
                            partyName_composite: {
                                partyName: mainBody[0].e3036
                            },
                            street_composite: {
                                streetAndNumberOrPostOfficeBoxId: "222 Pacific Coast Highway 10th Fl"
                            },
                            cityName: "El Segundo",
                            countrySubdivisionDetails_composite: {
                                countrySubdivisionId: "CA"
                            },
                            postalIdCode: "90245",
                            countryId: "US"
                        }
                    }
                ],
                consignmentPackingSequence_group: [
                    {
                        consignmentPackingSequence: {
                            hierarchicalStructureLevelId: "1",
                            packagingLevelCode: "1E"
                        },
                        package_group: [
                            {
                                package: {
                                    packageQuantity: record.e7224,
                                    packageType_composite: {
                                        packageTypeDescriptionCode: "CT"
                                    }
                                }
                            }
                        ]
                    },    
                    getItems],
                summary_group: {
                    controlTotal: [
                        {
                            control_composite: {
                                controlTotalTypeCodeQualifier: "2",
                                controlTotalQuantity: mainBody.length.toString()
                            }
                        }
                    ]
                }
            }
    }];
  
    const updaterec = {updateid: mainBody[0].id};
    var holder = {};
    holder.MainObject = MainObject;
    holder.updaterec = updaterec;
    data.push(holder);
    console.log(JSON.stringify(data, null, 2));
    return {
            data: data,
            errors: options.errors,
            abort: false,
            newErrorsAndRetryData: []
            };
    }
}
  

  


