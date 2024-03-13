import options from './Ulta_855_data.json' assert { type: "json" };
preSavePage(options);

///////// BEGIN CELIGO CODE /////////////////////////////////
function preSavePage(options) {
    const mainBody = options.data[0];
    if (!mainBody || mainBody.length === 0) {
      // If no records, return empty response
      return {
          data: []
      };
  }

    const AcknowledgmentType = "AD"; // "AD" = Acknowledge with Detail, No Change | "AC" = Acknowledge with Detail and Change, "RD" = Reject with Detail
    const firstNode = mainBody[0];
    const linecount = mainBody.length;

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
    // DATETIME INFORMATION FUNCTION
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
          if (index === 0) {dateInformation.push(dateInformationObject)};
        })
      } else {
        const dateInformationObject = {};
        dateInformationObject.dateTimeQualifier = node.DTM01;
        dateInformationObject.dateTime = node.DTM02;
        dateInformationObject.description = node.DTM03;
        dateInformation.push(dateInformationObject);   
      }
      return dateInformation;
    }
    // ITEM INFORMATION FUNCTION
function getItems(node) {
        const po1Loop = [];
        node.forEach((record, index) => {
            const po1Object = {};
            po1Object.baselineItemData = [{
                assignedIdentification: String(index + 1),
                quantity: record.PO102,
                unitOrBasisForMeasurementCode: record.PO103,
                unitPrice: record.PO104,
                basisOfUnitPriceCode: record.PO105,
                productServiceIDQualifier: record.PO106,
                productServiceID: record.PO107,
                productServiceIDQualifier1: record.PO108,
                productServiceID1: record.PO109,
                productServiceIDQualifier2: record.PO110,
                productServiceID2: record.PO111
            }];
            po1Object.PID_loop = [{
                productItemDescription: [{
                  itemDescriptionTypeCode: record.PID01,
                  productProcessCharacteristicCode: record.PID02,
                  description: record.PID05
                }]
            }];
            po1Object.ACK_loop = [{
                lineItemAcknowledgment: [{
                    lineItemStatusCode: record.ACK01,
                    quantity: record.PO102,
                    unitOrBasisForMeasurementCode: record.PO103,
                    dateTimeQualifier: "068",
                    date: record.ACK05
                }],
                dateTimeReference: [{
                    dateTimeQualifier: "017",
                    date: record.ACK05
                }]
            }];
            po1Loop.push(po1Object);
        });
        return po1Loop;
    }

    function getAcknowledgmentType(nodes) {
      // Iterate through all nodes
      for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          // Check if any ACK01 is not equal to "IA"
          if (node.ACK01 !== "IA") {
              // If any ACK01 is not "IA", return "AC"
              return "AC";
          }
      }
      // If all ACK01 are "IA", return "AD"
      return "AD";
  }


    ///////// END CUSTOM FUNCTIONS ///////////////////////////////    
    
// MAIN RESPONSE OBJECT ///////////////////////////////
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
        transactionSets: [{
            transactionSetHeader: [{
                transactionSetIdentifierCode: '855',
                transactionSetControlNumber: '0001'
            }],
            beginningSegmentForPurchaseOrderAcknowledgment: [{
                transactionSetPurposeCode: firstNode.BAK01,
                acknowledgmentTypeCode: getAcknowledgmentType(mainBody),
                purchaseOrderNumber: firstNode.BAK03,
                date: firstNode.BAK04,
                requestReferenceNumber: firstNode.BAK06,
            }],
            currency: [{
                entityIdentifierCode: firstNode.CUR01,
                currencyCode: firstNode.CUR02
            }],
            referenceInformation: getReferenceInformation(firstNode),
            dateTimeReference: getDateInformation(firstNode),
            PO1_loop: getItems(mainBody), // Remove the extra array wrapping
            CTT_loop: [{
                transactionTotals: [{
                    numberOfLineItems: String(linecount)
                }]
            }]
        }]
    }
}];
// END MAIN RESPONSE OBJECT ///////////////////////////////

    // Add the update record to the response
    response[0].updaterec = firstNode.id;
    // Return the response as data
    console.log(JSON.stringify(response, null, 2));
    return {
        data: response
    };
    }
///////// END CELIGO CODE ///////////////////////////////////