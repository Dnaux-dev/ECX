const Job = require('../../models/Job');

module.exports = async (req, res) => {
  const { jobType, location, minSalary, maxSalary, sortBy, page = 1, limit = 10 } = req.query;

  const filters = {};

  if (jobType) {
    filters.jobType = jobType;
  }

  if (location) {
    filters.location = { $regex: location, $options: 'i' };
  }

  if (minSalary || maxSalary) {
    filters.salary = {};
    if (minSalary) {
      filters.salary.$gte = Number(minSalary);
    }
    if (maxSalary) {
      filters.salary.$lte = Number(maxSalary);
    }
  }

  const sortOptions = {};
  if (sortBy === 'date') {
    sortOptions.createdAt = -1;
  } else if (sortBy === 'salary') {
    sortOptions.salary = -1;
  } else {
    sortOptions.createdAt = -1; // Default sort
  }

  try {
    const totalJobs = await Job.countDocuments(filters);
    const totalPages = Math.ceil(totalJobs / limit);
    const currentPage = Number(page);

    const jobs = await Job.find(filters)
      .populate('employer', 'username')
      .sort(sortOptions)
      .skip((currentPage - 1) * limit)
      .limit(Number(limit));

    res.json({
      totalJobs,
      totalPages,
      currentPage,
      jobs
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve jobs', details: err.message });
  }
}; 