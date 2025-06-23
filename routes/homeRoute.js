const { Router } = require('express');
const router = Router();
const checkAuth = require('../middleware/authMiddleware');
const User = require('../models/User');

const getBooks = async (userId, filters) => {
    
    const user = await User.findById(userId).populate('books');
    if (filters.none) {
        console.log(user.books)
        return user.books
    }
    const {completion} = filters;
    console.log(filters);
    return user.books.filter((book) =>{
        if(completion==null){
            console.log(book.genre)
           return filters[book.genre] == true
        }
        return filters[book.genre] == true &&  book.completionStatus==completion 
    }
        
    );
}

router.post('/home', checkAuth, async (req, res) => {
    console.log(req.body)
    const { filters } = req.body;

    try {

        const books = await getBooks(req.user.id, filters);
        console.log(books);
        res.status(200).json({ isAuth: true, books: books });
    } catch (err) {
        console.log(err);
        res.status(400).json({ err })
    }




})

module.exports = router;