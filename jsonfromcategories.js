const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // Set to true for headless mode
  const page = await browser.newPage();

  // Set cookies
  const cookies = [
    {"domain":".bazos.cz","hostOnly":false,"httpOnly":false,"name":"testcookie","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"ano"},
    {"domain":".bazos.cz","expirationDate":1721547373.662166,"hostOnly":false,"httpOnly":true,"name":"testcookieaaa","path":"/","sameSite":"strict","secure":true,"session":false,"storeId":"0","value":"ano"},
    {"domain":".bazos.cz","expirationDate":1723534573.662211,"hostOnly":false,"httpOnly":false,"name":"rekkkb","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"ano"},
    {"domain":".bazos.cz","expirationDate":1755502671.877773,"hostOnly":false,"httpOnly":false,"name":"_ga","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"GA1.1.21165940.1720942314"},
    {"domain":".bazos.cz","expirationDate":1723534331.997711,"hostOnly":false,"httpOnly":false,"name":"rekkk","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"ano"},
    {"domain":".bazos.cz","expirationDate":1755502573.662198,"hostOnly":false,"httpOnly":false,"name":"bid","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"73204290"},
    {"domain":".bazos.cz","expirationDate":1755502566.618734,"hostOnly":false,"httpOnly":false,"name":"cookie_consent_user_consent_token","path":"/","sameSite":"strict","secure":false,"session":false,"storeId":"0","value":"y4vIfnFRiaAB"},
    {"domain":".bazos.cz","expirationDate":1755502566.619173,"hostOnly":false,"httpOnly":false,"name":"cookie_consent_user_accepted","path":"/","sameSite":"strict","secure":false,"session":false,"storeId":"0","value":"true"},
    {"domain":".bazos.cz","expirationDate":1752478573.662188,"hostOnly":false,"httpOnly":false,"name":"bkod","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"JJWMNTZR4G"},
    {"domain":".bazos.cz","expirationDate":1755502671.84783,"hostOnly":false,"httpOnly":false,"name":"cookie_consent_level","path":"/","sameSite":"strict","secure":false,"session":false,"storeId":"0","value":"%7B%22strictly-necessary%22%3Atrue%2C%22functionality%22%3Afalse%2C%22tracking%22%3Afalse%2C%22targeting%22%3Afalse%7D"},
    {"domain":".bazos.cz","expirationDate":1755502683.205319,"hostOnly":false,"httpOnly":false,"name":"_ga_NZW1QTHKBB","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"GS1.1.1720942313.1.1.1720942683.0.0.0"}
  ];
  
  await page.setCookie(...cookies);

  // Navigate to the form page
  await page.goto('https://auto.bazos.cz/pridat-inzerat.php');
//   const options = await page.$$eval('select[name="rubrikyvybrat"] option', elements => {
//     return elements.map(option => ({
//         value: option.value,
//         text: option.textContent
//     }));
// });

// // Log the options
// console.log(options);
// Wait for the select elements to be available
// Wait for the rubrikyvybrat select element to be available
// Initialize an object to hold the results
const results = {};

// Wait for the rubrikyvybrat select element to be available
await page.waitForSelector('select[name="rubrikyvybrat"]');

// Get all options from rubrikyvybrat
const rubrikyOptions = await page.$$eval('select[name="rubrikyvybrat"] option', elements => {
    return elements.map(option => option.value).filter(value => value !== '0');
});

// Loop through each rubriky option
for (const value of rubrikyOptions) {
    // Select the corresponding option in rubrikyvybrat
    await page.select('select[name="rubrikyvybrat"]', value);
    
    // Wait for the category select to be available
    await page.waitForSelector('#category');

    // Get all option values from the #category select, filtering out '0'
    const categoryOptions = await page.$$eval('select#category option', elements => {
        return elements.map(option => option.value).filter(value => value !== '0');
    });

    // Assign the category option values to the rubrikyvybrat value
    results[value] = categoryOptions;
}


// Assuming 'results' is your JSON object containing the category options
const jsonResults = JSON.stringify(results, null, 2);

// Define the path for the output JSON file
const outputPath = path.join(__dirname, 'categoryOptions.json');

// Write the JSON object to the file
fs.writeFileSync(outputPath, jsonResults, 'utf8');

console.log('Category options saved to categoryOptions.json');

})();
