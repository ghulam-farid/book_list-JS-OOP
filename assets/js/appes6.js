class Book{
   constructor(_title, _author, _isbn){
      this.title = _title;
      this.author = _author;
      this.isbn = _isbn;
   }
}
class UI{
   addBooktoList(book){
      const list = document.getElementById('book-list');
      const row = document.createElement('tr');
      row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="delete">X</a></td>
      `;
      list.appendChild(row);
   }
   showAlert(message, className){
      const div = document.createElement('div');
      div.className = `alert ${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
      setTimeout(function(){
         document.querySelector('.alert').remove();
      }, 3000);
   }
   clearFields(){
      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
   }
   deleteBook(target){
      if(target.className === 'delete'){
         target.parentElement.parentElement.remove();

      }
   }
}

class Store{
   static getBooks(){
      let books;
      if(localStorage.getItem('books') === null){
         books = [];
      }else{
         books = JSON.parse(localStorage.getItem('books'));
      }
      return books;
   }

   static displayBooks(){
      const books = Store.getBooks();
      books.map((book)=>{
         const ui = new UI;
         ui.addBooktoList(book);
      });
   }  

   static addBook(book){
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
   }

   static removeBook(isbn){
      const books = Store.getBooks();
      books.filter((book, index)=>{
         if(book.isbn === isbn){
            books.splice(index, 1);
         }
      });
      localStorage.setItem('books', JSON.stringify(books));
   }
}

document.addEventListener('DOMContentLoaded', Store.displayBooks);

document.getElementById('book-form').addEventListener('submit', function(e) {
   
   const title = document.getElementById('title').value;
   const author = document.getElementById('author').value;
   const isbn = document.getElementById('isbn').value;

   const ui = new UI();
   if(title === '' || author === '' || isbn === '') {
      ui.showAlert('Please fill in all fields', 'error');
   }else{
      const book = new Book(title, author, isbn);
      
      ui.addBooktoList(book);

      Store.addBook(book);
      
      ui.clearFields();
      
      ui.showAlert('Book Added!', 'success');
   }
   e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function(e){
   const ui = new UI();
   ui.deleteBook(e.target);
   ui.showAlert('Book Removed!', 'success');
   Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
   e.preventDefault();
});