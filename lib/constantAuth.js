const constantAuth = {
    getUserByemail: "select * from users where email = ? limit 1",
    insertUsers: "insert into users (username, email, password) values (?, ?, ?)",
}
export default constantAuth;