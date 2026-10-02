import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    classAppliedFor: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, index: true },
    email: { type: String, trim: true },
    message: { type: String, trim: true },
    status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
    crmStatus: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending' },
  },
  { timestamps: true }
);

enquirySchema.index({ mobile: 1, classAppliedFor: 1, createdAt: -1 });

export default mongoose.model('Enquiry', enquirySchema);
