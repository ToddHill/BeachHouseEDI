import options from './Nordstrom_856_data.json' assert { type: "json" };
preSavePage(options);

// CELIGO PORTIONS BELOW THIS LINE ////////////////
function preSavePage(options) {
  let oldRecord = options.data;
  let UpdateRecordsArray = [];
  let newRecord = {};
  let newOptions = {};
  let responseData = [];
  let totalLines = 0;
  let hierarchicalIDNumberCounter = 0;


  // Call combineByBol function and capture returned values
  let result = combineByBol(oldRecord, newRecord, newOptions, hierarchicalIDNumberCounter, UpdateRecordsArray);
  UpdateRecordsArray = result.UpdateRecordsArray;
  hierarchicalIDNumberCounter = result.hierarchicalIDNumberCounter;

  // now we take 'newRecord' and convert it
  // This loop is looping through our newly consolidated newRecord and
  // converting the map objects into arrays so we can loop through
  // the data and generate the document before sending it to Orderful.

  for (let bolKey in newRecord) {

    for (let dcKey in newRecord[bolKey]["dcObj"]) {
      for (let poAndStoreKey in newRecord[bolKey]["dcObj"][dcKey][
        "poAndStoreObj"
      ]) {
        totalLines++;

        let dcObj = newRecord[bolKey]["dcObj"][dcKey];
      }
      let bolObj = newRecord[bolKey];
    }
    newRecord[bolKey]["dcObj"] = undefined;

    // Add the "transactionTotals" field to the message object

    var transactionTotalsCount = {};
    transactionTotalsCount.numberOfLineItems = hierarchicalIDNumberCounter.toString();
       newRecord[bolKey]["message"]["transactionSets"][0]["transactionTotals"] = [];
    newRecord[bolKey]["message"]["transactionSets"][0]["transactionTotals"].push(transactionTotalsCount);
    // Add the "updaterec" field to the responseData object


    responseData.push({
      record: newRecord[bolKey],
      updaterec: UpdateRecordsArray
    });


  }

// useful debug to see the entire object before it is sent.
 console.log(JSON.stringify(responseData, undefined, 2));
  
  return {
    data: responseData,
    errors: options.errors,
    abort: false,
  };
}

