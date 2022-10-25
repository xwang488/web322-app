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

module.exports.getPublishedPostsByCategory=(category)=>{
    return new Promise((resolve, reject)=>{
        var filteredposts = [];
        for(let i = 0; i< posts.length; i++ ){
            if(posts[i].published == true && posts[i].category == category){
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

module.exports.addPost = function(postData){
    var currDate = new Date();
    var day = currDate.toLocaleString('en-US', { day: '2-digit'});
    var month = currDate.toLocaleString('en-US', { month: '2-digit'});
    var year = currDate.getFullYear();
    var m_postDate = year  + "-" + month + "-" + day;
    return new Promise((resolve, reject)=>{
        postData.id = posts.length + 1;
        postData.published = (postData.published)? true : false;
        postData.postDate = m_postDate;
        posts.push(postData);
        resolve();
    })
}

module.exports.getPostsByCategory = function(category) {
    return new Promise((resolve, reject)=>{
        var filteredposts = [];
        for(let i = 0; i< posts.length; i++ ){
            if(posts[i].category == category){
                filteredposts.push(posts[i]);
            }
        }
        if(filteredposts.length == 0){
            reject("category posts no results returned!");
        }
        else{
            resolve(filteredposts);
        }
    });

}


module.exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject)=>{
        var filteredposts = [];
        for(let i = 0; i< posts.length; i++ ){
            if(posts[i].postDate >= minDateStr ){
                filteredposts.push(posts[i]);
            }
        }
        if(filteredposts.length == 0){
            reject("postDate posts no results returned!");
        }
        else{
            resolve(filteredposts);
        }
    });
}

module.exports.getPostById = function(id){
    return new Promise((resolve,reject)=>{
        let foundPost = posts.find(post => post.id == id);

        if(foundPost){
            resolve(foundPost);
        }else{
            reject("no result returned");
        }
    });
}