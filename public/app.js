/**
 * ResumeAI — Main Application Logic
 * Handles form navigation, data collection, resume generation, and export
 */

// ─── State ────────────────────────────────────────────
const APP_STATE = {
  currentStep: 1,
  totalSteps: 8,
  selectedTemplate: 'modern',
  resumeData: null,
  generatedResume: null,
  experienceCount: 0,
  educationCount: 0,
  projectCount: 0,
  certificationCount: 0,
  achievementCount: 0
};

const STEP_LABELS = [
  'Personal', 'Objective', 'Experience', 'Education',
  'Skills', 'Projects', 'Extras', 'Template'
];

// ─── DOM References ───────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── Initialization ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initProgressSteps();
  initNavigation();
  initTemplateGallery();
  initDynamicEntries();
  initSkillsPreview();
  initExportButtons();
  initDownloadModal();
  updateProgress();
  updateMiniPreview();

  // Add input listeners for live mini preview
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', debounce(updateMiniPreview, 300));
  });
});

// ─── Progress Steps ──────────────────────────────────
function initProgressSteps() {
  const container = $('#progress-steps');
  STEP_LABELS.forEach((label, i) => {
    const step = document.createElement('div');
    step.className = `progress-step ${i === 0 ? 'active' : ''}`;
    step.dataset.step = i + 1;
    step.innerHTML = `<span class="step-dot"></span><span class="step-label">${label}</span>`;
    step.addEventListener('click', () => goToStep(i + 1));
    container.appendChild(step);
  });
}

function updateProgress() {
  const fill = $('#progress-fill');
  const percent = ((APP_STATE.currentStep - 1) / (APP_STATE.totalSteps - 1)) * 100;
  fill.style.width = `${percent}%`;

  $$('.progress-step').forEach((step, i) => {
    step.classList.remove('active', 'completed');
    if (i + 1 === APP_STATE.currentStep) step.classList.add('active');
    else if (i + 1 < APP_STATE.currentStep) step.classList.add('completed');
  });

  // Update buttons
  $('#btn-prev').disabled = APP_STATE.currentStep === 1;
  
  if (APP_STATE.currentStep === APP_STATE.totalSteps) {
    $('#btn-next').classList.add('hidden');
    $('#btn-generate').classList.remove('hidden');
  } else {
    $('#btn-next').classList.remove('hidden');
    $('#btn-generate').classList.add('hidden');
  }
}

// ─── Navigation ──────────────────────────────────────
function initNavigation() {
  $('#btn-next').addEventListener('click', () => goToStep(APP_STATE.currentStep + 1));
  $('#btn-prev').addEventListener('click', () => goToStep(APP_STATE.currentStep - 1));
  $('#btn-generate').addEventListener('click', generateResume);

  // View switching
  $('#nav-builder').addEventListener('click', () => switchView('builder'));
  $('#nav-preview').addEventListener('click', () => {
    if (!APP_STATE.generatedResume) {
      showToast('Generate your resume first!', 'info');
      return;
    }
    switchView('preview');
  });

  $('#btn-back-to-builder').addEventListener('click', () => switchView('builder'));
  $('#btn-expand-preview').addEventListener('click', () => {
    if (!APP_STATE.generatedResume) {
      showToast('Generate your resume first!', 'info');
      return;
    }
    switchView('preview');
  });
}

