const constantProfile = {
    updateUserPenName: "UPDATE users SET pen_name = ? WHERE id = ?",
    updateUserProfile: "UPDATE users SET username = ?, avatar = ?, role = ? WHERE id = ?",
    getUserById: "SELECT * FROM users WHERE id = ? LIMIT 1",
}
export default constantProfile;