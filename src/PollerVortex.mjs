const orderful-api-key = '582c6d4de4a3454c9a66458f4a2b49e4';
const gitem = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'orderful-api-key': '582c6d4de4a3454c9a66458f4a2b49e4'
    }
  };
  
  fetch('https://api.orderful.com/v3/polling-buckets/89', gitem)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

    const whackem = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'orderful-api-key': '582c6d4de4a3454c9a66458f4a2b49e4'
        },
        body: JSON.stringify({resourceIds: ['34567890']})
      };
      
      fetch('https://api.orderful.com/v3/polling-buckets/id/confirm-retrieval', whackem)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));   