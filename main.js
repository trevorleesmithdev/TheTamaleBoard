//########################################################################################################################
// GLOBAL VARIABLES
  var toastRestaurantExternalId = 'insert string here';

  var authorization = 'Bearer <Your_Token_Here>';

  var header01 = {};
  var header02 = {};
  
  var tableTamales = document.getElementById('tamaleList').getElementsByTagName('tbody')[0];
  
  var testMenuItemObject1 = {
      name: 'Black Bean Tamale',
      amount: 5,
    };

var boardLastUpdatedTime = new Date();

var infoSheet = {};

// the below variable is being built to pass into the stockInfo variable fetch request
// - must be included in the message body of the request and contain all needed GUIDs.
// - will be built alongside the infoSheet{} variable
var inventorySearchRequest = [];

//########################################################################################################################
// FUNCTIONS
  // CORE 1 Functions - Repeatable / Modularized
    
    // Add Blank Row - Receives existing table as parameter
      function addBlankRow(table){        
        var row = table.insertRow(-1);
        //console.log('addBlankRow() function executed'); 
        return row;
      }

    // Add Table Cell - Receives existing table row as parameter
      function addTableCell(row){
        var cell = row.insertCell(-1);
        //console.log('addTableCell() function executed');
        return cell;
      }


    // Add Table Cell Text - Receieves existing table cell as 1st parameter, and string of text to display within as the 2nd parameter
      function addCellText(cell, text){
        cell.innerHTML = text.toString();
        //console.log('addCellText() function executed');
      }
    // Refreshes the board
      function refreshBoard(){
        location.reload();
        console.log('refreshBoard() function executed');
      }


  // CORE 2 Functions - Modularized Snippets Expanding upon and implementing CORE 1
    
    // Add a Tamale Type Emtry to the Board
      function addTamale(table,name,amount){
        // Add row to table
        var row = addBlankRow(table);
        // Add first cell to current row being inserted
        var cell1 = addTableCell(row);
        // Add text to the first cell
        var cellText1 = addCellText(cell1, name);
        // Add second cell to current row being inserted
        var cell2 = addTableCell(row);
        // Add text to the second cell
        var cellText2 = addCellText(cell2, amount);
        //console.log('addTamale() function executed');
      }

    // Determines if the board is out of date - if it is, then the function will act based on situation
      function evaluateBoardThenAct(){
        // Get menu last modified timestamp
        var menuLastModifiedTime = fetch('https://toast-api-server/menus/v2/metadata', {
          method: 'GET',
          headers: {
            'Toast-Restaurant-External-ID': toastRestaurantExternalId,
          },
        })
        //!!! - you will need to parse the response here into json an grab the value you're wanting to evaluate
        // IF menu has been updated since most recent tamale board update
        if(menuLastModifiedTime < boardLastUpdatedTime){
          //a more in depth analysis for if statement above needed, date formats, comparisons and evaluation etc etc
          refreshBoard();
          //console.log('refreshBoard() function executed');
        } else {
          // if tamale board is still up to date, wait a partial sec to confirm no load conflicts, then set last load time to current time
          function resetBoardLastUpdated(){
            boardLastUpdatedTime = new Date();
          }
          setTimeout(resetBoardLastUpdated,100); 
        }
        //console.log('evaluateBoardThenAct() function executed');
      }



//########################################################################################################################
// LOGIC FLOW


  // Every 30 seconds evaluate if the board is current
  setInterval(evaluateBoardThenAct, 30000);
  
  // The following is executed once upon page load or reload. Other script logic is deciding when / if this reload should happen.
    // Create reference list 
      // Return 'Tamales Avaialable' Menu Group - this does the work of presorting what tamales are in stock for us ^-^
        var tamalesAvailable = fetch('https://toast-api-server/menus/v2/menugroup', {
          method: 'GET',
          headers: {
            'Toast-Restaurant-External-ID': toastRestaurantExternalId,
          },
        })
        .then((response) => response.json())
        .then((tamalesAvailable) => {
          // Access the menuItems array within it
          var menuItems = tamalesAvailable.menuItems;
          // Iterate / parse this array - adding desired values to object
          menuItems.forEach((item) => {
            // Set variables
            var menuItemName = item.name;
            var menuItemGUID = item.guid;
            var menuItemDescription = item.description;
            var menuItemImage = item.image;
            var menuItemPrice = item.price;
            // add GUID into array for stockInfo request
            inventorySearchRequest.push(menuItemGUID)
            // Pass variables into infosheet object
            infosheet.menuItemName = {
              guid: menuItemGUID,
              description: menuItemDescription,
              imageURL: menuItemImage,
              price: menuItemPrice,
            };
          }
          // after finishing the above block of code, we should be left with...
          // - an object, full of menuItem objects, full of key:value pairs - called the infoSheet
          // - an array, containing only the GUIDs in string form - called the inventorySearchRequest
        }
        var stockInfo = fetch('https://toast-api-server/stock/v1/inventory/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Toast-Restaurant-External-ID': toastRestaurantExternalId,
          },
          body: JSON.stringify({
            inventorySearchRequest;
          }),
        });
        // 2. Object returned will contain both GUID validity and quantity
        // 3. IF GUID Valid, it should be, append the quantity to the infoSheet
        // 3.5 If GUID not valid, remove the related entry from infoSheet




//########################################################################################################################
// SNIPPETS
    
  

// Pokemon API Test Population
  var testCounter = 1;
  while(testCounter<152){
    var pokedex = fetch("https://pokeapi.co/api/v2/pokemon/"+testCounter+"/")
    .then((response) => response.json())
    .then((pokedex) => {
      var pokename = pokedex.name;
      var pokemove = pokedex.moves[0].move.name;
      //console.log(pokename + ' used ' + pokemove);
      //console.log(table);
      addTamale(tableTamales,pokename,pokemove);
    });
    
    testCounter += 1;
  }
  

//next steps / future proofing
// 1. add trace & head requests where needed for failsafes and catches
// 2. 
