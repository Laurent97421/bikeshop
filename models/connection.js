var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

mongoose.connect('mongodb+srv://Laurent:Jabami4738329@cluster0.rjey0hh.mongodb.net/bikeshop?retryWrites=true&w=majority',
    options,
    function (err) {
        console.log(err);
    }
);