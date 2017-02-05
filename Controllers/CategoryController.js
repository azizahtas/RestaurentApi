var express = require('express');
var CategoryRouter = express.Router();
var Category = require('../Models/Category');

CategoryRouter.use('*',function (req, res, next) {
    console.log('Inside Category Controller!');
    next();
});

//All Routes with /
CategoryRouter
    .get('/',function (req, res) {
        Category.getAllCategories(function (err,Categories) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Retrieving All Categories!',data:[]});}
            else{res.json({'success': true, 'msg' : 'We Found What your looking For!',data:Categories});}
        });
    })
    .post('/',function (req, res) {
        var Itm = req.body;

        Category.addCategory(Itm,function (err, Category) {
            if(err){
                console.log('Error Saving Category :'+err);
                res.json({'success': false, 'msg' : 'Error Saving Category!', data:[]});
            }
            else{
            res.json({'success': true, 'msg' : Category.Name + ' Saved Successfully', data:[]});}
        });
    });

//All Routes with /:id
CategoryRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        Category.getCategoryById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Selecting Category with Id : '+id});}
            res.json({'success': true, 'msg' : 'Found Category with Id : '+id,data:data});
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        Category.deleteCategoryById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Deleting Category with Id : '+id,data:[]});}
            else{res.json({'success': true, 'msg' : data.Name + ' Deleted Successfully',data:[]});}

        });
    })
    .put('/:_id',function (req, res) {
        var id = req.params['_id'];
        var rec_proj = req.body;
        Category.UpdateCategory(id,rec_proj,function (err,Category) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Editing Category with Id : '+id,data:[]});}
            res.json({'success': true, 'msg' : Category.Name+ ' Updated Successfully',data:[]});
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
                        res.json({'success': false, 'msg': 'Error Checking Category with name : ' + name,data:[]});
                    }
                    else {
                        res.json({'success': true, 'msg': 'Found category with name: ' + name,data:data});
                    }
                });
            }
    })
    .get('/u/Search/:_term',function (req, res) {
        var term = req.params['_term'];
        Category.getCategories(term, function (err, Category) {
            if (err) {
                console.log('Error :' + err);
                res.json({'success': false, 'msg': 'Error Retriving Category!',data:[]});
            }
            else {
                res.json({'success': true, 'msg': 'Found what your looking for!',data:Category});
            }
        })
    });

module.exports = CategoryRouter;
