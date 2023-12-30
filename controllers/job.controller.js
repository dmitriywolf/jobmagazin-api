import { Job } from '#root/models/index.js';

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('author');
    res.status(200).json({
      jobs,
    });
  } catch (err) {
    console.log('[getAllJobs]', err);
    res.status(500).json({
      message: 'Не удалось получить вакансии',
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const result = await Job.findOne({ _id: jobId }).populate('author');
    const job = result._doc;

    const { passwordHash, __v, ...authorView } = job.author._doc;

    res.status(200).json({
      job: {
        ...job,
        author: {
          ...authorView,
        },
      },
    });
  } catch (err) {
    console.log('[getJobById]', err);

    res.status(500).json({
      message: 'Не удалось получить вакансию',
    });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      category,
      domain,
      skills,
      workExperience,
      experienceLevel,
      salaryRange,
      country,
      city,
      englishLevel,
      summary,
      companyType,
      employmentOptions,
    } = req.body;

    const job = new Job({
      author: req.userId,
      title,
      category,
      domain,
      skills,
      workExperience,
      experienceLevel,
      salaryRange,
      country,
      city,
      englishLevel,
      summary,
      companyType,
      employmentOptions,
    });

    const jobData = await job.save();

    res.status(201).json({
      job: jobData,
    });
  } catch (err) {
    console.log('ERROR [createJob]', err);

    res.status(500).json({
      message: 'Не удалось создать вакансию',
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const {
      title,
      category,
      domain,
      skills,
      workExperience,
      experienceLevel,
      salaryRange,
      country,
      city,
      englishLevel,
      summary,
      companyType,
      employmentOptions,
    } = req.body;

    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId },
      {
        title,
        category,
        domain,
        skills,
        workExperience,
        experienceLevel,
        salaryRange,
        country,
        city,
        englishLevel,
        summary,
        companyType,
        employmentOptions,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      job: updatedJob,
    });
  } catch (err) {
    console.log('ERROR [createJob]', err);

    res.status(500).json({
      message: 'Не удалось создать вакансию',
    });
  }
};

export const getMyVacancies = async (req, res) => {
  try {
    const jobs = await Job.find({ author: req.userId });

    res.status(200).json({
      jobs,
    });
  } catch (err) {
    console.log('ERROR [getMyVacancies]', err);

    res.status(500).json({
      message: 'Не удалось получить вакансии',
    });
  }
};