import mongoose from 'mongoose';

const newsEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, enum: ['News', 'Event', 'Achievement'], required: true },
    date: { type: Date, required: true },
    image: { type: String, required: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

newsEventSchema.index({ published: 1, date: -1 });

export default mongoose.model('NewsEvent', newsEventSchema);
