import options from './Mecca_ORDRSP_data.json' assert { type: "json" };
preSavePage(options);


function preSavePage (options) {
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
        // If there are records, process them
        const mainBody = options.data[0];
        const AcknowledgmentType = "AD"; // "AD" = Acknowledge with Detail, No Change | "AC" = Acknowledge with Detail and Change, "RD" = Reject with Detail
        const firstNode = mainBody[0];
        const linecount = mainBody.length;
        console.log(linecount);
        const response = {
            sender: {
              isaId: firstNode.ISA06
            },
            receiver: {
              isaId: firstNode.ISA08
            },
            type: {
              name: 'ORDRSP_PURCHASE_ORDER_RESPONSE'
            },
            stream: 'Test',
            message: {
              beginningOfMessage: {
                documentMessageName_composite: {
                  documentNameCode: firstNode.1001
                },
                documentMessageId_composite: {
                  documentId: firstNode.1004
                },
                messageFunctionCode: firstNode.1225
              },
              dateTimePeriod: [
                {
                  dateTimePeriod_composite: {
                    dateOrTimeOrPeriodFunctionCodeQualifier: 2005,
                    dateOrTimeOrPeriodText: 2380,
                    dateOrTimeOrPeriodFormatCode: 2379
                  }
                }
              ],
              freeText: [
                {
                  textSubjectCodeQualifier: 4451,
                  textLiteral_composite: {
                    freeText: 4440,
                    freeText_1: 4440,
                    freeText_2: 4440,
                    freeText_3: 4440,
                    freeText_4: 4440
                  }
                }
              ],
              reference_group: [
                {
                  reference: {
                    reference_composite: {
                      referenceCodeQualifier: 1153,
                      referenceId: 1154
                    }
                  }
                }
              ],
              nameAndAddress_group: [
                {
                  nameAndAddress: {
                    partyFunctionCodeQualifier: 3035,
                    partyIdDetails_composite: {
                      partyId: 3039,
                      codeListResponsibleAgencyCode: 3055
                    },
                    partyName_composite: {
                      partyName: 3036,
                      partyName_1: 3036
                    },
                    street_composite: {
                      streetAndNumberOrPostOfficeBoxId: 3042,
                      streetAndNumberOrPostOfficeBoxId_1: 3042,
                      streetAndNumberOrPostOfficeBoxId_2: 3042
                    },
                    cityName: 3164,
                    countrySubdivisionDetails_composite: {
                      countrySubdivisionId: 3229
                    },
                    postalIdCode: 3251,
                    countryId: 3207
                  }
                }
              ],
              currencies_group: [
                {
                  currencies: {
                    currencyDetails_composite: {
                      currencyUsageCodeQualifier: 6347,
                      currencyIdCode: 6345,
                      currencyTypeCodeQualifier: 6343
                    }
                  }
                }
              ],
              paymentTerms_group: [
                {
                  paymentTerms: {
                    paymentTermsTypeCodeQualifier: 4279,
                    paymentTerms_composite: {
                      paymentTermsDescriptionId: 4277,
                      codeListResponsibleAgencyCode: 3055,
                      paymentTermsDescription: 4276
                    }
                  }
                }
              ],
              transportInformation_group: [
                {
                  transportInformation: {
                    transportStageCodeQualifier: 8051,
                    modeOfTransport_composite: {
                      transportModeName: 8066
                    }
                  }
                }
              ],
              termsOfDeliveryOrTransport_group: [
                {
                  termsOfDeliveryOrTransport: {
                    deliveryOrTransportTermsFunctionCode: 4055,
                    termsOfDeliveryOrTransport_composite: {
                      deliveryOrTransportTermsDescriptionCode: 4053,
                      codeListIdCode: 1131,
                      codeListResponsibleAgencyCode: 3055
                    }
                  }
                }
              ],
              lineItem_group: [
                {
                  lineItem: {
                    lineItemId: 1082,
                    actionCode: 1229,
                    itemNumberId_composite: {
                      itemId: 7140,
                      itemTypeIdCode: 7143
                    }
                  },
                  additionalProductId: [
                    {
                      productIdCodeQualifier: 4347,
                      itemNumberId_composite: {
                        itemId: 7140,
                        itemTypeIdCode: 7143
                      }
                    }
                  ],
                  itemDescription: [
                    {
                      descriptionFormatCode: 7077,
                      itemDescription_composite: {
                        itemDescription: 7008,
                        itemDescription_1: 7008
                      }
                    }
                  ],
                  quantity: [
                    {
                      quantityDetails_composite: {
                        quantityTypeCodeQualifier: 6063,
                        quantity: 6060,
                        measurementUnitCode: 6411
                      }
                    }
                  ],
                  monetaryAmount: [
                    {
                      monetaryAmount_composite: {
                        monetaryAmountTypeCodeQualifier: 5025,
                        monetaryAmount: 5004
                      }
                    }
                  ],
                  freeText: [
                    {
                      textSubjectCodeQualifier: 4451,
                      textLiteral_composite: {
                        freeText: 4440,
                        freeText_1: 4440,
                        freeText_2: 4440,
                        freeText_3: 4440,
                        freeText_4: 4440
                      }
                    }
                  ],
                  priceDetails_group: [
                    {
                      priceDetails: {
                        priceInformation_composite: {
                          priceCodeQualifier: 5125,
                          priceAmount: 5118
                        }
                      }
                    }
                  ],
                  reference_group: [
                    {
                      reference: {
                        reference_composite: {
                          referenceCodeQualifier: 1153,
                          referenceId: 1154,
                          documentLineId: 1156
                        }
                      }
                    }
                  ],
                  dutyTaxFeeDetails_group: [
                    {
                      dutyTaxFeeDetails: {
                        dutyOrTaxOrFeeFunctionCodeQualifier: 5283,
                        dutyTaxFeeType_composite: {
                          dutyOrTaxOrFeeTypeNameCode: 5153
                        },
                        dutyTaxFeeDetail_composite: {
                          dutyOrTaxOrFeeRate: 5278
                        }
                      }
                    }
                  ],
                  allowanceOrCharge_group: [
                    {
                      allowanceOrCharge: {
                        allowanceOrChargeCodeQualifier: 5463
                      },
                      percentageDetails_group: {
                        percentageDetails: {
                          percentageDetails_composite: {
                            percentageTypeCodeQualifier: 5245,
                            percentage: 5482
                          }
                        }
                      },
                      monetaryAmount_group: [
                        {
                          monetaryAmount: {
                            monetaryAmount_composite: {
                              monetaryAmountTypeCodeQualifier: 5025,
                              monetaryAmount: 5004
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ],
              summary_group: {
                monetaryAmount: [
                  {
                    monetaryAmount_composite: {
                      monetaryAmountTypeCodeQualifier: 5025,
                      monetaryAmount: 5004
                    }
                  }
                ],
                controlTotal: [
                  {
                    control_composite: {
                      controlTotalTypeCodeQualifier: 6069,
                      controlTotalQuantity: 6066
                    }
                  }
                ]
              }
            }
          };
            console.log(JSON.stringify(response, null, 2));
        return {
            data: response,
            errors: options.errors,
            abort: false,
            newErrorsAndRetryData: []
          };



    }
}