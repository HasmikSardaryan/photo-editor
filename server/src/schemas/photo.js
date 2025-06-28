import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

export const Photo = mongoose.model('Photo', photoSchema);