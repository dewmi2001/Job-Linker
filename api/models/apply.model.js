import mongoose from 'mongoose';

const applySchema = new mongoose.Schema(
  {
    
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    telNo: {
      type: String, 
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      
    },
    resume: {
      type: String,
    },
  },
  { timestamps: true }
);

const Apply = mongoose.model('Apply', applySchema);

export default Apply;
