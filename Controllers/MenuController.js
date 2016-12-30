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
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Retrieving Menu Items!',data:{}});}
            else{res.json(MenuItems);}
        });
    })
    .post('/',function (req, res) {
        var Itm = req.body;

        MenuItem.addMenuItem(Itm,function (err, MenuItem) {
            if(err){
                console.log('Error Saving MenuItem :'+err);
                res.json({'status': 'Error', 'msg' : 'Error Saving Menu Items!',data:{}});
            }
            else{
            res.json({'status': 'Success', 'msg' : 'Menu Item '+MenuItem.Name+" Saved!",data:MenuItem._id});}
        });
    });

//All Routes with /:id
MenuItemRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        MenuItem.getMenuItemById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Selecting MenuItem with Id : '+id,data:{}});}
            res.json(data);
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        MenuItem.deleteMenuItemById(id,function (err,d) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Deleting MenuItem with Id : '+id,data:{}});}
            else{res.json({'status': 'Success', 'msg' : d.Name + ' Deleted Successfully',data:{}});}

        });
    })
    .put('/:_id',function (req, res) {
        var id = req.params['_id'];
        var rec_proj = req.body;
        MenuItem.UpdateMenuItem(id,rec_proj,function (err,MenuItem) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing MenuItem with Id : '+id,data:{}});}
            res.json({'status': 'Success', 'msg' : MenuItem.Name+ ' Updated Successfully',data:{}});
        });
    });

//Misc Routes
MenuItemRouter
    .get('/check/:_term',function (req, res) {
            var name = req.params['_term'];
                MenuItem.checkMenuItemByName(name, function (err, data) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'status': 'Error', 'msg': 'Error Checking MenuItem with name : ' + name,data:{}});
                    }
                    else {
                        res.json({'status': 'Success', 'msg' : 'We Found What you are Looking For!',data:data});
                    }
                });
    })
    .get('/u/Search/:_term',function (req, res) {
        var term = req.params['_term'];
        MenuItem.getMenuItems(term, function (err, MenuItem) {
            if (err) {
                console.log('Error :' + err);
                res.json({'status': 'Error', 'msg': 'Error Retriving MenuItem!',data:{}});
            }
            else {
                res.json({'status': 'Success', 'msg' : 'We Found What you are Looking For!',data:MenuItem});
            }
        })
    });


module.exports = MenuItemRouter;
