$(document).ready(function () {
  /* Declare DOM Variables */
  var userQueryInput = $("#userQueryInput");
  var recipeSearchBtn = $("#recipeSearchBtn");
  var buttonSelectors = $("#buttonSelectors");
  var ingredientsForm = $("#ingredientsForm");

  var spoontacularButton = $("#spoontacular");

  /* Declare JavaScript Variables */
  var noTreeNuts = false;
  var noDairy = false;
  var noEggs = false;
  var noPeanuts = false;
  var noAlcohol = false;

  var searchResults = [];
  var resultTitle = [];
  var resultImage = [];
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
  function searchingAPIs(event) {
    event.preventDefault();
    var searchQuery = $(this).prev().val();
    searchEdamam(event, searchQuery);
    searchSpoontacular(event, searchQuery);
  }
  //Function to query Edamam API
  function searchEdamam(event, searchQuery) {
    event.preventDefault();

    var appID = "a1693f14";
    var appKey = "f3aa39b9486a7dff1bea7a4cbcede5a9";
    var searchURL =
      "https://api.edamam.com/search?q=" +
      searchQuery +
      "&app_id=" +
      appID +
      "&app_key=" +
      appKey;

    // Adding these tags to the URL if the approiate selector is true.
    if (noTreeNuts && searchURL.indexOf("health=tree-nut-free") === -1) {
      searchURL = searchURL + "&health=tree-nut-free";
    }
    if (noEggs && searchURL.indexOf("health=vegan") === -1) {
      searchURL = searchURL + "&health=vegan";
    }
    if (noDairy && searchURL.indexOf("health=vegan") === -1) {
      searchURL = searchURL + "&health=vegan";
    }
    if (noPeanuts && searchURL.indexOf("health=peanut-free") === -1) {
      searchURL = searchURL + "&health=peanut-free";
    }
    if (noAlcohol && searchURL.indexOf("health=alcohol-free")) {
      searchURL = searchURL + "&health=alcohol-free";
    }
    // console.log(searchURL);
    $.ajax({
      url: searchURL,
      method: "GET",
    }).then(function (response) {
      // console.log(response);
      // searchResults = response.hits;
      // displayRecipes(event);
    });
  }

  //Function to call Spoontacular API
  function searchSpoontacular(event, searchQuery) {
    event.preventDefault();
    // Declaring local variables.
    var recipeID = [];
    var recipeImage = [];
    var recipeTitle = [];

    var recipeSearchURL =
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=55ef65bbdb1c401490f851867d7b839f";
    searchQuery = "&query=" + searchQuery;

    $.ajax({
      url: recipeSearchURL + searchQuery,
      method: "GET",
    }).then(function (response) {
      var spoonResults = response.results;

      // Defining the three main variables we will be using.
      for (let i = 0; i < spoonResults.length; i++) {
        recipeTitle.push(JSON.stringify(spoonResults[i].title));
        recipeImage.push(JSON.stringify(spoonResults[i].image));
        recipeID.push(JSON.stringify(spoonResults[i].id));

        var recipeResultCardEl = $("<div>");
        recipeResultCardEl.addClass("row");
        var recipeResultImg = $("<img>");
        recipeResultImg.attr("src", resultImage[i]);
        recipeResultCardEl.append(recipeResultImg);
        var recipeResultTitleEl = $("<p>");
        recipeResultTitleEl.text(resultTitle[i]);
        recipeResultCardEl.append(recipeResultTitleEl);
        dynamicContentEl.append(recipeResultCardEl);

        // Making recipe cards.
      }
      console.log(recipeTitle);
      console.log(recipeID);
      console.log(recipeImage);
      // Preparing the URL for the second ajax call to get the recipe.
      var recipeStepsURL =
        "https://api.spoonacular.com/recipes/" +
        recipeID +
        "/analyzedInstructions?apiKey=55ef65bbdb1c401490f851867d7b839f";

      $.ajax({
        url: recipeStepsURL,
        method: "GET",
      }).then(function (response2) {
        // console.log("Recipe Steps: " + results);
      });
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
  recipeSearchBtn.on("click", searchingAPIs);
  ingredientsForm.on("submit", saveList);

  spoontacularButton.on("click", searchSpoontacular);
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
