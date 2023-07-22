import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ReplaySchema = new Schema({
  id: { type: String, required: true },
  youtube_code: { type: String, required: true },
  awards_no: { type: Number, required: true, default: 58 },
  image: { type: String, required: true },
  duration_display_time: { type: String },
  title: { type: String },
});

ReplaySchema.plugin(mongoosePaginate);
const Replay = mongoose.model('Replay', ReplaySchema);

export default Replay;
