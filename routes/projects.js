const express = require('express');
const router = express.Router();
const {getClient} = require('../utils/db.util')
const {ObjectId} = require('mongodb'); 
const client = getClient()   

/** 
 * GET - /projects 
 * Description - Get the List of all Projects
*/
router.get('/', async function(req, res, next) {   
  const response = await client.collection("projects").find({}).toArray(function (err, result){
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
 * Post - /projects 
 * req.body - name (name of project), createdAt, dueDate
 * Description - To add the project
*/
router.post('/', async function(req, res, next) {  
  req.body.createdAt = new Date()
  req.body.dueDate = new Date(req.body.dueDate)
  const result = await client.collection("projects").insertOne(req.body);
  res.json(
    {message: `A document was inserted with the _id: ${result.insertedId}`}
  );  
});

/** 
 * Post - /projects/id 
 * req.body - name (name of project), createdAt, dueDate
 * Description - To update the project
*/
router.post('/:id', async function(req, res, next) {    
  const updateTask = await client.collection("projects").findOneAndUpdate({_id: new ObjectId(req.params.id)}, {$set: req.body})  
  if(!updateTask?.lastErrorObject?.n){
    res.json({message: "Project does not Exists. Project Id is invalid."})
  }else{
    res.json({message: "Project updated successfully."})
  }    
});


/** 
 * DELETE - /projects/id 
 * req.params -  id (ProjectID)
 * Description - To Delete the ProjectId
*/
router.delete('/:id', async function(req, res, next) {    
  const deleteTask = await client.collection("projects").deleteOne({_id: new ObjectId(req.params.id)}, {$set: req.body})
  if(!deleteTask.deletedCount){
    res.json({message: "Project does not Exists. Project Id is invalid."})
  }else{
    res.json({message: "Project deleted successfully."})    
  }  
});

/** 
 * POST - /projects/taskId/ProjectId
 * req.params -  taskId (taskId), ProjectId (ProjectId)
 * Description - To Assign the project to the task
*/
router.post('/assign/:taskId/:projectId', async function(req, res, next) {    
  const updateTask = await client.collection("tasks").findOneAndUpdate({_id: new ObjectId(req.params.taskId)}, {$set: {projectId: req.params.projectId}})
  if(!updateTask?.lastErrorObject?.n){
    res.json({message: "Project/Task does not Exists. Project/Task Id is invalid."})
  }else{
    res.json({message: "Project assigned successfully."})
  }   
});

/** 
 * GET - /projects/filter/ProjectId
 * req.params -  ProjectId
 * Description - filter by one project Id, fetch all tasks
*/
router.get('/filter/:projectId', async function(req, res, next) {      
  const response = await client.collection("tasks").find({projectId:req.params.projectId}).toArray(function (err, result){
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
 * GET - /projects/filter 
 * Description - filter by all projects, fetch all tasks
*/
router.get('/filter', async function(req, res, next) {   
  const response =    await client.collection("tasks").aggregate([
    { $match: {
      "projectId": { 
          $exists: true, 
          $ne: null 
      }
  } },      
    {$group: {_id: "$projectId", tasks: { $push: "$$ROOT"}}}
  ]).toArray(function (err, result){
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
 * GET - /projects/sortByDueDate 
 * Description - sort all project by due date and get all
*/
router.get('/sortByDueDate', async function(req, res, next) {      
  const response = await client.collection("tasks").find({}).sort({dueDate: -1}).toArray(function (err, result){
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
 * GET - /projects/sortByCreatedAt 
 * Description - sort all project by created date and get all
*/
router.get('/sortByCreatedAt', async function(req, res, next) {      
  const response=await client.collection("tasks").find({}).sort({createdAt: -1}).toArray(function (err, result){
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