import React, {useState, useContext, useEffect} from "react";
import "./App.css";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useParams,
} from "react-router-dom";
/* Import the ThemeContext and the themes from ThemeContext.js */
import {ThemeContext, themes} from "./ThemeContext";

function BookList({books}) {
    const [likedOnly, setLikedOnly] = useState(false)
    const [updatedBooks, setUpdatedBooks] = useState([])

    const toggleLikeOnly = () => {
        setLikedOnly(likedOnly => !likedOnly)
        setUpdatedBooks([])
        books.filter((book) => {
            if (book.liked == true) {
                setUpdatedBooks(updatedBooks => [...updatedBooks, book])
            }
            return book.liked == true ;
        });
        console.log(updatedBooks)
    }

    if (likedOnly == true){
        return (
            <React.Fragment>
                <label>
                    Liked only
                    <input type="checkbox" onClick={toggleLikeOnly}/>
                    {likedOnly.toString()}
                </label>
                <ul style={{listStyleType: "none", padding: 0}}>
                    {/* The "map" function iterates over the array of books */}
                    {/* and returns a list item with a Book component for   */}
                    {/* each book in the books array.                       */}
                    {/* The books now come from the state                   */}
                    {updatedBooks.map((book) => (
                        /*
                        The key of the list item the ID of the book in the DB now
                         */
                        <li key={book.id}>
                            {/* Display basic info about the Book */}
                            <div>
                                <p>
                                    {/* Display a link leading to /book/..., to show  */}
                                    {/* the book details of the book that was clicked */}
                                    <Link to={`/book/${book.id}`} className="App-link"
                                          style={{color: book.liked ? '#98ff98' : 'inherit'}}>
                                        {book.title} by {book.author} ({book.year})
                                    </Link>
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </React.Fragment>
        )
    }else {
       return (
           <React.Fragment>
           <label>
               Liked only
               <input type="checkbox" onClick={toggleLikeOnly}/>
               {likedOnly.toString()}
           </label>
           <ul style={{listStyleType: "none", padding: 0}}>
               {/* The "map" function iterates over the array of books */}
               {/* and returns a list item with a Book component for   */}
               {/* each book in the books array.                       */}
               {/* The books now come from the state                   */}
               {books.map((book) => (
                   /*
                   The key of the list item the ID of the book in the DB now
                    */
                   <li key={book.id}>
                       {/* Display basic info about the Book */}
                       <div>
                           <p>
                               {/* Display a link leading to /book/..., to show  */}
                               {/* the book details of the book that was clicked */}
                               <Link to={`/book/${book.id}`} className="App-link"
                                     style={{color: book.liked ? '#98ff98' : 'inherit'}}>
                                   {book.title} by {book.author} ({book.year})
                               </Link>
                           </p>
                       </div>
                   </li>
               ))}
           </ul>
       </React.Fragment>)
    }

    return (
        /* Render a list of Book components, with no bullet points */
        <React.Fragment>
            <label>
                Liked only
                <input type="checkbox" onClick={toggleLikeOnly}/>
                {likedOnly.toString()}
            </label>
            <ul style={{listStyleType: "none", padding: 0}}>
                {/* The "map" function iterates over the array of books */}
                {/* and returns a list item with a Book component for   */}
                {/* each book in the books array.                       */}
                {/* The books now come from the state                   */}
                {books.map((book) => (
                    /*
                    The key of the list item the ID of the book in the DB now
                     */
                    <li key={book.id}>
                        {/* Display basic info about the Book */}
                        <div>
                            <p>
                                {/* Display a link leading to /book/..., to show  */}
                                {/* the book details of the book that was clicked */}
                                <Link to={`/book/${book.id}`} className="App-link"
                                      style={{color: book.liked ? '#98ff98' : 'inherit'}}>
                                    {book.title} by {book.author} ({book.year})
                                </Link>
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </React.Fragment>

    );

}

/* Book Form component - the UI & logic to add a new book */
class BookForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newBook: this.emptyBook,
        };
        /* Add a ref for the title text input */
        this.titleInputRef = React.createRef();
    }

    /* Emtpy book used in initial state and for resetting the form */
    emptyBook = {title: "", author: "", year: "", pages: "", cover: ""};

    /* Form input change handler */
    handleFormInputChange = (event) => {
        /*
        event is the change event generated by the browser
          - event.target is the form input that is affected
          - target.value is the value of the form field
          - target.name is the name of the form field
        */
        const target = event.target;
        const value = target.value;
        const name = target.name;

        /*
        Update state dynamically by spreading the existing
        newBook object (...prevState.newBook) and overriding
        the property based on the input name ([name]: value)
        The second form of setState is used, as we are
        basing the new value on the previous state
         */
        this.setState((prevState) => ({
            newBook: {...prevState.newBook, [name]: value},
        }));
    };

    /* Form submission handler */
    handleFormSubmit = async (event) => {
        /* Prevent the form submission from reloading the page */
        event.preventDefault();

        /* We now call the server to create our new book in the DB */
        /* Method is POST (for creation of resources)              */
        /* Content-Type header is set to application/json          */
        /* The body is the newBook object, stringified as JSON     */
        let newBookResponse = await fetch(process.env.REACT_APP_BOOKS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.newBook),
        });

        /* Get the response body, parsed from JSON */
        let newBook = await newBookResponse.json();

        /* Call the "add book" function that is passed as a prop */
        this.props.addBook(newBook);

        /* Reset the new book state */
        this.resetNewBook();

        /* Focus on the book title after adding a new book */
        this.focusBookTitle();
    };

    /* Method for focusing on the book title, using the created ref */
    focusBookTitle = (event) => {
        /* Use "current" to access the DOM element linked to the ref */
        /* and use the browser API method "focus"                    */
        this.titleInputRef.current.focus();
    };

    /* Reset the new book object */
    resetNewBook = () => {
        this.setState({newBook: this.emptyBook});
    };

    render() {
        return (
            <>
                {/* Render a form allowing to add a new book to the list */}
                <h2>Add a new Book</h2>
                <form onSubmit={this.handleFormSubmit} className="NewBook-Form">
                    {/* All inputs have been replaced with FormInput components */}
                    <FormInput
                        /* Link the created ref to the title input */
                        fieldRef={this.titleInputRef}
                        type="text"
                        name="title"
                        value={this.state.newBook.title}
                        onChange={this.handleFormInputChange}
                        placeholder="Title"
                    />
                    <FormInput
                        type="text"
                        name="author"
                        value={this.state.newBook.author}
                        onChange={this.handleFormInputChange}
                        placeholder="Author"
                    />
                    <FormInput
                        type="number"
                        name="year"
                        value={this.state.newBook.year}
                        onChange={this.handleFormInputChange}
                        placeholder="Year of Publication"
                    />
                    <FormInput
                        type="number"
                        name="pages"
                        value={this.state.newBook.pages}
                        onChange={this.handleFormInputChange}
                        placeholder="Number of Pages"
                    />
                    <FormInput
                        type="text"
                        name="cover"
                        value={this.state.newBook.cover}
                        onChange={this.handleFormInputChange}
                        placeholder="Cover URL"
                    />
                    <button type="submit">Add Book</button>
                </form>
            </>
        );
    }
}

/* About component - just render some simple text */
function About() {
    return (
        <p>Beeblio was developed @ HES-SO Valais, thanks for your interest!</p>
    );
}

/* FormInput component - uses the object destructuring syntax for the props */
function FormInput({type, name, value, onChange, placeholder, fieldRef}) {
    return (
        /* Wrap both elements in a React Fragment */
        <>
            {/* Render the input with the passed props */}
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                /* fieldRef defaults to null if no ref is given */
                ref={fieldRef ? fieldRef : null}
            />
            {/* Render a line break after the input */}
            <br/>
        </>
    );
}

/* Navbar component to switch theme */
class Navbar extends React.Component {
    render() {
        return (
            <div>
                <button
                    type="button"
                    title="Switch Theme"
                    onClick={this.context.toggleTheme}
                >
                    {/* Remove the current theme value from the button text */}
                    <span>????</span>
                </button>
            </div>
        );
    }
}

/* Set the contextType to ThemeContext*/
Navbar.contextType = ThemeContext;

/*
BookHelper is a helper component that interacts with
the React Router to determine which Book to render
 */
function BookHelper({books, toggleLike}) {
    let params = useParams();

    {
        /* Further pass down the toggleLike prop to the Book itself */
    }
    return (
        <Book
            {...books.find((book) => book.id === +params.id)}
            toggleLike={toggleLike}
        />
    );
}

class Book extends React.Component {
    /* Initialize state in the constructor */
    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
        };
    }

    /* Event handler for the Like Button*/
    handleLikeClick = (e) => {
        /* Toggle liked state using the method passed as a prop */
        this.props.toggleLike(this.props.id);
    };

    /* Start the timer when mounting the component */
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({currentDate: new Date()});
        }, 1000);
    }

    /* Clear the timer when unmounting the component */
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    /* Render the book's props as headings, paragraphs & an image */
    render() {
        let secondsSincePublished = Math.floor(
            (this.state.currentDate.getTime() -
                new Date(this.props.year, 0).getTime()) /
            1000
        );

        /* Element variable for the formatted book title */
        let formattedTitle;
        if (this.props.liked) {
            formattedTitle = (
                <h2 style={{color: "lightgreen"}}>{this.props.title}</h2>
            );
        } else {
            {
                /* Removed the hard-coded 'white' color for the book title to support light theme */
            }
            formattedTitle = <h2>{this.props.title}</h2>;
        }

        return (
            <div
                /* Style the book according to the current theme (from context) */
                style={{
                    backgroundColor: themes[this.context.theme].bookBackground,
                    color: themes[this.context.theme].foreground,
                }}
            >
                {/* Render the formatted title element variable */}
                {formattedTitle}
                {/* Invoke the handleLikeClick method when clicking on the button  */}
                {/* Inline if-else Like/Unlike button depending  the 'liked' state */}
                <button type="button" onClick={this.handleLikeClick}>
                    {this.props.liked ? <span>???? Unlike</span> : <span>???? Like</span>}
                </button>
                <h4>{this.props.author}</h4>
                <p>Published in : {this.props.year}</p>
                <p>Seconds since published : {secondsSincePublished}</p>
                <p>Pages : {this.props.pages}</p>
                <img
                    alt={this.props.title}
                    src={this.props.cover}
                    style={{maxHeight: "300px"}}
                />
            </div>
        );
    }
}

