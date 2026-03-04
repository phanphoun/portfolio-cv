import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { skills, skillCategories, getSkillsByCategory, languages } from '@/data/skills';
import { education, certifications } from '@/data/education';

export function formatDate(date: string): string {
  return new Date(`${date}-01`).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function generateTextResume(): string {
  const lines: string[] = [];
  const contactLine = [
    `Email: ${profile.email}`,
    profile.phone ? `Phone: ${profile.phone}` : null,
  ].filter((part): part is string => Boolean(part));
  const locationLine = [
    `Location: ${profile.location}`,
    profile.website ? `Website: ${profile.website}` : null,
  ].filter((part): part is string => Boolean(part));

  lines.push(profile.name.toUpperCase());
  lines.push(profile.title);
  lines.push('');
  lines.push(contactLine.join(' | '));
  lines.push(locationLine.join(' | '));
  lines.push('');
  lines.push('='.repeat(60));
  lines.push('');

  lines.push('SUMMARY');
  lines.push('-'.repeat(40));
  lines.push(profile.summary);
  lines.push('');

  lines.push('EXPERIENCE');
  lines.push('-'.repeat(40));
  experience.forEach((exp) => {
    lines.push(`${exp.title} at ${exp.company}`);
    lines.push(`${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate!)}`);
    lines.push(`${exp.location} | ${exp.type}`);
    exp.achievements.forEach((achievement) => {
      lines.push(`  * ${achievement}`);
    });
    lines.push('');
  });

  lines.push('SKILLS');
  lines.push('-'.repeat(40));
  skillCategories.forEach((category) => {
    const categorySkills = getSkillsByCategory(category);
    if (categorySkills.length > 0) {
      lines.push(`${category}: ${categorySkills.map((skill) => skill.name).join(', ')}`);
    }
  });
  lines.push('');

  lines.push('EDUCATION');
  lines.push('-'.repeat(40));
  education.forEach((edu) => {
    lines.push(`${edu.degree} in ${edu.field}`);
    lines.push(`${edu.school}, ${edu.location} (${edu.endYear})`);
    if (edu.gpa) {
      lines.push(`GPA: ${edu.gpa}`);
    }
    lines.push('');
  });

  lines.push('CERTIFICATIONS');
  lines.push('-'.repeat(40));
  certifications.forEach((cert) => {
    lines.push(`${cert.name} - ${cert.issuer} (${formatDate(cert.date)})`);
  });
  lines.push('');

  lines.push('LANGUAGES');
  lines.push('-'.repeat(40));
  lines.push(languages.map((lang) => `${lang.name} (${lang.level})`).join(', '));

  return lines.join('\n');
}

export function getResumeData() {
  return {
    profile,
    experience,
    skills,
    skillCategories,
    education,
    certifications,
    languages,
  };
}
