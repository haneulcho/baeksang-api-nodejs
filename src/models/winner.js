import mongoose, { Schema } from 'mongoose';

const WinnerSchema = new Schema({
  awards_no: { type: Number, required: true, default: 58 },
  division: { type: String, required: true },
  division_name: { type: String, required: true },
  has_sector_winner: { type: Boolean, required: true, default: false },
  winner: {
    image: { type: String },
    award_name: { type: String },
    title: { type: String },
    sub_title: { type: String },
  },
  list: [
    {
      image: { type: String },
      award_name: { type: String },
      title: { type: String },
      sub_title: { type: String },
    },
  ],
});

const Winner = mongoose.model('Winner', WinnerSchema);

export default Winner;
