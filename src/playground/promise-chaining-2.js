require("../db/mongoose");
const Task = require("../models/task");

// Task.findByIdAndDelete("61d40c6921fa98dc5ca3beba")
//    .then((task) => {
//       console.log(task);
//       return Task.countDocuments({ completed: false });
//    })
//    .then((count) => {
//       console.log(count);
//    })
//    .catch((error) => {
//       console.log(error);
//    });

const deleteAndCount = async (id, completed) => {
   const task = await Task.findByIdAndDelete(id);
   const count = await Task.countDocuments({ completed });
   return count;
};
deleteAndCount("61d17676383facb3d2993e0c", false)
   .then((count) => {
      console.log(count);
   })
   .catch((e) => {
      console.log(error);
   });
