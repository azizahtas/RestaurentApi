var express = require('express');
var BranchRouter = express.Router();
var Branch = require('../Models/Branch');
var passport =require('passport');
var jwt =require('jwt-simple');
var config = require('../config');
var User = require('../Models/User');

BranchRouter.use('*',function (req, res, next) {
    console.log('Inside Branch Controller!');
    next();
});

//All Routes with /
BranchRouter
    .get('/',function (req, res) {
        Branch.getAllBranches(function (err,Branches) {
            if(err){console.log('Error :'+err); res.json({'status': 'Error', 'msg' : 'Error Retrieving All Branches!', data:[]});}
            else{res.json({'success': true, 'msg' : 'We found what your looking for!', data:Branches});}
        });
    })
    .post('/',passport.authenticate('jwt',
        {
            session: false
        }),function (req, res, next) {
        var token = this.getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.userExistsId(decoded, function (err, user) {
                if (user.otherDetails.who) {
                    var Itm = req.body;
                    Branch.addBranch(Itm,function (err, branch) {
                        if(err){
                            console.log('Error Saving Branch :'+err);
                            res.json({'success': false, 'msg' : 'Error Saving Branch!', data:[]});
                        }
                        else{
                        res.json({'success': true, 'msg' : branch.Name + ' Saved Successfully', data:branch._id});}
                    });
                }
                else {
                    res.json({'success': false, 'msg': 'Your are not admin to do this!!', data: {}});
                }
            });
        }
    });

//All Routes with /:id
BranchRouter
    .get('/:_id',function (req, res,next) {
        var id = req.params['_id'];
        Branch.getBranchById(id,function (err,branches) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Retrieving Branch with Id : '+id, data:[]});}
            res.json({'success': true, 'msg' : 'We found what your looking for!', data:branches});
        });
    })
    .delete('/:_id',passport.authenticate('jwt',
        {
            session: false
        }),function (req, res, next) {
        var token = this.getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.userExistsId(decoded, function (err, user) {
                if (user.otherDetails.who) {
                    var id = req.params['_id'];
                    Branch.deleteBranchById(id,function (err,branch) {
                        if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Deleting Branch with Id : '+id, data:[]});}
                        else{res.json({'success': true, 'msg' : branch.Name + ' Deleted Successfully',data:[]});}
                });
                }
                else {
                    res.json({'success': false, 'msg': 'Your are not admin to do this!!', data: {}});
                }
            });
        }
    })
    .put('/:_id',passport.authenticate('jwt',
        {
            session: false
        }),function (req, res) {
        var token = this.getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.userExistsId(decoded, function (err, user) {
                var id = req.params['_id'];
                if (user.otherDetails.who || (user.otherDetails.bm && user.otherDetails._branchId == id)) {
                    
                    var rec_proj = req.body;
                    Branch.UpdateBranch(id,rec_proj,function (err,branch) {
                        if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Editing Branch with Id : '+id,data:[]});}
                        res.json({'success': true, 'msg' : branch.Name+ ' Updated Successfully',data:branch._id});
                    });
                }
                else {
                    res.json({'success': false, 'msg': 'Your are not admin to do this!!', data: {}});
                }
            });
        }
    });
//Table Routes
BranchRouter
    .post('/u/Table/:_id',passport.authenticate('jwt',
        {
            session: false
        }),function (req, res) {
        var token = this.getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.userExistsId(decoded, function (err, user) {
                if (user.otherDetails.who) {
                    var id = req.params['_id'];
                    var table = req.body;
                    Branch.addTable(id,table, function (err, data) {
                        if (err) {
                            console.log('Error :' + err);
                            res.json({'success': false, 'msg': 'Error Saving Table!',data:[]});
                        }
                        else {
                            res.json({'success': true, 'msg': 'Table Created Successfully',data:data.Tables});
                        }
                    })
                }
                else {
                    res.json({'success': false, 'msg': 'Your are not admin to do this!!', data: {}});
                }
            });
        }
    })
    .put('/u/Table/:_id',passport.authenticate('jwt',
        {
            session: false
        }),function (req, res) {
        var token = this.getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.userExistsId(decoded, function (err, user) {
                if (user.otherDetails.who ) {
                    var id = req.params['_id'];
                    var table = req.body;
                    Branch.editTable(id,table, function (err, data) {
                        if (err) {
                            console.log('Error :' + err);
                            res.json({'success': false, 'msg': 'Error Saving Table!',data:[]});
                        }
                        else {
                            res.json({'success': true, 'msg': 'Table Edited Successfully',data:data.Tables});
                        }
                    })
                }
                else {
                    res.json({'success': false, 'msg': 'Your are not admin to do this!!', data: {}});
                }
            });
        }
    })
    .delete('/u/Table/:_id/:_tableId',passport.authenticate('jwt',
        {
            session: false
        }),function (req, res) {
        var token = this.getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.userExistsId(decoded, function (err, user) {
                if (user.otherDetails.who) {
        var id = req.params['_id'];
        var tableId = req.params['_tableId'];
        Branch.deleteTable(id,tableId, function (err, data) {
            if (err) {
                console.log('Error :' + err);
                res.json({'success': false, 'msg': 'Error Saving Table!',data:[]});
            }
            else {
                res.json({'success': true, 'msg': 'Table Deleted Successfully',data:data.Tables});
            }
        })
                }
                else {
                    res.json({'success': false, 'msg': 'Your are not admin to do this!!', data: {}});
                }
            });
        }
    });

//Misc Routes
BranchRouter
    .get('/check/:_term',function (req, res) {
            var name = req.params['_term'];
            Branch.checkBranchByName(name, function (err, branch) {
                if (err) {
                    console.log('Error :' + err);
                    res.json({'success': false, 'msg': 'Error Checking Branch with name : ' + name,data:[]});
                }
                else {
                    res.json({'success': true, 'msg': 'We found what your looking for!',data:branch});
                }
            });
    })
    .get('/u/Search/:_term',function (req, res) {
        var term = req.params['_term'];
        Branch.getBranches(term, function (err, branches) {
            if (err) {
                console.log('Error :' + err);
                res.json({'success': false, 'msg': 'Error Retrieving Branch!',data:[]});
            }
            else {
                res.json({'success': true, 'msg': 'We found what your looking for!',data:branches});
            }
        })
    });



module.exports = BranchRouter;
