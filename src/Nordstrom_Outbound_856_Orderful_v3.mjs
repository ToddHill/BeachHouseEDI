import options from './856Nordstrom.json' assert { type: "json" };


// CELIGO PORTIONS BELOW THIS LINE /////////////////////////////////////////////
/*
Everything BETWEEN the CELIGO PORTIONS BELONGS IN CELIGO.  The
rest if for development purposes and will do nothing in Celigo
*/
function preSavePage(options) {
  const numberOfLineItems = options.data.reduce((count, innerArray) => {
    return count + innerArray.length;
  }, 0);
  const data = [];  
  options.data.forEach(mainBody => {
  const firstNode = mainBody[0];
  const addr = [];
  addr.push(firstNode.N101);
  const N1_loop = [];
  const addressInformation = [];
  
  for (let i=0; i < firstNode.N101.length; i++) {
  const addressInformationObject = {};
  const partyIdentificationObject ={};  
      addressInformationObject.entityIdentifierCode = firstNode.N101[i];
      if (firstNode.N102 && firstNode.N102[i]) {
        addressInformationObject.name = firstNode.N102[i];
    }
      addressInformationObject.identificationCodeQualifier = firstNode.N103[i];
      addressInformationObject.identificationCode = firstNode.N104[i];
      addressInformation.push(addressInformationObject);
  }
  const N1Object = {};
  N1Object.entityIdentifierCode = firstNode.N101;
  N1Object.name = firstNode.N102;
  N1Object.identificationCodeQualifier = firstNode.N103;
  N1Object.identificationCode = firstNode.N104;
  N1Object.addressInformation = addressInformation;
  N1_loop.push(N1Object);
  console.log('N1 Loop Stored...');

  const dateTimeReference = [];
  const dateInformationObject = {};
  dateInformationObject.date = firstNode.DTM02;
  dateInformationObject.time = firstNode.DTM03;
  dateInformationObject.dateTimeQualifier = firstNode.DTM01;
  dateTimeReference.push(dateInformationObject);
  console.log('Date Time Reference Stored...');

  const IT1_loop = [];
  const items = getItems(mainBody);
  items.forEach(item => {
    IT1_loop.push(item);
  });
  console.log('IT1 Loop Stored...');


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
  console.log('Update Record Stored...');
  data.push(response);
  console.log('Record Processed');
  
  return data;
}
})
///////// END CELIGO CODE ///////////////////////////////////


