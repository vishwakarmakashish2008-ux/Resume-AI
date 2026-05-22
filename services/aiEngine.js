/**
 * AI Engine — Intelligent Resume Content Enhancement
 * 
 * This module provides NLP-powered text transformation that converts
 * casual, plain-language input into polished, professional resume content.
 */

// ─── Action Verb Library ────────────────────────────────
const ACTION_VERBS = {
  leadership: ['Spearheaded', 'Led', 'Directed', 'Orchestrated', 'Championed', 'Mentored', 'Supervised', 'Coordinated'],
  achievement: ['Achieved', 'Exceeded', 'Surpassed', 'Delivered', 'Accomplished', 'Attained', 'Earned', 'Secured'],
  creation: ['Developed', 'Designed', 'Built', 'Created', 'Engineered', 'Architected', 'Established', 'Launched'],
  improvement: ['Optimized', 'Streamlined', 'Enhanced', 'Improved', 'Accelerated', 'Revamped', 'Transformed', 'Modernized'],
  analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated', 'Identified', 'Diagnosed', 'Examined'],
  communication: ['Presented', 'Communicated', 'Articulated', 'Negotiated', 'Collaborated', 'Facilitated', 'Advocated', 'Influenced'],
  management: ['Managed', 'Administered', 'Oversaw', 'Executed', 'Implemented', 'Maintained', 'Organized', 'Regulated'],
  technical: ['Implemented', 'Integrated', 'Automated', 'Deployed', 'Configured', 'Programmed', 'Migrated', 'Debugged']
};

// ─── Professional Phrases ────────────────────────────────
const PROFESSIONAL_PHRASES = {
  'worked on': 'Contributed to',
  'helped with': 'Facilitated',
  'was responsible for': 'Managed',
  'responsible for': 'Oversaw',
  'did': 'Executed',
  'made': 'Developed',
  'used': 'Leveraged',
  'worked with': 'Collaborated with',
  'was part of': 'Contributed to',
  'dealt with': 'Managed',
  'took care of': 'Administered',
  'in charge of': 'Directed',
  'fixed': 'Resolved',
  'changed': 'Transformed',
  'started': 'Initiated',
  'set up': 'Established',
  'put together': 'Assembled',
  'came up with': 'Conceived',
  'figured out': 'Determined',
  'got': 'Obtained',
  'gave': 'Provided',
  'ran': 'Managed',
  'handled': 'Administered',
  'looked at': 'Analyzed',
  'checked': 'Evaluated',
  'showed': 'Demonstrated',
  'taught': 'Mentored',
  'learned': 'Acquired proficiency in',
  'know': 'Proficient in',
  'good at': 'Skilled in',
  'familiar with': 'Experienced with',
  'i am': '',
  'i was': '',
  'i have': '',
  'i ': '',
  'my ': '',
};

// ─── Skill Categories ────────────────────────────────────
const SKILL_CATEGORIES = {
  'Programming Languages': ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'typescript', 'swift', 'kotlin', 'php', 'scala', 'perl', 'r', 'matlab', 'dart', 'c', 'objective-c', 'lua', 'haskell', 'elixir', 'clojure'],
  'Web Technologies': ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'asp.net', 'next.js', 'nuxt', 'svelte', 'gatsby', 'webpack', 'vite', 'tailwind', 'bootstrap', 'sass', 'less', 'jquery', 'graphql', 'rest', 'api'],
  'Databases': ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sql server', 'sqlite', 'dynamodb', 'cassandra', 'firebase', 'supabase', 'neo4j', 'mariadb'],
  'Cloud & DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'ci/cd', 'linux', 'nginx', 'apache', 'heroku', 'vercel', 'netlify', 'git', 'github', 'gitlab', 'bitbucket'],
  'Data Science & AI': ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'nlp', 'computer vision', 'data analysis', 'data visualization', 'tableau', 'power bi', 'spark', 'hadoop', 'ai', 'neural networks'],
  'Mobile Development': ['react native', 'flutter', 'android', 'ios', 'swift', 'kotlin', 'xamarin', 'ionic'],
  'Tools & Platforms': ['jira', 'confluence', 'slack', 'trello', 'figma', 'sketch', 'adobe', 'postman', 'swagger', 'vs code', 'intellij', 'eclipse'],
  'Soft Skills': ['leadership', 'communication', 'teamwork', 'problem-solving', 'critical thinking', 'time management', 'adaptability', 'creativity', 'attention to detail', 'project management', 'agile', 'scrum']
};

// ─── Enhancement Functions ───────────────────────────────

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRandomVerb(category) {
  const verbs = ACTION_VERBS[category] || ACTION_VERBS.achievement;
  return verbs[Math.floor(Math.random() * verbs.length)];
}

/**
 * Replaces casual phrases with professional equivalents
 */
