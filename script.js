class Human {
  constructor(name, age, hobbies) {
    this.name = name;
    this.age = age;
    this.hobbies = hobbies;
  }

  callName() {
    console.log(this.name, "THE NAME HAS BEEN CALLED");
  }
}

const newHuman = new Human("Adam", 45);
// const newHuman = new Human('Adam', 45, ['farmer', "eating forbidden fruits", 'eve'])
console.log(newHuman)

class Female extends Human {
  constructor(name, age, hobbies) {
    super(name, age, hobbies);
    this.sex = "female";
    this.occupation = "lawyer";
  }
}

// console.log(newHuman)
// newHuman.callName()

const newFemale = new Female("Cherop", 21, [
  "travelling",
  "making new friends",
  "sky diving",
]);
const newFemale2 = new Female("Alonso", 23, [
  "cooking",
  "gym",
  "visiting childrens home",
]);

newFemale.callName();
console.log(newFemale);
console.log(newFemale2);

console.log(Math.round(new Date().getTime()/365))




// Import your database library here
const db = require('your-database-library');

// Follow a user
app.post('/follow/:id', (req, res) => {
  const userId = req.session.userId;
  const followedUserId = req.params.id;

  // Check if the user is already following this user
  db.query('SELECT * FROM follows WHERE user_id = ? AND followed_user_id = ?', [userId, followedUserId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal server error');
      return;
    }

    if (results.length > 0) {
      // User is already following this user
      res.status(400).send('User is already following this user');
      return;
    }

    // Insert new follow record into database
    db.query('INSERT INTO follows (user_id, followed_user_id) VALUES (?, ?)', [userId, followedUserId], (error) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal server error');
        return;
      }

      res.send('User followed successfully');
    });
  });
});

// // check if already following
    // const follow = [ await userModel.findOne({ follow_Id }) ];
    // if (user.following.indexOf(follow) !== -1) {
    //   return sendError(res, 400,'You are already following this user');
    // }

    //blocking a user
export const blockedUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    userModel.findOne({ userId }, function (err, data) {
      if (data.blocked === 0) next();
      else res.status(403).send("You are blocked");
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};
