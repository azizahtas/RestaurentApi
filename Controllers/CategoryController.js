var express = require('express');
var CategoryRouter = express.Router();
var Category = require('../Models/Menu');

CategoryRouter.use('*',function (req, res, next) {
    console.log('Inside Category Controller!');
    next();
});

//All Routes with /
CategoryRouter
    .get('/',function (req, res) {
        Category.getAllCategories(function (err,Categories) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Retriving All Categories!'});}
            else{res.json(Categories);}
        });
    })
    .post('/',function (req, res) {
        var Itm = req.body;

        Category.addCategory(Itm,function (err, Category) {
            if(err){
                console.log('Error Saving Category :'+err);
                res.json({'status': 'Error', 'msg' : 'Error Saving Category!'});
            }
            else{
            res.json({'status': 'Success', 'msg' : Category.Name + ' Saved Successfully'});}
        });
    });

//All Routes with /:id
CategoryRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        Category.getCategoryById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Selecting Category with Id : '+id});}
            res.json(data);
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        Category.deleteCategoryById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Deleting Category with Id : '+id});}
            else{res.json({'status': 'Success', 'msg' : data.Name + ' Deleted Successfully'});}

        });
    })
    .put('/:_id',function (req, res) {
        var id = req.params['_id'];
        var rec_proj = req.body;
        Category.UpdateCategory(id,rec_proj,function (err,Category) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing Category with Id : '+id});}
            res.json({'status': 'Success', 'msg' : Category.Name+ ' Updated Successfully'});
        });
    });

//Misc Routes
CategoryRouter
    .get('/check/:_term',function (req, res) {
            var name = req.params['_term'];
            if(name=="default"){
                res.json({_id:"default"});
            }else {
                Category.checkCategoryByName(name, function (err, data) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'status': 'Error', 'msg': 'Error Checking Category with name : ' + name});
                    }
                    else {
                        res.json(data);
                    }
                });
            }
    })
    .get('/u/Search/:_term',function (req, res) {
        var term = req.params['_term'];
        Category.getCategories(term, function (err, Category) {
            if (err) {
                console.log('Error :' + err);
                res.json({'status': 'Error', 'msg': 'Error Retriving Category!'});
            }
            else {
                res.json(Category);
            }
        })
    })
    .put('/u/Qty/:_Id',function (req, res) {
        var id = req.params['_Id'];
        var Qty = req.body;

        Category.updateQuantity(id,Qty,function (err,Itm) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing Category Quantity!'});}
            else{res.json({'status': 'Success', 'msg' : Itm.Name+' Quantity Updated Successfully!'});}
        });
    });

module.exports = CategoryRouter;