function combineByBol(oldRecord, newRecord, newOptions, hierarchicalIDNumberCounter, UpdateRecordsArray) {
//  let UpdateRecordsArray = [];  
// set up the newOptions object to hold the shipmentladingQuantity and shipmentWeight
  let shipmentladingQuantity = 0;
  let shipmentWeight = 0;
  let orderladingQuantity = 0;
  let orderWeight = 0;
  let totalLines = 0;

  
  for (let i = 0; i < oldRecord.length; i++) {
    let bolKey = oldRecord[i].BSN02;
    let dcKey = oldRecord[i].N104[0];
    let poAndStoreKey = oldRecord[i].N104[2];
    let cartonKey = oldRecord[i].MAN02;
    let itemKey = oldRecord[i].LIN03;
    UpdateRecordsArray.push({recordidtoupdate: oldRecord[i].SOId});
    if (!newOptions[bolKey]) {
      newOptions[bolKey] = {
        shipmentladingQuantity: 0,
        shipmentWeight: 0
      };
      newOptions[bolKey]["dcObj"] = {};
      
    }

    if (!newOptions[bolKey]["dcObj"][dcKey]) {
      newOptions[bolKey]["dcObj"][dcKey] = {
        poAndStoreObj: {},
        poAndStoreList: [],
        Package_weight: "0",
      };
    }

    if (!newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]) {
      newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey] = {
        cartonObj: {},
        cartonList: [],
        orderladingQuantity: 0,
        orderWeight: 0,
      };
    }

    if (!newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["cartonObj"][cartonKey]) {
      newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["cartonObj"][cartonKey] = {
        itemObj: {},
        itemList: [],
      };
    }

    if (!newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["cartonObj"][cartonKey]["itemObj"][itemKey]) {
      newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["cartonObj"][cartonKey]["itemObj"][itemKey] = {
        endObj: {},
      };
   
  // update the shipmentladingQuantity and shipmentWeight
  var shortWeight = parseFloat(oldRecord[i].TD107);
  newOptions[bolKey]["shipmentladingQuantity"] = newOptions[bolKey]["shipmentladingQuantity"] + 1;
  newOptions[bolKey]["shipmentWeight"] = newOptions[bolKey]["shipmentWeight"] + shortWeight;
  // update the orderladingQuantity and orderWeight
  newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderladingQuantity"] = newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderladingQuantity"] + 1;
  newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderWeight"] = newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderWeight"] + shortWeight;


    }

  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  // Loop through the options.data to combine records with the same                                  //
  // BOL number into a new object to be sent to Orderful                                             //
  // set 'keys' for BOL (Shipment Level), then DC (Same Shipment), then PO & Store (Order Level)     //
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  // Initialize the Hierarchical ID Number Counter
  hierarchicalIDNumberCounter = 0;
  // Initialize the Hierarchical Parent ID Number Counter
  let hierarchicalParentIDNumberCounter = 0;
  // Initialize the Hierarchical ID Shipment Number
  let hierarchicalIDShipmentNumber = 0;
  // Initialize the Hierarchical ID Order Number
  let hierarchicalIDOrderNumber = 0;
  // Loop through the oldRecord to combine records with the same BOL number
  for (let i = 0; i < oldRecord.length; i++) {
    let bolKey = oldRecord[i].BSN02;
    let dcKey = oldRecord[i].N104[0];
    let poAndStoreKey = oldRecord[i].N104[2];
    let cartonKey = oldRecord[i].MAN02;
    let itemKey = oldRecord[i].LIN03;

  //Build the newRecord Object
    if (!newRecord[bolKey]) {

      hierarchicalIDNumberCounter = 1;
      // Transaction Set Headers
      var transactionSetHeader = [];
      var transactionSetHeaderObject = {};
      transactionSetHeaderObject.transactionSetIdentifierCode = "856";
      transactionSetHeaderObject.transactionSetControlNumber = "0001";
      transactionSetHeader.push(transactionSetHeaderObject);
      // Beginning Segment for Ship Notice
      var beginningSegmentForShipNotice = [];
      var beginningSegmentForShipNoticeObject = {};
      beginningSegmentForShipNoticeObject.transactionSetPurposeCode =
        oldRecord[i].BSN01;
      beginningSegmentForShipNoticeObject.shipmentIdentification =
        oldRecord[i].BSN02;
      beginningSegmentForShipNoticeObject.date = oldRecord[i].BSN03;
      beginningSegmentForShipNoticeObject.time = oldRecord[i].BSN04;
      beginningSegmentForShipNoticeObject.hierarchicalStructureCode = "0001";
      beginningSegmentForShipNotice.push(beginningSegmentForShipNoticeObject);

      // Build the HL Level 1 (Shipment) loop
// REFERENCE INFORMATION FUNCTION
// Processing reference information if multiples are required.
const getReferenceInformation = (node) => {
  const referenceInformation = [];
  // Make sure it is an array.  Then loop through it. If not
  // write the single records and move on.
  if (Array.isArray(node.REF01)) {
    // Use slice to loop until the second-to-last element
    node.REF01.slice(0, -1).forEach((ref01, index) => {
      // For each value in node.REF01, we're going to create a new... OBJECT
      const referenceInformationObject = {};
      referenceInformationObject.referenceIdentificationQualifier = ref01;
      if (node.REF02.length >= index) {
        // If there's a corresponding value in node.REF02, we're going to add that data
        // to the OBJECT
        referenceInformationObject.referenceIdentification =
          node.REF02[index];
      }
      if (node.REF03 && node.REF03.length >= index) {
        // If there's a corresponding value in node.REF03, we're going to add that data
        // to the OBJECT
        referenceInformationObject.description = node.REF03[index];
      }
      // Then we're going to push the OBJECT onto the referenceInformation ARRAY
      referenceInformation.push(referenceInformationObject);
    });
  } else {
    const referenceInformationObject = {};
    referenceInformationObject.referenceIdentificationQualifier =
      node.REF01;
    referenceInformationObject.referenceIdentification = node.REF02;
    referenceInformationObject.description = node.REF03;
    referenceInformation.push(referenceInformationObject);
  }
  return referenceInformation;
};
// End Reference Information

      // DATETIME INFORMATION FUNCTION
      // Run through the Date Arrays to get the DateTimeInformation
      //
      const getDateInformation = (node) => {
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
          });
        } else {
          const dateInformationObject = {};
          dateInformationObject.dateTimeQualifier = node.DTM01;
          dateInformationObject.date = node.DTM02;
          dateInformationObject.description = node.DTM03;
          dateInformation.push(dateInformationObject);
        }
        return dateInformation;
      };
      //
      //  We're going to load the addresses as the array
      //  N1_loop will be needed in the HL_loop array.
      //
      //const addr = [];
      //addr.push(oldRecord[i].N101);
      const N1_loop = [];
      for (let n = 0; n < oldRecord[i].N101.length-1; n++) {
        const addressInformationObject = {};
        const partyIdentificationObject = {};
        addressInformationObject.entityIdentifierCode = oldRecord[i].N101[n];
        addressInformationObject.identificationCodeQualifier = oldRecord[i].N103[n];
        addressInformationObject.identificationCode = oldRecord[i].N104[n];
        partyIdentificationObject.partyIdentification = [addressInformationObject];
        
        if (n === 1) {
          const additionalNameInformationObject = {};
          additionalNameInformationObject.name = oldRecord[i].N301;
          const geographicLocationObject = {};
          geographicLocationObject.cityName = oldRecord[i].N401;
          geographicLocationObject.stateOrProvinceCode = oldRecord[i].N402;
          geographicLocationObject.postalCode = oldRecord[i].N403;
          geographicLocationObject.countryCode = oldRecord[i].N404;
          partyIdentificationObject.additionalNameInformation = [additionalNameInformationObject];
          partyIdentificationObject.geographicLocation = [geographicLocationObject];
        }
        
        if (n === 0) {
          const additionalNameInformationObject = {};
          additionalNameInformationObject.name = '222 Pacific Coast Highway 10th Fl';
          const geographicLocationObject = {};
          geographicLocationObject.cityName = 'El Segundo';
          geographicLocationObject.stateOrProvinceCode = 'CA';
          geographicLocationObject.postalCode = '90245';
          geographicLocationObject.countryCode = 'US';
          partyIdentificationObject.additionalNameInformation = [additionalNameInformationObject];
          partyIdentificationObject.geographicLocation = [geographicLocationObject];
        }


        N1_loop.push(partyIdentificationObject);
      }
      
      // End Address Information

      // Reference Information
      var referenceInformation = getReferenceInformation(oldRecord[i]);
      var dateTimeInformation = getDateInformation(oldRecord[i]);
      HLObject = {};
      var HL_loop = [];
      var hierarchicalLevel = [];
      var hierarchicalLevelObject = {};
      hierarchicalIDShipmentNumber = hierarchicalIDNumberCounter;
      hierarchicalLevelObject.hierarchicalIDNumber =
        hierarchicalIDNumberCounter.toString();
      hierarchicalLevelObject.hierarchicalLevelCode = "S";
      hierarchicalLevel.push(hierarchicalLevelObject);
      // Build the Carrier Details
      var carrierDetailsQuantityAndWeight = [];
      var carrierDetailsQuantityAndWeightObject = {};
      carrierDetailsQuantityAndWeightObject.packagingCode = oldRecord[i].TD101;
      carrierDetailsQuantityAndWeightObject.ladingQuantity = newOptions[bolKey]["shipmentladingQuantity"].toString();
      carrierDetailsQuantityAndWeightObject.weightQualifier =
        oldRecord[i].TD106;
        carrierDetailsQuantityAndWeightObject.weight = Number(newOptions[bolKey]["shipmentWeight"]).toFixed(2);
        carrierDetailsQuantityAndWeightObject.unitOrBasisForMeasurementCode =
        oldRecord[i].TD108;
      carrierDetailsQuantityAndWeight.push({
        carrierDetailsQuantityAndWeightObject,
      });
      // Build the Carrier Routing Sequence
      var carrierDetailsRoutingSequenceTransitTime = [];
      var carrierDetailsRoutingSequenceTransitTimeObject = {};

      carrierDetailsRoutingSequenceTransitTimeObject.routingSequenceCode = oldRecord[i].TD501;
      carrierDetailsRoutingSequenceTransitTimeObject.identificationCodeQualifier = oldRecord[i].TD502;
      carrierDetailsRoutingSequenceTransitTimeObject.identificationCode = oldRecord[i].TD503;
      carrierDetailsRoutingSequenceTransitTimeObject.transportationMethodTypeCode = oldRecord[i].TD504;
      carrierDetailsRoutingSequenceTransitTime.push({
        carrierDetailsRoutingSequenceTransitTimeObject,
      });
      // We will need an Object to Build the HL Loop
      var HLObject = {
        hierarchicalLevel: [],
        carrierDetailsQuantityAndWeight: [],
        carrierDetailsRoutingSequenceTransitTime: [],
        referenceInformation: [],
        dateTimeReference: [],
        N1_loop: [],
      };
      // Now Populate the Object
      HLObject.hierarchicalLevel.push(hierarchicalLevelObject);
      HLObject.carrierDetailsQuantityAndWeight.push(
        carrierDetailsQuantityAndWeightObject,
      );
      HLObject.carrierDetailsRoutingSequenceTransitTime.push(
        carrierDetailsRoutingSequenceTransitTimeObject,
      );
      HLObject.referenceInformation = referenceInformation;
      HLObject.dateTimeReference = dateTimeInformation;
      HLObject.N1_loop = N1_loop;
      // Put the Object in the HL_loop Array
      HL_loop.push(HLObject);
      var blueline = { HL_loop: HL_loop };
      var orderline = {};
      var cartonline = {};
      var itemline = {};

