const userSchema = require("./schema");

const getUser = async () => {
  const allUsers = await userSchema.find();
  console.log(allUsers);
  return allUsers;
};

const removeUser = async (userId) => {
  const allUser = await getUser();
  console.log(deleteUser, "ca ka user ");

  const findUser = allUser.find((user) => user.userId === userId);

  if (findUser) {
    const deleteUser = await userSchema.findOneAndDelete({ userId: userId });
    if (deleteUser) console.log("done");
  }
};

const newUser = async (username, userId) => {
  const existingUser = await userSchema.findOne({ username: username });

  if (existingUser) {
    await userSchema.findOneAndUpdate(
      { username: username },
      { userId: userId }
    );
  } else {
    const addUser = new userSchema({ username, userId });
    await addUser.save();
  }
  return await getUser;
};

module.exports = {
  getUser,
  removeUser,
  newUser,
};
