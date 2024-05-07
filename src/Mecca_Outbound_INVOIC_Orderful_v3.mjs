import options from './data/Mecca_INVOIC_data.json' assert { type: "json" };
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
                            quantityTypeCodeQualifier: "47",
                            quantity: record.e6060,
                            measurementUnitCode: "PCE"
                        }
                    }
                ],
                monetaryAmount_group: [
                    {
                      monetaryAmount: {
                        monetaryAmount_composite: {
                            monetaryAmountTypeCodeQualifier: "128",
                            monetaryAmount: record.e5004
                        }
                      }
                    },
                    {
                        monetaryAmount: {
                          monetaryAmount_composite: {
                              monetaryAmountTypeCodeQualifier: "369",
                              monetaryAmount: "0.00"
                          }
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
                                priceAmount: record.e5118,
                                priceSpecificationCode: "INV"
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
                                dutyOrTaxOrFeeRate: "0.00"
                            }
                        }
                    }
                ]
            };
        });
  
        const MainObject = [{
            sender: {
                isaId: mainBody[0].ISA06
            },
            receiver: {
                isaId: mainBody[0].ISA08
            },
            type: {
                name: 'INVOIC_INVOICE'
            },
            stream: 'Test',
            message: {
                beginningOfMessage: {
                    documentMessageName_composite: {
                        documentNameCode: "388",
                        documentName: "TAX INVOICE"
                    },
                    documentMessageId_composite: {
                        documentId: mainBody[0].e1004
                    },
                    messageFunctionCode: "9"
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
                        textSubjectCodeQualifier: "AAI",
                        textLiteral_composite: {
                            freeText: "Invoice for order: " + mainBody[0].e1154
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
                                partyName: "MECCA Brands Pty Ltd"
                            },
                            street_composite: {
                                streetAndNumberOrPostOfficeBoxId: "34 Wangaratta St"
                            },
                            cityName: "RICHMOND",
                            countrySubdivisionDetails_composite: {
                                countrySubdivisionId: "VIC"
                            },
                            postalIdCode: "3121",
                            countryId: "AU"
                    },
                    reference_group: [
                        {
                            reference: {
                                reference_composite: {
                                    referenceCodeQualifier: "XA",
                                    referenceId: "74010078010"
                                }
                            }
                        }
                      ],
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
                    },
                    reference_group: [
                        {
                            reference: {
                                reference_composite: {
                                    referenceCodeQualifier: "XA",
                                    referenceId: mainBody[0].e1154duns
                                }
                            }
                        }
                      ]
                    },
                ],
                currencies_group: [
                    {
                        currencies: {
                            currencyDetails_composite: {
                                currencyUsageCodeQualifier: "2",
                                currencyIdCode: "USD",
                                currencyTypeCodeQualifier: "4"
                            }
                        }
                    }
                ],
                paymentTerms_group: [
                    {
                      paymentTerms: {
                        paymentTermsTypeCodeQualifier: "18",
                        paymentTerms_composite: {
                          paymentTermsDescriptionId: "7",
                          codeListResponsibleAgencyCode: "ZZZ",
                          paymentTermsDescription: "60D"
                        }
                      }
                    }
                  ],
                transportInformation_group: [
                    {
                      transportInformation: {
                        transportStageCodeQualifier: "20",
                        modeOfTransport_composite: {
                          transportModeName: "SEA"
                        }
                      }
                    }
                  ],
                lineItem_group: getItems,
                summary_group: {
                    monetaryAmount_group: [
                      {
                        monetaryAmount: {
                            monetaryAmount_composite: {
                                monetaryAmountTypeCodeQualifier: "39",
                                monetaryAmount: totalMonetaryAmount.toString()
                            }
                        }
                      },
                      {
                        monetaryAmount: {
                            monetaryAmount_composite: {
                                monetaryAmountTypeCodeQualifier: "128",
                                monetaryAmount: totalMonetaryAmount.toString()
                            }
                        }
                      },
                      {
                        monetaryAmount: {
                            monetaryAmount_composite: {
                                monetaryAmountTypeCodeQualifier: "369",
                                monetaryAmount: "0.00"
                            }
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
        const updaterec = [];
        updaterec.push({updateid: mainBody[0].id});
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