// BEGIN THE PROCESS OF BUILDING THE NEW RECORD OBJECT
// TOP LEVEL
// The Level 1 Object is the BOL, which defines the Shipment Level
      newRecord[bolKey] = {
        sender: { isaId: oldRecord[i].ISA06 },
        receiver: { isaId: oldRecord[i].ISA08 },
        type: { name: oldRecord[i].typeName },
        stream: oldRecord[i].stream,
        dcObj: {},
        message: { transactionSets: [] }

      };
      newRecord[bolKey]["message"]["transactionSets"].push({
        transactionSetHeader,
        beginningSegmentForShipNotice,
        HL_loop,
      });
    }
// STORE LEVEL
// The Level 2 Object is the DC, which defines the DC Level.  No data is needed here.
    if (!newRecord[bolKey]["dcObj"][dcKey]) {


      newRecord[bolKey]["dcObj"][dcKey] = {
        poAndStoreObj: {},
        poAndStoreList: [],
        Package_weight: "0",
      };
    
    }

// ORDER LEVEL
// The Level 3 Object is the PO and Store, which defines the Order Level.  This is where the Orderline is
// built to be added to the HL_loop array.
    if (!newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]) {
      hierarchicalParentIDNumberCounter = hierarchicalIDNumberCounter;
      hierarchicalIDNumberCounter++;
      hierarchicalIDOrderNumber = hierarchicalIDNumberCounter;
      orderline = {};
      newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey] = {
        cartonObj: {},
        cartonList: [],
        Package_weight: "0",
      };


      orderline = {
        hierarchicalLevel: [
          {
            hierarchicalIDNumber: hierarchicalIDNumberCounter.toString(),
            hierarchicalLevelCode: "O",
            hierarchicalParentIDNumber: hierarchicalIDShipmentNumber.toString(),
          },
        ],
        purchaseOrderReference: [
          {
            purchaseOrderNumber: oldRecord[i].PRF01,
          },
        ],
        referenceInformation: [
          {
            referenceIdentificationQualifier: oldRecord[i].REF01[4],
            referenceIdentification: oldRecord[i].REF02[4],
          }
        ],        
        carrierDetailsQuantityAndWeight: [
          {
            packagingCode: oldRecord[i].TD101,
            ladingQuantity: newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderladingQuantity"].toString(),
            weightQualifier: oldRecord[i].TD106,
            weight: newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderWeight"].toString(),
            unitOrBasisForMeasurementCode: oldRecord[i].TD108,
          },
        ],
        N1_loop: [
          {
            partyIdentification: [
              {
                entityIdentifierCode: oldRecord[i].N101[2],
                identificationCodeQualifier: oldRecord[i].N103[2],
                identificationCode: oldRecord[i].N104[2],
              },
            ],
          },
        ],
      };
      newRecord[bolKey]["message"]["transactionSets"][0]["HL_loop"].push(orderline);  
    }

