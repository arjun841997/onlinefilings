const express = require('express');
const router = express.Router();
const {getClient} = require('../utils/db.util')
const {ObjectId} = require('mongodb'); 


const client = getClient()     

/** 
 * GET - /tasks
 * Description - To get the list of tasks.
*/
router.get('/', async function(req, res, next) {
  const response =  await client.collection("tasks").find({}).toArray(function (err, result){
        if(err){
          return err
        }else{
          return result
        }  
      })         
    res.json(
      {data: response}
    );
});


/** 
 * POST - /tasks
 * req.body - task, dueDate, projectId
 * Description - To get the list of tasks.
*/
router.post('/', async function(req, res, next) {  
  req.body.createdAt = new Date()
  req.body.startDate = new Date()
  req.body.dueDate = new Date(req.body.dueDate)
  req.body.projectId = new ObjectId(req.body.projectId)
  const result = await client.collection("tasks").insertOne(req.body);
  res.json(
    {message: `A document was inserted with the _id: ${result.insertedId}`}
  );  
});


/** 
 * POST - /tasks/:id
 * req.body - task, dueDate, projectId
 * req.params - id (TaskId)
 * Description - To add the task.
*/
router.post('/:id', async function(req, res, next) {    
  const updateTask = await client.collection("tasks").findOneAndUpdate({_id: new ObjectId(req.params.id)}, {$set: req.body})
  if(!updateTask?.lastErrorObject?.n){
    res.json({message: "Task does not Exists. Task Id is invalid."})
  }else{
    res.json({message: "Task updated successfully."})
  }  
});


/** 
 * DELETE - /tasks/:id 
 * req.params - id (TaskId)
 * Description - To Delete the Tasks.
*/
router.delete('/:id', async function(req, res, next) {    
  const deleteTask = await client.collection("tasks").deleteOne({_id: new ObjectId(req.params.id)}, {$set: req.body})
  if(!deleteTask.deletedCount){
    res.json({message: "Task does not Exists. Task Id is invalid."})
  }else{
    res.json({message: "Task deleted successfully."})    
  }  
});

/** 
 * POST - /tasks/done/:id 
 * req.params - id (TaskId)
 * req.query - status (status of the task)
 * Description - To Change the status of the task.
*/
router.post('/done/:id', async function(req, res, next) {    
  const status= req.query.status
  let updateTask;
  if(status === "DONE"){ //Mark Task as Done. 
    const doneDate = new Date()
    const startDate = null
    updateTask = await client.collection("tasks").findOneAndUpdate({_id: new ObjectId(req.params.id)}, {$set: {status, doneDate, startDate}})        
  }else if(status === "TODO"){ // Mark Task as TO BE Done.
    const doneDate = null
    const startDate = new Date()
    updateTask = await client.collection("tasks").findOneAndUpdate({_id: new ObjectId(req.params.id)}, {$set: {status, doneDate, startDate}})    
  }  else { //Mark Task as Cancelled, Pending, Doing   
    updateTask = await client.collection("tasks").findOneAndUpdate({_id: new ObjectId(req.params.id)}, {$set: {status}})     
  }
  if(!updateTask?.lastErrorObject?.n){
    res.json({message: "Task does not Exists. Task Id is invalid."})
  }else{
    res.json({message: "Task status updated successfully."})
  }  
});

/** 
 * GET - /tasks/search 
 * req.query - taskQuery (search string for task)
 * Description - To search the task.
*/
router.get('/search', async function(req, res, next) {      
  const query = {}
  query["task"] = { '$regex': new RegExp('^' + req.query.taskQuery + '$', "i") }; 
  const response = await client.collection("tasks").find(query).toArray(function (err, result){
    if(err){
      return err
    }else{
     return result
    }  
  })    
  res.json(
    {data: response}
  );
});


module.exports = router;
