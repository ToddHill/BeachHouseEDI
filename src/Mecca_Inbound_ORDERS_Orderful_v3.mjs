/*
Import the Mecca Orders
convert them to easier to manage JSON
convert the dates as well
*/
function preSavePage(options) {
  // Check if the data array is empty or undefined and return early if true
  if (!options.data || options.data.length === 0) {
    return {
      data: [],  // Return empty data array
      errors: options.errors,
      abort: false,
      newErrorsAndRetryData: []
    };
  }

  // Continue with the existing function implementation if there is data
  const MainObject = {};
  const DataObject = {};
  var EntityID = "";
  var BrandID = "";
  var ShipMethodID = "";
  
  const Information = options.data[0];
  const Dates = Information.message.dateTimePeriod;
  const Totals = Information.message.summary_group.monetaryAmount;
  const deliveryId = Information.id;
  const RetailerEDI = Information.receiver.isaId;

  if (RetailerEDI === "BEACHHOUSEMOON") {
    EntityID = "2277338";
    BrandID = "62";
    ShipMethodID = "49536";
  }

  if (RetailerEDI === "BHGNOYZ") {
    EntityID = "2314095";
    BrandID = "111";
    ShipMethodID = "55278";    
  }

  const Message = Information.message.freeText;
  var TextNote = Message[0].textLiteral_composite;
  var FinalNote = TextNote.freeText;
  const Addresses = Information.nameAndAddress_group;
  const Currency = Information.currencies_group;

  var orderDate = "";
  var shipDate = "";

  const getDateInformation = node => {
    node.forEach((record, index) => {
      if (record.dateTimePeriod_composite.dateOrTimeOrPeriodFunctionCodeQualifier == '137') {
        orderDate = convertDate(record.dateTimePeriod_composite.dateOrTimeOrPeriodText);
        return orderDate;
      } else if (record.dateTimePeriod_composite.dateOrTimeOrPeriodFunctionCodeQualifier == '10') {
        shipDate = convertDate(record.dateTimePeriod_composite.dateOrTimeOrPeriodText);
        return shipDate;
      }
    });
  };

  var datestuff = getDateInformation(Dates);

  const items = [];
  const itemGroup = Information.message.lineItem_group;

  const getItems = node => {
    node.forEach((record, index) => {
      var itemObject = {};
      itemObject.linenumber = index + 1;
      itemObject.lineitemid = record.lineItem.lineItemId;
      record.additionalProductId.forEach((qualifier, count) => {
        if (qualifier.itemNumberId_composite.itemTypeIdCode == 'IN') {
          itemObject.BPN = qualifier.itemNumberId_composite.itemId;
        } else if (qualifier.itemNumberId_composite.itemTypeIdCode == 'SA') {
          itemObject.Item = qualifier.itemNumberId_composite.itemId;
        }
      });
      itemObject.description = record.itemDescription[0].itemDescription_composite.itemDescription;
      itemObject.quantity = record.quantity[0].quantityDetails_composite.quantity;
      record.monetaryAmount.forEach((money, each) => {
        if (money.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == '128') {
          itemObject.TotalAmount = money.monetaryAmount_composite.monetaryAmount;
        } else if (money.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == '369') {
          itemObject.GSTTax = money.monetaryAmount_composite.monetaryAmount;
        }
      });
      itemObject.price = record.priceDetails_group[0].priceDetails.priceInformation_composite.priceAmount;
      items.push(itemObject);
    });
  };

  var itemstuff = getItems(itemGroup);

  const cancelbyDate = new Date(shipDate);
  cancelbyDate.setDate(cancelbyDate.getDate() + 5);
  const day = cancelbyDate.getDate();
  const month = cancelbyDate.getMonth() + 1;
  const year = cancelbyDate.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;  
  var canceled = formattedDate;

  MainObject.EntityID = EntityID;
  MainObject.purchaseOrder = Information.businessNumber;
  MainObject.TextNote = FinalNote;
  MainObject.orderDate = orderDate;
  MainObject.shipDate = shipDate;
  MainObject.cancelbyDate = canceled;
  MainObject.BrandID = BrandID;
  MainObject.ShipMethodID = ShipMethodID;
  MainObject.items = items;

  const getTotals = node => {
    var invoicetotal = "";
    var merchtotal = "";
    var taxtotal = "";
    node.forEach((record, index) => {
      if (record.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == "86") {
        invoicetotal = record.monetaryAmount_composite.monetaryAmount;
        MainObject.InvoiceTotal = invoicetotal;
      } else if (record.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == "128") {
        merchtotal = record.monetaryAmount_composite.monetaryAmount;
        MainObject.MerchandiseTotal = merchtotal;
      } else if (record.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == "369") {
        taxtotal = record.monetaryAmount_composite.monetaryAmount;
        MainObject.TaxTotal = taxtotal;
      }
    });
  };

  var alltotals = getTotals(Totals);
  DataObject.MainObject = [MainObject];
  DataObject.deliveryId = deliveryId;

  return {
    data: [DataObject],
    errors: options.errors,
    abort: false,
    newErrorsAndRetryData: []
  };
}

function convertDate(date) {
  var year = date.slice(0, 4);
  var month = date.slice(4, 6);
  var day = date.slice(6, 8);
  return `${month}/${day}/${year}`;
}
