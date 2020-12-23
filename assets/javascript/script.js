$(document).ready(function () {
  /* Declare DOM Variables */
  var userQueryInput = $("#userQueryInput");
  var recipeSearchBtn = $("#recipeSearchBtn");

  var ingredientsForm = $("#ingredientsForm");

  /* Declare JavaScript Variables */

  /* Define Functions */
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
    $.ajax({
      url: searchURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
  }

  /* Make Function Calls */

  /* Register Event Listeners */
  recipeSearchBtn.on("click", findRecipe);
  $("#ingredientsForm").on("submit", function (event) {
    event.preventDefault();

    btn.value = "Sending...";

    const serviceID = "service_y9qb5eg";
    const templateID = "template_241tje5";

    emailjs.sendForm(serviceID, templateID, this).then(
      () => {
        btn.value = "Send Email";
        alert("Sent!");
      },
      (err) => {
        btn.value = "Send Email";
        alert(JSON.stringify(err));
      }
    );
  });
});
