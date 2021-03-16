const mongoose = require('mongoose');

const url = 'mongodb+srv://saquib:saquib@test.kcaqx.mongodb.net/test?retryWrites=true&w=majority';

const option = {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false};

module.exports = function(){

    mongoose.connection.on('connecting', function(){
        console.log('DB connecting...');
    })

    mongoose.connection.on('connected', function(){
        console.log('DB connected!');
    });

    mongoose.connection.on('error', function(err){
        console.log("error DB connection!", err);
    });

    mongoose.connection.on('disconnected', function(){
        console.log('DB disconnected!');
    });

    const connect = () => mongoose.connect(url, option).catch(err=>setTimeout(connect, 5000));
    connect();

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log('Terminated connection');
            process.exit(0)
        });
    });
}
