require("../db/mongoose");
const User = require("../models/user");

// User.findByIdAndUpdate("61d4b6d33e1f20b39012153f", { age: 24 })
//    .then((user) => {
//       console.log(user);
//       return User.countDocuments({ age: 33 });
//    })
//    .then((count) => {
//       console.log(count);
//    })
//    .catch((error) => {
//       console.log(errro);
//    });

const updateUserAndCount = async (id, age) => {
   const user = await User.findByIdAndUpdate(id, { age });
   const count = await User.countDocuments({ age });
   return count;
};

updateUserAndCount("61d4b6d33e1f20b39012153f", 25)
   .then((count) => {
      console.log(count);
   })
   .catch((e) => {
      console.log(e);
   });
