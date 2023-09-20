# BeachHouse EDI ![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "GitHub Repository")
- Created with CodeSandbox
- Stored in GITHUB Repository 
## Scripts for Use in Celigo
- [X] 810: Edited for update of 810 sent record by adding it to the data.  a **preMap** script is required to remove it at the point of insertion.
- [ ] 855: Currently Under Development
- [ ] 856: On standby for FR discussion
---
- There will be a new way to process fulfilments.  The current method of NetSuite fulfilments is designed to make use of a fulfilment request.  The fulfilment request will then inform the NetSuite fulfilment and carton data, which will be required for the 856.
---

## preMap Script
```
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
```
