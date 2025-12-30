import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
     {
          username: {
               type: String,
               required: [true, 'Please provide a username'],
               unique: true,
          },
          email: {
               type: String,
               required: [true, 'Please provide an email'],
               unique: true,
          },
          password: {
               type: String,
               required: [true, 'Please provide a password'],
          },
          image: {
               type: String,
               default: "",
          },
          bio: {
               type: String,
               default: "",
          },
          followers: [
               {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
               },
          ],
          following: [
               {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
               },
          ],
     },
     { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
