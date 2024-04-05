/////////////////////////////////// BEGIN DEVELOPMENT CODE ///////////////////////////////////
import options from './data/Bloomingdales_850_data.json' assert { type: "json" };
preSavePage(options);
console.log(JSON.stringify(options, null, 2));
/*
MACYSNET INBOUND 850 ORDERFUL V3 5010VICS

This is an import script originally for Bloomingdales/Beis Integration to import 850 JSON
From Orderful.  This should be functional for ALL MacysNet 850 JSON files using 5010VICS.

*/
/////////////////////////////////// END DEVELOPMENT CODE ///////////////////////////////////
////////////////////////////////// BEGIN CELIGO CODE ///////////////////////////////////
function preSavePage(options) {
    if (options.data === undefined || options.data.length === 0) {
      return {
        data: [],
        errors: [],
        abort: false
      }
    }
    else {
    const approval = options.data[0].delivery.approve.href;
    var approved = approval.substring(24);
    for (let i = 0; i < options.data.length; i++) {
      let salesorders = [];
      let identificationCode;
  // loop through transactionSets
      for (let j = 0; j < options.data[i].message.transactionSets.length; j++) {
        let record = options.data[i].message.transactionSets[j];
  // parse out refenceIdentification section with qualifiers, specifically departmentNumber & retailersPONumber
        for (let k = 0; k < record.referenceInformation.length; k++) {
          if (record.referenceInformation[k].referenceIdentificationQualifier === 'DP') {
            record.departmentNumber = record.referenceInformation[k].referenceIdentification;
          } else if (record.referenceInformation[k].referenceIdentificationQualifier === 'CO') {
            record.retailersPONumber = record.referenceInformation[k].referenceIdentification;
          }
        }
  // parse out dateTimeReference header segment for cancelByDate and shipNotBefore
        for (let k = 0; k < record.dateTimeReference.length; k++) {
          if (record.dateTimeReference[k].dateTimeQualifier === '001') {
            record.cancelByDate = convertDate(record.dateTimeReference[k].date);
          } else if (record.dateTimeReference[k].dateTimeQualifier === '037') {
            record.shipNotBefore = convertDate(record.dateTimeReference[k].date);
            record.requestedShip = convertDate(record.dateTimeReference[k].date);
          } else if (record.dateTimeReference[k].dateTimeQualifier === '038') {
            record.shipNoLater = convertDate(record.dateTimeReference[k].date);
            record.cancelByDate = convertDate(record.dateTimeReference[k].date);
          } else if (record.dateTimeReference[k].dateTimeQualifier === '010') {
            record.requestedShip = convertDate(record.dateTimeReference[k].date);
          } else if (record.dateTimeReference[k].dateTimeQualifier === '064') {
            record.DoNotDeliverBefore = convertDate(record.dateTimeReference[k].date);
            record.requestedShip = convertDate(record.dateTimeReference[k].date);
          } else if (record.dateTimeReference[k].dateTimeQualifier === '002') {
            record.DeliveryRequested = convertDate(record.dateTimeReference[k].date);
            record.requestedShip = convertDate(record.dateTimeReference[k].date);
          } else if (record.dateTimeReference[k].dateTimeQualifier === '118') {
            record.RequestedPickup = convertDate(record.dateTimeReference[k].date);
            record.requestedShip = convertDate(record.dateTimeReference[k].date);
          } else if (record.dateTimeReference[k].dateTimeQualifier === '063') {
            record.DoNotDeliverAfter = convertDate(record.dateTimeReference[k].date);
            record.cancelByDate = convertDate(record.dateTimeReference[k].date);
          }
        }
  // Retrieve Information to asses single vs multiple sales orders
        if (!record.PO1_loop[0].destinationQuantity) {
  // set header level fields for single sales order in sales order array
          salesorders.push({
            purchaseOrderNumber: record.beginningSegmentForPurchaseOrder[0].purchaseOrderNumber,
            identificationCode: identificationCode,
            dcCode: identificationCode,
            departmentNumber: record.departmentNumber,
            retailersPONumber: record.retailersPONumber,
            cancelByDate: record.cancelByDate,
            shipNotBefore: record.shipNotBefore,
            shipNoLater: record.shipNoLater,
            DoNotDeliverBefore: record.DoNotDeliverBefore,
            DeliveryRequested: record.DeliveryRequested,
            RequestedPickup: record.RequestedPickup,
            DoNotDeliverAfter: record.DoNotDeliverAfter,
            requestedShip: record.requestedShip
          })
          salesorders[salesorders.length - 1].items = [];
        }
  
  // loop through items loop
        for (let k = 0; k < record.PO1_loop.length; k++) {
  // create and assign holding item object
          let item = {};
          Object.assign(item, record.PO1_loop[k].baselineItemData[0]);
  // retrieve UPC data from productServiceIDs
          let b = 0;
          do {
            if (b === 0) {
              if (item.productServiceIDQualifier === 'UP') {
                item.UPC = item.productServiceID;
              }else if (item.productServiceIDQualifier === 'VA') {
                item.sku = item.productServiceID;
              }
            } else {
              if (item[`productServiceIDQualifier${b}`] === 'UP') {
                item.UPC = item[`productServiceID${b}`];
              } if (item[`productServiceIDQualifier${b}`] === 'VA') {
                item.sku = item[`productServiceID${b}`];
              }
            }
            b++;
          } while (typeof item[`productServiceIDQualifier${b}`] !== 'undefined')
  // get purchase order number and set it to item holding object for later use
          item.purchaseOrderNumber = record.beginningSegmentForPurchaseOrder[0].purchaseOrderNumber;
  // get and set item description
          item.description = "";
          if (record.PO1_loop[k].PID_loop) {
            for (let a = 0; a < record.PO1_loop[k].PID_loop.length; a++) {
              item.description += record.PO1_loop[k].PID_loop[a].productItemDescription[0].description;
              if (a !== record.PO1_loop[k].PID_loop.length - 1) {
                item.description += " ";
              }
            }
          }
  // get unit price from baselineItemData
          item.unitPrice = record.PO1_loop[k].baselineItemData[0].unitPrice ? record.PO1_loop[k].baselineItemData[0].unitPrice : "";
  // if there is no destination quantity, Push in all items into single salesorder, it is not multiple.
          if (record.PO1_loop[k].destinationQuantity === undefined) {
            salesorders[j].items.push(item);
            continue;
          }
  // On the other hand, if destinationQuantity exists, loop through and sort items
          for (let a = 0; a < record.PO1_loop[k].destinationQuantity.length; a++) {
            let m = 0;
            let quantity;
            let identificationCode1; // store code
            let dcCode; // distribution center code
            do {
              // grab quantity, store code, and dc code
              if (m === 0) {
                quantity = record.PO1_loop[k].destinationQuantity[a].quantity;
                identificationCode1 = record.PO1_loop[k].destinationQuantity[a].identificationCode ? record.PO1_loop[k].destinationQuantity[a].identificationCode.split('/')[0] : "";
                if (record.PO1_loop[k].destinationQuantity[a].identificationCode) {
                  if (record.PO1_loop[k].destinationQuantity[a].identificationCode.split('/')[1]) {
                    dcCode = record.PO1_loop[k].destinationQuantity[a].identificationCode.split('/')[1];
                    dcCode = record.N1_loop[0].partyIdentification[0].identificationCode;
                  }
                }
              } else {
                quantity = record.PO1_loop[k].destinationQuantity[a]['quantity' + m];
                identificationCode1 = record.PO1_loop[k].destinationQuantity[a]['identificationCode' + m] ? record.PO1_loop[k].destinationQuantity[a]['identificationCode' + m].split('/')[0] : "";
                if (record.PO1_loop[k].destinationQuantity[a]['identificationCode' + m].split('/')[1]) {
                  dcCode = record.PO1_loop[k].destinationQuantity[a]['identificationCode' + m].split('/')[1];
                  dcCode = record.N1_loop[0].partyIdentification[0].identificationCode;
                }
              }
  // check to see if a sales order with matching store code and purchase order number already exist
  // if sales order exists, add item to existing sales order
          let exists = false;
            for (let n = 0; n < salesorders.length; n++) {
              if (identificationCode1 === salesorders[n].identificationCode && item.purchaseOrderNumber === salesorders[n].purchaseOrderNumber) {
                  exists = true;
                  salesorders[n].items.push({});
                  Object.assign(salesorders[n].items[salesorders[n].items.length - 1], item);
                  salesorders[n].items[salesorders[n].items.length - 1].quantity = quantity;
                  salesorders[n].items[salesorders[n].items.length - 1].identificationCode = identificationCode1;
                  salesorders[n].items[salesorders[n].items.length - 1].dcCode = dcCode;
                  break;
                }
              }
  // if sales order does not exist, set header level fields and push first item
              if (!exists) {
                salesorders.push({
                  identificationCode: identificationCode1,
                  dcCode: dcCode,
                  purchaseOrderNumber: item.purchaseOrderNumber,
                  departmentNumber: record.departmentNumber,
                  internalVendorNum: record.internalVendorNum,
                  cancelByDate: record.cancelByDate,
                  shipNotBefore: record.shipNotBefore,
                  shipNoLater: record.shipNoLater,
                  DoNotDeliverBefore: record.DoNotDeliverBefore,
                  DeliveryRequested: record.DeliveryRequested,
                  RequestedPickup: record.RequestedPickup,
                  DoNotDeliverAfter: record.DoNotDeliverAfter,                
                  requestedShip: record.requestedShip,
                  items: [{}]
                });
  // add first item to new sales order
                Object.assign(salesorders[salesorders.length - 1].items[0], item);
                salesorders[salesorders.length - 1].items[0].quantity = quantity;
                salesorders[salesorders.length - 1].items[0].identificationCode = identificationCode1;
                salesorders[salesorders.length - 1].items[0].dcCode = dcCode;
              }
              m++
            } while (typeof record.PO1_loop[k].destinationQuantity[a]['identificationCode' + m] !== 'undefined');
  // break loop when no more items in destinationQuantity remain to be parsed
          }
        }
  // add salesorders array to data to be returned
        options.data[i].salesorders = salesorders;
      }
    }
    
  options.data[0].approved = approved;
    
    return {
      data: options.data,
      errors: options.errors,
      abort: false
    }
  }
}
function convertDate(date) {
    // EDI Dates need to be converted into NetSuite dates
    // We slice the incoming YYYYMMDD into variables and
    // then reassemble them with slashes for a corrected
    // format of MM/DD/YYYY
    var year = date.slice(0, 4);
    var month = date.slice(4, 6);
    var day = date.slice(6, 8);
    return `${month}/${day}/${year}`;
}
////////////////////////////////// END CELIGO CODE ///////////////////////////////////