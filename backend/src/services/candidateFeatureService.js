const extractCandidateFeatures = (normalizedResume) => {

    const {
        skills = [],
        roles = [],
        experience = [],
        education = [],
        projects = [],
        certifications = []
    } = normalizedResume;


    // Primary role
    const primaryRole = roles.length > 0 ? roles[0] : "";

    // Calculate approximate experience
    const experienceYears = calculateExperienceYears(experience);

    // Determine seniority
    const seniority = determineSeniority(
        experienceYears
    );

    // Collect technologies from projects
    const projectTechnologies = projects.flatMap(
        project => project.technologies || []
    );

    // Combine all technical skills
    const allSkills = [
        ...skills,
        ...projectTechnologies
    ];

    // Remove duplicates
    const uniqueSkills = [
        ...new Set(allSkills)
    ]

    return {

        primaryRole,

        roles,

        skills: uniqueSkills,

        experienceYears,

        seniority,

        education,

        certifications

    };

}

const calculateExperienceYears = (experience) => {

    // For now, we only count entries that contain dates.
    // We'll improve this calculation later.

    let totalMonths = 0;


    for (const item of experience) {

        if (!item.startDate) {
            continue;
        }


        const start = new Date(item.startDate);

        const end = item.endDate
            ? new Date(item.endDate)
            : new Date();


        if (
            isNaN(start.getTime()) ||
            isNaN(end.getTime())
        ) {
            continue;
        }


        const months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());


        if (months > 0) {
            totalMonths += months;
        }
    }


    return Number(
        (totalMonths / 12).toFixed(1)
    );
};


const determineSeniority = (experienceYears) => {

    if (experienceYears < 1) {
        return "fresher";
    }

    if (experienceYears < 3) {
        return "junior";
    }

    if (experienceYears < 6) {
        return "mid";
    }

    return "senior";
};

export default extractCandidateFeatures;