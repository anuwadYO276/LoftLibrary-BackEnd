// lib/constant_book.js

const constantBook = {
  CreateProduct: `
    INSERT INTO books 
      (title, description, cover_url, category, author_id, price_per_chapter, release_date, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  UpdateProduct: `
    UPDATE books SET
      title = ?,
      description = ?,
      cover_url = COALESCE(?, cover_url),
      category = ?,
      author_id = ?,
      price_per_chapter = ?,
      release_date = ?,
      status = ?
    WHERE id = ?
  `,

  getProductID: `
    SELECT * FROM books WHERE id = ?
  `,

  getProduct: `
    SELECT * FROM books LIMIT ?
  `,

  searchProduct: `
    SELECT * FROM books 
    WHERE LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)
  `,
};

export default constantBook;
