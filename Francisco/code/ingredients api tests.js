$(document).ready(function(){

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

//listener for search field
$('#SearchRecipeBtn').click(function(){
var userKeyword = $('#KeywordRecipeField').val();
//Get recipes with a keyword. Once answer is recieved, executes onSearchResponse
getRecipes(userKeyword);
});

//listener for accept selection field
var SelectedRecipe = [];
var countChecked = function() {
  var n = $( "input:checked" ).length;
  $( "div" ).text( n + (n === 1 ? " is" : " are") + " checked!" );
};
countChecked();

$( "input[type=checkbox]" ).on( "click", countChecked );

$('#AcceptSelectionBtn').click(function(){
   document.getElementById("currentIngredients").innerHTML=" ";
      SelectedRecipe = [];
      var RecipeIds = [];
         console.log ('Listener to select OK');
         $( "input:checked" ).each(function(i){
           SelectedRecipe.push(($(this).attr('id')));
         });
         ExtractRecipeId (SelectedRecipe, RecipeIds);
         console.log(SelectedRecipe);
         
         PopulateIngredFromId(RecipeIds);
         
       })
    //clicked element, do-some-stuff

function ExtractRecipeId (SelectedRecipe, RecipeIds){
  for (i=0; i<(SelectedRecipe.length); ++i){
    var RecipeId = SelectedRecipe[i].split("_")[1];
    RecipeIds.push(RecipeId);
    console.log(RecipeIds);
  }
}

var SelectedRecipes = [];
function PopulateIngredFromId (RecipeIds){
    for (i=0; i<(RecipeIds.length); ++i){
         SelectedRecipes.push(currentRecipes[RecipeIds[i]]);   
}
    var rawIngredients = getIngredientsFromRecipes(SelectedRecipes);
    
    htmlFillRawIngredientsList(rawIngredients);
}

function appendParameterToUrl(url, parameterName, parameterValue)
{
    return url + "&" + parameterName + "=" + parameterValue;
}

function getRecipes(keyword)
{
    var urlSearch = baseUrlSearch + keyword;
    fetch(urlSearch)
    .then(function(response){ return response.json(); })
    .then(function(data)
    {
        onSearchResponse(data);
    }
    );
}

function onSearchResponse(data)
{
    currentRecipes = data.hits;
    console.log("Answer from fetch:" + currentRecipes);

    //Kind of user selection. Just select first n recipes for now
    populateRecipeList();

    //todo change place var rawIngredients = getIngredientsFromRecipes(currentRecipesDisplayed);

    //todo change place for this: htmlFillRawIngredientsList(rawIngredients);
}

function populateRecipeList()
{
    for(var i in currentRecipes)
    {
        var contentRecipeTitle = currentRecipes[i].recipe.label;
        let li = document.createElement("li");


        var CheckboxIdIndex = "ChooseRecipe_"+i
        $('#currentRecipes').append('<li class="list-group-item">'+'<h5>'+contentRecipeTitle+'</h5>'+ '<input type="checkbox" ' + "id="+ '\''+ CheckboxIdIndex+ '\'' +'>');

        currentRecipesDisplayed.push(currentRecipes[i]);
    }        




}

function getIngredientsFromRecipes(recipes)
{
    var ingredients = [];
    for(var i in recipes)
    {
        //Concatenates ingredient list of one recipe to total list of ingredients
        ingredients.push.apply(ingredients, getIngredientsFromRecipe(recipes[i]));
    }
    return ingredients;
}

function getIngredientsFromRecipe(recipe)
{
    var ingredientLines = recipe.recipe.ingredientLines;
    var ingredients = [];
    for(var i in ingredientLines)
    {
        //Builds ingredient list
        ingredients.push(ingredientLines[i]);
    }
    return ingredients;
}

//Fills html ul list
function htmlFillRawIngredientsList(rawIngredients)
{
  //$('#currentIngredients').empty();  
  document.getElementById("currentIngredients").innerHTML=" ";
  
    for(var i in rawIngredients)
    {
        var li = document.createElement("li");
        var liContent = document.createTextNode(rawIngredients[i]);
        li.appendChild(liContent);
        htmlIngredientList.appendChild(li);
    }
    rawIngredients = [];
}



})
