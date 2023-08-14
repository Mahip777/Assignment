const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   
        
            Date: {
                type: String,
                required: true

            },
            Description: {
                type: String,
                 required: true
            },
            Amount: {
                type: String,
                 required: true
            },
            Currency: {
                type: String,
                 required: true
            },
            INR: {
                
            }
        
    
})




const User = mongoose.model('Assigning', userSchema);
module.exports = User; 