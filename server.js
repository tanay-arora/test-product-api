const fs= require('fs')
var express = require('express');
var app = express();
var cors = require('cors');
var _ = require("underscore");

app.use(cors())
app.get('/',function (req,res){
    res.send('node server running!')
})
app.get('/api/banner/', function(req,res){
    fs.readFile('./routes/banner/banner.json',function(err,data){
        if(err){
            return res.send("404 not found")
        }
        res.end(data)
    })
})

app.get('/api/categories/', function(req,res){
    fs.readFile('./routes/category/categories.json', function(err,data){
        if (err) {
            return res.end("404 Not Found"); 
          } 
          res.end(data);
    })
})
app.get('/api/subcategories/', function(req,res){
    fs.readFile('./routes/category/subcategories.json', function(err,data){
        if (err) {
            return res.send("404 Not Found");
          } 
          res.end(data)
    })
})
app.get('/api/brands/', function(req,res){
    fs.readFile('./routes/brands/brands.json', function(err,data){
        if (err) {
            return res.send("404 Not Found");
          } 
          res.end(data)
    })
})
app.get('/api/products/', function(req,res){
    fs.readFile('./routes/products/products.json', function(err,value){
        if (err) {
            return res.send("404 Not Found");
          } 
          res.end(value)
    })
})
app.get('/api/categories/:category',function(req,res){
    let category = req.params.category
    fs.readFile('./routes/products/products.json',function(err,data){
        if(err){
            return res.send("404 Not Found");
        }
        res.end(JSON.stringify(JSON.parse(data).filter(value=>value.category.slug===category)))
    })
})
app.get('/api/brands/:brand', function(req,res){
    var brand = req.params.brand;
    fs.readFile('./routes/products/products.json', function(err,data){
        if (err) {
            return res.send("404 Not Found");
          } 
        let list = JSON.parse(data)
        let result = list.filter(item=>item.brand.slug===brand)
        res.end(JSON.stringify(result))
    })
})
app.get('/api/subcat/:category', function(req,res){
    var category = req.params.category;
    fs.readFile('./routes/products/products.json', function(err,data){
        if(err){
            return res.send("404 Not Found");
        }
        let products =[]
        let list = JSON.parse(data)
        let result = list.filter(item=>item.subcategory.slug===category)
        res.end(JSON.stringify(result))
    })
})
app.get('/api/chain_search/brand/:brands',function(req,res){
    var brands = req.params.brands
    fs.readFile('./routes/products/products.json', function(err,data){
        if (err) {
            return res.send("404 Not Found");
          }
        let list=JSON.parse(data)
        let regex = new RegExp(":","g") 
        let new_list = brands.replace(regex,"\n")
        new_list = new_list.split("\n")
        let products=[]
        new_list.map(z=>{
            list.map(value=>{
                if(value.brand.slug===z.toLowerCase()
                .replace(/[^\w \-]+/g,'')
                .replace(/ +/g,'-')) products.push(value)
            })
        })
        res.end(JSON.stringify(products))
    })
})
app.get('/api/chain_search/subcategory/:category',function(req,res){
    var category = req.params.category
    fs.readFile('./routes/products/products.json', function(err,data){
        if (err) {
            return res.send("404 Not Found");
          }
        let list=JSON.parse(data)
        let regex = new RegExp(":","g") 
        let new_list = category.replace(regex,"\n")
        new_list = new_list.split("\n")
        let products=[]
        new_list.map(z=>{
            list.map(value=>{
                if(value.subcategory.slug===z.toLowerCase()
                .replace(/[^\w \-]+/g,'')
                .replace(/ +/g,'-')) products.push(value)
            })
        })
        res.end(JSON.stringify(products))
    })
})
app.get('/api/chain_search/:category/:brand',function(req,res){
    var category = req.params.category
    var brand = req.params.brand
    fs.readFile('./routes/products/products.json', function(err,data){
        if (err) {
            return res.send("404 Not Found");
          }
        let list=JSON.parse(data)
        let regex = new RegExp(":","g") 
        let category_list = category.replace(regex,"\n")
        category_list = category_list.split("\n")
        let brand_list = brand.replace(regex,"\n")
        brand_list = brand_list.split("\n")
        let brand_products=[]
        let category_products=[]
        let result=[]
        category_list.map(z=>{
            list.map(value=>{
                if(value.subcategory.slug===z.toLowerCase()
                .replace(/[^\w \-]+/g,'')
                .replace(/ +/g,'-')) category_products.push(value)
            })
        })
        brand_list.map(z=>{
            list.map(value=>{
                if(value.brand.slug===z.toLowerCase()
                .replace(/[^\w \-]+/g,'')
                .replace(/ +/g,'-')) brand_products.push(value)
            })
        })
        brand_products.map(values=>{
            category_products.map(items=>{
                if(values.product_id===items.product_id) result.push(values)
            })
        })
        res.end(JSON.stringify(result))
    })
})
app.get('/api/search/:search',function(req,res){
    let search = req.params.search
    fs.readFile('./routes/products/products.json',function(err,data){
        if (err) {
            return res.send("404 Not Found");
        }
        let list = JSON.parse(data)
        let result = list.filter(data=>{
            return data.brand.title.toLowerCase().includes(search) || data.category.title.toLowerCase().includes(search) || data.title.toLowerCase().includes(search) || data.subcategory.title.toLowerCase().includes(search)
        })
        res.end(JSON.stringify(result))
    })
})
app.get('/media/product/:image',function(req,res){
    let image = req.params.image
    fs.readFile('./routes/products/images/'+image,function(err,data){
        if(err){
            return res.send("404 not found")
        }
        res.end(data)
    })
})
app.get('/media/category/:image',function(req,res){
    let image = req.params.image
    fs.readFile('./routes/category/images/'+image,function(err,data){
        if(err){
            return res.send("404 not found")
        }
        res.end(data)
    })
})
app.get('/media/banner/:image',function(req,res){
    let image = req.params.image
    fs.readFile('./routes/banner/images/'+image,function(err,data){
        if(err){
            return res.send("404 not found")
        }
        res.end(data)
    })
})
app.get('/api/offers/:number',function(req,res){
    let number = req.params.number
    fs.readFile('./routes/products/products.json',function(err,data){
        if(err){
            return res.send("404 Not Found")
        }
        let result=JSON.parse(data).filter((value,index)=>index<+number)
        res.end(JSON.stringify(result))
    })
})
app.use(
    express.urlencoded({
      extended: true
    })
  )
  
  app.use(express.json())
  
app.post('/api/create-order',function(req,res){
    console.log(req.body.json)
    res.end("true")
})
var server = app.listen(8000,()=>{
    var port = server.address().port
    console.log("Node server listening at port:",port)
})