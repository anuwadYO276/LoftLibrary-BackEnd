
const constantPurchase = {
    addPurchase: `
        INSERT INTO purchases (user_id, book_id, episode_id, amount, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `,
    getTransactionBookHistory: `
        SELECT * FROM books WHERE id in (
            SELECT book_id FROM purchases WHERE user_id = ? group by book_id
        )`,
    getTransactionEpisodeHistory: `
        SELECT * FROM purchases WHERE user_id = ? AND book_id = ?
    `
}
export default constantPurchase;