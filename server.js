var express = require ("express");
var path = require("path");
var data = require("./blog-server.js");
var app = express();


app.use(express.static('public')); 

var HTTP_PORT = process.env.PORT || 8080;

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

	data.getAllPosts().then((data)=>{
		res.json(data);
	})
});

app.get('/categories',(req, res) =>{

	data.getCategories().then((data)=>{
		res.json(data);
	})
});

app.use((req,res)=>{
	res.status(404).sendFile(path.join(__dirname,"/views/404.html"));
});




 data.initialize().then(function(){
	app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
	console.log("Unavle to start server: " + err);
});

