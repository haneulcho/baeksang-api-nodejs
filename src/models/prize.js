import mongoose, { Schema } from 'mongoose';

const PrizeSchema = new Schema({
  division: { type: String, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
});

const Prize = mongoose.model('Prize', PrizeSchema);

export default Prize;
