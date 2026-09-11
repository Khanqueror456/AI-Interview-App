const extractJobFeatures = (job) => {
    return {
        jobId: job.externalId,

        role: job.title,

        skills: [],

        experienceYearsMin: null,

        experienceYearsMax: null,

        employmentType: job.employmentType,

        location: job.location,

        education: [],

        description: job.description,

        company: job.company,

        applyUrl: job.applyUrl,

        source: job.source
    };
};


export default extractJobFeatures;