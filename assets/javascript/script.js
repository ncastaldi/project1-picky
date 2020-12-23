$(document).ready(function () {
  /* Declare DOM Variables */
  var userQueryInput = $("#userQueryInput");
  var recipeSearchBtn = $("#recipeSearchBtn");
  var buttonSelectors = $("#buttonSelectors");

  var ingredientsForm = $("#ingredientsForm");

  /* Declare JavaScript Variables */
  var noTreeNuts = false;
  var noDairy = false;
  var noEggs = false;

  /* Define Functions */
  function settingSearchCriteria(event) {
    var allergySelected = $(this.attr("data-type"));
    if (allergySelected === treeNuts) {
      if (noTreeNuts) {
        noTreeNuts = false;
      } else {
        noTreeNuts = true;
      }
    }
    if (noDairy) {
      noDairy = false;
    } else {
      noDairy = true;
    }
    if (noEggs) {
      noEggs = false;
    } else {
      noEggs = true;
    }
  }

  function findRecipe(event) {
    event.preventDefault();
    var searchQuery = userQueryInput.val();
    console.log(searchQuery);
    var appID = "097df148";
    var appKey = "9aac325c109e9c8f03dcbcb3501b2988";
    var searchURL =
      "https://api.edamam.com/search?q=" +
      searchQuery +
      "&app_id=" +
      appID +
      "&app_key=" +
      appKey;
    if (noNuts) {
      searchURL = searchURL + "&healthLabels=tree-nut-free";
    }
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
});
