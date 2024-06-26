import options from './data/Mecca_ORDRSP_data.json' assert { type: "json" };
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
        var totalMonetaryAmount = 0; // Initialize total monetary amount
  
        const getItems = mainBody.map(record => {
            totalMonetaryAmount += parseFloat(record.e5004); // Sum up monetary amounts
  
            return {
                lineItem: {
                    lineItemId: record.e1082,
                    actionCode: record.e1229,
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
                monetaryAmount: [
                    {
                        monetaryAmount_composite: {
                            monetaryAmountTypeCodeQualifier: "128",
                            monetaryAmount: record.e5004
                        }
                    }
                ],
                freeText: [
                  {
                      textSubjectCodeQualifier: "LIN",
                      textLiteral_composite: {
                          freeText: "."
                      }
                  }
                ],
                priceDetails_group: [
                    {
                        priceDetails: {
                            priceInformation_composite: {
                                priceCodeQualifier: "AAA",
                                priceAmount: record.e5118
                            }
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
                dutyTaxFeeDetails_group: [
                    {
                        dutyTaxFeeDetails: {
                            dutyOrTaxOrFeeFunctionCodeQualifier: "7",
                            dutyTaxFeeType_composite: {
                                dutyOrTaxOrFeeTypeNameCode: "GST"
                            },
                            dutyTaxFeeDetail_composite: {
                                dutyOrTaxOrFeeRate: "0"
                            }
                        }
                    }
                ]
            };
        });
  
        const messageFunctionCode = determineMessageFunctionCode(getItems);
  
        const MainObject = [{
            sender: {
                isaId: mainBody[0].ISA06
            },
            receiver: {
                isaId: mainBody[0].ISA08
            },
            type: {
                name: 'ORDRSP_PURCHASE_ORDER_RESPONSE'
            },
            stream: 'Test',
            message: {
                beginningOfMessage: {
                    documentMessageName_composite: {
                        documentNameCode: "231"
                    },
                    documentMessageId_composite: {
                        documentId: mainBody[0].e1004
                    },
                    messageFunctionCode: messageFunctionCode
                },
                dateTimePeriod: [
                    {
                        dateTimePeriod_composite: {
                            dateOrTimeOrPeriodFunctionCodeQualifier: "10",
                            dateOrTimeOrPeriodText: mainBody[0].e2380,
                            dateOrTimeOrPeriodFormatCode: "102"
                        }
                    },
                    {
                        dateTimePeriod_composite: {
                            dateOrTimeOrPeriodFunctionCodeQualifier: "137",
                            dateOrTimeOrPeriodText: mainBody[0].e2380,
                            dateOrTimeOrPeriodFormatCode: "102"
                        }
                    }
                ],
                freeText: [
                    {
                        textSubjectCodeQualifier: "PUR",
                        textLiteral_composite: {
                            freeText: "We have received the following order: " + mainBody[0].e1154
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
                  }
              ],
                nameAndAddress_group: [
                    {
                        nameAndAddress: {
                            partyFunctionCodeQualifier: "BY",
                            partyIdDetails_composite: {
                                partyId: "9377778760728",
                                codeListResponsibleAgencyCode: "9"
                            },
                            partyName_composite: {
                                partyName: "MECCA BRANDS PTY LTD"
                            },
                            street_composite: {
                                streetAndNumberOrPostOfficeBoxId: "34 Wangaratta St"
                            },
                            cityName: "Richmond",
                            countrySubdivisionDetails_composite: {
                                countrySubdivisionId: "VIC"
                            },
                            postalIdCode: "3121",
                            countryId: "AU"
                        }
                    },
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
                currencies_group: [
                    {
                        currencies: {
                            currencyDetails_composite: {
                                currencyUsageCodeQualifier: "2",
                                currencyIdCode: "USD",
                                currencyTypeCodeQualifier: "9"
                            }
                        }
                    }
                ],
                lineItem_group: getItems,
                summary_group: {
                    monetaryAmount: [
                        {
                            monetaryAmount_composite: {
                                monetaryAmountTypeCodeQualifier: "128",
                                monetaryAmount: totalMonetaryAmount.toString()
                            }
                        }
                    ],
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
  
        const updaterec = {
            updateid: mainBody[0].id // Assuming 'id' exists in mainBody[0]
        };
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
  
  function determineMessageFunctionCode(lineItems) {
    const allActionCode5 = lineItems.every(item => item.lineItem.actionCode === '5');
    const anyActionCode3 = lineItems.some(item => item.lineItem.actionCode === '3');
    const allActionCode7 = lineItems.every(item => item.lineItem.actionCode === '7');
  
    if (anyActionCode3) {
      return '4';
    } else if (allActionCode5) {
      return '29';
    } else if (allActionCode7) {
      return '27';
    } else {
      return '29'; // Default value if none of the specific conditions are met
    }
  }
  


