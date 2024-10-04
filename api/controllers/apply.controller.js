import Apply from '../models/apply.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

export const createApply = async (req, res, next) => {
 
  if (!req.body.fullName || !req.body.email || !req.body.telNo || !req.body.city || !req.body.address) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  
  try {
    const slug = req.body.fullName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '-') // Replace special characters with '-'
      .replace(/-{2,}/g, '-') // Replace multiple consecutive '-' with single '-'
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing '-'

    const newApply = new Apply({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedApply = await newApply.save();
    res.status(201).json(savedApply);
  } catch (error) {
    next(error);
  }
};

export const getapply = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const apply = await Apply.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { category: req.query.slug }),
      ...(req.query.applyId && { _id: req.query.applyId }),
      ...(req.query.searchTerm && {
        $or: [
          { fullName: { $regex: req.query.searchTerm, $options: 'i' } },
          { email: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalApply = await Apply.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthApply = await Apply.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      apply,
      totalApply,
      lastMonthApply,
    });
  } catch (error) {
    next(error);
  }
};