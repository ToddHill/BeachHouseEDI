const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'orderful-api-key': '582c6d4de4a3454c9a66458f4a2b49e4'
  }
};

fetch('https://api.orderful.com/v3/polling-buckets/10999?limit=1', options)
  .then(res => res.json())
  .then(res => {
    // Check if the response has data and if it's an array with at least one element
    if (res && res.data && res.data.length > 0) {
      const transactionId = res.data[0].id;
      console.log('Transaction ID:', transactionId); // This will output the id
    } else {
      console.log('No data found in the response.');
    }
  })
  .catch(err => console.error(err));

//  console.log(JSON.stringify(options, null, 2));
console.log("Hello from OrderfulRequest.mjs");
console.log("This is a test file to make sure the fetch request works.");
console.log("If you see this message, the fetch request was successful.");

// ZBpreSavePage(options);  // Commented out to avoid errors since options.data is undefined
console.log("WTF",options.id);