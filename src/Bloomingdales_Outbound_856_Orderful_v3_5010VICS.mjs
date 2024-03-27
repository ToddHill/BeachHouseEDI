// Version: 1.3.1
import options from './Bloomingdales_856_data.json' assert { type: "json" };
preSavePage(options);
/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// Everything BELOW this block goes to Celigo.  Everything ABOVE this block is development //
// information used for populating and executing this script by creating an environment    //
// That Simulates Celigo Data as Celigo Delivers it, and executes the PreSavePage as       //
// Celigo would. Everything BELOW this is the contents of the MacysNet 856 Script          //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
// The BOL (Bill of Lading) is the Primary Key Object.                                     //
// Within the BOL, it is separated by DC (Distribution Center),                            //
// within the DC it is separated by PO/Store (Purchase Order/Store),                       //  
// within the PO and Store the cartons are contained.                                      //
// Within the cartons which contain the Carton IDs, we find the items.                     //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
/*
Release History:
1.0.0 - 2024-01-27 - Initial Release
1.0.1 - 2024-01-29 - Added the newObject to the preSavePage function to collect counts of the number of lines and the total weight of the shipment.
1.0.2 - 2024-01-30 - Added the total transaction lines to the newObject.
1.0.3 - 2024-01-30 - placed total transaction lines in the correct location.
1.0.4 - 2024-01-30 - removed the total transaction lines from the newObject.  they just won't hunt
1.0.5 - 2024-01-30 - set shipping weight using toFixed(2) to eliminate extra decimals. Ended up with entirely new variable to do this.
1.1.0 - 2024-02-08 - Added updaterec to the Response Object for updating the record in NetSuite.
1.2.0 - 2024-03-08 - Added objects to the updaterec from the UpdateRecordsArray to be sent to NetSuite.
1.3.0 - 2024-03-25 - Added the UpdateRecordsArray to the preSavePage function to collect the updateid for the updaterec object.
1.3.1 - 2024-03-25 - Brought the decimals to two and added the total lines
*/

