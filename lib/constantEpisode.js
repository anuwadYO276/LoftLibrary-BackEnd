
const constantEpisode = {
    getEpisodeByBookIdQuery: `SELECT * FROM episodes WHERE book_id = ?`,
    addEpisodeQuery: `INSERT INTO episodes (book_id, title, description, episodes_image) VALUES (?, ?, ?, ?)`,
    updateEpisodeQuery: `UPDATE episodes SET title = ?, description = ?, episodes_image = ? WHERE id = ?`,
    getEpisodeByIdQuery: `SELECT * FROM episodes WHERE book_id = ? AND id = ?`
}
export default constantEpisode;