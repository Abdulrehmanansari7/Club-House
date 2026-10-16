import pool from "./db.js";

// const getMsg = async (isMember) => {
//   if(isMember){
//     const { rows } = await pool.query(
//       `SELECT messages.id, messages.title, messages.text, messages.created_at, messages.user_id, users.username
//       FROM messages
//       JOIN users ON messages.user_id = users.id`,
//     );
//     return rows;
//   } else {
//      const { rows } = await pool.query(`
//             SELECT id, title, text, created_at
//             FROM messages
//         `);

//         return rows;
//   }
// };

const getMsg = async () => {
  const { rows } = await pool.query(
    `SELECT messages.id, messages.title, messages.text, messages.created_at,
            messages.user_id, users.username
     FROM messages
     LEFT JOIN users ON messages.user_id = users.id
     ORDER BY messages.id DESC`
  );
  return rows;
};

const addUser = async (username,hash) => {
  await pool.query('INSERT INTO users(username,password) VALUES($1,$2)',[username,hash]); 
}

const addMessage = async (title,text,userId) => {
  await pool.query('INSERT INTO messages(title,user_id,text) VALUES($1,$2,$3)', [title,userId,text])
}

const deleteMsg = async (messagesId, userId, isAdmin) => {
    if (isAdmin) {
        await pool.query(
            'DELETE FROM messages WHERE id = $1',
            [messagesId]
        );
    } else {
        await pool.query(
            'DELETE FROM messages WHERE id = $1 AND user_id = $2',
            [messagesId, userId]
        );
    }
};

const updateMember = async (id) => {
  await pool.query('UPDATE users SET is_member = TRUE WHERE id = $1',[id])
}

export default {
  getMsg,
  addUser,
  addMessage,
  deleteMsg,
  updateMember
};
