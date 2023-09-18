import './styles.css';
import options from './855Nordstrom.json';
document.getElementById("app855").innerHTML = '855 Nordstom Script';
// CELIGO PORTIONS BELOW THIS LINE /////////////////////////////////////////////
/*
Everything BETWEEN the CELIGO PORTIONS BELONGS IN CELIGO.  The
rest if for development purposes and will do nothing in Celigo
*/
// We get the first record so we can use it to modify the header data BEFORE
// going into the detail level issues.
const mainBody = options.data[0];
const firstNode = mainBody[0];
const linecount = mainBody.length;
/*  We're going to load the references as the array 
    Building it as a function is untenebale.
    We are also going to take into consideration the 
    possibility that there may be only one.
*/
// REFERENCE INFORMATION FUNCTION
const getReferenceInformation = node => {
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
/*

There could be an array of Dates.  There could also be only ONE.  This
function assures that the dates work both ways.

*/
//DATETIME INFORMATION FUNCTION
const getDateInformation = node => {
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
      dateInformation.push(dateInformationObject);
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
/*

 Get the Items Themselves.  This is the only part that needs to 
 loop through the entire record set.  Everything else is derived
 from the very first record.  This is where the proverbial rubber meets
 the road.

*/
const getItems = node => {
  const itemInformation = [];
  const destinationQ = [];
  node.forEach((record, index) => {
    // create the objects to load the data into
    const itemInformationObject = {};
    const proddestcobj ={};
    // the loop for the baseline Item Data 
    itemInformationObject.assignedIdentification = String(index+1);
    itemInformationObject.quantity = record.PO102;
    itemInformationObject.unitOrBasisForMeasurementCode = record.PO103;
    itemInformationObject.unitPrice = record.PO104; 
    itemInformationObject.basisOfUnitPriceCode = record.PO105;
    itemInformationObject.productServiceIDQualifier = record.PO106;
    itemInformationObject.productServiceID = record.PO107;
    itemInformationObject.productServiceIDQualifier1 = record.PO108;
    itemInformationObject.productServiceID1 = record.PO109;
    itemInformation.push(itemInformationObject);
    // the loop for the destination Quantity
    proddestcobj.unitOrBasisForMeasurementCode = record.SDQ01;
    proddestcobj.identificationCodeQualifier = record.SDQ02;
    proddestcobj.identificationCode = record.SDQ03;
    proddestcobj.quantity = record.SDQ04;
    destinationQ.push(proddestcobj)
  })
  return {
    baselineItemData: itemInformation, 
    destinationQuantity: destinationQ
  };
}


// MAIN RESPONSE OBJECT ///////////////////////////////
/*
This is where it is all assembled to go out to Orderful and
all of the items are combined with the headers.
*/
const response ={
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
            transactionSetIdentifierCode: '855',
            transactionSetControlNumber: '0001'
          }
        ],
          beginningSegmentForPurchaseOrderAcknowledgment: [
            {
              transactionSetPurposeCode: firstNode.BAK01,
              acknowledgmentTypeCode: firstNode.BAK02,
              purchaseOrderNumber: firstNode.BAK03,
              date: firstNode.BAK04
            }
          ],
          referenceInformation: getReferenceInformation(firstNode),
          dateTimeReference: getDateInformation(firstNode),
          PO1_loop: [getItems(mainBody)],
          CTT_loop: [
            {
              transactionTotals: [
                {
                  numberOfLineItems: String(linecount)
                }
              ]
            }
          ]
        }
      ]
    }
  }
  options.data = [response];
///////// END CELIGO CODE ///////////////////////////////////

/*
Everything Above this is Celigo Ready.  Nothing Below this
Does anything for you in Celigo, it is for testing only
*/
  console.log('response', options);
  console.log('mainbody', mainBody);
  document.getElementById("response").innerHTML = JSON.stringify(response,null,2);
