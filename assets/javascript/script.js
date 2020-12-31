$(document).ready(function () {
  /* Declare DOM Variables */
  var userQueryInput = $("#rs");
  var recipeSearchBtn = $("#searchButton");
  var allergySelector = $("#Allergy");
  var dietSelector = $("#Diet");
  var ingredientsForm = $("#ingredientsForm");
  var dynamicContentDiv = $("#dynamicContent");

  /* Declare JavaScript Variables */
  // Used in storing ID's of recipes.
  var recipeID = [];
  var allergySelected = {};
  var dietSelected = {};
  let offsetMultiple = 0;

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
  function searchSpoontacular(event, offset) {
    event.preventDefault();

    // Setting the offset.
    let offset = 0 + 10 * offsetMultiple;
    let offsetQuery = "&offset=" + offset;

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

    // Adding empty arrays to collect data.
    recipeID = [];
    var recipeImage = [];
    var recipeTitle = [];

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
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=55ef65bbdb1c401490f851867d7b839f";

    // Combining the queries.
    let queryURL =
      recipeSearchURL + searchQuery + dietQuery + allergyQuery + offsetQuery;
    console.log(queryURL);

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var spoonResults = response.results;
      console.log(spoonResults);

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
        recipeResultTitleEl.addClass("card-title my-auto");
        recipeResultTitleEl.attr("id", "cardTitle");
        recipeResultCardEl.append(recipeResultTitleEl);

        // Making the img's and setting the src.
        var recipeResultImg = $("<img>");
        //recipeResultImg.addClass("card-img-top img-fluid");
        recipeResultImg.attr("src", recipeImage[i]);
        recipeResultImg.attr("id", "recipeImg");
        recipeResultCardEl.append(recipeResultImg);

        // Making a button to show the recipe.
        var openRecipe = $("<button>").text("Show Recipe");
        openRecipe.attr("class", "btn btn-primary recipe");
        openRecipe.attr("id", "openRecipeButton");
        openRecipe.attr("data-index", i);
        recipeResultCardEl.append(openRecipe);

        // Appending everything to dynamicContent
        recipeCol.append(recipeResultCardEl);
        dynamicContentDiv.append(recipeCol);
      }
    });
  }
  // Second AJAX call for recipe.
  function findRecipe(event) {
    // Using the data-index to find which recipe ID to access in the global variable.
    var index = this.dataset.index;

    // Preparing the URL for the second ajax call to get the recipe.
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

  //Function to send saved ingredient list via EmailJS API
  function saveList(event) {
    event.preventDefault();

    //btn.value = 'Sending...';

    const serviceID = "default_service";
    const templateID = "template_241tje5";
    var passed_html = $("#passed_html").val();
    var user_email = $("#user_email").val();

    emailjs.send(serviceID, templateID, {
      passed_html: passed_html,
      user_email: user_email,
    });
  }
  /* Define Functions */

  /* Make Function Calls */
  /* Make Function Calls */

  /* Register Event Listeners */
  allergySelector.on("click", ".allergy", settingAllergyCriteria);
  dietSelector.on("click", ".diet", settingDietCriteria);
  recipeSearchBtn.on("click", searchSpoontacular);
  ingredientsForm.on("submit", saveList);
  dynamicContentDiv.on("click", ".recipe", findRecipe);
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
