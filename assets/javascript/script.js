$(document).ready(function () {
  /* Declare DOM Variables */
  var userQueryInput = $("#rs");
  var recipeSearchBtn = $("#searchButton");
  var buttonSelectors = $("#buttonSelectors");
  var ingredientsForm = $("#ingredientsForm");
  var dynamicContent = $("#dynamicContent");

  /* Declare JavaScript Variables */
  var recipeID = [];
  var noTreeNuts = false;
  var noDairy = false;
  var noEggs = false;
  var noPeanuts = false;
  var noAlcohol = false;

  /* Declare JavaScript Variables */

  /* Define Functions */
  // Function to toggle the allergen variables.
  function settingSearchCriteria(event) {
    var allergySelected = $(this).attr("data-type");
    switch (allergySelected) {
      case "treeNuts":
        if (noTreeNuts) {
          noTreeNuts = false;
          break;
        } else {
          noTreeNuts = true;
          break;
        }
      case "dairy":
        if (noDairy) {
          noDairy = false;
          break;
        } else {
          noDairy = true;
          break;
        }
      case "eggs":
        if (noEggs) {
          noEggs = false;
          break;
        } else {
          noEggs = true;
          break;
        }
      case "peanuts":
        if (noPeanuts) {
          noPeanuts = false;
          break;
        } else {
          noPeanuts = true;
          break;
        }
      case "alcohol":
        if (noAlcohol) {
          noAlcohol = false;
          break;
        } else {
          noAlcohol = true;
          break;
        }
    }
  }

  //Function to call Spoontacular API
  function searchSpoontacular(event) {
    event.preventDefault();

    /* Clear dynamicContent DIV ahead of writing new search results */
    dynamicContent.empty();

    // Declaring local variables.
    var searchQuery = $(userQueryInput).val();
    console.log(searchQuery);
    recipeID = [];
    var recipeImage = [];
    var recipeTitle = [];

    var recipeSearchURL =
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=096dffd3ff0d4431820fce4a3121a0c1";
    searchQuery = "&query=" + searchQuery;

    $.ajax({
      url: recipeSearchURL + searchQuery,
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
        var recipeResultCardEl = $("<div>");
        recipeResultCardEl.addClass("row card");

        // Making the title element.
        var recipeResultTitleEl = $("<p> " + recipeTitle[i] + "</p>");
        // recipeResultTitleEl.append(recipeTitle[i]);
        recipeResultCardEl.append(recipeResultTitleEl);

        // Making the img's and setting the src.
        var recipeResultImg = $("<img>");
        recipeResultImg.attr("src", recipeImage[i]);
        recipeResultCardEl.append(recipeResultImg);

        // Making a button to show the recipe.
        var openRecipe = $("<button>").text("Show Recipe");
        openRecipe.attr("class", "btn btn-primary recipe");
        openRecipe.attr("id", "openRecipeButton");
        openRecipe.attr("data-index", i);
        recipeResultCardEl.append(openRecipe);

        // Appending everything to dynamicContent
        dynamicContent.append(recipeResultCardEl);
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
  buttonSelectors.on("click", ".allergy", settingSearchCriteria);
  recipeSearchBtn.on("click", searchSpoontacular);
  ingredientsForm.on("submit", saveList);
  dynamicContent.on("click", ".recipe", findRecipe);
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
