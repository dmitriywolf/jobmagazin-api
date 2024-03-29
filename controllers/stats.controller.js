import { Resume, Job, Employer } from '#root/models/index.js';
import {
  EXPERIENCE_LEVELS,
  EMPLOYMENT,
  ENGLISH_LEVELS,
  RES_ERRORS,
} from '#root/common/constants.js';

export const getTotalStat = async (req, res) => {
  try {
    const companies = await Employer.find({ isPublished: true });
    const resumes = await Resume.find({ isPublished: true });
    const jobs = await Job.find();

    res.status(200).json({
      stat: [
        {
          key: 'Total',
          Companies: companies.length,
          Vacancies: jobs.length,
          Candidates: resumes.length,
        },
      ],
    });
  } catch (err) {
    console.log('ERROR [getTotalStat]', err);
    res.status(500).json({
      message: RES_ERRORS.internal_server_error,
    });
  }
};

export const getLevelStat = async (req, res) => {
  try {
    const resumes = await Resume.find({ isPublished: true });
    const jobs = await Job.find();

    const stat = EXPERIENCE_LEVELS.map((level) => {
      const resumesCount = resumes.filter((r) => r.experienceLevel === level)?.length || 0;
      const jobsCount = jobs.filter((j) => j.experienceLevel === level)?.length || 0;

      return {
        level,
        Vacancies: jobsCount,
        Candidates: resumesCount,
      };
    });

    res.status(200).json({
      stat,
    });
  } catch (err) {
    console.log('ERROR [getLevelStat]', err);
    res.status(500).json({
      message: RES_ERRORS.internal_server_error,
    });
  }
};

export const getSalaryExpectationStat = async (req, res) => {
  try {
    const resumes = await Resume.find({ isPublished: true });

    const stat = EXPERIENCE_LEVELS.map((level) => {
      const levelResumes = resumes.filter((r) => r.experienceLevel === level);
      const total = levelResumes.reduce((acc, r) => acc + r.salaryExpectations, 0);

      return {
        level,
        Salary: levelResumes.length ? total / levelResumes.length : 0,
      };
    });

    res.status(200).json({
      stat,
    });
  } catch (err) {
    console.log('ERROR [getSalaryExpectationStat]', err);
    res.status(500).json({
      message: RES_ERRORS.internal_server_error,
    });
  }
};

export const getEnglishStat = async (req, res) => {
  try {
    const resumes = await Resume.find({ isPublished: true });
    const jobs = await Job.find();

    const vacancies = ENGLISH_LEVELS.map((el) => {
      const count = jobs.filter((j) => j.englishLevel === el)?.length || 0;

      return {
        name: el,
        value: Math.round((count / jobs.length) * 10000) / 100,
      };
    });

    const candidates = ENGLISH_LEVELS.map((el) => {
      const count = resumes.filter((r) => r.englishLevel === el)?.length || 0;

      return {
        name: el,
        value: Math.round((count / resumes.length) * 10000) / 100,
      };
    });

    res.status(200).json({
      stat: {
        vacancies,
        candidates,
      },
    });
  } catch (err) {
    console.log('ERROR [getEnglishStat]', err);
    res.status(500).json({
      message: RES_ERRORS.internal_server_error,
    });
  }
};

export const getEmploymentStat = async (req, res) => {
  try {
    const resumes = await Resume.find({ isPublished: true });
    const jobs = await Job.find();

    const stat = EMPLOYMENT.map((employment) => {
      const resumesCount = resumes.filter((r) => r.employment.includes(employment))?.length || 0;
      const jobsCount = jobs.filter((j) => j.employment.includes(employment))?.length || 0;

      return {
        employment,
        Vacancies: jobsCount,
        Candidates: resumesCount,
      };
    });

    res.status(200).json({
      stat,
    });
  } catch (err) {
    console.log('ERROR [getEmploymentStat]', err);
    res.status(500).json({
      message: RES_ERRORS.internal_server_error,
    });
  }
};

export const getNotConsiderDomainsStat = async (req, res) => {
  try {
    const resumes = await Resume.find({ isPublished: true });

    const stat = {
      adult: 0,
      gambling: 0,
      dating: 0,
      gameDev: 0,
      blockchain: 0,
    };

    resumes.forEach((r) => {
      r.dontConsider.forEach((d) => {
        if (d === 'Adult') stat.adult += 1;
        if (d === 'Gambling') stat.gambling += 1;
        if (d === 'Dating') stat.dating += 1;
        if (d === 'Gamedev') stat.gameDev += 1;
        if (d === 'Blockchain/Crypto') stat.blockchain += 1;
      });
    });

    const statPercentage = {
      key: "Don't consider",
      Adult: Math.round((stat.adult / resumes.length) * 100),
      Gambling: Math.round((stat.gambling / resumes.length) * 100),
      Dating: Math.round((stat.dating / resumes.length) * 100),
      GameDev: Math.round((stat.gameDev / resumes.length) * 100),
      Blockchain: Math.round((stat.blockchain / resumes.length) * 100),
    };

    res.status(200).json({
      stat: [statPercentage],
    });
  } catch (err) {
    console.log('ERROR [getNotConsiderDomainsStat]', err);
    res.status(500).json({
      message: RES_ERRORS.internal_server_error,
    });
  }
};