function professionalizeSentence(sentence) {
  let result = sentence.trim();
  
  // Replace casual phrases
  const lowerResult = result.toLowerCase();
  for (const [casual, professional] of Object.entries(PROFESSIONAL_PHRASES)) {
    const regex = new RegExp(`\\b${casual}\\b`, 'gi');
    result = result.replace(regex, professional);
  }
  
  // Clean up extra spaces
  result = result.replace(/\s+/g, ' ').trim();
  
  // Ensure starts with capital letter or action verb
  if (result.length > 0) {
    result = capitalizeFirst(result);
  }
  
  // Ensure proper ending
  if (result.length > 0 && !result.endsWith('.') && !result.endsWith('!')) {
    result += '.';
  }
  
  return result;
}

/**
 * Enhances a bullet point for work experience
 */
function enhanceExperienceBullet(bullet) {
  let enhanced = bullet.trim();
  
  // Remove leading bullets/dashes
  enhanced = enhanced.replace(/^[-•*]\s*/, '');
  
  // Professionalize the language
  enhanced = professionalizeSentence(enhanced);
  
  // If doesn't start with an action verb, try to add one
  const firstWord = enhanced.split(' ')[0];
  const allVerbs = Object.values(ACTION_VERBS).flat();
  const startsWithVerb = allVerbs.some(v => firstWord.toLowerCase() === v.toLowerCase());
  
  if (!startsWithVerb && enhanced.length > 10) {
    // Determine context and pick appropriate verb category
    const lowerBullet = enhanced.toLowerCase();
    let category = 'achievement';
    
    if (lowerBullet.includes('team') || lowerBullet.includes('lead') || lowerBullet.includes('manage')) {
      category = 'leadership';
    } else if (lowerBullet.includes('build') || lowerBullet.includes('creat') || lowerBullet.includes('develop') || lowerBullet.includes('design')) {
      category = 'creation';
    } else if (lowerBullet.includes('improv') || lowerBullet.includes('optim') || lowerBullet.includes('enhanc') || lowerBullet.includes('reduc')) {
      category = 'improvement';
    } else if (lowerBullet.includes('analy') || lowerBullet.includes('research') || lowerBullet.includes('evaluat') || lowerBullet.includes('data')) {
      category = 'analysis';
    } else if (lowerBullet.includes('code') || lowerBullet.includes('software') || lowerBullet.includes('system') || lowerBullet.includes('app')) {
      category = 'technical';
    } else if (lowerBullet.includes('present') || lowerBullet.includes('communic') || lowerBullet.includes('client')) {
      category = 'communication';
    }
    
    const verb = getRandomVerb(category);
    // Remove redundant starting words
    enhanced = enhanced.replace(/^(Successfully |Effectively |Efficiently )/i, '');
    enhanced = `${verb} ${enhanced.charAt(0).toLowerCase()}${enhanced.slice(1)}`;
  }
  
  return enhanced;
}

/**
 * Generates a professional summary from user input
 */
function generateProfessionalSummary(data) {
  const { personalInfo, objective, experience, skills } = data;
  
  let summary = '';
  
  // Determine experience level
  const totalYears = (experience || []).reduce((acc, exp) => {
    if (exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = exp.endDate === 'Present' ? new Date() : new Date(exp.endDate);
      return acc + (end.getFullYear() - start.getFullYear());
    }
    return acc;
  }, 0);
  
  const experienceLevel = totalYears > 8 ? 'Senior' : totalYears > 4 ? 'Experienced' : totalYears > 1 ? 'Motivated' : 'Enthusiastic';
  
  // Build skills string
  const topSkills = (skills || []).slice(0, 5).join(', ');
  
  if (objective && objective.trim().length > 0) {
    // Enhance user-provided objective
    summary = professionalizeSentence(objective);
    // Prepend experience level if not already there
    if (!summary.toLowerCase().includes(experienceLevel.toLowerCase())) {
      const role = personalInfo?.title || 'professional';
      summary = `${experienceLevel} ${role} with ${totalYears > 0 ? totalYears + '+ years of experience' : 'a strong foundation'} ${topSkills ? 'in ' + topSkills : ''}. ${summary}`;
    }
  } else {
    // Generate summary from available data
    const role = personalInfo?.title || 'professional';
    const skillPhrase = topSkills ? `specializing in ${topSkills}` : 'with diverse technical expertise';
    
    summary = `${experienceLevel} ${role} ${totalYears > 0 ? 'with ' + totalYears + '+ years of hands-on experience' : 'with a solid foundation in the field'}, ${skillPhrase}. Proven ability to deliver high-quality solutions and drive impactful results in fast-paced environments. Committed to continuous learning and professional growth.`;
  }
  
  return summary;
}

/**
 * Categorizes and organizes skills
 */
function organizeSkills(skillsInput) {
  if (!skillsInput || skillsInput.length === 0) return {};
  
  // Flatten input
  const allSkills = typeof skillsInput === 'string' 
    ? skillsInput.split(/[,;\n]/).map(s => s.trim()).filter(Boolean)
    : skillsInput;
  
  const categorized = {};
  const uncategorized = [];
  
  for (const skill of allSkills) {
    let found = false;
    for (const [category, keywords] of Object.entries(SKILL_CATEGORIES)) {
      if (keywords.some(kw => skill.toLowerCase().includes(kw))) {
        if (!categorized[category]) categorized[category] = [];
        if (!categorized[category].includes(skill)) {
          categorized[category].push(skill);
        }
        found = true;
        break;
      }
    }
    if (!found && skill.length > 0) {
      uncategorized.push(skill);
    }
  }
  
  if (uncategorized.length > 0) {
    categorized['Other Skills'] = uncategorized;
  }
  
  return categorized;
}

