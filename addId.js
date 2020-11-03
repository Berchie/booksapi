var fs = require('fs');

const addId = () => (fs.readFile('./dataDb/authors.json', 'utf-8', function(err, data){
    if (err) {
      console.error(err.message);
    }
    books = JSON.parse(data);
    for (let i = 0; i < books.length; i++) {
      books[i].id = i + 1;
    }
    
    console.log(books);

    fs.writeFile('./dataDb/authors1.json', JSON.stringify(books),'utf-8', function(err){
        if (err) {
          console.error(err.message);
        }
        console.log("Great!!!! It works")
    })
}))

 module.exports = addId;