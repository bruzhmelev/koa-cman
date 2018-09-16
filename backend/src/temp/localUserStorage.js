// This is an example! Use password hashing in your project and avoid storing passwords in your code
const users = [{ id: 1, username: 'testUser', password: 'testPass' }];
let sequence = 2;

const fetchUsersByName = (() => {
  return async function(name) {
    const findedUsers = users.filter(user => user.username === name);

    console.log('findedUsers: ' + JSON.stringify(findedUsers));
    return findedUsers;
  };
})();

const fetchUserById = (id => {
  return async function() {
    return users[0];
  };
})();

async function fetchUserByToken(token) {
  //   return
}

async function addUser(user) {
  users.push({ ...user, id: sequence++ });
}

module.exports = { fetchUsersByName, fetchUserById, fetchUserByToken, addUser };
