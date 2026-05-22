/**
 * Template Service
 * Manages resume templates and their rendering
 */

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with accent colors and a sidebar layout. Perfect for tech and creative roles.',
    preview: 'modern',
    accentColor: '#6366f1',
    fontFamily: "'Inter', sans-serif"
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout with clean lines and serif typography. Ideal for corporate and academic positions.',
    preview: 'classic',
    accentColor: '#1e3a5f',
    fontFamily: "'Georgia', serif"
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean minimalist design with maximum whitespace. Great for senior-level executives and designers.',
    preview: 'minimal',
    accentColor: '#0f172a',
    fontFamily: "'Inter', sans-serif"
  }
];

function getTemplates() {
  return templates;
}

function getTemplateById(id) {
  return templates.find(t => t.id === id) || null;
}

/**
 * Generate HTML for a specific template with resume data
 */
function renderTemplate(templateId, resumeData) {
  const template = getTemplateById(templateId) || templates[0];
  
  switch (template.id) {
    case 'modern':
      return renderModernTemplate(resumeData, template);
    case 'classic':
      return renderClassicTemplate(resumeData, template);
    case 'minimal':
      return renderMinimalTemplate(resumeData, template);
    default:
      return renderModernTemplate(resumeData, template);
  }
}

module.exports = {
  getTemplates,
  getTemplateById,
  renderTemplate
};
