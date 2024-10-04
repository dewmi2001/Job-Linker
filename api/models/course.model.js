import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    instituteName: {
      type: String,
      required: true,
      
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    
    level: {
      type: String,
      default: 'uncategorized',
      
    },
    price: {
      type: Number,
      required: true,
      
    },
    description: {
        type: String,
        required: true,
        
    },
    about: {
        type: String,
        required: true,
        
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default:
          'https://sprottshaw.com/wp-content/uploads/2022/09/GettyImages-1292319470-1-e1663277729533-1024x867.jpg',
      },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;