$(document).ready(function () {

    var currentRecipeIds = [];
    var currentRecipes = {};
    var currentRecipesDisplayed = [];

    //url infos - for food2fork
    //const baseUrlSearch = "http://food2fork.com/api/search?key=9ae655dca216187117cd9c66a335a53e";
    //const baseUrlRecipe = "http://food2fork.com/api/get?key=9ae655dca216187117cd9c66a335a53e";

    //url infos - for edamam
    const baseUrlSearch = "https://api.edamam.com/search?app_id=b03b6d4c&app_key=a9ca3cc36a6e430922d27f05642b6c4c&q=";
    const baseUrlRecipe = "https://api.edamam.com/search?app_id=b03b6d4c&app_key=a9ca3cc36a6e430922d27f05642b6c4c&r=";

    //User selections
    var userKeyword = "";
    var htmlRecipeList = document.getElementById("currentRecipes");
    var htmlIngredientList = document.getElementById("currentIngredients");
    var htmlRecipeTitlesList = document.getElementById("SelecteRecipeList");

    //listener for search field
    $('#SearchRecipeBtn').click(function () {
        $('#currentRecipes').empty();
        var userKeyword = $('#KeywordRecipeField').val();
        //Get recipes with a keyword. Once answer is recieved, executes onSearchResponse
        getRecipes(userKeyword);
    });

    //listener for accept selection field
    $('#AcceptSelectionBtn').click(function () {
        SelectedRecipe = [];
        var RecipeIds = [];
        //console.log('Listener to select OK'); //debug
        $("input:checked").each(function (i) {
            SelectedRecipe.push(($(this).attr('id'))); //identify checked buttons
        });
        ExtractRecipeId(SelectedRecipe, RecipeIds); //extract recipe id to show ingred (SelectedRecipe, RecipeIds); 
        //   console.log('SelectedRecipe' + SelectedRecipe); //debug
        //   console.log('RecipeIds' + RecipeIds); //debug
        populateIngredFromId(RecipeIds); // populate list
        populateTitles( temporarySelectedRecipes )
        //UpdateSelectedRecipes(TemporarySelectedRecipes);
       
    })

    function ExtractRecipeId(selectedRecipe, RecipeIds) {
        for (i = 0; i < (selectedRecipe.length); i++) {
            var RecipeId = selectedRecipe[i].split("_")[1];
            RecipeIds.push(RecipeId);
            // console.log('RecipeIds' + RecipeIds); //debug
        }
    }

    var FinalSelectedRecipes = [];
    function updateSelectedRecipes(temporarySelectedRecipes) {
        FinalSelectedRecipes = [];
        for (var i in temporarySelectedRecipes) {

            /*for (var i in TemporarySelectedRecipes) {
                FinalSelectedRecipes.push(TemporarySelectedRecipes[i]);
                
            }

            console.log('TemporarySelectedRecipes = ' + TemporarySelectedRecipes);
            console.log('FinalSelectedRecipes = ' + FinalSelectedRecipes);*/
        }
    }

        var temporarySelectedRecipes = [];
        function populateIngredFromId(RecipeIds) {
            temporarySelectedRecipes = [];
            //console.log('PopulateIngredFromId RecipeIds ' + RecipeIds); //debug
            for (i = 0; i < (RecipeIds.length); i++) {
                temporarySelectedRecipes.push(currentRecipes[RecipeIds[i]]);
            }
            //console.log('PopulateIngredFromId TemporarySelectedRecipes' + TemporarySelectedRecipes); //debug
            var rawIngredients = getIngredientsFromRecipes(temporarySelectedRecipes);
            htmlFillRawIngredientsList(rawIngredients);

        }

        function populateTitles(recipesTT) {
            var rawTitlesSelectedRecipe = getTitlesFromRecipes(recipesTT);
            //console.log(rawTitlesSelectedRecipe); //debug
            htmlFillRawTitlesList(rawTitlesSelectedRecipe);
        }

        function appendParameterToUrl(url, parameterName, parameterValue) {
            return url + "&" + parameterName + "=" + parameterValue;
        }

        function getRecipes(keyword) {
            var urlSearch = baseUrlSearch + keyword;
            fetch(urlSearch)
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    onSearchResponse(data);
                }
                );
        }

        function onSearchResponse(data) {
            currentRecipes = data.hits;
            //console.log("Answer from fetch:" + currentRecipes); //debug
            //Kind of user selection. Just select first n recipes for now
            populateRecipeList();
        }

        function populateRecipeList() {
            for (var i in currentRecipes) {
                var contentRecipeTitle = currentRecipes[i].recipe.label;
                let li = document.createElement("li");
                var checkboxIdIndex = "ChooseRecipe_" + i
                $('#currentRecipes').append('<li class="list-group-item" id="listeRecettes">' + '<h5>' + contentRecipeTitle + '</h5>' + '<input class=checkRec type="checkbox" ' + "id=" + '\'' + checkboxIdIndex + '\'' + '>');
                currentRecipesDisplayed.push(currentRecipes[i]);
            }
        }

        function getIngredientsFromRecipes(recipes) {
            var ingredients = [];
            for (var i in recipes) {
                //Concatenates ingredient list of one recipe to total list of ingredients
                ingredients.push.apply(ingredients, getIngredientsFromRecipe(recipes[i]));
            }
            
            return ingredients;
        }

        function getIngredientsFromRecipe(recipe) {
            var ingredientLines = recipe.recipe.ingredientLines;
            //console.log(recipe); //debug
            var ingredients = [];
            for (var i in ingredientLines) {
                //Builds ingredient list
                ingredients.push(ingredientLines[i]);
            }
            
            return ingredients;
        }


        function getTitlesFromRecipes(recipes) {
            var Titles = [];
            for (var i in recipes) {
                //Concatenates ingredient list of one recipe to total list of Titles
                Titles.push(getTitleFromRecipe(recipes[i]));
            }
           // console.log(Titles);//debug
            return Titles;
        }

        function getTitleFromRecipe(recipe) {
            var Recipetitle = recipe.recipe.label;
            //console.log(Recipetitle); //debug
            return Recipetitle;
        }



        //Fills html ul list
        function htmlFillRawIngredientsList(rawIngredients) {
            $('#currentIngredients').empty(); //empties the list to refill it again
            for (var i in rawIngredients) {
                var li = document.createElement("li");
                var liContent = document.createTextNode(rawIngredients[i]);
                li.appendChild(liContent);
                htmlIngredientList.appendChild(li);
            }
        }

        //Fills html ul list
        function htmlFillRawTitlesList(rawTitlesSelectedRecipe) {
            console.log( 'htmlFillRawTitlesList ' +rawTitlesSelectedRecipe);
            $('#SelecteRecipeList').empty(); //empties the list to refill it again
            for (var i in rawTitlesSelectedRecipe) {
                var li = document.createElement("li");
                li.className = "list-group-item";
                li.setAttribute("id", "RecipeItem");
                var liContent = document.createTextNode(rawTitlesSelectedRecipe[i]);
                li.appendChild(liContent);
                htmlRecipeTitlesList.appendChild(li);
            }
        }


    })