/* Set the contextType to ThemeContext*/
Book.contextType = ThemeContext;

function App() {
    /* Use Theme Context (with a hook) */
    let themeContext = useContext(ThemeContext);

    /* Initialize the books array state (with a hook) */
    /* From now on, the books come from a server URL  */
    let [books, setBooks] = useState([]);

    /* Effect hook for fetching the books from the server */
    useEffect(() => {
        /* The URL for the books is in the 'process.env' object */
        let booksURL = process.env.REACT_APP_BOOKS_URL;

        /* Declare an async function in order to use "await" */
        async function getBooks() {
            /* Call the books URL using the fetch API (async) */
            let booksReponse = await fetch(booksURL);

            /* Set the books to the JSON body of the response */
            /* using the ".json()" method (async)             */
            setBooks(await booksReponse.json());
        }

        /* Call the function the get the books */
        getBooks();
    }, []);

    /* appName is now just a variable */
    let appName = "Beeblio";

    /* Book adding function is now a variable */
    let addBook = (book) => {
        setBooks((prevBooks) => [book, ...prevBooks]);
    };

    /*
    We now want to be able to toggle a book's liked status
    using the server and updating the "books" array state
     */
    let handleToggleLike = async (idToToggle) => {
        // Copy books
        let updatedBooks = [...books];
        // Find book to update
        let bookToUpdate = updatedBooks.find((book) => book.id === idToToggle);
        // Check if book should be liked/unliked
        let action = bookToUpdate.liked ? "unlike" : "like";
        // Toggle book status on server
        let toggleBookResponse = await fetch(
            `${process.env.REACT_APP_BOOKS_URL}/${action}/${idToToggle}`,
            {method: "POST"}
        );
        // Toggle was successful
        if (toggleBookResponse.ok) {
            // Toggle liked state of book
            bookToUpdate.liked = !bookToUpdate.liked;
            // Update books array state
            setBooks(updatedBooks);
        }
    };

    /* No more render method */
    return (
        <BrowserRouter>
            <div className="App">
                <header
                    className="App-header"
                    /* Style the app according to the current theme (from context) */
                    style={{
                        /* The theme values now come from the themeContext variable */
                        backgroundColor: themes[themeContext.theme].background,
                        color: themes[themeContext.theme].foreground,
                    }}
                >
                    <Navbar/>
                    {/* appName is now just a variable */}
                    <h1>Welcome to {appName}!</h1>
                    {/* Render a Link that will take us to the /new URL */}
                    <Link to="/new" style={{color: themes[themeContext.theme].foreground}}>Add a New Book</Link>
                    <Routes>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/new" element={<BookForm addBook={addBook}/>}/>
                        {/* Render a Route that will render a Book component and pass it  */}
                        {/* the right book based on its current index in the array, given */}
                        {/* as a parameter in the URL. Also pass down the handleToggleLike*/}
                        {/* function as a prop to the BookHelper component                */}
                        <Route path="/book/:id" element={<BookHelper books={books} toggleLike={handleToggleLike}/>}/>
                    </Routes>
                    {/* Render the BookList and pass it the books array as a prop */}
                    <BookList books={books}/>
                </header>
            </div>
        </BrowserRouter>
    );
}

export default App;
