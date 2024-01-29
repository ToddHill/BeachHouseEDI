// For Development Purposes, the Data will need to be imported
// into the Celigo SYstem.  Celigo will automatically pass the 
// JSON of "options", which will contain an array labelled "data".
// it is "data" we will be working with using this script.
//
// The Next Lines are to create a development environment similar
// to what Celigo will pass through
import options from './856Bloomingdales.json';
console.log('Proof of Life');


// The following lines are for use in Celigo 
function preSavePage (options) {
    // Author Date: 11/2/2023
    // Due to the use of arrays being sent, we now need to
    // verify we even have an object, or Celigo will throw
    // an error
    // Update: 11/13/2023
    // Add grouping to connect to IF structure to get each
    // IF individually.
    // Rewrite: 1/2/2024
    // We now must UNGROUP the records and loop through all 
    // of them, and additionally loop the BSN information to group 
    // all records as they come in, to build a proper SHIPMENT loop
    // for the EDI
    //
    if (options.data.length > 0) {
    
    console.log('BEGIN 856');
    console.log('-------------------------------');
    // Starting Variables
    const mainBody = options.data;
    const firstNode = mainBody;
    const linecount = mainBody.length;
    
    var items = [];
    var ladingqty = 0;
    var holder = {};
    var obj1 = {};
    var obj2 = {};
    // Report Starting Variables to LOG.
    console.log('Number of Line Items : ' + linecount);
    console.log('Processing PO Number : ' + firstNode.PRF01);
    
    
    // REFERENCE INFORMATION FUNCTION
    
    // Processing reference information if multiples are required.
    const getReferenceInformation = node => {
        const referenceInformation = [];
      // Make sure it is an array.  Then loop through it. If not
      // write the single records and move on.
        if (Array.isArray(node.REF01)) {
            console.log('Reference Array Loop');
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
            console.log('Single Reference Object');
          const referenceInformationObject = {};
          referenceInformationObject.referenceIdentificationQualifier = node.REF01;
          referenceInformationObject.referenceIdentification = node.REF02;
          referenceInformationObject.description = node.REF03;
          referenceInformation.push(referenceInformationObject);   
        }
        return referenceInformation;
      }
    // End Reference Information
    
    //  We're going to load the addresses as the array is so many levels deep that
    //  Building it as a function is untenebale.
    //
    //  This builds, but does not USE the address loop, as it is actually used
    //  elsewhere in the code than normal.
    const addr = [];
    addr.push(firstNode.N101);
    const N1_loop = [];
    const addressInformation = [];
    const addressInformationObject = {};
    const partyIdentificationObject ={};
    console.log('-------------------------------');
    console.log('Addresses:');
    
    for (let i=0; i < firstNode.N101.length; i++) {
        addressInformationObject.entityIdentifierCode = firstNode.N101[i];
        addressInformationObject.name = firstNode.N102[i];
        addressInformationObject.identificationCodeQualifier = firstNode.N103[i];
        addressInformationObject.identificationCode = firstNode.N104[i];
        console.log(firstNode.N101[i],firstNode.N102[i],firstNode.N103[i] ,firstNode.N104[i]);
        addressInformation.push(addressInformationObject);
        partyIdentificationObject.partyIdentification = [addressInformationObject];
        N1_loop.push(partyIdentificationObject);
    
      }
    // End Address Information
    //DATETIME INFORMATION FUNCTION
    const getDateInformation = node => {
      const dateInformation = [];
    // Make sure it is an array.  Then loop through it. If not
    // write the single records and move on.
      if (Array.isArray(node.DTM01)) {
        node.DTM01.forEach((DTM01, index) => {
          // For each value in node.DTM01, we're going to create a new... OBJECT
          const dateInformationObject = {};
          console.log('multiple date array');
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
        console.log('single date object');
        const dateInformationObject = {};
        dateInformationObject.dateTimeQualifier = node.DTM01;
        dateInformationObject.dateTime = node.DTM02;
        dateInformationObject.description = node.DTM03;
        dateInformation.push(dateInformationObject);   
      }
      return dateInformation;
    }
    //
    // UPDATED ITEMLOOP
    // 10.28.2023 itemloopcontent - designed to pre-load 
    // the item loop from the data and manage the counting of the
    // HL Loops, connecting the single order to all packs, and all
    // items to the associated pack as a parent id
    // 10.30.2023 Debugging Added to verify passing through loop.
    // 12.01.2023 Redone to Resolve issue with looping index and 
    //            index count not being sufficient causing
    //            only half the records being output in the 
    //            item loop due to dual objects being loaded.
    //            two objects, not one, are loaded here.
    //
    for (let i = 0; i < mainBody.length; i++) {
      console.log('-------------------------------');
      console.log('   Carton: ' + mainBody[i].MAN02);
      console.log('      UPC: ' + mainBody[i].LIN03);
      console.log(' Quantity: ' + mainBody[i].SN102);
      ladingqty = mainBody.length;
        obj1 = { 
            hierarchicalLevel: [
            {
              hierarchicalIDNumber: (((i + 1) * 2) + 1).toString(),
              hierarchicalParentIDNumber: '2',
              hierarchicalLevelCode: 'P',
            },],
            marksAndNumbersInformation: [
            {
              marksAndNumbersQualifier: mainBody[i].MAN01,
              marksAndNumbers: mainBody[i].MAN02
            }] 
              };
    
      obj2 = {  
            hierarchicalLevel: [
            {
               hierarchicalIDNumber: (((i + 1) * 2) + 2).toString(),
               hierarchicalParentIDNumber: (((i + 1) * 2) + 1).toString(),
               hierarchicalLevelCode: 'I',
            },],
            itemIdentification: [
            {
              productServiceIDQualifier: mainBody[i].LIN02,
              productServiceID: mainBody[i].LIN03
            }],
            itemDetailShipment: [
            {
              numberOfUnitsShipped: mainBody[i].SN102,
              unitOrBasisForMeasurementCode: mainBody[i].SN103
            }]
             }; 
    
      items.push(obj1,obj2);
    }
    var referenceInformation = getReferenceInformation(firstNode);
    //
    // Main Body of Response is provided below, this is what will be sent to Orderful
    //if sucessfully executed, along with the NetSuite record to be updated.
    //
    const response = [{
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
                  transactionSetIdentifierCode: '856',
                  transactionSetControlNumber: '0001'
                }
              ],
              beginningSegmentForShipNotice: [
                {
                  transactionSetPurposeCode: '00',
                  shipmentIdentification: firstNode.BSN02,
                  date: firstNode.BSN03,
                  time: firstNode.BSN04,
                  hierarchicalStructureCode: '0001'
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
                      packagingCode: firstNode.TD101,
                      ladingQuantity: ladingqty.toString(),
                      weightQualifier: firstNode.TD106,
                      weight: firstNode.TD107,
                      unitOrBasisForMeasurementCode: firstNode.TD108
                    }
                  ],
                  carrierDetailsRoutingSequenceTransitTime: [
                    {
                      identificationCodeQualifier: firstNode.TD502,
                      identificationCode: firstNode.TD503,
                      transportationMethodTypeCode: firstNode.TD504,
                      routing: firstNode.TD505,
                      shipmentOrderStatusCode: firstNode.TD506
                    }
                  ],
                  referenceInformation,
                  dateTimeReference: getDateInformation(firstNode),
                  N1_loop: [
                    {
                      partyIdentification: [
                        {
                          entityIdentifierCode: firstNode.N101[0],
                          name: firstNode.N102[0],
                          identificationCodeQualifier: firstNode.N103[0],
                          identificationCode: firstNode.N104[0]
                        }
                      ]
                    },
                    {
                     partyIdentification: [
                        {
                          entityIdentifierCode: firstNode.N101[2],
                          name: firstNode.N102[2],
                          identificationCodeQualifier: firstNode.N103[2],
                          identificationCode: firstNode.N104[2]
                        }
                      ],
                     geographicLocation: [
                    {
                      cityName: firstNode.N401,
                      stateOrProvinceCode: firstNode.N402
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
                      purchaseOrderNumber: firstNode.PRF01,
                      date: firstNode.PRF04
                    }
                  ],
                  productItemDescription: [
                  {
                    itemDescriptionTypeCode: firstNode.PID01,
                    agencyQualifierCode: firstNode.PID03,
                    productDescriptionCode: firstNode.PID04
                  }
                  ],
                  carrierDetailsQuantityAndWeight: [
                    {
                      packagingCode: firstNode.TD101,
                      ladingQuantity: ladingqty.toString()
                    }
                  ],
                  N1_loop: [
                    {
                      partyIdentification: [
                        {
                          entityIdentifierCode: firstNode.N101[1],
                          name: firstNode.N102[1],
                          identificationCodeQualifier: firstNode.N103[1],
                          identificationCode: firstNode.N104[1]
                        }
                      ]
                    }
                  ]
                },
              ...items
              ],
              transactionTotals: [
                      {
                              numberOfLineItems: linecount.toString()
                      }
                    ]
            }
          ]
        }
      }];
      response[0].updaterec = firstNode.updaterec;
      console.log('Update Record Stored...');
    
     
    return {
        data: response,
        errors: options.errors,
        abort: false,
        newErrorsAndRetryData: []
      }
    }
      else {
      var errorMessage = '';
      console.log('No record to process');
      if(options.data === null) {
        errorMessage = 'No records to process';
      }else if (options.data.length === 0) {
        errorMessage = 'No data to process';
      }
     
      var errorsArray = options.errors;
      if (errorMessage.length > 0) {
        const error = {code:'NetSuite Export', message: errorMessage, source:'NetSuite Record Not Present',ignored:true};
        errorsArray.push(error);
      }
        
       return {
        data: options.data,
        errors: errorsArray,
        abort: false,
        newErrorsAndRetryData: []
      } 
    }
    }