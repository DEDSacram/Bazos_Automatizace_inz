const fs = require('fs').promises;
const path = require('path');

// Step 1: Load the JSON object
const categories = require('./categoryOptions.json');

// Function to find the key for a given category number
function findCategoryKey(categoryNumber) {
  for (const key in categories) {
    if (categories[key].includes(categoryNumber)) {
      return key;
    }
  }
  return null;
}

// Function to process each folder
async function processFolders() {
  const mainDir = path.join(__dirname, 'inzeraty');

  try {
    const folders = await fs.readdir(mainDir);
    const directoryFolders = [];

    for (const folder of folders) {
      const folderPath = path.join(mainDir, folder);
      const stat = await fs.stat(folderPath);
      if (stat.isDirectory()) {
        directoryFolders.push(folder);
      }
    }

    for (const folder of directoryFolders) {
      const jsonFilePath = path.join(mainDir, folder, `${folder}.json`);
      const imgDirPath = path.join(mainDir, folder, 'img');

      if (await fileExists(jsonFilePath)) {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(data);

        const categoryNumber = jsonData.category;
        const categoryKey = findCategoryKey(categoryNumber);

        if (categoryKey) {
          jsonData.rubrikyvybrat = categoryKey;

          // Get image paths and add them to jsonData
          jsonData.img = await getImagePaths(imgDirPath);
          
          await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
          console.log(`Updated ${jsonFilePath} with rubrikyvybrat: ${categoryKey} and images.`);
        } else {
          console.log(`Category number ${categoryNumber} not found in JSON.`);
        }
      } else {
        console.log(`File ${jsonFilePath} does not exist.`);
      }
    }
  } catch (error) {
    console.error('Error processing folders:', error);
  }
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

// Function to get paths of images in the img directory
async function getImagePaths(imgDirPath) {
  const images = [];
  if (await fileExists(imgDirPath)) {
    const imgFiles = await fs.readdir(imgDirPath);
    imgFiles.forEach(imgFile => {
      const imgPath = path.join(imgDirPath, imgFile);
      images.push(imgPath);
    });
  }
  return images;
}

// Execute the function
processFolders().catch(error => console.error('Error processing folders:', error));