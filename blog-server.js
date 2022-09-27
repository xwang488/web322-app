const fs = require("fs");

var posts = [];
var categories = [];

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
        fs.readFile('./data/categories.json', (err, data)=>{
            if(err){
                reject(err);
            }else{
                categories = JSON.parse(data);
                resolve();
            }
        });
        fs.readFile('./data/posts.json', (err, data)=>{
            if(err){
                reject(err);
            }else{
                posts = JSON.parse(data);
                resolve();
            }
        });
    });
}

module.exports.getPublishedPosts=()=>{
    return new Promise((resolve, reject)=>{
        var filteredposts = [];
        for(let i = 0; i< posts.length; i++ ){
            if(posts[i].published == true){
                filteredposts.push(posts[i]);
            }
        }

        if(filteredposts.length == 0){
            reject("Published posts no results returned!");
        }
        else{
            resolve(filteredposts);
        }
    });
}

module.exports.getAllPosts = function(){
    return new Promise((resolve, reject)=>{
        if(posts.lenght == 0){
            reject(" Posts no results returned!");
        }
        else{
            resolve(posts);
        }
    })
}

module.exports.getCategories = function(){
    return new Promise((resolve, reject)=>{
        if(categories.lenght == 0){
            reject(" categories no results returned!");
        }
        else{
            resolve(categories);
        }
    })
}