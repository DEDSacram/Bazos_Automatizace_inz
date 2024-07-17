const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
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
  
  
    // Navigate to the page containing the <select>
    await page.goto('https://www.bazos.cz/moje-inzeraty.php');
  
      // Navigate to the page containing the inputs
  
      // Fill in the email input
      await page.type('input[name="mail"]', 'bubles013@gmail.com', { delay: 100 });
    
      // Fill in the phone input
      await page.type('input[name="telefon"]', '776898649', { delay: 100 });
    
      console.log('Email and phone fields filled.');
  
      await page.click('input[type="submit"][name="Submit"][value="Vypsat inzeráty"]');
      console.log('Form submitted.');


      async function collectInputValues(selected) {
        
        // Navigate to the target page
        // Get all elements for processing
        const elements = await page.$$('.inzeraty.inzeratyflex');
      
        // Iterate through elements to click the selected link
        let i = 0;
        for (const element of elements) {
          if (i === selected) {
            const link = await element.$('a'); // Get the first <a> within the element
            if (link) {
              await link.evaluate(el => el.click()); // Click the link
              await page.waitForNavigation(); // Wait for the new page to load
              break;
            }
          } else {
            i++;
          }
        }
      
        // Click the delete/edit link
        const link = await page.$('.inzeratydetdel a');
        if (link) {
          await link.click(); // Click the link
          await page.waitForNavigation(); // Wait for the new page to load
          console.log('Clicked link and navigated to:', page.url());
        } else {
          console.log('Link not found.');
        }
      
        // Click the submit button
        await page.click('input[name="administrace"][value="Vymazat"]');
        console.log('Clicked submit and navigated to:', page.url());
        // Navigate back to the specified URL
        await new Promise(r => setTimeout(r, 2000));
        await page.goto('https://www.bazos.cz/moje-inzeraty.php', { waitUntil: 'networkidle2' });
        console.log('Navigated back to moje inzeraty');
      }

      const selectedNumber = 999; // Replace with your desired number
      // Example usage
     
      if(selectedNumber === 999){
        const elements = await page.$$('.inzeraty.inzeratyflex');
        for (let i = 0; i < elements.length; i++) {
            await collectInputValues(0);
            }
        
      }else{
        collectInputValues(selectedNumber);
      }
      
     

})();
