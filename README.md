# Assignment
Zluri assignment

Hey there!
I have connected my application to MongoDB database and the connection is established in DB folder. 

//Approach1
I tried using the MongoDB playground plugin and was able to manage and operate CRUD functionalities but got stuck while connecting it to UI.
//Approach2
I selected the file from UI and parsed it there itself using File Reader and sent the parsed data to MongoDB. I had connected UI and server using a proxy. But since the file size can be large it should be parsed from the server so I shifted to using multer for the same.
//Approach3 (code shared for this method)
I uploaded the file using multer and converted it into json format using CSVtoJson and sent it to MongoDB. I created GET, Insert, Delete and Edit API after that.

The Exchange-rates-api is not fetching exchange rates and probably is not working. Money.js wasn't of much help either because it showed that the given exchange rate is not available. 
