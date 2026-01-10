import { useState, useEffect } from "react";
import { addBook, getDropdownAuthors, getDropdownGenres, createAuthor, createGenre } from "../api/books";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const [book, setBook] = useState({
    title: '',
    author_id: '',
    genre_id: '',
    year_published: ''
  });
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [authorsRes, genresRes] = await Promise.all([
          getDropdownAuthors(),
          getDropdownGenres()
        ]);
        setAuthors(authorsRes.data);
        setGenres(genresRes.data);
      } catch (error) {
        console.error('Failed to load dropdown data:', error);
      }
    };
    loadDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: (name === 'year_published') ? parseInt(value) || '' : 
              (name === 'author_id' || name === 'genre_id') ? parseInt(value) || '' : value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!book.title || (!book.author_id && !book.new_author)) {
      alert('Title and Author are required');
      return;
    }
    
    setLoading(true);
    try {
      let authorId = book.author_id;
      let genreId = book.genre_id;
      
      if (book.author_id === 'new' && book.new_author) {
        const authorRes = await createAuthor({ name: book.new_author });
        authorId = authorRes.data.id;
      }
      
      if (book.genre_id === 'new' && book.new_genre) {
        const genreRes = await createGenre({ name: book.new_genre });
        genreId = genreRes.data.id;
      }
      
      await addBook({
        title: book.title,
        author_id: authorId,
        genre_id: genreId,
        year_published: book.year_published
      });
      navigate("/books");
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '600px', margin: '0 auto'}}>
        <h2>Add Book</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Title *</label>
            <input 
              className="form-control"
              name="title"
              value={book.title}
              placeholder="Enter book title" 
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Author *</label>
            <select 
              className="form-control"
              name="author_id"
              value={book.author_id}
              onChange={handleChange}
              required
            >
              <option value="">Select an author...</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
              <option value="new">+ Add New Author</option>
            </select>
            {book.author_id === 'new' && (
              <input 
                className="form-control" 
                style={{marginTop: '10px'}}
                placeholder="Enter new author name"
                value={book.new_author || ''}
                onChange={(e) => setBook({...book, new_author: e.target.value})}
                required
              />
            )}
          </div>
          <div className="form-group">
            <label>Genre</label>
            <select 
              className="form-control"
              name="genre_id"
              value={book.genre_id}
              onChange={handleChange}
            >
              <option value="">Select a genre...</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
              <option value="new">+ Add New Genre</option>
            </select>
            {book.genre_id === 'new' && (
              <input 
                className="form-control" 
                style={{marginTop: '10px'}}
                placeholder="Enter new genre name"
                value={book.new_genre || ''}
                onChange={(e) => setBook({...book, new_genre: e.target.value})}
              />
            )}
          </div>
          <div className="form-group">
            <label>Year Published</label>
            <input 
              className="form-control"
              name="year_published"
              value={book.year_published}
              placeholder="Enter publication year" 
              type="number"
              min="1000"
              max="2024"
              onChange={handleChange}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Book'}
          </button>
        </form>
      </div>
    </div>
  );
}
