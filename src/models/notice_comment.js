import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const NoticeCommentSchema = new Schema(
  {
    id: { type: Number },
    ip: { type: String, default: '' },
    pr_id: { type: Number },
    author: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    display_name: { type: String },
    contents: { type: String, trim: true, required: true },
    password: {
      type: String,
      min: 8,
      max: 1024,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    cnt: {
      like: { type: Number, default: 0 },
      dislike: { type: Number, default: 0 },
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

NoticeCommentSchema.plugin(mongoosePaginate);
NoticeCommentSchema.plugin(AutoIncrement, { id: 'notice_comment_counter', inc_field: 'id' });

const NoticeComment = model('Notice_Comment', NoticeCommentSchema);

export default NoticeComment;
