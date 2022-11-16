
//const Sequelize = require('sequelize');
const Sequelize = require ('sequelize');
var sequelize = new Sequelize('wzgohwyg', 'wzgohwyg', 'bFJNiEYE8DVNoe6G0tc48YtzNeqDdpVc', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

 // define "Post" model
var Post = sequelize.define('Post',{
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

// define "category" model
var Category = sequelize.define('Category',{
    category: Sequelize.STRING
});

//define a relationship between Posts and Categories

Post.belongsTo(Category, {foreignKey: 'category'});

// synchronize the Database with our models and automatically add the 
// table if it does not exist

module.exports.initialize = function(){
    return new Promise((resolve, reject) => {
        sequelize.sync().then(()=>{
            resolve();
        }).catch(()=>{
            reject("Unable to sync with database");
        });        
    });
}



module.exports.getPublishedPosts=()=>{
    return new Promise((resolve, reject)=>{
        Post.findAll({
            where:{
                published: true
            }}).then(function(data){
                resolve(data);
            }).catch((err)=>{
                reject("no results returned");
            });       
    });
}

module.exports.getPublishedPostsByCategory=(categoryid)=>{
    return new Promise((resolve, reject)=>{
        Post.findAll({
            where:{
                published: true,
                category: categoryid
            }}).then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });     
    });
}

module.exports.getAllPosts = function(){
    return new Promise((resolve, reject) => {
        Post.findAll().then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });       
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve, reject)=>{
        Category.findAll().then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });       
    });
}


module.exports.getPostsByCategory = function(num) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where:{
                category: num
            }
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });       
    });
}


module.exports.getPostsByMinDate = function(minDateStr) {
    const { gte } = Sequelize.Op;
    return new Promise((resolve, reject)=>{       
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });       
    });
}

module.exports.getPostById = function(postid){
    console.log("Jeniifer:okok"+postid);
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                id: postid
            }
        }).then(function(data){
            console.log("Posts fund!");
            resolve(data[0]);
        }).catch((err)=>{
            reject("no results returned");
        });       

    });
}




module.exports.deleteCategoryById = function(Categoryid){
    return new Promise((resolve, reject)=>{
        Category.destroy({
            where: { id: Categoryid } //  remove id == Categoryid
        }).then(function (data) { 
            resolve(data);
        }).catch((err)=>{
            reject("no categorydata delete");
        });      
    })
}


module.exports.deletePostById = function(Postid){
    return new Promise((resolve,reject) => {
        Post.destroy({
            where: {
                id: Postid
            }
        })
        .then(function(data){
            resolve(data);

        }).catch((err)=>{
            reject('unable to delete post');
        });
    })
};

// Add Post
 
module.exports.addPost = function(postData){

    return new Promise((resolve, reject) => {

        postData.published = (postData.published) ? true : false;

        for(var d in postData){

            if(postData[d] == '') postData[d] = null;//convert empty data to null

        }

        let now = new Date();
        postData.postDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

        Post.create(postData).then(function(data){

            resolve(data);

        }).catch((err)=>{

            reject("unable to create post in function addPost ");

        });  

    });

}


//Add category--ass5

module.exports.addCategory = function(categoryData){

    return new Promise((resolve, reject) =>{

        for(var d in categoryData){

            if(categoryData[d] == '') categoryData[d] = null;

        }

        Category.create(categoryData).then(function(data){

            resolve(data);

        }).catch((err)=>{

            reject("unable to create category in function addCategory");

        });

    });

}