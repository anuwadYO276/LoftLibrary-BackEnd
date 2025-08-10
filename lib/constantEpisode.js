
const constantEpisode = {
    getEpisodeByBookIdQuery: `SELECT * FROM episodes WHERE book_id = ?`,
    addEpisodeQuery: `INSERT INTO episodes (book_id, user_id, title, content, is_free, price, cover, release_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    updateEpisodeQuery: `UPDATE episodes SET title = ?, content = ?, cover = ? WHERE id = ?`,
    getEpisodeByIdQuery: `SELECT * FROM episodes WHERE book_id = ? AND id = ?`
}
export default constantEpisode;