var express = require('express');
var MenuItemRouter = express.Router();
var MenuItem = require('../Models/Menu');

MenuItemRouter.use('*',function (req, res, next) {
    console.log('Inside MenuItem Controller!');
    next();
});

//All Routes with /
MenuItemRouter
    .get('/',function (req, res) {
        MenuItem.getAllMenuItems(function (err,MenuItems) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Retriving All MenuItems!'});}
            else{res.json(MenuItems);}
        });
    })
    .post('/',function (req, res) {
        var Itm = req.body;

        MenuItem.addMenuItem(Itm,function (err, MenuItem) {
            if(err){
                console.log('Error Saving MenuItem :'+err);
                res.json({'status': 'Error', 'msg' : 'Error Saving MenuItem!'});
            }
            else{
            res.json({'status': 'Success', 'msg' : MenuItem.Name + ' Saved Successfully'});}
        });
    });

//All Routes with /:id
MenuItemRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        MenuItem.getMenuItemById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Selecting MenuItem with Id : '+id});}
            res.json(data);
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        MenuItem.deleteMenuItemById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Deleting MenuItem with Id : '+id});}
            else{res.json({'status': 'Success', 'msg' : data.Name + ' Deleted Successfully'});}

        });
    })
    .put('/:_id',function (req, res) {
        var id = req.params['_id'];
        var rec_proj = req.body;
        MenuItem.UpdateMenuItem(id,rec_proj,function (err,MenuItem) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing MenuItem with Id : '+id});}
            res.json({'status': 'Success', 'msg' : MenuItem.Name+ ' Updated Successfully'});
        });
    });

//Misc Routes
MenuItemRouter
    .get('/check/:_term',function (req, res) {
            var name = req.params['_term'];
            if(name=="default"){
                res.json({_id:"default"});
            }else {
                MenuItem.checkMenuItemByName(name, function (err, data) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'status': 'Error', 'msg': 'Error Checking MenuItem with name : ' + name});
                    }
                    else {
                        res.json(data);
                    }
                });
            }
    })
    .get('/u/Search/:_term',function (req, res) {
        var term = req.params['_term'];
        MenuItem.getMenuItems(term, function (err, MenuItem) {
            if (err) {
                console.log('Error :' + err);
                res.json({'status': 'Error', 'msg': 'Error Retriving MenuItem!'});
            }
            else {
                res.json(MenuItem);
            }
        })
    })
    .put('/u/Qty/:_Id',function (req, res) {
        var id = req.params['_Id'];
        var Qty = req.body;

        MenuItem.updateQuantity(id,Qty,function (err,Itm) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing MenuItem Quantity!'});}
            else{res.json({'status': 'Success', 'msg' : Itm.Name+' Quantity Updated Successfully!'});}
        });
    });

module.exports = MenuItemRouter;
