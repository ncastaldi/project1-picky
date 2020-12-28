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