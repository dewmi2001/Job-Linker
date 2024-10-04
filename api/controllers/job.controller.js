import Job from '../models/job.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

export const create = async (req, res, next) => {
  if (!req.user.isEmp) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
  if (!req.body.jobTitle || !req.body.companyName) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  
  try {
    const slug = req.body.jobTitle
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '-') // Replace special characters with '-'
      .replace(/-{2,}/g, '-') // Replace multiple consecutive '-' with single '-'
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing '-'

    const newJob = new Job({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.jobTitle) {
      return next(errorHandler(400, 'Job title already exists'));
    } else if (error.code === 11000 && error.keyPattern.companyName) {
      return next(errorHandler(400, 'Company name already exists'));
    } else if (error.code === 11000 && error.keyPattern.slug) {
      return next(errorHandler(400, 'Slug already exists'));
    } else {
      return next(error);
    }
  }
};


export const getjobs = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const searchTerms = req.query.searchTerms; // Corrected variable name
    const job = await Job.find({
      ...(searchTerms && {
        $or: [
          { title: { $regex: searchTerms, $options: 'i' } },
          { category: { $regex: searchTerms, $options: 'i' } },
        ],
      }),
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.jobId && { _id: req.query.jobId }),
    }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

    const totalJobs = await Job.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthJobs = await Job.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      job,
      totalJobs,
      lastMonthJobs,
    });
  } catch (error) {
    next(error);
  }
};




export const deletejobs = async (req, res, next) => {
  if (!req.user.isEmp || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Job.findByIdAndDelete(req.params.jobId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatejob = async (req, res, next) => {
  try {
    // Ensure the user is authorized to update the job
    if (!req.user.isEmp || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
      return next(errorHandler(400, 'Invalid courseId'));
    }

    // Retrieve the job ID from the request parameters
    const jobId = req.params.jobId;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      {
        $set: {
          jobTitle: req.body.jobTitle,
          companyName: req.body.companyName,
          type: req.body.type,
          category: req.body.category,
          salary: req.body.salary,
          description: req.body.description,
          location: req.body.location,
        },
      },
      { new: true }
    );

    // Check if the job exists and was successfully updated
    if (!updatedJob) {
      return next(errorHandler(404, 'Job not found'));
    }

    // Return the updated job data
    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};
