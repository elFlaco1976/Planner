$(document).ready(function(){

var currentRecipeIds = [];
var currentRecipes = {};
var currentRecipesSelected = [];

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
console.log("before accept listener");
$('#AcceptSelectionBtn').click(function(){
         console.log ('olafsdfdsf');

    /*$('#currentRecipes').children('li').each(function(i) { 
     
     console.log ('ola');

     //$(this).rotate(ring.stones[i].stone_rotation);
    }); */
});


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
    selectRecipes();

    var rawIngredients = getIngredientsFromRecipes(currentRecipesSelected);

    htmlFillRawIngredientsList(rawIngredients);
}
//todo: rename this. rather is displaying all recipes
function selectRecipes()
{
   var userRecipeSelection = 5;//prompt("Select recipes. First x recipes:");
    var incRecipeSelection = 0;
    for(var i in currentRecipes)
    {
        var contentRecipeTitle = currentRecipes[i].recipe.label;
        let li = document.createElement("li");
/*        let liContent = document.createTextNode(contentRecipeTitle);
        li.appendChild(liContent) 
        htmlRecipeList.appendChild(li); */
        incRecipeSelection++;
        var CheckboxIdIndex = "ChooseRecipe_"+i
        $('#currentRecipes').append('<li class="list-group-item">'+'<h5>'+contentRecipeTitle+'</h5>'+ '<input type="checkbox" ' + "id="+ '\''+ CheckboxIdIndex+ '\'' +'>'); 

        var testId = '<li class="list-group-item" id=RecipeItem>'+'<h5>'+contentRecipeTitle+'</h5>'+ '<input type="checkbox" ' + "id="+ '\''+ CheckboxIdIndex+ '\'' +'>'; 
       // console.log (testId)

        currentRecipesSelected.push(currentRecipes[i]);
        if(incRecipeSelection >= userRecipeSelection)
        {
            break;
        }
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
    for(var i in rawIngredients)
    {
        var li = document.createElement("li");
        var liContent = document.createTextNode(rawIngredients[i]);
        li.appendChild(liContent);

        htmlIngredientList.appendChild(li);
    }
}



})