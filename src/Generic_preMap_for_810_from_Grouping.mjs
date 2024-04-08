/////////////////////////////////// BEGIN DEVELOPMENT CODE ///////////////////////////////////
import options from './data/Nordstrom_810_premap_data.json' assert { type: "json" };
preMap(options);
console.log(JSON.stringify(options, null, 2));
/*
NORDSTROM PREMAP 810 ORDERFUL TRANSITION

This is a mapping script originally for Nordstrom|Moon Integration to remove updaterec from the JSON
From Orderful.  This should be functional for ALL Nordstrom 810s.

*/
/////////////////////////////////// END DEVELOPMENT CODE ///////////////////////////////////
/////////////////////////////////// BEGIN PRODUCTION CODE ///////////////////////////////////
export function preMap(options) {
    return options.data.map((nestedArray) => {
        // Map over each object in the nested array
        const newData = nestedArray.map((obj) => {
            // Remove the "updaterec" property from the object
            delete obj.updaterec;
            return obj;
        });
        // Return the modified nested array
        return newData;
    });
}
