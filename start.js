const { app, connectToDatabase } = require('./server');

const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

connectToDatabase(mongoUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(console.error);