function preSavePage(options) {
  let UpdateRecordsArray = [];
  let newRecord = {};
  let newOptions = {};
  let oldRecord = options.data;
  let responseData = [];
  let totalLines = 0;
  let hierarchicalIDNumberCounter = 0;


  // Execute Combination of Records into Separate Documents
  // Based on Keys we've set.

 UpdateRecordsArray = combineByBol(oldRecord, newRecord, newOptions, hierarchicalIDNumberCounter, UpdateRecordsArray);

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
    console.log(totalLines);
    // Add the total transaction lines to the newRecord object
    let numberOfLines = totalLines.toString();
    newRecord[bolKey]["message"]["transactionSets"][0]["transactionTotals"] = [];
    newRecord[bolKey]["message"]["transactionSets"][0]["transactionTotals"].push({numberOfLineItems: numberOfLines});
    newRecord[bolKey]["dcObj"] = undefined;


    
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

// THIS IS WHERE THE LOOPS ARE BUILT

function combineByBol(oldRecord, newRecord, newOptions) {
  let UpdateRecordsArray = [];  
// set up the newOptions object to hold the shipmentladingQuantity and shipmentWeight
  let shipmentladingQuantity = 0;
  let shipmentWeight = 0;
  let orderladingQuantity = 0;
  let orderWeight = 0;
  let totalLines = 0;
  let seenSOIds = new Set();
  
  for (let i = 0; i < oldRecord.length; i++) {
    let bolKey = oldRecord[i].BSN02;
    let dcKey = oldRecord[i].N104[0];
    let poAndStoreKey = oldRecord[i].PRF01 + "-" + oldRecord[i].N104[1];
    let cartonKey = oldRecord[i].MAN02;
    let itemKey = oldRecord[i].LIN03;
    let SOId = oldRecord[i].updaterec;
    if (!seenSOIds.has(SOId)) {
        UpdateRecordsArray.push({ updateid: SOId });
        seenSOIds.add(SOId);
    }
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

    if (
      !newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey][
        "cartonObj"
      ][cartonKey]
    ) {
      newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey][
        "cartonObj"
      ][cartonKey] = {
        itemObj: {},
        itemList: [],
      };
// update the shipmentladingQuantity and shipmentWeight
      var shortWeight = parseFloat(oldRecord[i].TD107);
      shortWeight = parseFloat(shortWeight.toFixed(2));
      newOptions[bolKey]["shipmentladingQuantity"] = newOptions[bolKey]["shipmentladingQuantity"] + 1;
      newOptions[bolKey]["shipmentWeight"] = newOptions[bolKey]["shipmentWeight"] + shortWeight;
// update the orderladingQuantity and orderWeight
      newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderladingQuantity"] = newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderladingQuantity"] + 1;
      newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderWeight"] = newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["orderWeight"] + shortWeight;
    }

    if (
      !newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey][
        "cartonObj"
      ][cartonKey]["itemObj"][itemKey]
    ) {
      newOptions[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey][
        "cartonObj"
      ][cartonKey]["itemObj"][itemKey] = {
        endObj: {},
      };
    }

  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  // Loop through the options.data to combine records with the same                                  //
  // BOL number into a new object to be sent to Orderful                                             //
  // set 'keys' for BOL (Shipment Level), then DC (Same Shipment), then PO & Store (Order Level)     //
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  // Initialize the Hierarchical ID Number Counter
  let hierarchicalIDNumberCounter = 0;
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
    let poAndStoreKey = oldRecord[i].PRF01 + "-" + oldRecord[i].N104[1];
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
              referenceInformationObject.description = node.REF03[index];
            }
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
          dateInformationObject.dateTime = node.DTM02;
          dateInformationObject.description = node.DTM03;
          dateInformation.push(dateInformationObject);
        }
        return dateInformation;
      };
      //
      //  We're going to load the addresses as the array
      //  N1_loop will be needed in the HL_loop array.
      //
      const addr = [];
      addr.push(oldRecord[i].N101);
      const N1_loop = [];
      const addressInformation = [];
      let addressInformationObject = {};
      let partyIdentificationObject = {};
      let geographicLocationItem = {};
      let geographicLocationObject = {};
        addressInformationObject.entityIdentifierCode = oldRecord[i].N101[0];
        addressInformationObject.name = oldRecord[i].N102[0];
        addressInformationObject.identificationCodeQualifier = oldRecord[i].N103[0];
        addressInformationObject.identificationCode = oldRecord[i].N104[0];
        addressInformation.push(addressInformationObject);
        partyIdentificationObject.partyIdentification = [
          addressInformationObject,
        ];
        N1_loop.push(partyIdentificationObject);
        addressInformationObject = {};
        partyIdentificationObject = {};
        
        geographicLocationItem = {};
        addressInformationObject.entityIdentifierCode = oldRecord[i].N101[2];
        addressInformationObject.name = oldRecord[i].N102[2];
        addressInformationObject.identificationCodeQualifier = oldRecord[i].N103[2];
        addressInformationObject.identificationCode = oldRecord[i].N104[2];
        addressInformation.push(addressInformationObject);

        partyIdentificationObject.partyIdentification = [
          addressInformationObject,
        ];
        geographicLocationItem.cityName = oldRecord[i].N401;
        geographicLocationItem.stateOrProvinceCode = oldRecord[i].N402;
        partyIdentificationObject.geographicLocation = [
          geographicLocationItem
        ];
        N1_loop.push(partyIdentificationObject); 
           
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
      carrierDetailsQuantityAndWeightObject.weight = oldRecord[i].TD107;
      carrierDetailsQuantityAndWeightObject.unitOrBasisForMeasurementCode =
        oldRecord[i].TD108;
      carrierDetailsQuantityAndWeight.push({
        carrierDetailsQuantityAndWeightObject,
      });
      // Build the Carrier Routing Sequence
      var carrierDetailsRoutingSequenceTransitTime = [];
      var carrierDetailsRoutingSequenceTransitTimeObject = {};
      carrierDetailsRoutingSequenceTransitTimeObject.transportationMethodTypeCode =
        oldRecord[i].TD504;
      carrierDetailsRoutingSequenceTransitTimeObject.routing =
        oldRecord[i].TD505;
      carrierDetailsRoutingSequenceTransitTimeObject.shipmentOrderStatusCode =
        oldRecord[i].TD506;
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
      //
      hierarchicalParentIDNumberCounter = hierarchicalIDNumberCounter;
      hierarchicalIDNumberCounter++;
      hierarchicalIDOrderNumber = hierarchicalIDNumberCounter;

      //
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
        productItemDescription: [
          {
            agencyQualifierCode: oldRecord[i].PID03,
            itemDescriptionTypeCode: oldRecord[i].PID01,
            productDescriptionCode: oldRecord[i].PID04,
          },
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
                identificationCode: oldRecord[i].N104[1],
                entityIdentifierCode: oldRecord[i].N101[1],
                identificationCodeQualifier: oldRecord[i].N103[1],
              },
            ],
          },
        ],
      };
      newRecord[bolKey]["message"]["transactionSets"][0]["HL_loop"].push(
        orderline,
      );
    }

// CARTON LEVEL - This is where the Carton is built to be added to the HL_loop array.
    if (!newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["cartonObj"][cartonKey]) {
      //
      hierarchicalParentIDNumberCounter = hierarchicalIDNumberCounter;
      hierarchicalIDNumberCounter++;
      //
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
    }

// ITEM LEVEL - This is where the Item is built to be added to the HL_loop array.
    if (!newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey]["cartonObj"][cartonKey]["itemObj"][itemKey]) {
      hierarchicalParentIDNumberCounter = hierarchicalIDNumberCounter;
      hierarchicalIDNumberCounter++;
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
    }
//
//
// I need to include the UpdateRec in the newRecord Object so I can use it to update the records in NetSuite.


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
    newRecord[bolKey]["message"]["transactionSets"][0]["HL_loop"].push(
      cartonline,
    );
    newRecord[bolKey]["message"]["transactionSets"][0]["HL_loop"].push(
      itemline,
    );

  }
  return UpdateRecordsArray;
}