/**
 * Enhance education entries
 */
function enhanceEducation(education) {
  if (!education || education.length === 0) return [];
  
  return education.map(edu => ({
    ...edu,
    degree: edu.degree ? capitalizeFirst(edu.degree.trim()) : '',
    institution: edu.institution ? edu.institution.trim() : '',
    location: edu.location ? edu.location.trim() : '',
    gpa: edu.gpa ? edu.gpa.trim() : '',
    startDate: edu.startDate || '',
    endDate: edu.endDate || '',
    highlights: (edu.highlights || []).map(h => professionalizeSentence(h))
  }));
}

/**
 * Enhance work experience entries
 */
function enhanceExperience(experience) {
  if (!experience || experience.length === 0) return [];
  
  return experience.map(exp => ({
    ...exp,
    title: exp.title ? capitalizeFirst(exp.title.trim()) : '',
    company: exp.company ? exp.company.trim() : '',
    location: exp.location ? exp.location.trim() : '',
    startDate: exp.startDate || '',
    endDate: exp.endDate || 'Present',
    bullets: (exp.bullets || []).map(b => enhanceExperienceBullet(b))
  }));
}

/**
 * Enhance project entries
 */
function enhanceProjects(projects) {
  if (!projects || projects.length === 0) return [];
  
  return projects.map(proj => ({
    ...proj,
    name: proj.name ? capitalizeFirst(proj.name.trim()) : '',
    description: proj.description ? professionalizeSentence(proj.description) : '',
    technologies: proj.technologies || [],
    bullets: (proj.bullets || []).map(b => enhanceExperienceBullet(b)),
    link: proj.link || ''
  }));
}

/**
 * Enhance certifications
 */
function enhanceCertifications(certifications) {
  if (!certifications || certifications.length === 0) return [];
  
  return certifications.map(cert => ({
    ...cert,
    name: cert.name ? capitalizeFirst(cert.name.trim()) : '',
    issuer: cert.issuer ? cert.issuer.trim() : '',
    date: cert.date || '',
    link: cert.link || ''
  }));
}

/**
 * Enhance achievements
 */
function enhanceAchievements(achievements) {
  if (!achievements || achievements.length === 0) return [];
  
  return achievements.map(ach => {
    if (typeof ach === 'string') {
      return enhanceExperienceBullet(ach);
    }
    return {
      ...ach,
      title: ach.title ? capitalizeFirst(ach.title.trim()) : '',
      description: ach.description ? professionalizeSentence(ach.description) : ''
    };
  });
}

// ─── Main Export Functions ───────────────────────────────

/**
 * Enhance content for a specific resume section
 */
function enhanceResumeContent(section, content) {
  switch (section.toLowerCase()) {
    case 'summary':
    case 'objective':
      return professionalizeSentence(content);
    case 'experience':
      if (Array.isArray(content)) {
        return content.map(b => enhanceExperienceBullet(b));
      }
      return enhanceExperienceBullet(content);
    case 'skills':
      return organizeSkills(typeof content === 'string' ? content.split(',') : content);
    case 'education':
      return typeof content === 'string' ? professionalizeSentence(content) : content;
    case 'projects':
      if (Array.isArray(content)) {
        return content.map(b => enhanceExperienceBullet(b));
      }
      return enhanceExperienceBullet(content);
    case 'certifications':
      return typeof content === 'string' ? capitalizeFirst(content) : content;
    case 'achievements':
      if (Array.isArray(content)) {
        return content.map(b => enhanceExperienceBullet(b));
      }
      return enhanceExperienceBullet(content);
    default:
      return professionalizeSentence(content);
  }
}

/**
 * Generate and enhance all resume sections from raw data
 */
function generateResumeSections(data) {
  return {
    personalInfo: {
      name: data.personalInfo?.name || '',
      title: data.personalInfo?.title || '',
      email: data.personalInfo?.email || '',
      phone: data.personalInfo?.phone || '',
      location: data.personalInfo?.location || '',
      linkedin: data.personalInfo?.linkedin || '',
      github: data.personalInfo?.github || '',
      website: data.personalInfo?.website || ''
    },
    summary: generateProfessionalSummary(data),
    skills: organizeSkills(data.skills || []),
    experience: enhanceExperience(data.experience || []),
    education: enhanceEducation(data.education || []),
    projects: enhanceProjects(data.projects || []),
    certifications: enhanceCertifications(data.certifications || []),
    achievements: enhanceAchievements(data.achievements || [])
  };
}

module.exports = {
  enhanceResumeContent,
  generateResumeSections,
  professionalizeSentence,
  organizeSkills
};
