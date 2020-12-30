$(document).ready(function () {
  /* Declare DOM Variables */
  var userQueryInput = $("#rs");
  var recipeSearchBtn = $("#searchButton");
  var allergySelector = $("#Allergy");
  var dietSelector = $("#Diet");
  var ingredientsForm = $("#ingredientsForm");
  var dynamicContent = $("#dynamicContent");

  var searchFiltersTab = $("#searchFilters");

  /* Declare JavaScript Variables */
  // Used in storing ID's of recipes.
  var recipeID = [];
  var allergySelected = {};
  var dietSelected = {};

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
    dynamicContent.empty();

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
    let queryURL = recipeSearchURL + searchQuery + dietQuery + allergyQuery;
    console.log(queryURL);

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var spoonResults = response.results;
      console.log(spoonResults);
      // Defining the three main variables we will be using.

      for (let i = 0; i < spoonResults.length; i++) {
        recipeTitle.push(spoonResults[i].title);
        recipeImage.push(spoonResults[i].image);
        recipeID.push(spoonResults[i].id);

        // Making recipe cards.
        // Making a new row.
        var recipeCol = $("<div>");
        recipeCol.addClass("col-lg-4");
        recipeCol.attr("id", "recipeCol");

        var recipeResultCardEl = $("<div>");
        recipeResultCardEl.addClass("card");
        recipeResultCardEl.attr("id", "recipeCard");

        // Making the title element.
        var recipeResultTitleEl = $("<h5>" + recipeTitle[i] + "</h5>");
        // recipeResultTitleEl.append(recipeTitle[i]);
        recipeResultTitleEl.addClass("card-title");
        recipeResultTitleEl.attr("id", "cardTitle");
        recipeResultCardEl.append(recipeResultTitleEl);

        // Making the img's and setting the src.
        var recipeResultImg = $("<img>");
        //recipeResultImg.addClass("card-img-top img-fluid");
        recipeResultImg.attr("src", recipeImage[i]);
        recipeResultCardEl.append(recipeResultImg);

        // Making a button to show the recipe.
        var openRecipe = $("<button>").text("Show Recipe");
        openRecipe.attr("class", "btn btn-primary recipe");
        openRecipe.attr("id", "openRecipeButton");
        openRecipe.attr("data-index", i);
        recipeResultCardEl.append(openRecipe);

        // Appending everything to dynamicContent
        recipeCol.append(recipeResultCardEl);
        dynamicContent.append(recipeCol);
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

  function showHide() {
    console.log(this);
  }
  /* Define Functions */

  /* Make Function Calls */
  /* Make Function Calls */

  /* Register Event Listeners */
  allergySelector.on("click", ".allergy", settingAllergyCriteria);
  dietSelector.on("click", ".diet", settingDietCriteria);
  recipeSearchBtn.on("click", searchSpoontacular);
  ingredientsForm.on("submit", saveList);
  dynamicContent.on("click", ".recipe", findRecipe);

  searchFiltersTab.on("click", showHide);
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
