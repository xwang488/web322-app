/*********************************************************************************
*  WEB322 – Assignment 4
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jennifer Wang  Student ID: 169554219 Date: 10 October 2022
*
*  Online (Cyclic) URL:  https://plain-poncho-moth.cyclic.app
*
********************************************************************************/ 


const express = require ("express");
const app = express();

const path = require("path");
const data = require("./blog-server.js");
//This used for text and images...
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
//const fs = require("fs");

// 	This use for text only(no images)
//const bodyParser = require('body-parser');
//app. use(bodyParser.urlencoded({ extended: true }));  
app.use(express.static('public')); 


const stripJs = require('strip-js');
//This used for handlebar
const exphbs = require('express-handlebars');
// this used for handlebar and help functions
app.engine('.hbs', exphbs.engine({ 
	extname: '.hbs',
	defaultLayout:"main",
	helpers:{
		navLink: function(url, options){
			return '<li' + 
				((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
				'><a href="' + url + '">' + options.fn(this) + '</a></li>';},
		equal: function (lvalue, rvalue, options) {
			if (arguments.length < 3)
				throw new Error("Handlebars Helper equal needs 2 parameters");
			if (lvalue != rvalue) {
				return options.inverse(this);
			} else {
				return options.fn(this);
			}
		},
		safeHTML: function(context){
			return stripJs(context);
		}						
	}
}));

//This used for handlebar
app.set('view engine', '.hbs');

var HTTP_PORT = process.env.PORT || 8080;			
const upload = multer(); 

cloudinary.config({
	cloud_name: "dofgszlie",
	api_key: "215442383736998",
	api_secret:"l76jjNYoaKNdahwPJiw_qpb9Bjo",
	secure: true
});


app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});




function onHttpStart(){
    console.log("Express http server is listening on: " + HTTP_PORT);
}

// Without middleware
app.get('/', function(req, res){
	res.redirect('/blog');
});

app.get('/about', function(req, res){
	//console.log(path.join(__dirname,"/views/about.html" ));
    //res.sendFile(path.join(__dirname,"/views/about.html" ));
	//res.render("layouts/main");
	res.render("about");

	
});


app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await data.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await data.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await data.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});

app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await data.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await data.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await data.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await data.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

app.get('/posts',(req, res) =>{
	if(req.query.category){
		data.getPostsByCategory(req.query.category).then((data)=>{
			//res.json({data});
			res.render("posts", {posts: data});
		}).catch((err)=>{
			//res.json({message:err});
			res.render("posts", {message: "no results"});
		})
	}
	else if(req.query.minDate){
		data.getPostsByMinDate(req.query.minDate).then((data)=>{
			//res.json({data});
			res.render("posts", {posts: data});
		}).catch((err)=>{
			//res.json({message:err});
			res.render("posts", {message: "no results"});
		})
	}
	else{
		data.getAllPosts().then((data)=>{
			//res.json(data);
			res.render("posts", {posts: data});
		}).catch((err)=>{
			//res.json({message:err});
			res.render("posts", {message: "no results"});
		})
	}
	
});

app.get('/post/:value', (req,res) => {
    data.getPostById(req.params.value).then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});


app.get('/categories',(req, res) =>{

	data.getCategories().then((data)=>{		
		//res.json(data);
		res.render("categories", {categories: data});
	}).catch((err)=>{
		res.render("categories", {message: "no results"});
	})
});

app.get('/posts/add',(req,res)=>{
	//res.sendFile(path.join(__dirname,"/views/addPost.html" ));
	res.render("addPost");
})

app.post('/posts/add', upload.single("featureImage"), (req,res)=>{
	//res.sendFile(path.join(__dirname,"/views/addPost.html" ));
	let streamUpload = (req) => {
		return new Promise((resolve, reject) => {
			let stream = cloudinary.uploader.upload_stream(
				(error, result) => {
				if (result) {
					resolve(result);
				} else {
					reject(error);
				}
				}
			);
	
			streamifier.createReadStream(req.file.buffer).pipe(stream);
		});
	};
	
	async function upload(req) {
		let result = await streamUpload(req);
		console.log(result);
		return result;
	}
	
	upload(req).then((uploaded)=>{
		req.body.featureImage = uploaded.url;
	
		// TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts

		data.addPost(req.body).then(() => {
			res.redirect("/posts");			
		})
	});
});


app.use((req,res)=>{
	res.status(404).render("404",{layout: false});
});

 data.initialize().then(function(){
	app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
	console.log("Unavle to start server: " + err);
});

