const constant = {
    // Sinup
    insertReader: "insert into user (username, email, password, role) values (?, ?, ?, ?)",
    insertWriter: "insert into user (username, email, password, pen_name, role) values (?, ?, ?, ?, ?)",
    // Login
    getUserByemail: "select * from user where email = ? or username = ? limit 1",
    // Product
    CreateProduct: "insert into book (book_name, description ) values (?, ?)",
    getProduct: "select * from book order by id desc limit ?",
    searchProduct: "select * from book where book_name like ? or description like ?",
}

export default constant;