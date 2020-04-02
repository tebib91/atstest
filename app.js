const express = require('express');
const cors = require('cors')({origin: true});
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors);

const connectToDb = require('./dbConnection');
const Product = require('./schemas/product');

app.listen(2020, () => {
    console.log("server is running on port:" + 2020);

    let db = connectToDb();

    axios.get('http://test.ats-digital.com:3000/products?size=100')
        .then(function (res) {
            // handle success
            let products = res.data.products;
            if (products) {
                try {
                    try {
                        db.collection('products').insertMany(products).then(result => {
                            console.log(`Successfully inserted ${result.insertedCount} products!`);
                        }).catch(err => console.error(`Failed to insert documents: ${err}`))
                    } catch (e) {
                        console.log(e);
                    }


                } catch (e) {
                    console.log(e)
                }

            }
        })
        .catch(function (err) {
            // handle error
            console.error(err);
        });

    app.get('/products', function (req, res) {
       
            var size = parseInt(req.query.size);
            var page = parseInt(req.query.page);
            if (size === undefined || page === undefined) {
                var size = 10;
                var page = 1;
             } 
       
        let category = req.query.category;

        console.log(JSON.stringify(category, null, 2));
        if (category !== undefined) {
            Product.find({category: category})
                .skip(page * size)
                .limit(size)
                .exec(function (err, docs) {
                    if (err) {
                        console.log(JSON.stringify(err, null, 2));
                        res.status(500).json(err);
                        return;
                    }
                    console.log(JSON.stringify(docs, null, 2));
                    res.status(200).json(docs);
                });
        } else {
            Product.find()
                .skip(page * size)
                .limit(size)
                .exec(function (err, products) {
                    if (err) {
                        console.log(JSON.stringify(err, null, 2));
                        res.status(500).json(err);
                        return;
                    }
                    console.log(JSON.stringify(products, null, 2));
                    res.status(200).json(products);
                });
        }

    });
    app.get('/categories', function (req, res) {
        Product.find({}, {_id: 0, category: 1}).distinct('category').exec(function (err, categories) {
            if (err) {
                console.log(JSON.stringify(err, null, 2));
                res.status(500).json(err);
                return;
            }
            console.log(JSON.stringify(categories, null, 2));
            res.status(200).json(categories);
        });
    })

    app.get('/product/:id', function (req, res) {
        const id = req.params.id;
        Product.findById(id, function (err, product) {
            if (err) {
                console.log(JSON.stringify(err, null, 2));
                res.status(500).json(err);
                return;
            }
            res.status(200).json(product);
        });

    })

});