function goToStep(step) {
  if (step < 1 || step > APP_STATE.totalSteps) return;
  
  $$('.form-step').forEach(s => s.classList.remove('active'));
  const target = $(`.form-step[data-step="${step}"]`);
  if (target) {
    target.classList.add('active');
    APP_STATE.currentStep = step;
    updateProgress();
    
    // Scroll to top of form
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function switchView(view) {
  $$('.view').forEach(v => v.classList.remove('active'));
  $(`#view-${view}`).classList.add('active');
  
  $$('.nav-btn').forEach(b => b.classList.remove('active'));
  $(`#nav-${view}`).classList.add('active');

  if (view === 'preview' && APP_STATE.generatedResume) {
    renderFullPreview();
  }
}

// ─── Template Gallery ────────────────────────────────
function initTemplateGallery() {
  const gallery = $('#template-gallery');
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with gradient header and accent colors. Perfect for tech and creative roles.',
      previewClass: 'template-preview-modern'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional professional layout with serif typography. Ideal for corporate and academic positions.',
      previewClass: 'template-preview-classic'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Ultra-clean minimalist design with elegant whitespace. Great for executives and designers.',
      previewClass: 'template-preview-minimal'
    }
  ];

  templates.forEach(tpl => {
    const card = document.createElement('div');
    card.className = `template-card ${tpl.id === APP_STATE.selectedTemplate ? 'selected' : ''}`;
    card.dataset.template = tpl.id;
    card.innerHTML = `
      <div class="template-preview ${tpl.previewClass}">
        <div class="tpl-name-line"></div>
        <div class="tpl-contact-line"></div>
        <div class="tpl-section-line"></div>
        <div class="tpl-text-line long"></div>
        <div class="tpl-text-line medium"></div>
        <div class="tpl-section-line"></div>
        <div class="tpl-text-line long"></div>
        <div class="tpl-text-line short"></div>
        <div class="tpl-text-line medium"></div>
        <div class="tpl-section-line"></div>
        <div class="tpl-text-line short"></div>
        <div class="tpl-text-line long"></div>
      </div>
      <div class="template-name">${tpl.name}</div>
      <div class="template-desc">${tpl.description}</div>
    `;
    card.addEventListener('click', () => selectTemplate(tpl.id));
    gallery.appendChild(card);
  });
}

function selectTemplate(id) {
  APP_STATE.selectedTemplate = id;
  $$('.template-card').forEach(c => c.classList.remove('selected'));
  $(`.template-card[data-template="${id}"]`).classList.add('selected');
  
  // Update preview selector too
  $('#template-select').value = id;
  
  if (APP_STATE.generatedResume) {
    renderFullPreview();
    updateMiniPreview();
  }
}

// ─── Dynamic Entries ─────────────────────────────────
function initDynamicEntries() {
  // Add initial entries
  addExperienceEntry();
  addEducationEntry();
  addProjectEntry();
  addCertificationEntry();
  addAchievementEntry();

  // Button listeners
  $('#btn-add-experience').addEventListener('click', addExperienceEntry);
  $('#btn-add-education').addEventListener('click', addEducationEntry);
  $('#btn-add-project').addEventListener('click', addProjectEntry);
  $('#btn-add-certification').addEventListener('click', addCertificationEntry);
  $('#btn-add-achievement').addEventListener('click', addAchievementEntry);
}

function createEntryCard(title, index, fields, containerId) {
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.dataset.index = index;
  card.innerHTML = `
    <div class="entry-card-header">
      <span class="entry-card-title">${title} #${index}</span>
      <button class="btn-remove-entry" onclick="this.closest('.entry-card').remove(); updateMiniPreview();">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="form-grid">${fields}</div>
  `;
  return card;
}

