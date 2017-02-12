module.exports.api = {
    '/menu' : require('./Controllers/MenuController'),
    '/branch' : require('./Controllers/BranchController'),
    '/booking' : require('./Controllers/BookingController'),
    '/category' : require('./Controllers/CategoryController'),
    '/timeslot' : require('./Controllers/TimeSlotController'),    
    '/user' : require('./Controllers/UserController')
};
