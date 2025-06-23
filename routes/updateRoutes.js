const checkAuth = require('../middleware/authMiddleware');
const Book = require('../models/Book.js');
const User = require('../models/User.js');
const router = require('express').Router();



const isBookNew = async (userId,bookData)=>{
   console.log(bookData);
   const user = await User.findById(userId).populate('books');
   console.log(user.books);
   for(let book of user.books){
      console.log("////........Inside loop......////")
      if (book.title == bookData.title){
         return false;
      }
   }
   return true;
};

const addBook = async (userId, bookData) => {

   
      if( ! await isBookNew(userId,bookData)) throw Error("Book already exists");
      if(bookData.totalPages==bookData.pagesRead){
         bookData.completionStatus = true;
      }
      const book = await Book.create(bookData);
     
      const user = await User.findById(userId);
      console.log("after:::",user);
      user.books.push(book._id);
      user.totalBooks++;
      console.log("after:::",user);
      
      await user.save();
      return (user);
}

const editBook = async (userId, newBookData)=>{
   if(newBookData.totalPages==newBookData.pagesRead){
         newBookData.completionStatus = true;
      }
   return (await Book.findOneAndReplace({_id:newBookData._id},newBookData,{returnDocument:'after'}) );

}

const deleteBook = async (bookId, userId) => {
  const response = await Book.findByIdAndDelete(bookId);
  const user = await User.findById(userId);
  console.log(user);
  user.books.filter((id)=> id !=bookId);
  user.totalBooks--;
  console.log(user);
  await user.save();
  console.log(response)

  
}

router.post('/book/new', checkAuth,async (req, res) => {
   const{bookData}= req.body
   try{
      
      const user = await addBook(req.user.id, bookData);
      
      res.status(200).json(user);

   }catch(err){
      
      res.status(400).json({error: err.message})
   }
   
})


router.patch('/books',checkAuth,async (req,res)=>{
    const{bookData}= req.body;
    res.status(200);
   try{
     
      const user = await editBook(req.user.id, bookData);
     
      res.status(200).json(user);

   }catch(err){
      console.log(err);
      res.status(400).json({error: err.message})
   }
})

router.delete('/books',checkAuth, async (req,res)=>{
   const {bookId} = req.body;
   
   try{
      await deleteBook(bookId,req.user.id);
      console.log()
      res.status(200).json({status:"success"})

   }catch(err){
      console.log(err);
      res.status(400).json({status:"failed"});
   }
})

module.exports = router;