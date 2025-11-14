import React, { useState } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([
    { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0618640157' },
    { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084' }
  ]);

  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingBook({ ...editingBook, [name]: value });
  };

  const addBook = (event) => {
    event.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.isbn) return;
    setBooks([...books, { ...newBook, id: Date.now() }]);
    setNewBook({ title: '', author: '', isbn: '' });
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const startEditing = (book) => {
    setEditingBook(book);
  };

  const cancelEditing = () => {
    setEditingBook(null);
  };

  const updateBook = (event) => {
    event.preventDefault();
    setBooks(books.map(book => (book.id === editingBook.id ? editingBook : book)));
    setEditingBook(null);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>📚 Library Management System</h1>

      {editingBook ? (
        <div>
          <h2>Edit Book</h2>
          <form onSubmit={updateBook} className="book-form">
            <input name="title" value={editingBook.title} onChange={handleEditInputChange} placeholder="Title" required />
            <input name="author" value={editingBook.author} onChange={handleEditInputChange} placeholder="Author" required />
            <input name="isbn" value={editingBook.isbn} onChange={handleEditInputChange} placeholder="ISBN" required />
            <button type="submit">Update Book</button>
            <button type="button" onClick={cancelEditing}>Cancel</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Add a New Book</h2>
          <form onSubmit={addBook} className="book-form">
            <input name="title" value={newBook.title} onChange={handleInputChange} placeholder="Title" required />
            <input name="author" value={newBook.author} onChange={handleInputChange} placeholder="Author" required />
            <input name="isbn" value={newBook.isbn} onChange={handleInputChange} placeholder="ISBN" required />
            <button type="submit">Add Book</button>
          </form>
        </div>
      )}

      <hr />

      <h2>Book List</h2>
      <input
        type="text"
        placeholder="Search for a book..."
        onChange={(event) => setSearchTerm(event.target.value)}
        className="search-bar"
      />
      <ul className="book-list">
        {filteredBooks.map(book => (
          <li key={book.id} className="book-item">
            <div>
              <strong>{book.title}</strong>
              <p>by {book.author}</p>
              <small>ISBN: {book.isbn}</small>
            </div>
            <div className="button-group">
              <button onClick={() => startEditing(book)}>Update</button>
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;