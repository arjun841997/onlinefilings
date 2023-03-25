const { MongoClient } = require("mongodb");

const uri = `mongodb://localhost:27017`; // MongoDB URI

const client = new MongoClient(uri); // Mongo Client, used later for connection purpose.

/*
  init method is used to connect the client with database. 
*/
const init = async () => {
  try {    
     await client.connect(); //connect to the local mongoDB 
    console.log("Connected To Database " + process.env.DATABASE);
  } catch (error) {
    console.log(error);
  }
};

/*
  Get Client Method is used to get the database client.
*/
const getClient = () => {
  const clientDB =  client.db(process.env.DATABASE) // selecting the db
  return clientDB;
};

module.exports.init = init;
module.exports.getClient = getClient;