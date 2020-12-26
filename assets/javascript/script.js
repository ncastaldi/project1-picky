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
    }
  }

  function findRecipe(event) {
    event.preventDefault();
    var searchQuery = userQueryInput.val();
    var appID = "097df148";
    var appKey = "9aac325c109e9c8f03dcbcb3501b2988";
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
    console.log(searchURL);
    $.ajax({
      url: searchURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
  }

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

  /* Make Function Calls */

  /* Register Event Listeners */
  buttonSelectors.on("click", ".allergy", settingSearchCriteria);
  recipeSearchBtn.on("click", findRecipe);
  ingredientsForm.on("submit", saveList);

  spoontacularButton.on("click", searchSpoontacular);
});



////daniels filter tabs
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