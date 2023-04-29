import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost:27017/demoreset", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
    .then(db => console.log('DB connected successfully'))
    .catch(err => console.log(err));