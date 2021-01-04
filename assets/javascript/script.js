$(document).ready(function () {
  /* Declare DOM Variables */
  var userQueryInput = $("#rs");
  var recipeSearchBtn = $("#searchButton");
  var allergySelector = $("#Allergy");
  var dietSelector = $("#Diet");
  var ingredientsForm = $("#ingredientsForm");
  var dynamicContentDiv = $("#dynamicContent");
  var sendIngredientsBtn = $("#sendIngridents");

  var emailInput = $("#exampleInputEmail1");

  /* Declare JavaScript Variables */
  // Used in storing ID's of recipes.
  var recipeID = [];
  var allergySelected = {};
  var dietSelected = {};
  let offsetMultiple = 0;
  let tempURL = "";

  /* Declare JavaScript Variables */

  /* Define Functions */
  // Function to toggle the allergen variables.
  function settingAllergyCriteria(allergy) {
    allergy = this.dataset.type;
    if (allergySelected[allergy]) {
      allergySelected[allergy] = false;
      console.log(allergySelected);
    } else {
      allergySelected[allergy] = true;
      console.log(allergySelected);
    }
  }
  // Function to toggle the diet variables.
  function settingDietCriteria(diet) {
    diet = this.dataset.type;
    if (dietSelected[diet]) {
      dietSelected[diet] = false;
      console.log(dietSelected);
    } else {
      dietSelected[diet] = true;
      console.log(dietSelected);
    }
  }

  //Function to call Spoontacular API
  function searchSpoontacular(event) {
    event.preventDefault();

    /* Clear dynamicContent DIV ahead of writing new search results */
    dynamicContentDiv.empty();

    // Declaring local variables.
    var searchQuery = $(userQueryInput).val();
    searchQueryArray = searchQuery.split(" ");
    searchFirstInstance = true;
    for (let i = 0; i < searchQueryArray.length; i++) {
      if (searchFirstInstance) {
        searchQuery = "&query=" + searchQueryArray[i];
        searchFirstInstance = false;
      } else {
        searchQuery = searchQuery + "+" + searchQueryArray[i];
      }
    }
    console.log(searchQuery);

    // Adding empty strings so that they can be populated with selections.
    let dietQuery = "";
    let allergyQuery = "";

    // Converting the objects into array key/value pairs.
    let allergyArray = Object.entries(allergySelected);
    let dietArray = Object.entries(dietSelected);

    // Iterating over the arrays and adding keys into the above string if they are true.
    let firstInstanceAllergy = true;
    for (let i = 0; i < allergyArray.length; i++) {
      if (allergyArray[i][1]) {
        if (firstInstanceAllergy) {
          allergyQuery = "&intolerances=" + allergyArray[i][0];
          firstInstanceAllergy = false;
        } else {
          allergyQuery = allergyQuery + "," + allergyArray[i][0];
        }
      }
    }
    let firstInstanceDiet = true;
    for (let i = 0; i < dietArray.length; i++) {
      if (dietArray[i][1]) {
        if (firstInstanceDiet) {
          dietQuery = "&diet=" + dietArray[i][0];
          firstInstanceDiet = false;
        } else {
          dietQuery = dietQuery + "," + dietArray[i][0];
        }
      }
    }
    console.log(dietQuery);
    console.log(allergyQuery);

    var recipeSearchURL =
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=096dffd3ff0d4431820fce4a3121a0c1";

    // Combining the queries.
    let queryURL = recipeSearchURL + searchQuery + dietQuery + allergyQuery;

    // Storing a temporary URL to global.
    tempURL = queryURL;
    console.log(queryURL);

    // Calling the creatingRecipes and passing it the URL made above.
    creatingRecipes(queryURL);
  }

  // Making the AJAX call and the DOM elements function.
  function creatingRecipes(queryURL) {
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var spoonResults = response.results;
      console.log(spoonResults);

      // Adding empty arrays to collect data.
      recipeID = [];
      var recipeImage = [];
      var recipeTitle = [];

      // If spoonResults is empty display search again.
      if (spoonResults.length === 0) {
        var tryAgain = $("<h2>No recipes found with this criteria.</h2>");
        var searchAgain = $("<h3>").text("Please search again");
        dynamicContentDiv.attr("class", "bg-white col-3");
        dynamicContentDiv.append(tryAgain);
        dynamicContentDiv.append(searchAgain);
      }

      // Create container to display recipe cards in
      var contentRowEl = $("<div>");
      contentRowEl.addClass("row");
      contentRowEl.attr("id", "contentRow");

      for (let i = 0; i < spoonResults.length; i++) {
        // Defining the three main variables we will be using.
        recipeTitle.push(spoonResults[i].title);
        recipeImage.push(spoonResults[i].image);
        recipeID.push(spoonResults[i].id);

        // Create recipe cards.
        var recipeCol = $("<div>");
        recipeCol.addClass("col-md-4 justify-content-center");
        recipeCol.attr("id", "recipeCol");

        var recipeResultCardEl = $("<div>");
        recipeResultCardEl.addClass("card");
        recipeResultCardEl.attr("id", "recipeCard");

        // Making the title element.
        var recipeResultTitleEl = $("<h2>" + recipeTitle[i] + "</h2>");
        // recipeResultTitleEl.append(recipeTitle[i]);
        recipeResultTitleEl.attr("class", "cardTitle flex my-auto mx-auto");
        recipeResultCardEl.append(recipeResultTitleEl);

        // Making the img's and setting the src.
        var recipeResultImg = $("<img>");
        //recipeResultImg.addClass("card-img-top img-fluid");
        recipeResultImg.attr("src", recipeImage[i]);
        recipeResultImg.attr("class", "recipeImg");
        recipeResultCardEl.append(recipeResultImg);

        // Making row to show buttons side by side
        var buttonRow = $("<div>");
        buttonRow.addClass("row");
        buttonRow.attr("id", "buttonRow");

        // Making a button to show the recipe.
        var leftCol = $("<div>");
        leftCol.addClass("col-6");
        var openRecipe = $("<button>").text("Show Recipe");
        openRecipe.attr("class", "btn btn-primary recipe");
        openRecipe.attr("id", "openRecipeButton");
        openRecipe.attr("data-index", i);
        leftCol.append(openRecipe);
        buttonRow.append(leftCol);

        // Making a button to send full ingredient list to email
        var rightCol = $("<div>");
        rightCol.addClass("col-6");
        var sendIngredients = $("<button>").text("View Ingredients");
        sendIngredients.addClass("btn btn-secondary");
        sendIngredients.attr("id", "viewIngredients");
        sendIngredients.attr("data-bs-toggle", "modal");
        sendIngredients.attr("data-bs-target", "#exampleModal");
        sendIngredients.attr("data-index", i);
        rightCol.append(sendIngredients);
        buttonRow.append(rightCol);

        recipeResultCardEl.append(buttonRow);

        // Appending everything to dynamicContent
        recipeCol.append(recipeResultCardEl);
        dynamicContentDiv.append(recipeCol);
      }
      // Making the see next results button.
      const offsetBtn = $("<button>").text("See the next 10 results!");
      offsetBtn.attr("class", "btn btn-primary");
      offsetBtn.attr("id", "offsetBtn");
      dynamicContentDiv.append(offsetBtn);

      // Add returned recipe IDs to local storage
      localStorage.setItem("recipeID", JSON.stringify(recipeID));
    });
  }

  // New function to make a new call with a higher offset.
  function nextResults(event) {
    // Setting the offset.
    event.preventDefault();
    offsetMultiple++;
    let offset = 0 + 10 * offsetMultiple;
    let offsetQuery = "&offset=" + offset;
    let newQuery = tempURL + offsetQuery;
    dynamicContentDiv.empty();
    creatingRecipes(newQuery);
  }

  // Second AJAX call for recipe.
  function findRecipe(event) {
    // Using the data-index to find which recipe ID to access in the global variable.
    var index = this.dataset.index;

    // Preparing the URL for the ajax call to get the recipe.
    var recipeStepsURL =
      "https://api.spoonacular.com/recipes/" +
      recipeID[index] +
      "/analyzedInstructions?apiKey=096dffd3ff0d4431820fce4a3121a0c1";

    console.log(recipeStepsURL);
    $.ajax({
      url: recipeStepsURL,
      method: "GET",
    }).then(function (response2) {
      console.log(response2);
    });
  }

  // Function to find the ingredients.
  function findIngredients(event) {
    // Using the data-index to find which recipe ID to access in the global variable.
    var index = this.dataset.index;
    let emailRecipeName = this.parentNode.parentNode.parentNode.firstChild
      .textContent;

    // Preparing the URL for the ajax call to get the ingredients.
    var ingredientsNeededURL =
      "https://api.spoonacular.com/recipes/" +
      recipeID[index] +
      "/ingredientWidget.json?apiKey=096dffd3ff0d4431820fce4a3121a0c1";

    $.ajax({
      url: ingredientsNeededURL,
      method: "GET",
    }).then(function (response) {
      let ingredient = response.ingredients;

      // Emptying the modal footer.
      $(".modal-footer").empty();

      // Making a table.
      const tableEle = $("<table>");
      $(".modal-footer").append(tableEle);

      // Adding a caption.
      const caption = $("<caption>").text("Ingredients needed.");
      tableEle.append(caption);

      // Adding table head.
      const theadEle = $("<thead>");
      tableEle.append(theadEle);

      // Adding table row.
      const trEle = $("<tr>");
      theadEle.append(trEle);

      // Adding content for headers.
      const ingredientNameTH = $("<th>").text("Ingredients");
      const amountTH = $("<th>").text("Amount");
      const unitsTH = $("<th>").text("Units");
      trEle.append(ingredientNameTH);
      trEle.append(amountTH);
      trEle.append(unitsTH);

      // Adding table body.
      const tableBodyEle = $("<tbody>");
      tableEle.append(tableBodyEle);

      for (let i = 0; i < ingredient.length; i++) {
        // Making a table row inside a for loop.
        let tableBodyTR = $("<tr>");
        tableEle.append(tableBodyTR);

        // Adding data into the chart.
        let ingredientNameTD = $("<td>").text(ingredient[i].name);
        tableBodyTR.append(ingredientNameTD);

        let amountTD = $("<td>").text(ingredient[i].amount.us.value.toFixed(2));
        tableBodyTR.append(amountTD);

        let unitsTD = $("<td>").text(ingredient[i].amount.us.unit);
        tableBodyTR.append(unitsTD);
      }
      sendIngredientsBtn.on("click", function (event) {
        event.preventDefault();
        let savedEmail = emailInput.val;
        saveList(savedEmail, ingredient, emailRecipeName);
      });
    });
  }

  //Function to send saved ingredient list via EmailJS API
  function saveList(savedEmail, ingredient, emailRecipeName) {
    // Save Email address
    var savedEmail = $(emailInput).val();
    console.log(savedEmail);
    console.log(ingredient);
    //Ajax call for ingredient list

    // Hide modal
    $("#exampleModal").removeClass("show");

    //EmailJS call to send list
    var bodyHTML = [];

    for (var i = 0; i < ingredient.length; i++) {
      console.log("Name: " + ingredient[i].name);
      console.log(
        "Amount: " +
          ingredient[i].amount.us.value +
          " " +
          ingredient[i].amount.us.unit
      );

      bodyHTML.push(
        "<p>" +
          ingredient[i].amount.us.value +
          " " +
          ingredient[i].amount.us.unit +
          " " +
          ingredient[i].name +
          "</p>"
      );
    }
    console.log(bodyHTML);

    emailjs.send("service_y9qb5eg", "template_241tje5", {
      bodyHTML: bodyHTML,
      userEmail: savedEmail,
      recipeName: emailRecipeName,
    });
  }
  /* Register Event Listeners */
  allergySelector.on("click", ".allergy", settingAllergyCriteria);
  dietSelector.on("click", ".diet", settingDietCriteria);
  recipeSearchBtn.on("click", searchSpoontacular);
  dynamicContentDiv.on("click", ".recipe", findRecipe);
  dynamicContentDiv.on("click", "#viewIngredients", findIngredients);
  $("#exampleInputEmail1").keyup(function (event) {
    if (event.keyCode === 13) {
      captureEmail.click(event);
    }
  });
  dynamicContentDiv.on("click", "#offsetBtn", nextResults);
  userQueryInput.keyup(function (event) {
    if (event.keyCode === 13) {
      recipeSearchBtn.click();
    }
  });
});
function openPage(pageName, elmnt, color) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
