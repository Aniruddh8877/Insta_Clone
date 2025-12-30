import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
     {
          user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },
          image: {
               type: String, // Deprecated
          },
          media: [
               {
                    url: { type: String, required: true },
                    type: { type: String, enum: ['image', 'video'], required: true }
               }
          ],
          caption: {
               type: String,
               default: "",
          },
          likes: [
               {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
               },
          ],
          comments: [
               {
                    user: {
                         type: mongoose.Schema.Types.ObjectId,
                         ref: 'User',
                         required: true,
                    },
                    text: {
                         type: String,
                         required: true,
                    },
                    createdAt: {
                         type: Date,
                         default: Date.now,
                    },
               },
          ],
     },
     { timestamps: true }
);

// Prevent Mongoose OverwriteModelError
// In development, we want to allow schema updates.
// Note: In production, this might not be ideal, but for this dev session it fixes the stale schema.
if (process.env.NODE_ENV !== 'production' && mongoose.models.Post) {
     delete mongoose.models.Post;
}

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
