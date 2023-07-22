import { Schema, model } from 'mongoose';

const CandidateSchema = new Schema({
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
      id: { type: String, required: true },
      image: { type: String, required: true },
      award_name: { type: String },
      title: { type: String, required: true },
      sub_title: { type: String },
    },
  ],
});

const Candidate = model('Candidate', CandidateSchema);

export default Candidate;
