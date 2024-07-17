const puppeteer = require('puppeteer');

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Function to prompt user input
function promptUser(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
async function typeIfEmpty(selector, value,page) {
  const isEmpty = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    return element && !element.value;
  }, selector);

  if (isEmpty) {
    await page.type(selector, value,page);
  }
}



// Function to load JSON data from specified folders
async function loadJsonFromFolders(mainDir, selectedFolders) {
  const jsonDataArray = [];

  for (const folder of selectedFolders) {
    const jsonFilePath = path.join(mainDir, folder, `${folder}.json`);
    if (await fileExists(jsonFilePath)) {
      try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(data);
        jsonDataArray.push(jsonData);
      } catch (error) {
        console.error(`Error reading or parsing ${jsonFilePath}:`, error);
      }
    } else {
      console.log(`File ${jsonFilePath} does not exist.`);
    }
  }

  return jsonDataArray;
}

// Helper function to check if a file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Function to list folders and prompt user to choose
async function chooseFolders(mainDir) {
  const folders = await fs.readdir(mainDir);
  const directoryFolders = [];

  for (const folder of folders) {
    const folderPath = path.join(mainDir, folder);
    const stat = await fs.stat(folderPath);
    if (stat.isDirectory()) {
      directoryFolders.push(folder);
    }
  }

  if (directoryFolders.length === 0) {
    console.log('No folders found in the specified directory.');
    return [];
  }

  // Display folder options
  console.log('Folders:');
  directoryFolders.forEach((folder, index) => {
    console.log(`${index}: ${folder}`);
  });

  // Prompt user to choose a folder or 'A' for all
  const folderChoice = await promptUser(`Choose a folder by number (0-${directoryFolders.length - 1}) or type 'A' for all: `);

  if (folderChoice.toLowerCase() === 'a') {
    return directoryFolders; // Return all folders
  } else {
    const folderIndex = parseInt(folderChoice, 10);
    if (isNaN(folderIndex) || folderIndex < 0 || folderIndex >= directoryFolders.length) {
      console.log('Invalid folder number.');
      return [];
    } else {
      return [directoryFolders[folderIndex]]; // Return selected folder as an array
    }
  }
}

// // Function to execute after loading JSON data
// async function processData(jsonDataArray) {
//   // Implement your processing logic here
//   console.log('Processing data:', jsonDataArray);
// }

async function runPuppeteer(jsonDataArray) {
  const browser = await puppeteer.launch({ headless: false }); // Set to true for headless mode
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

  for (let i = 0; i < jsonDataArray.length; i++) {
    const jsonobject = jsonDataArray[i]
    console.log(jsonobject["nadpis"])
  await page.goto('https://deti.bazos.cz/pridat-inzerat.php');
  await page.select('select[name="rubrikyvybrat"]', jsonobject["rubrikyvybrat"]);
  await page.waitForSelector('select[name="category"]', { visible: true });
  await page.select('select[name="category"]', jsonobject["category"]); // Selecting category
  await page.type('input[name="nadpis"]',jsonobject["nadpis"]); // Title
  await page.type('textarea[name="popis"]', jsonobject["popis"]); // Description
  await page.type('input[name="cena"]', jsonobject["cena"]); // Price
  await page.select('select[name="cenavyber"]', jsonobject["cenavyber"]); // Price type
  // await page.type('input[name="lokalita"]', jsonobject["lokalita"]); // Location
  // await page.type('input[name="jmeno"]', jsonobject["jmeno"]); // Name
  // await page.type('input[name="telefoni"]', jsonobject["telefoni"]); // Phone
  // await page.type('input[name="maili"]', jsonobject["maili"]); // Email
  // await page.type('input[name="heslobazar"]', '360'); // Password

  // Fill the 'Location' field if it's empty
await typeIfEmpty('input[name="lokalita"]', jsonobject["lokalita"],page);

// Fill the 'Name' field if it's empty
await typeIfEmpty('input[name="jmeno"]', jsonobject["jmeno"],page);

// Fill the 'Phone' field if it's empty
await typeIfEmpty('input[name="telefoni"]', jsonobject["telefoni"],page);

// Fill the 'Email' field if it's empty
await typeIfEmpty('input[name="maili"]', jsonobject["maili"],page);

// Fill the 'Password' field with a static value if it's empty
await typeIfEmpty('input[name="heslobazar"]', '360',page);


    
      await page.waitForSelector('a[href="javascript:odstranitdrop()"]', { visible: true });
      await page.click('a[href="javascript:odstranitdrop()"]');
  
      // Optional: Wait for the upload to complete (if there's a visual indication)
      // await page.waitForTimeout(1000); // Adjust as necessary
      // Upload files
    const fileInput = await page.waitForSelector('input[name="souborp[]"]', { visible: true });
    
    // Upload files from img array
    await fileInput.uploadFile(...jsonobject.img); // Spread operator for multiple files

     // Submit the form with specific name and value
    //  await page.waitForSelector('selector', { visible: true });
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 2000)); // Wait for 1 second


     await page.click('input[type="submit"][name="Submit"][value="Odeslat"]'); // Click the submit button
    
     // Wait for a response or navigation if needed
    await page.goto('https://www.bazos.cz/moje-inzeraty.php', { waitUntil: 'networkidle2' });
    //  await new Promise(resolve => setTimeout(resolve, 2000));
    await browser.close();
    console.log("inserted:" + jsonobject["nadpis"])
    }
  
}

