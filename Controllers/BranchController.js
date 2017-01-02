var express = require('express');
var BranchRouter = express.Router();
var Branch = require('../Models/Branch');

BranchRouter.use('*',function (req, res, next) {
    console.log('Inside Branch Controller!');
    next();
});

//All Routes with /
BranchRouter
    .get('/',function (req, res) {
        Branch.getAllBranches(function (err,Branches) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Retrieving All Branches!', data:[]});}
            else{res.json({'status': 'Success', 'msg' : 'We found what your looking for!', data:Branches});}
        });
    })
    .post('/',function (req, res) {
        var Itm = req.body;

        Branch.addBranch(Itm,function (err, branch) {
            if(err){
                console.log('Error Saving Branch :'+err);
                res.json({'status': 'Error', 'msg' : 'Error Saving Branch!', data:[]});
            }
            else{
            res.json({'status': 'Success', 'msg' : branch.Name + ' Saved Successfully', data:branch._id});}
        });
    });

//All Routes with /:id
BranchRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        Branch.getBranchById(id,function (err,branches) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Retrieving Branch with Id : '+id, data:[]});}
            res.json({'status': 'Success', 'msg' : 'We found what your looking for!', data:branches});
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        Branch.deleteBranchById(id,function (err,branch) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Deleting Branch with Id : '+id, data:[]});}
            else{res.json({'status': 'Success', 'msg' : branch.Name + ' Deleted Successfully',data:[]});}

        });
    })
    .put('/:_id',function (req, res) {
        var id = req.params['_id'];
        var rec_proj = req.body;
        Branch.UpdateBranch(id,rec_proj,function (err,branch) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Editing Branch with Id : '+id,data:[]});}
            res.json({'status': 'Success', 'msg' : branch.Name+ ' Updated Successfully',data:branch._id});
        });
    });
//Table Routes
BranchRouter
    .get('/u/Table/:_term',function (req, res) {
        var term = req.params['_term'];
        Branch.getBranches(term, function (err, branches) {
            if (err) {
                console.log('Error :' + err);
                res.json({'status': 'Error', 'msg': 'Error Retrieving Branch!',data:[]});
            }
            else {
                res.json({'status': 'Success', 'msg': 'We found what your looking for!',data:branches});
            }
        })
    });


//Misc Routes
BranchRouter
    .get('/check/:_term',function (req, res) {
            var name = req.params['_term'];
            Branch.checkBranchByName(name, function (err, branch) {
                if (err) {
                    console.log('Error :' + err);
                    res.json({'status': 'Error', 'msg': 'Error Checking Branch with name : ' + name,data:[]});
                }
                else {
                    res.json({'status': 'Success', 'msg': 'We found what your looking for!',data:branch});
                }
            });
    })
    .get('/u/Search/:_term',function (req, res) {
        var term = req.params['_term'];
        Branch.getBranches(term, function (err, branches) {
            if (err) {
                console.log('Error :' + err);
                res.json({'status': 'Error', 'msg': 'Error Retrieving Branch!',data:[]});
            }
            else {
                res.json({'status': 'Success', 'msg': 'We found what your looking for!',data:branches});
            }
        })
    });



module.exports = BranchRouter;
