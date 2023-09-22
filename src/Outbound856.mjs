import './styles.css';
import options from './856Nordstrom.json';
document.getElementById("app856").innerHTML = '856 Nordstom Script';
// CELIGO PORTIONS BELOW THIS LINE /////////////////////////////////////////////
/*
Everything BETWEEN the CELIGO PORTIONS BELONGS IN CELIGO.  The
rest if for development purposes and will do nothing in Celigo
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
// End Reference Information

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
          referenceInformation: getReferenceInformation(firstNode), 
          N1_loop,
          termsOfSaleDeferredTermsOfSale: [
                  {
                    termsTypeCode: firstNode.ITD01,
                    termsBasisDateCode: firstNode.ITD02
                  }
                ],
          dateTimeReference: getDateInformation(firstNode),
          IT1_loop: [getItems(mainBody)],     
          totalMonetaryValueSummary: [
                  {
                    amount: firstNode.TDS01
                  }
                ],
          carrierDetails: [
                  {
                    transportationMethodTypeCode: firstNode.CAD01,
                    standardCarrierAlphaCode: firstNode.CAD04,
                    referenceIdentificationQualifier: firstNode.CAD07,
                    referenceIdentification: firstNode.CAD08
                  }
                ],      
          transactionTotals: [
                  {
                          numberOfLineItems: firstNode.CTT01
                  }
                ]
        }
      ]
    }
  }];
  response[0].updaterec = firstNode.id;
  data.push(response);
///////// END CELIGO CODE ///////////////////////////////////
/*
Everything Above this is Celigo Ready.  Nothing Below this
Does anything for you in Celigo, it is for testing only
*/

console.log('response', response);
document.getElementById("response").innerHTML = JSON.stringify(response,null,2);
