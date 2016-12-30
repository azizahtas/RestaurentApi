var express = require('express');
var BranchRouter = express.Router();
var Branch = require('../Models/Menu');

BranchRouter.use('*',function (req, res, next) {
    console.log('Inside Branch Controller!');
    next();
});

//All Routes with /
BranchRouter
    .get('/',function (req, res) {
        Branch.getAllBranches(function (err,Branches) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Retriving All Branches!'});}
            else{res.json(Branches);}
        });
    })
    .post('/',function (req, res) {
        var Itm = req.body;

        Branch.addBranch(Itm,function (err, Branch) {
            if(err){
                console.log('Error Saving Branch :'+err);
                res.json({'status': 'Error', 'msg' : 'Error Saving Branch!'});
            }
            else{
            res.json({'status': 'Success', 'msg' : Branch.Name + ' Saved Successfully'});}
        });
    });

//All Routes with /:id
BranchRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        Branch.getBranchById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Selecting Branch with Id : '+id});}
            res.json(data);
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        Branch.deleteBranchById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Deleting Branch with Id : '+id});}
            else{res.json({'status': 'Success', 'msg' : data.Name + ' Deleted Successfully'});}

        });
    })
    .put('/:_id',function (req, res) {
        var id = req.params['_id'];
        var rec_proj = req.body;
        Branch.UpdateBranch(id,rec_proj,function (err,Branch) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing Branch with Id : '+id});}
            res.json({'status': 'Success', 'msg' : Branch.Name+ ' Updated Successfully'});
        });
    });

//Misc Routes
BranchRouter
    .get('/check/:_term',function (req, res) {
            var name = req.params['_term'];
            if(name=="default"){
                res.json({_id:"default"});
            }else {
                Branch.checkBranchByName(name, function (err, data) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'status': 'Error', 'msg': 'Error Checking Branch with name : ' + name});
                    }
                    else {
                        res.json(data);
                    }
                });
            }
    })
    .get('/u/Search/:_term',function (req, res) {
        var term = req.params['_term'];
        Branch.getBranches(term, function (err, Branch) {
            if (err) {
                console.log('Error :' + err);
                res.json({'status': 'Error', 'msg': 'Error Retriving Branch!'});
            }
            else {
                res.json(Branch);
            }
        })
    })
    .put('/u/Qty/:_Id',function (req, res) {
        var id = req.params['_Id'];
        var Qty = req.body;

        Branch.updateQuantity(id,Qty,function (err,Itm) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing Branch Quantity!'});}
            else{res.json({'status': 'Success', 'msg' : Itm.Name+' Quantity Updated Successfully!'});}
        });
    });

module.exports = BranchRouter;
