import * as request from 'request';

request.get('https://fapi.binance.com/fapi/v1/premiumIndex', (error: any, response: any, body: any) => {
  console.log(error, response, body);

})