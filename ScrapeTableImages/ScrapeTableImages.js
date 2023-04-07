// ==UserScript==
// @name     Get Images From All tables
// @version  1
// @grant    none
// @require  https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @run-at      document-idle
// ==/UserScript==

/*
 * TODO:
 * Clean up script so that only tables with images are selected. Current method utilizes hardcoded variable.
 * Add error handling.
 * Add checks to see if images need to be saved.
*/
var tables = document.querySelectorAll("table:not(.wikitable)");  // get all HTML tables on a webpage

var imageJSON = {}; // images to save

var base64Array = Array(); // images converted to base64

var imageCounter = 0;

for(var i = 0; i < tables.length; i++)
{
 	var table = tables[i];
  var tableData = table.getElementsByTagName("td");
  
  for(var j = 0; j < tableData.length; j++)
  {
    if(tableData[j].getElementsByTagName("img").length > 0)
    {
      var src = tableData[j].getElementsByTagName('img')[0].getAttribute('data-src');
      var name = [tableData[j].getElementsByTagName('img')[0].getAttribute('alt')]
      imageJSON[imageCounter] = 
      {
        "name": name,
        "src": src
      };
      imageCounter++;
    }
  }
}

saveImages(imageJSON);

// // JSON requires a name => img key/value pair
async function saveImages(imageObject)
{
	var zip = new JSZip();
  var zipFileName = "images.zip";
  
  length = Object.keys(imageObject).length - 1
  console.log(length);
  var base64 = '';
  for (const key in imageObject)
  {
    var url = imageObject[key].src;
    var fileName = imageObject[key].name[0];
    const file = await JSZipUtils.getBinaryContent(url)
    zip.file(fileName, file, {binary:true});                          
    if(length == key)
    {
      zip.generateAsync({type:'blob'}).then(function(content) {
        saveAs(content, zipFileName);
      });
    }
  }
  
}
