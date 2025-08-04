
const constantBook = {
    getRatingQuery: `
        SELECT COUNT(*) as count FROM ratings WHERE user_id = ? AND book_id = ?
    `,
    deleteRatingQuery: `
        DELETE FROM ratings WHERE user_id = ? AND book_id = ?
    `,
    addRatingQuery: `
        INSERT INTO ratings (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)
    `,
    searchBooksQuery: `
        SELECT * FROM books WHERE title LIKE ?
    `,
    updateBookQuery: `
        UPDATE books SET title = ?, user_id = ?, description = ?, cover_image = ? WHERE id = ?
    `,
    addBookQuery: `
        INSERT INTO books (title, user_id, description, cover_image) VALUES (?, ?, ?, ?)
    `,
    getBooksQuery: `
        SELECT * FROM books WHERE user_id = ?
    `,
    updateBookCompleteQuery: `
        UPDATE books SET is_complete = ? WHERE id = ?
    `
}
export default constantBook;