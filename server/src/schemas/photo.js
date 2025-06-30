import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
}, {
  timestamps: true
});


export const Photo = mongoose.model('Photo', photoSchema);