function addExperienceEntry() {
  APP_STATE.experienceCount++;
  const i = APP_STATE.experienceCount;
  const fields = `
    <div class="form-group">
      <label>Job Title</label>
      <input type="text" class="exp-title-input" placeholder="e.g. Software Engineer">
    </div>
    <div class="form-group">
      <label>Company</label>
      <input type="text" class="exp-company-input" placeholder="e.g. Google">
    </div>
    <div class="form-group">
      <label>Start Date</label>
      <input type="text" class="exp-start-input" placeholder="e.g. Jan 2020">
    </div>
    <div class="form-group">
      <label>End Date</label>
      <input type="text" class="exp-end-input" placeholder="e.g. Present">
    </div>
    <div class="form-group full-width">
      <label>Location</label>
      <input type="text" class="exp-location-input" placeholder="e.g. Mountain View, CA">
    </div>
    <div class="form-group full-width">
      <label>Key Responsibilities / Achievements</label>
      <div class="bullets-container">
        <div class="bullet-input-group">
          <input type="text" class="bullet-input" placeholder="e.g. Built a new feature that increased user engagement by 25%">
          <button class="btn-remove-bullet" onclick="this.parentElement.remove()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <button class="btn-add-bullet" onclick="addBulletInput(this)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add bullet point
      </button>
    </div>
  `;
  const card = createEntryCard('Experience', i, fields, 'experience-container');
  $('#experience-container').appendChild(card);
  
  // Add input listeners for live preview
  card.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', debounce(updateMiniPreview, 300));
  });
}

function addEducationEntry() {
  APP_STATE.educationCount++;
  const i = APP_STATE.educationCount;
  const fields = `
    <div class="form-group full-width">
      <label>Degree</label>
      <input type="text" class="edu-degree-input" placeholder="e.g. B.S. in Computer Science">
    </div>
    <div class="form-group">
      <label>Institution</label>
      <input type="text" class="edu-institution-input" placeholder="e.g. MIT">
    </div>
    <div class="form-group">
      <label>Location</label>
      <input type="text" class="edu-location-input" placeholder="e.g. Cambridge, MA">
    </div>
    <div class="form-group">
      <label>Start Date</label>
      <input type="text" class="edu-start-input" placeholder="e.g. Sep 2016">
    </div>
    <div class="form-group">
      <label>End Date</label>
      <input type="text" class="edu-end-input" placeholder="e.g. May 2020">
    </div>
    <div class="form-group">
      <label>GPA (optional)</label>
      <input type="text" class="edu-gpa-input" placeholder="e.g. 3.8/4.0">
    </div>
  `;
  const card = createEntryCard('Education', i, fields, 'education-container');
  $('#education-container').appendChild(card);
  
  card.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', debounce(updateMiniPreview, 300));
  });
}

function addProjectEntry() {
  APP_STATE.projectCount++;
  const i = APP_STATE.projectCount;
  const fields = `
    <div class="form-group">
      <label>Project Name</label>
      <input type="text" class="proj-name-input" placeholder="e.g. E-commerce Platform">
    </div>
    <div class="form-group">
      <label>Technologies Used</label>
      <input type="text" class="proj-tech-input" placeholder="e.g. React, Node.js, MongoDB">
    </div>
    <div class="form-group full-width">
      <label>Description</label>
      <textarea class="proj-desc-input" rows="2" placeholder="Describe the project briefly..."></textarea>
    </div>
    <div class="form-group full-width">
      <label>Key Highlights</label>
      <div class="bullets-container">
        <div class="bullet-input-group">
          <input type="text" class="bullet-input" placeholder="e.g. Implemented real-time search with 50ms response time">
          <button class="btn-remove-bullet" onclick="this.parentElement.remove()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <button class="btn-add-bullet" onclick="addBulletInput(this)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add bullet point
      </button>
    </div>
  `;
  const card = createEntryCard('Project', i, fields, 'projects-container');
  $('#projects-container').appendChild(card);
  
  card.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', debounce(updateMiniPreview, 300));
  });
}

function addCertificationEntry() {
  APP_STATE.certificationCount++;
  const i = APP_STATE.certificationCount;
  const fields = `
    <div class="form-group">
      <label>Certification Name</label>
      <input type="text" class="cert-name-input" placeholder="e.g. AWS Solutions Architect">
    </div>
    <div class="form-group">
      <label>Issuing Organization</label>
      <input type="text" class="cert-issuer-input" placeholder="e.g. Amazon Web Services">
    </div>
    <div class="form-group">
      <label>Date</label>
      <input type="text" class="cert-date-input" placeholder="e.g. Mar 2023">
    </div>
  `;
  const card = createEntryCard('Certification', i, fields, 'certifications-container');
  $('#certifications-container').appendChild(card);
  
  card.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', debounce(updateMiniPreview, 300));
  });
}

