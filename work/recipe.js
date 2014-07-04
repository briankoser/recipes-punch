var fs = require('fs'),
    extname = require('path').extname;


// get all files in folder
// loop
//  if isRecipe, call recipeToJson
var title = "Boxed Mac and Cheese that Doesn't Suck";

fs.readFile(title + '.txt', function(err, logData) {
    if (err) throw err;
    
    var json = recipeToJson(logData.toString());
    var fileName = title
        .replace(/[^A-Za-z ]/g, '')
        .replace(/ /g, '-')
        .toLowerCase() + '.json';
    
    fs.writeFile(fileName, JSON.stringify(json));
});






function isRecipe(file){
    return /\.recipe/.test(extname(file));
}

function recipeToJson(src) {
    if (src == '') return src;
    
    var json = {};
    
    json['datemodified'] = new Date();
    
    var name = src.match(/(Name: )([A-Za-z0-9&' ]+)/);
    if (name != undefined)
    {
        json['name'] = name[2];
    }
    
    var author = src.match(/(Author: )([A-Za-z0-9 ]+)/);
    if (author != undefined)
    {
        json['author'] = author[2];
    }
    
    var description = src.match(/(Comments: )([A-Za-z0-9 ]+)/);
    if (description != undefined)
    {
        json['description'] = description[2];
    }
    
    var yield = src.match(/(Yield: )([A-Za-z0-9\- ]+)/);
    if (yield != undefined)
    {
        json['yield'] = yield[2];
    }
    
    //['Name', 'Author', 'Description', 'Yield'].forEach(function() {
    //    
    //});
    
    var ingredients = src
        .match(/(?:Ingredients:)([\s\S]*)(?=Directions)/)[1]
        .split('\n- ')
        .filter(function(n){ return n.trim() != '' });
    ingredients.forEach(function(item, index){ ingredients[index] = item.trim()});
    json['ingredients'] = ingredients;
    
    var directions = src
        .match(/(?:Directions:)([\s\S]*)(?=Yield)/)[1]
        .split('\n- ')
        .filter(function(n){ return n.trim() != '' });
    directions.forEach(function(item, index){ directions[index] = item.trim()});
    json['instructions'] = directions;
    
    return json;
}