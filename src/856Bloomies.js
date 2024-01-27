//
// Development Setup for 856
// includes options.data as inclusive to simulate
// Celigo Setup
// Begin By Loading options.data

const options = {
  data: [
    {
      id: "33343249",
      recordType: "itemfulfillment",
      updaterec: "33342646",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test",
      BSN03: "20231218",
      BSN04: "111211",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: "5",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test",
      DTM01: ["011", "067"],
      DTM02: ["20231218", "20231220"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Secaucus DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["SC", "0001", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "00008100128601750001",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33343249&compid=4675206_SB1",
    },
    {
      id: "33343250",
      recordType: "itemfulfillment",
      updaterec: "33342649",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test",
      BSN03: "20231218",
      BSN04: "111241",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: ".01",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test",
      DTM01: ["011", "067"],
      DTM02: ["20231218", "20231226"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Secaucus DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["SC", "0004", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "00008100128601750002",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33343250&compid=4675206_SB1",
    },
    {
      id: "33343251",
      recordType: "itemfulfillment",
      updaterec: "33342651",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test",
      BSN03: "20231218",
      BSN04: "111204",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: ".01",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test",
      DTM01: ["011", "067"],
      DTM02: ["20231218", "20231228"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Secaucus DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["SC", "0006", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "00008100128601750004",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33343251&compid=4675206_SB1",
    },
    {
      id: "33343252",
      recordType: "itemfulfillment",
      updaterec: "33342650",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test",
      BSN03: "20231218",
      BSN04: "111212",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: ".01",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test",
      DTM01: ["011", "067"],
      DTM02: ["20231218", "20231226"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Secaucus DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["SC", "0005", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "00008100128601750003",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33343252&compid=4675206_SB1",
    },
    {
      id: "33343253",
      recordType: "itemfulfillment",
      updaterec: "33342654",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test",
      BSN03: "20231218",
      BSN04: "111222",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: ".01",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test",
      DTM01: ["011", "067"],
      DTM02: ["20231218", "20231226"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Secaucus DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["SC", "0024", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "00008100128601750005",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33343253&compid=4675206_SB1",
    },
    {
      id: "33344463",
      recordType: "itemfulfillment",
      updaterec: "33342655",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test2",
      BSN03: "20240103",
      BSN04: "080104",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: ".01",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test2",
      DTM01: ["011", "067"],
      DTM02: ["20240103", "20240108"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Stone Mountain DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["ST", "0055", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "00008100128601750006",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33344463&compid=4675206_SB1",
    },
    {
      id: "33344465",
      recordType: "itemfulfillment",
      updaterec: "33342653",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test2",
      BSN03: "20240103",
      BSN04: "080121",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: ".01",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test2",
      DTM01: ["011", "067"],
      DTM02: ["20240103", "20240108"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Stone Mountain DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["ST", "0020", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "00008100128601750007",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33344465&compid=4675206_SB1",
    },
    {
      id: "33344467",
      recordType: "itemfulfillment",
      updaterec: "33342652",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test2",
      BSN03: "20240103",
      BSN04: "090135",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: ".01",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test2",
      DTM01: ["011", "067"],
      DTM02: ["20240103", "20240108"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Stone Mountain DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["ST", "0010", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "00008100128601750009",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33344467&compid=4675206_SB1",
    },
    {
      id: "33344469",
      recordType: "itemfulfillment",
      updaterec: "33342648",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test2",
      BSN03: "20240103",
      BSN04: "090157",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: ".01",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test2",
      DTM01: ["011", "067"],
      DTM02: ["20240103", "20240108"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Stone Mountain DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["ST", "0003", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "00008100128601750008",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33344469&compid=4675206_SB1",
    },
    {
      id: "33344471",
      recordType: "itemfulfillment",
      updaterec: "33342647",
      ISA06: "BHGBEIS",
      ISA08: "6113310072",
      typeName: "856_SHIP_NOTICE_MANIFEST",
      stream: "Test",
      BSN01: "00",
      BSN02: "0123456789-test2",
      BSN03: "20240103",
      BSN04: "090133",
      TD101: "CTN25",
      TD102: "0",
      TD106: "G",
      TD107: ".01",
      TD108: "LB",
      TD504: "M",
      TD505: "TODD",
      TD506: "CC",
      REF01: "BM",
      REF02: "0123456789-test2",
      DTM01: ["011", "067"],
      DTM02: ["20240103", "20240108"],
      FOB01: "CC",
      N101: ["ST", "BY", "SF"],
      N102: ["Stone Mountain DC", "Bloomingdales", "Beis"],
      N103: ["92", "92", "92"],
      N104: ["ST", "0002", "99999"],
      PRF01: "5105203",
      PRF04: "20231215",
      N401: "El Segundo",
      N402: "CA",
      MAN01: "GM",
      MAN02: "000081001286017500010",
      PID01: "S",
      PID03: "VI",
      PID04: "FL",
      LIN02: "UP",
      LIN03: "810012865272",
      LIN04: "VA",
      LIN05: "BEIS223428",
      SN102: "1",
      SN103: "EA",
      dataURI:
        "https://4675206-sb1.app.netsuite.com/app/accounting/transactions/itemship.nl?id=33344471&compid=4675206_SB1",
    },
  ],
};
preSavePage(options);

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// Below is what goes to Celigo.  Everything ABOVE this line is development                //
// information used for populating and executing this script by creating an environment    //
// That Simulates Celigo Data as Celigo Delivers it, and executes the PreSavePage as       //
// Celigo would. Everything BELOW this is the contents of the 856 Script                   //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
/*

The Plan: Organize Data into following structure

bol > DC > po and store > carton > item

Required Object Structure when completed looks like this:

  {
    [
      {
        bol: {

                [{
                    poAndStoreList :
                    [{
                        cartonList :
                        [{
                            item : {}
                        }]
                    }]
                }]
             }
      }
    ]
  }

Make particular note of what is an Object, and what is an array.
The BOL is the Primary Key Object.  
Within the BOL, it is separated by DC, 
within the DC it is separated by PO/Store, 
within the PO and Store the cartons are contained.  
Within the cartons which contain the Carton IDs, we find the items.

*/

function preSavePage(options) {
  let newRecord = {};
  let newOptions = {};
  let oldRecord = options.data;
  let responseData = [];
  let totalLines = 0;
  // Execute Combination of Records into Separate Documents
  // Based on Keys we've set.

  combineByBol(oldRecord, newRecord, newOptions);

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

    responseData.push(newRecord[bolKey]);
  }

  console.log(JSON.stringify(responseData, undefined, 2));

  return {
    data: responseData,
    errors: options.errors,
    abort: false,
  };
}

// THIS IS WHERE THE LOOPS ARE BUILT

function combineByBol(oldRecord, newRecord, newOptions) {
  // find a way to get the ladingQuantity
  // and the weight.
  // NEW.OPTIONS is the object to cath the items.
  for (let i = 0; i < oldRecord.length; i++) {
    let bolKey = oldRecord[i].BSN02;
    if (!newOptions[bolKey]) {
      newOptions[bolKey] = {};
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
        Package_weight: "0",
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
  // Transaction Sets                                                                                //
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  let hierarchicalIDNumberCounter = 0;
  let hierarchicalParentIDNumberCounter = 0;
  let hierarchicalIDShipmentNumber = 0;
  let hierarchicalIDOrderNumber = 0;
  for (let i = 0; i < oldRecord.length; i++) {
    let bolKey = oldRecord[i].BSN02;
    let dcKey = oldRecord[i].N104[0];
    let poAndStoreKey = oldRecord[i].PRF01 + "-" + oldRecord[i].N104[1];
    let cartonKey = oldRecord[i].MAN02;
    let itemKey = oldRecord[i].LIN03;

    //Initializing
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
      for (let n = 0; n < oldRecord[i].N101.length; n++) {
        const addressInformationObject = {};
        const partyIdentificationObject = {};
        addressInformationObject.entityIdentifierCode = oldRecord[i].N101[n];
        addressInformationObject.name = oldRecord[i].N102[n];
        addressInformationObject.identificationCodeQualifier =
          oldRecord[i].N103[n];
        addressInformationObject.identificationCode = oldRecord[i].N104[n];
        addressInformation.push(addressInformationObject);
        partyIdentificationObject.partyIdentification = [
          addressInformationObject,
        ];
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
      carrierDetailsQuantityAndWeightObject.ladingQuantity = "";
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

      // TOP LEVEL
      newRecord[bolKey] = {
        sender: { isaId: oldRecord[i].ISA06 },
        receiver: { isaId: oldRecord[i].ISA08 },
        type: { name: oldRecord[i].typeName },
        stream: oldRecord[i].stream,
        dcObj: {},
        message: { transactionSets: [] },
      };
      newRecord[bolKey]["message"]["transactionSets"].push({
        transactionSetHeader,
        beginningSegmentForShipNotice,
        HL_loop,
      });
    }

    // STORE LEVEL
    if (!newRecord[bolKey]["dcObj"][dcKey]) {
      newRecord[bolKey]["dcObj"][dcKey] = {
        poAndStoreObj: {},
        poAndStoreList: [],
        Package_weight: "0",
      };
    }

    // ORDER LEVEL
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
            ladingQuantity: oldRecord[i].TD102,
            weightQualifier: oldRecord[i].TD106,
            weight: oldRecord[i].TD107,
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
    }

    // Carton Level
    if (
      !newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey][
        "cartonObj"
      ][cartonKey]
    ) {
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

    // Item Level
    if (
      !newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey][
        "cartonObj"
      ][cartonKey]["itemObj"][itemKey]
    ) {
      hierarchicalParentIDNumberCounter = hierarchicalIDNumberCounter;
      hierarchicalIDNumberCounter++;
      newRecord[bolKey]["dcObj"][dcKey]["poAndStoreObj"][poAndStoreKey][
        "cartonObj"
      ][cartonKey]["itemObj"][itemKey] = {
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

    //Mapping
    //BOL Mapping
    newRecord[bolKey]["dcObj"] = newRecord[bolKey]["dcObj"][dcKey];

    //combine by DC
    //DC mapping
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
    newRecord[bolKey]["message"]["transactionSets"][0]["HL_loop"].push(
      orderline,
    );

    //    PO and Store mapping
    //  let poAndStoreWeight = String( (Number(newRecord[bolKey]['dcObj'][dcKey]['poAndStoreObj'][poAndStoreKey].Package_weight) + Number(oldRecord[i].TD107)).toFixed(2) );
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
}