function addAchievementEntry() {
  APP_STATE.achievementCount++;
  const i = APP_STATE.achievementCount;
  const fields = `
    <div class="form-group full-width">
      <label>Achievement</label>
      <input type="text" class="ach-text-input" placeholder="e.g. Won first place in university hackathon with 200+ participants">
    </div>
  `;
  const card = createEntryCard('Achievement', i, fields, 'achievements-container');
  $('#achievements-container').appendChild(card);
  
  card.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', debounce(updateMiniPreview, 300));
  });
}

function addBulletInput(btn) {
  const container = btn.previousElementSibling;
  const group = document.createElement('div');
  group.className = 'bullet-input-group';
  group.innerHTML = `
    <input type="text" class="bullet-input" placeholder="Add another point...">
    <button class="btn-remove-bullet" onclick="this.parentElement.remove()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  container.appendChild(group);
  group.querySelector('input').focus();
  
  group.querySelector('input').addEventListener('input', debounce(updateMiniPreview, 300));
}

// ─── Skills Preview ──────────────────────────────────
function initSkillsPreview() {
  const input = $('#input-skills');
  input.addEventListener('input', debounce(() => {
    const skills = input.value.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
    const preview = $('#skills-preview');
    preview.innerHTML = skills.map(s => `<span class="skill-chip">${s}</span>`).join('');
  }, 200));
}

// ─── Data Collection ─────────────────────────────────
function collectFormData() {
  // Personal Info
  const personalInfo = {
    name: $('#input-name').value.trim(),
    title: $('#input-title').value.trim(),
    email: $('#input-email').value.trim(),
    phone: $('#input-phone').value.trim(),
    location: $('#input-location').value.trim(),
    linkedin: $('#input-linkedin').value.trim(),
    github: $('#input-github').value.trim()
  };

  // Objective
  const objective = $('#input-objective').value.trim();

  // Experience
  const experience = [];
  $$('#experience-container .entry-card').forEach(card => {
    const bullets = [];
    card.querySelectorAll('.bullet-input').forEach(b => {
      if (b.value.trim()) bullets.push(b.value.trim());
    });
    
    const exp = {
      title: card.querySelector('.exp-title-input')?.value.trim() || '',
      company: card.querySelector('.exp-company-input')?.value.trim() || '',
      startDate: card.querySelector('.exp-start-input')?.value.trim() || '',
      endDate: card.querySelector('.exp-end-input')?.value.trim() || '',
      location: card.querySelector('.exp-location-input')?.value.trim() || '',
      bullets
    };
    
    if (exp.title || exp.company) experience.push(exp);
  });

  // Education
  const education = [];
  $$('#education-container .entry-card').forEach(card => {
    const edu = {
      degree: card.querySelector('.edu-degree-input')?.value.trim() || '',
      institution: card.querySelector('.edu-institution-input')?.value.trim() || '',
      location: card.querySelector('.edu-location-input')?.value.trim() || '',
      startDate: card.querySelector('.edu-start-input')?.value.trim() || '',
      endDate: card.querySelector('.edu-end-input')?.value.trim() || '',
      gpa: card.querySelector('.edu-gpa-input')?.value.trim() || '',
      highlights: []
    };
    
    if (edu.degree || edu.institution) education.push(edu);
  });

  // Skills
  const skillsRaw = $('#input-skills').value.trim();
  const skills = skillsRaw.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);

  // Projects
  const projects = [];
  $$('#projects-container .entry-card').forEach(card => {
    const bullets = [];
    card.querySelectorAll('.bullet-input').forEach(b => {
      if (b.value.trim()) bullets.push(b.value.trim());
    });
    
    const techRaw = card.querySelector('.proj-tech-input')?.value.trim() || '';
    const proj = {
      name: card.querySelector('.proj-name-input')?.value.trim() || '',
      technologies: techRaw.split(',').map(t => t.trim()).filter(Boolean),
      description: card.querySelector('.proj-desc-input')?.value.trim() || '',
      bullets
    };
    
    if (proj.name) projects.push(proj);
  });

  // Certifications
  const certifications = [];
  $$('#certifications-container .entry-card').forEach(card => {
    const cert = {
      name: card.querySelector('.cert-name-input')?.value.trim() || '',
      issuer: card.querySelector('.cert-issuer-input')?.value.trim() || '',
      date: card.querySelector('.cert-date-input')?.value.trim() || ''
    };
    
    if (cert.name) certifications.push(cert);
  });

  // Achievements
  const achievements = [];
  $$('#achievements-container .entry-card').forEach(card => {
    const text = card.querySelector('.ach-text-input')?.value.trim() || '';
    if (text) achievements.push(text);
  });

  return {
    personalInfo,
    objective,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements
  };
}

// ─── Resume Generation ───────────────────────────────
async function generateResume() {
  const formData = collectFormData();
  
  // Validation
  if (!formData.personalInfo.name) {
    showToast('Please enter your name in the Personal Information step.', 'error');
    goToStep(1);
    return;
  }

  showLoading('Generating your resume...', 'Our AI is enhancing your content with professional language');
  
  try {
    const response = await fetch('/api/resume/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      APP_STATE.generatedResume = result.resume;
      APP_STATE.resumeData = formData;
      
      hideLoading();
      showToast('Resume generated successfully! 🎉', 'success');
      
      // Switch to preview
      switchView('preview');
      renderFullPreview();
      updateMiniPreview();
    } else {
      hideLoading();
      showToast(`Error: ${result.error}`, 'error');
    }
  } catch (error) {
    hideLoading();
    showToast(`Failed to generate resume: ${error.message}`, 'error');
  }
}

// ─── Rendering ───────────────────────────────────────
function renderFullPreview() {
  if (!APP_STATE.generatedResume) return;
  
  const html = ResumeTemplates.render(APP_STATE.selectedTemplate, APP_STATE.generatedResume);
  $('#resume-page').innerHTML = html;
}

function updateMiniPreview() {
  const container = $('#mini-preview-content');
  const data = collectFormData();
  
  // Build simple mini preview
  const name = data.personalInfo.name || '';
  const title = data.personalInfo.title || '';
  const contactParts = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean);
  
  if (!name && !title && contactParts.length === 0 && data.skills.length === 0 && data.experience.length === 0) {
    container.innerHTML = `
      <div class="mini-resume-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <p>Your resume preview will appear here as you fill in the details</p>
      </div>
    `;
    return;
  }

  let html = '<div class="mini-resume">';
  
  if (name) html += `<div class="mr-name">${name}</div>`;
  if (title) html += `<div class="mr-title">${title}</div>`;
  if (contactParts.length > 0) html += `<div class="mr-contact">${contactParts.join(' · ')}</div>`;
  
  if (data.objective) {
    html += `<div class="mr-section-title">Summary</div>`;
    html += `<div class="mr-text">${data.objective.substring(0, 120)}${data.objective.length > 120 ? '...' : ''}</div>`;
  }
  
  if (data.experience.length > 0 && (data.experience[0].title || data.experience[0].company)) {
    html += `<div class="mr-section-title">Experience</div>`;
    data.experience.forEach(exp => {
      if (exp.title || exp.company) {
        html += `<div class="mr-job-title">${exp.title}${exp.company ? ' — ' + exp.company : ''}</div>`;
        exp.bullets.slice(0, 2).forEach(b => {
          html += `<div class="mr-bullet">${b.substring(0, 60)}${b.length > 60 ? '...' : ''}</div>`;
        });
      }
    });
  }
  
  if (data.education.length > 0 && (data.education[0].degree || data.education[0].institution)) {
    html += `<div class="mr-section-title">Education</div>`;
    data.education.forEach(edu => {
      if (edu.degree || edu.institution) {
        html += `<div class="mr-text"><strong>${edu.degree}</strong>${edu.institution ? ' — ' + edu.institution : ''}</div>`;
      }
    });
  }
  
  if (data.skills.length > 0) {
    html += `<div class="mr-section-title">Skills</div>`;
    html += `<div>${data.skills.slice(0, 8).map(s => `<span class="mr-skill-chip">${s}</span>`).join('')}</div>`;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

// ─── Export Functions ────────────────────────────────
function initExportButtons() {
  $('#btn-export-pdf').addEventListener('click', exportPDF);
  $('#btn-export-docx').addEventListener('click', exportDOCX);
  
  // Template selector in preview
  $('#template-select').addEventListener('change', (e) => {
    selectTemplate(e.target.value);
  });
}

async function exportPDF() {
  if (!APP_STATE.generatedResume) {
    showToast('Please generate your resume first.', 'info');
    return;
  }

  showLoading('Exporting PDF...', 'Creating a high-quality PDF document');
  
  try {
    const html = getFullHTMLForExport();
    
    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, templateId: APP_STATE.selectedTemplate })
    });
    
    if (!response.ok) throw new Error('PDF export failed');
    
    const blob = await response.blob();
    downloadBlob(blob, 'resume.pdf');
    
    hideLoading();
    showToast('PDF downloaded successfully! 📄', 'success');
  } catch (error) {
    hideLoading();
    showToast(`PDF export failed: ${error.message}`, 'error');
  }
}

async function exportDOCX() {
  if (!APP_STATE.generatedResume) {
    showToast('Please generate your resume first.', 'info');
    return;
  }

  showLoading('Exporting DOCX...', 'Creating a Word-compatible document');
  
  try {
    const response = await fetch('/api/export/docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData: APP_STATE.generatedResume })
    });
    
    if (!response.ok) throw new Error('DOCX export failed');
    
    const blob = await response.blob();
    downloadBlob(blob, 'resume.docx');
    
    hideLoading();
    showToast('DOCX downloaded successfully! 📝', 'success');
  } catch (error) {
    hideLoading();
    showToast(`DOCX export failed: ${error.message}`, 'error');
  }
}

function getFullHTMLForExport() {
  const resumeHTML = ResumeTemplates.render(APP_STATE.selectedTemplate, APP_STATE.generatedResume);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      </style>
    </head>
    <body>${resumeHTML}</body>
    </html>
  `;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Download Modal ──────────────────────────────────
function initDownloadModal() {
  $('#btn-download-header').addEventListener('click', () => {
    if (!APP_STATE.generatedResume) {
      showToast('Generate your resume first to download!', 'info');
      return;
    }
    $('#download-modal').classList.remove('hidden');
  });
  
  $('#modal-close').addEventListener('click', () => {
    $('#download-modal').classList.add('hidden');
  });
  
  $('#download-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      $('#download-modal').classList.add('hidden');
    }
  });
  
  $('#dl-pdf').addEventListener('click', () => {
    $('#download-modal').classList.add('hidden');
    exportPDF();
  });
  
  $('#dl-docx').addEventListener('click', () => {
    $('#download-modal').classList.add('hidden');
    exportDOCX();
  });
}

// ─── UI Utilities ────────────────────────────────────
function showLoading(title, subtitle) {
  $('#loading-title').textContent = title || 'Processing...';
  $('#loading-subtitle').textContent = subtitle || 'Please wait';
  $('#loading-overlay').classList.remove('hidden');
}

function hideLoading() {
  $('#loading-overlay').classList.add('hidden');
}

function showToast(message, type = 'info') {
  const container = $('#toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  
  toast.innerHTML = `${icons[type] || icons.info}<span class="toast-message">${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
