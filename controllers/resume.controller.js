import { Resume } from '#root/models/index.js';

export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ isPublished: true })
      .populate('owner')
      .sort({ createdAt: -1 });
    res.status(200).json({
      resumes,
    });
  } catch (err) {
    console.log('[getAllResumes]', err);
    res.status(500).json({
      message: 'Не удалось получить резюме',
    });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const resume = await Resume.findOne({ _id: resumeId }).populate('owner');

    res.status(200).json({
      resume,
    });
  } catch (err) {
    console.log('[getResumeById]', err);

    res.status(500).json({
      message: 'Не удалось получить резюме',
    });
  }
};

export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ owner: req.userId });

    res.status(200).json({
      resume,
    });
  } catch (err) {
    console.log('[getMyResume]', err);

    res.status(500).json({
      message: 'Не удалось получить резюме',
    });
  }
};

export const updateResumeById = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const {
      position,
      category,
      skills,
      workExperience,
      experienceLevel,
      salaryExpectations,
      country,
      city,
      relocation,
      englishLevel,
      summary,
      employment,
      dontConsider,
      isPublished,
    } = req.body;

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId },
      {
        position,
        category,
        skills,
        workExperience,
        experienceLevel,
        salaryExpectations,
        country,
        city,
        relocation,
        englishLevel,
        summary,
        employment,
        dontConsider,
        isPublished,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      resume: updatedResume,
    });
  } catch (err) {
    console.log('[updateResumeById]', err);

    res.status(500).json({
      message: 'Не удалось обновить резюме',
    });
  }
};
