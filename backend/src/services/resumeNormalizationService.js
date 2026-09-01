const normalizeResume = (parsedData) => {

    const {

        personalInfo = {},
        summary = "",
        skills = [],
        experience = [],
        education = [],
        projects = [],
        certifications = [],
        achievements = [],
        links = {}

    } = parsedData;


    // Normalize skills
    const normalizedSkills = skills
        .map(skill => skill.toLowerCase().trim())
        .filter(Boolean);

    // Normalize roles
    const roles = experience
        .map(item => item.position)
        .filter(Boolean)
        .map(role => role.toLowerCase().trim());

    // Normalize experience
    const normalizedExperience = experience.map(item => ({
        position: item.position || "",
        company: item.company || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        description: item.description || ""
    }));

    // Normalize education
    const normalizedEducation = education.map(item => ({
        degree: item.degree || "",
        institution: item.institution || "",
        field: item.field || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",

    }))

    // Normalize projects
    const normalizedProjects = projects.map(item => ({
        name: item.name || "",
        description: item.description || "",
        technologies: (item.technologies || [])
            .map(tech => tech.toLowerCase().trim())
            .filter(Boolean)
    }));


    return {

        personalInfo: {
            name: personalInfo.name || "",
            email: personalInfo.email || "",
            location: personalInfo.location || ""
        },

        summary: summary.trim(),

        skills: normalizedSkills,

        roles,

        experience: normalizedExperience,

        education: normalizedEducation,

        projects: normalizedProjects,

        certifications,

        achievements,

        links

    };
};


export default normalizeResume;
