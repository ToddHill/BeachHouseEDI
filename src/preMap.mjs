/*

This is the function designed to remove the record to be updated from the data record
as the data record needs to be passed on to the Orderful application, but the record to
be updated cannot be lost if we intend to update it after we have verified the Orderful
download of the document.

*/

function preMap(options) {
    return options.data.map((d) => {
      // Extract the first element of the nested array (your actual data)
      const actualData = d[0];
  
      // Create a copy of the actual data without the "updaterec" property
      const { updaterec, ...newData } = actualData;
  
      // Return the modified data within the nested array structure
      return {
        data: newData,
      };
    });
  }