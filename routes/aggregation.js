const express = require('express');
const router = express.Router();
const {getClient} = require('../utils/db.util')
const client = getClient()   

/** 
 * GET - /aggregation/projects
 * Description - To get the all the projects that have a task with a due date set to “today”
*/
router.get('/projects', async function(req, res, next) {      
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);
    const response = await client.collection("tasks")      
    .aggregate([
      {
        $match: {
          "dueDate":{$gte: start, $lt: end}
        }
      },
      { $match: {
        "projectId": { 
            $exists: true, 
            $ne: null 
      }}},
      { $lookup:
         {
           from: 'projects',
           localField: 'projectId',
           foreignField: '_id',
           as: 'projectDetails'
         }
       }
      ])
    .toArray(function (err, result){
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
 * GET - /aggregation/tasks
 * Description - To get the all the tasks that have a project with a due date set to “today”
*/
router.get('/tasks', async function(req, res, next) {      
  var start = new Date();
  start.setHours(0,0,0,0);

  var end = new Date();
  end.setHours(23,59,59,999);
  const response = await client.collection("tasks")
    // .find({dueDate: {$gte: start, $lt: end}})
    .aggregate([           
      { $match: {
        "projectId": { 
            $exists: true, 
            $ne: null 
      }}},
      { $lookup:
         {
           from: 'projects',
           localField: 'projectId',
           foreignField: '_id',
           as: 'projectDetails'
         }
       },
       {
        $match: {
          "projectDetails.dueDate":{$gte: start, $lt: end}
        }
      },
      ])
    .toArray(function (err, result){
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