import Course from '../models/course.model.js'
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

export const create = async (req, res, next) => {
  if (!req.user.isInst) {
    return next(errorHandler(403, 'You are not allowed to create a course'));
  }
  if (!req.body.title || !req.body.instituteName) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  
  try {
    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '-') // Replace special characters with '-'
      .replace(/-{2,}/g, '-') // Replace multiple consecutive '-' with single '-'
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing '-'

    const newCourse = new Course({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    next(error);
  }
};


export const getcourse = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    
    const queryFilters = {};

    if (req.query.userId) {
      queryFilters.userId = req.query.userId;
    }
    if (req.query.category) {
      queryFilters.category = req.query.category;
    }
    if (req.query.slug) {
      queryFilters.slug = req.query.slug;
    }
    if (req.query.courseId) {
      queryFilters._id = req.query.courseId;
    }
    if (req.query.searchTerms) {
      queryFilters.$or = [
        { title: { $regex: req.query.searchTerms, $options: 'i' } },
        { description: { $regex: req.query.searchTerms, $options: 'i' } },
      ];
    }
    if (req.query.level && req.query.level !== 'uncategorized') {
      queryFilters.level = req.query.level;
    }

    const course = await Course.find(queryFilters)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalCourse = await Course.countDocuments(queryFilters);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthCourse = await Course.countDocuments({
      ...queryFilters,
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      course,
      totalCourse,
      lastMonthCourse,
    });
  } catch (error) {
    next(error);
  }
};





export const deletecourse = async (req, res, next) => {
  if (!req.user.isInst || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this course'));
  }
  try {
    await Job.findByIdAndDelete(req.params.courseId);
    res.status(200).json('The course has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatecourse = async (req, res, next) => {
  try {
    if (!req.user.isInst || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this course'));
    }

    // Check if courseId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      return next(errorHandler(400, 'Invalid courseId'));
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          level: req.body.level,
          about: req.body.about,
          instituteName: req.body.instituteName,
          price: req.body.price,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};
