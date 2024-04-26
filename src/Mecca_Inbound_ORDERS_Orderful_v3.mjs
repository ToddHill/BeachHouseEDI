/*
Import the Mecca Orders
convert them to easier to manage JSON
convert the dates as well
*/
function preSavePage (options) {
    for (let i = 0; i < options.data.length; i++) {
      const salesorders = [];  
  // Start with the Header information
  // take the JSON apart and put it into NEW JSON we can use.
  // First, do some housekeeping and make space to work.
  // MainObject carries the water.  It is the object that will be sent to NetSuite
  const MainObject = {};
  // Now, pull the data from the Main Array
  const Information = options.data[0];
  const Dates = Information.message.dateTimePeriod;
  const Totals = Information.message.summary_group.monetaryAmount;
  // Get Text Message
  // No idea if we need this, but I am putting it in Notes
  const Message = Information.message.freeText;
  var TextNote = Message[0].textLiteral_composite;
  var FinalNote = TextNote.freeText;
  // Pull the address array into variable for later use.
  const Addresses = Information.nameAndAddress_group;
  /*
  Rendered Irrelevant due to Default Address Use in all cases
  Single Buyer, Single Ship To, Single Supplier
  */

  // Get the currencies Group
  const Currency = Information.currencies_group;
  /*
  Rendered Irrelevant due to all relationships being USD
  */
//EDIFACT DATETIME START
//set variable to contain date information
  var orderDate = "";
  var shipDate = "";

//Create a function to extract, and properly format the dates included and properly
//classify them
const getDateInformation = node => {
    node.forEach((record, index) => {
    if (record.dateTimePeriod_composite.dateOrTimeOrPeriodFunctionCodeQualifier == '137') 
      {
        orderDate = convertDate(record.dateTimePeriod_composite.dateOrTimeOrPeriodText);
          return orderDate;
      } 
      else 
    if (record.dateTimePeriod_composite.dateOrTimeOrPeriodFunctionCodeQualifier == '10')
      {
        shipDate = convertDate(record.dateTimePeriod_composite.dateOrTimeOrPeriodText);
        return shipDate;

      }
    }
  )
}
//Now, load it as a variable, forcing it to run the function so the returned data can be pushed to the MainObject
  var datestuff = getDateInformation(Dates);
//EDIFACT DATETIME COMPLETE

//EDIFACT LINE ITEM GROUP
const items = [];
const itemGroup = Information.message.lineItem_group;

const getItems = node => {
  node.forEach((record, index) => {
    var itemObject = {};
    itemObject.linenumber = index+1;    
    itemObject.lineitemid = record.lineItem.lineItemId;
    record.additionalProductId.forEach((qualifier, count) => {
    if (qualifier.itemNumberId_composite.itemTypeIdCode == 'IN') {
    itemObject.BPN = qualifier.itemNumberId_composite.itemId;}
    else
    if (qualifier.itemNumberId_composite.itemTypeIdCode == 'SA') {
    itemObject.Item = qualifier.itemNumberId_composite.itemId;}    
    })
    itemObject.description = record.itemDescription[0].itemDescription_composite.itemDescription;
    itemObject.quantity = record.quantity[0].quantityDetails_composite.quantity;
    record.monetaryAmount.forEach((money, each) => {
      if (money.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == '128') 
        {
        itemObject.TotalAmount = money.monetaryAmount_composite.monetaryAmount;
        }
        else
      if (money.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == '369') 
        {
        itemObject.GSTTax = money.monetaryAmount_composite.monetaryAmount;
        }
      }
    )
    itemObject.price = record.priceDetails_group[0].priceDetails.priceInformation_composite.priceAmount;
    items.push(itemObject)
  }

  )
}
//Load it as a variable and force the variables
  var itemstuff = getItems(itemGroup);
  
 
  const cancelbyDate = new Date(shipDate);
  cancelbyDate.setDate(cancelbyDate.getDate() + 5);
  const day = cancelbyDate.getDate();
  const month = cancelbyDate.getMonth() + 1;
  const year = cancelbyDate.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;  
  var canceled = formattedDate;

//MAIN DATA LOAD START
  MainObject.OrderfulId = Information.id;
  MainObject.purchaseOrder = Information.businessNumber;
  MainObject.TextNote = FinalNote;
  MainObject.orderDate = orderDate;
  MainObject.shipDate = shipDate;
  MainObject.cancelbyDate = canceled;
  MainObject.items = items;
//Get the totals
const getTotals = node => {
  var invoicetotal = "";
  var merchtotal = "";
  var taxtotal = "";
  node.forEach((record, index) => {
    if (record.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == "86")
    {invoicetotal = record.monetaryAmount_composite.monetaryAmount;
    MainObject.InvoiceTotal =  invoicetotal;
    }
    else
    if (record.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == "128")
    {merchtotal = record.monetaryAmount_composite.monetaryAmount;
    MainObject.MerchandiseTotal =  merchtotal;
    }
    else
    if (record.monetaryAmount_composite.monetaryAmountTypeCodeQualifier == "369")
    {taxtotal = record.monetaryAmount_composite.monetaryAmount;
    MainObject.TaxTotal = taxtotal;
    }
  })
}
var alltotals = getTotals(Totals);
salesorders[i] = MainObject;
console.log(JSON.stringify(salesorders));
//MAIN DATA LOAD COMPLETE
 
    }  
  
  return {
    data: options.data,
    errors: options.errors,
    abort: false,
    newErrorsAndRetryData: []
  }
//ADDITIONAL Convert Date Funtion to change EDIFACT Dates into NetSuite Importable Format  
function convertDate(date) {
  var year = date.slice(0, 4);
  var month = date.slice(4, 6);
  var day = date.slice(6, 8);
  return `${month}/${day}/${year}`;
} 


}