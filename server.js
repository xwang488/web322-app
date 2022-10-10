/*********************************************************************************
*  WEB322 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jennifer Wang  Student ID: 169554219 Date: 26 September 2022
*
*  Online (Cyclic) URL: 
*
********************************************************************************/ 


var express = require ("express");
var path = require("path");
var data = require("./blog-server.js");
var app = express();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const fs = require("fs");
const bodyParser = require('body-parser');
var HTTP_PORT = process.env.PORT || 8080;
const upload = multer(); 

cloudinary.config({
	cloud_name: "dofgszlie",
	api_key: "215442383736998",
	api_secret:"l76jjNYoaKNdahwPJiw_qpb9Bjo",
	secure: true
});

app.use(express.static('public')); 

function onHttpStart(){
    console.log("Express http server is listening on: " + HTTP_PORT);
}

// Without middleware
app.get('/', function(req, res){
	res.redirect('/about');
});

app.get('/about', function(req, res){
	//console.log(path.join(__dirname,"/views/about.html" ));
    res.sendFile(path.join(__dirname,"/views/about.html" ));
	
});

app.get('/blog',(req, res) =>{

	data.getPublishedPosts().then((data)=>{
		res.json(data);
	})
});

app.get('/posts',(req, res) =>{
	if(req.query.category){
		data.getPostsByCategory(req.query.category).then((data)=>{
			res.json({data});
		}).catch((err)=>{
			res.json({message:err});
		})
	}
	else if(req.query.minDate){
		data.getPostsByMinDate(req.query.minDate).then((data)=>{
			res.json({data});
		}).catch((err)=>{
			res.json({message:err});
		})
	}
	else{
		data.getAllPosts().then((data)=>{
			res.json(data);
		}).catch((err)=>{
			res.json({message:err});
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
		res.json(data);
	})
});

app.get('/posts/add',(req,res)=>{
	res.sendFile(path.join(__dirname,"/views/addPost.html" ));
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
	res.status(404).sendFile(path.join(__dirname,"/views/404.html"));
});

 data.initialize().then(function(){
	app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
	console.log("Unavle to start server: " + err);
});

