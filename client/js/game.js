let user_list = [];

// Join user to chat
function userJoin(id, username, room, mod) {
  const user = { id, username, room, mod};

  user_list.push(user);
  console.log(user)
  console.log(user_list)
  return user;
}

// Get current user
function getCurrentUser(id) {
  return user_list.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = user_list.findIndex(user => user.id === id);

  if (index !== -1) {
    return user_list.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  console.log('Getting users')
  console.log(room)
  let res = []
  for(let i = 0; i < user_list.length; ++i){
    if(user_list[i].room == room) res.push(user_list[i]);
  }
  return res;
}

function getRoomMod(room){
  console.log('Getting mod')
  console.log(room)

  let res;
  for(let i = 0; i < user_list.length; ++i){
    if(user_list[i].room == room && user_list[i].mod == true){
      res = user_list[i];
      break;
    }
  }
  console.log(res)
  return res;
}

function formatMessage(username, text) {
  return {
    username,
    text
  };
}


module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatMessage,
  getRoomMod
};