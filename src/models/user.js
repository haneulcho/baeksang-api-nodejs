import mongoose, { Schema } from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const UserSchema = new Schema(
  {
    id: { type: Number },
    email: {
      type: String,
      required: '이메일 주소를 입력해 주세요.',
      trim: true,
      unique: true,
      min: 6,
      max: 255,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '올바른 이메일 주소를 입력해 주세요.'],
    },
    name: {
      type: String,
      required: '이름 또는 닉네임을 입력해 주세요.',
      unique: true,
      match: [/^.{2,8}$/, '2자 이상 8자 이하로 이름 또는 닉네임을 작성해 주세요.'],
    },
    password: {
      type: String,
      required: '비밀번호를 입력해 주세요.',
      min: 8,
      max: 1024,
    },
    role: { type: String, default: 'user' },
    provider: { type: String, default: '' },
    authToken: { type: String, default: '' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    paranoid: true,
    toObject: { virtuals: true },
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
);

UserSchema.plugin(AutoIncrement, { id: 'user_counter', inc_field: 'id' });
const User = mongoose.model('User', UserSchema);

export default User;
