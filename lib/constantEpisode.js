
const constantEpisode = {
    getEpisodeByBookIdQuery: `SELECT * FROM episodes WHERE book_id = ?`,
    addEpisodeQuery: `INSERT INTO episodes (book_id, title, content, episodes_image) VALUES (?, ?, ?, ?)`,
    updateEpisodeQuery: `UPDATE episodes SET title = ?, content = ?, episodes_image = ? WHERE id = ?`,
    getEpisodeByIdQuery: `SELECT * FROM episodes WHERE book_id = ? AND id = ?`
}
export default constantEpisode;