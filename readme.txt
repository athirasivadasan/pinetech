Project Details 


Frontend : ReactJS
Backend : Node.js
DB : Mongodb
API : Graphql



To run the project
------------------
  1.open terminal,cd projectdirectory
  
  // backend
  
  $cd pinetech
  $npm install
  $npm start
  
  
  
  // frontend
  
  $cd frontend
  $npm install
  $npm start
  
  
  2.Open [http://localhost:3000](http://localhost:3000) to view it in the browser.



===============================================DATABASE========================================================

  Database configuration
  ----------------------


  1.Using MongoDB Atlas 

  Go to https://account.mongodb.com/account/login, and create one account

  1.create cluster
  2.under the security tab-> database access -> create user
  3.copy the user credentials and paste into nodemon.json file in the root directory
  4.click cluster->connect->connect your application ->copy the url
  5.paste the url into the app.js file in the root directory
   Eg:
   
    mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-km1ey.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
      });
  })
  .catch(err => {
    console.log(err);
  });