// CARTON LEVEL - This is where the Carton is built to be added to the HL_loop array.
    if (!newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["cartonObj"][cartonKey]) {
      //
      hierarchicalParentIDNumberCounter = hierarchicalIDNumberCounter;
      hierarchicalIDNumberCounter++;
      cartonline = {};
      newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey][
        "cartonObj"
      ][cartonKey] = {
        itemObj: {},
        itemList: [],
      };
      cartonline = {
        hierarchicalLevel: [
          {
            hierarchicalIDNumber: hierarchicalIDNumberCounter.toString(),
            hierarchicalLevelCode: "P",
            hierarchicalParentIDNumber: hierarchicalIDOrderNumber.toString(),
          },
        ],
        marksAndNumbersInformation: [
          {
            marksAndNumbersQualifier: oldRecord[i].MAN01,
            marksAndNumbers: oldRecord[i].MAN02,
          },
        ],
      };
      newRecord[bolKey]["message"]["transactionSets"][0]["HL_loop"].push(cartonline);
    }

// ITEM LEVEL - This is where the Item is built to be added to the HL_loop array.
    if (!newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["cartonObj"][cartonKey]["itemObj"][itemKey]) {
      hierarchicalParentIDNumberCounter = hierarchicalIDNumberCounter;
      hierarchicalIDNumberCounter++;
      itemline = {};
      newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["cartonObj"][cartonKey]["itemObj"][itemKey] = {
        endObj: {},
      };
      itemline = {
        hierarchicalLevel: [
          {
            hierarchicalIDNumber: hierarchicalIDNumberCounter.toString(),
            hierarchicalLevelCode: "I",
            hierarchicalParentIDNumber:
              hierarchicalParentIDNumberCounter.toString(),
          },
        ],
        itemIdentification: [
          {
            productServiceIDQualifier: oldRecord[i].LIN02,
            productServiceID: oldRecord[i].LIN03,
            productServiceIDQualifier1: oldRecord[i].LIN04,
            productServiceID1: oldRecord[i].LIN05,
          },
        ],
        itemDetailShipment: [
          {
            unitOrBasisForMeasurementCode: oldRecord[i].SN103,
            numberOfUnitsShipped: oldRecord[i].SN102,
          },
        ],
      };
      newRecord[bolKey]["message"]["transactionSets"][0]["HL_loop"].push(
        itemline,
      );
    }
//
// Mapping = This is where the data from the LOOPS is pushed into the newRecord Object
// BOL Mapping
    newRecord[bolKey]["dcObj"] = newRecord[bolKey]["dcObj"][dcKey];

// combine by DC
// DC mapping - pushing the Order Line
    let bolWeight = String(
      (
        Number(newRecord[bolKey]["dcObj"].Package_weight) +
        Number(oldRecord[i].TD107)
      ).toFixed(2),
    );
    newRecord[bolKey]["dcObj"][dcKey] = {
      poAndStoreObj: newRecord[bolKey]["dcObj"]["poAndStoreObj"][poAndStoreKey],
      poAndStoreList: [],
    };

// Carton Mapping - pushing the Carton Line
    newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey] = {
      StoreCode: oldRecord[i].N104[1],
      DCCODE: oldRecord[i].N104[0],
      Package_weight: oldRecord[i].TD107,
      PO: oldRecord[i].PRF01,
      cartonObj: {},
      cartonList: [],
    };



  }
  return {UpdateRecordsArray,hierarchicalIDNumberCounter};
}
///////// END CELIGO CODE /////////////////////////