// Main function to execute the script
async function main() {
  const mainDir = path.join(__dirname, 'inzeraty'); // Specify your main directory

  const selectedFolders = await chooseFolders(mainDir);
  if (selectedFolders.length === 0) {
    console.log('No folders selected.');
    return;
  }

  const jsonDataArray = await loadJsonFromFolders(mainDir, selectedFolders);

  // Call the Puppeteer function after loading JSON data
  await runPuppeteer(jsonDataArray);
}

// Execute the main function
main().catch(error => console.error('Error:', error));




// (async () => {
//     const browser = await puppeteer.launch({ headless: false }); // Set to true for headless mode
//   const page = await browser.newPage();

  // // Set cookies
  // const cookies = [
  //   {"domain":".bazos.cz","hostOnly":false,"httpOnly":false,"name":"testcookie","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"ano"},
  //   {"domain":".bazos.cz","expirationDate":1721547373.662166,"hostOnly":false,"httpOnly":true,"name":"testcookieaaa","path":"/","sameSite":"strict","secure":true,"session":false,"storeId":"0","value":"ano"},
  //   {"domain":".bazos.cz","expirationDate":1723534573.662211,"hostOnly":false,"httpOnly":false,"name":"rekkkb","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"ano"},
  //   {"domain":".bazos.cz","expirationDate":1755502671.877773,"hostOnly":false,"httpOnly":false,"name":"_ga","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"GA1.1.21165940.1720942314"},
  //   {"domain":".bazos.cz","expirationDate":1723534331.997711,"hostOnly":false,"httpOnly":false,"name":"rekkk","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"ano"},
  //   {"domain":".bazos.cz","expirationDate":1755502573.662198,"hostOnly":false,"httpOnly":false,"name":"bid","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"73204290"},
  //   {"domain":".bazos.cz","expirationDate":1755502566.618734,"hostOnly":false,"httpOnly":false,"name":"cookie_consent_user_consent_token","path":"/","sameSite":"strict","secure":false,"session":false,"storeId":"0","value":"y4vIfnFRiaAB"},
  //   {"domain":".bazos.cz","expirationDate":1755502566.619173,"hostOnly":false,"httpOnly":false,"name":"cookie_consent_user_accepted","path":"/","sameSite":"strict","secure":false,"session":false,"storeId":"0","value":"true"},
  //   {"domain":".bazos.cz","expirationDate":1752478573.662188,"hostOnly":false,"httpOnly":false,"name":"bkod","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"JJWMNTZR4G"},
  //   {"domain":".bazos.cz","expirationDate":1755502671.84783,"hostOnly":false,"httpOnly":false,"name":"cookie_consent_level","path":"/","sameSite":"strict","secure":false,"session":false,"storeId":"0","value":"%7B%22strictly-necessary%22%3Atrue%2C%22functionality%22%3Afalse%2C%22tracking%22%3Afalse%2C%22targeting%22%3Afalse%7D"},
  //   {"domain":".bazos.cz","expirationDate":1755502683.205319,"hostOnly":false,"httpOnly":false,"name":"_ga_NZW1QTHKBB","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"GS1.1.1720942313.1.1.1720942683.0.0.0"}
  // ];
  
  // await page.setCookie(...cookies);

      
  
// })();
