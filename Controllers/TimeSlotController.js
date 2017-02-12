var express = require('express');
var TimeSlotRouter = express.Router();
var TimeSlot = require('../Models/TimeSlot');

TimeSlotRouter.use('*',function (req, res, next) {
    console.log('Inside TimeSlot Controller!');
    next();
});

//All Routes with /
TimeSlotRouter
    .get('/',function (req, res) {
        TimeSlot.getAllTimeSlots(function (err,TimeSlots) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Retrieving All TimeSlots!',data:[]});}
            else{res.json({'success': true, 'msg' : 'We Found What your looking For!',data:TimeSlots});}
        });
    })
    .post('/',function (req, res) {
        var Itm = req.body;

        TimeSlot.addTimeSlot(Itm,function (err, TimeSlot) {
            if(err){
                console.log('Error Saving TimeSlot :'+err);
                res.json({'success': false, 'msg' : 'Error Saving TimeSlot!', data:[]});
            }
            else{
            res.json({'success': true, 'msg' : 'TimeSlot Saved Successfully', data:[]});}
        });
    });

//All Routes with /:id
TimeSlotRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        TimeSlot.getTimeSlotById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Selecting TimeSlot with Id : '+id});}
            res.json({'success': true, 'msg' : 'Found TimeSlot with Id : '+id,data:data});
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        TimeSlot.deleteTimeSlotById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Deleting TimeSlot with Id : '+id,data:[]});}
            else{res.json({'success': true, 'msg' : 'TimeSlot Deleted Successfully',data:[]});}

        });
    })
    .put('/:_id',function (req, res) {
        var id = req.params['_id'];
        var rec_proj = req.body;
        TimeSlot.UpdateTimeSlot(id,rec_proj,function (err,TimeSlot) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Editing TimeSlot with Id : '+id,data:[]});}
            res.json({'success': true, 'msg' :'TimeSlot Updated Successfully',data:[]});
        });
    });

module.exports = TimeSlotRouter;
