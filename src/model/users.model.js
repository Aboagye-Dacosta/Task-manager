const db = require("../services/connect.db.services");

function saveUser(user, callback) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (user_id, user_name, user_email, user_hash_password, user_salt, user_created_at, user_updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [...user], (err) => {
      if (err) {
        callback(err);
        reject(err);
      }
      callback(null);
      resolve(user.id);
    });
  });
}

const saveFederatedUser = (user, callback) => {
  return new Promise((resolve, reject) => {
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();

    const sql = `INSERT INTO federated_users (user_id, user_first_name, user_last_name, provider, user_email, user_created_at, user_updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(
      sql,
      [
        user.userId,
        user.userFirstName,
        user.userLastName,
        user.provider,
        user.userEmail,
        created_at,
        updated_at,
      ],
      (err) => {
        if (err) {
          callback(error);
          reject(err);
        }
        callback(null);
        resolve(user);
      }
    );
  });
};

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE user_email = ?`;
    db.get(sql, [email], (err, row) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(row);
    });
  });
}

module.exports = {
  saveUser,
  getUserByEmail,
};
