/**
 * Resume Template Renderer
 * Generates styled HTML for each resume template
 */

const ResumeTemplates = {
  
  /**
   * Generate the complete HTML for the resume based on template
   */
  render(templateId, data) {
    switch (templateId) {
      case 'modern': return this.renderModern(data);
      case 'classic': return this.renderClassic(data);
      case 'minimal': return this.renderMinimal(data);
      default: return this.renderModern(data);
    }
  },

  /**
   * Helper: render skills section
   */
  renderSkillsHTML(skills) {
    if (!skills || Object.keys(skills).length === 0) return '';
    let html = '';
    for (const [category, list] of Object.entries(skills)) {
      const items = Array.isArray(list) ? list : [list];
      html += `<div class="skills-category">
        <span class="skills-cat-name">${category}:</span>
        <span class="skills-list">${items.join(', ')}</span>
      </div>`;
    }
    return html;
  },

  /**
   * Helper: render experience bullets
   */
  renderBulletsHTML(bullets) {
    if (!bullets || bullets.length === 0) return '';
    return `<ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
  },

  // ══════════════════════════════════════════════════════
  // MODERN TEMPLATE
  // ══════════════════════════════════════════════════════
  renderModern(data) {
    const p = data.personalInfo || {};
    const contactItems = [];
    if (p.email) contactItems.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>${p.email}</span>`);
    if (p.phone) contactItems.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${p.phone}</span>`);
    if (p.location) contactItems.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${p.location}</span>`);
    if (p.linkedin) contactItems.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>${p.linkedin}</span>`);
    if (p.github) contactItems.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>${p.github}</span>`);

    return `
    <style>
      .resume-modern {
        font-family: 'Inter', -apple-system, sans-serif;
        color: #1e293b;
        line-height: 1.5;
        padding: 0;
      }
      .resume-modern .header-section {
        background: linear-gradient(135deg, #4f46e5, #6366f1, #818cf8);
        color: white;
        padding: 2rem 2.5rem;
        position: relative;
        overflow: hidden;
      }
      .resume-modern .header-section::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -10%;
        width: 300px;
        height: 300px;
        background: rgba(255,255,255,0.05);
        border-radius: 50%;
      }
      .resume-modern .name {
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 0.25rem;
      }
      .resume-modern .title {
        font-size: 1rem;
        font-weight: 400;
        opacity: 0.9;
        margin-bottom: 0.75rem;
      }
      .resume-modern .contact-info {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        font-size: 0.75rem;
        opacity: 0.85;
      }
      .resume-modern .contact-item {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .resume-modern .body-section {
        padding: 1.5rem 2.5rem 2rem;
      }
      .resume-modern .section {
        margin-bottom: 1.25rem;
      }
      .resume-modern .section-title {
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #4f46e5;
        padding-bottom: 0.4rem;
        border-bottom: 2px solid #e0e7ff;
        margin-bottom: 0.75rem;
      }
      .resume-modern .summary-text {
        font-size: 0.85rem;
        color: #475569;
        line-height: 1.6;
      }
      .resume-modern .exp-entry {
        margin-bottom: 1rem;
      }
      .resume-modern .exp-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: wrap;
        margin-bottom: 0.25rem;
      }
      .resume-modern .exp-title {
        font-size: 0.9rem;
        font-weight: 700;
        color: #1e293b;
      }
      .resume-modern .exp-company {
        font-size: 0.85rem;
        color: #4f46e5;
        font-weight: 500;
      }
      .resume-modern .exp-meta {
        font-size: 0.75rem;
        color: #94a3b8;
      }
      .resume-modern ul {
        list-style: none;
        padding: 0;
        margin: 0.35rem 0 0;
      }
      .resume-modern li {
        position: relative;
        padding-left: 1rem;
        font-size: 0.8rem;
        color: #475569;
        margin-bottom: 0.2rem;
        line-height: 1.45;
      }
      .resume-modern li::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.55em;
        width: 4px;
        height: 4px;
        background: #6366f1;
        border-radius: 50%;
      }
      .resume-modern .skills-category {
        margin-bottom: 0.3rem;
        font-size: 0.8rem;
      }
      .resume-modern .skills-cat-name {
        font-weight: 600;
        color: #1e293b;
      }
      .resume-modern .skills-list {
        color: #475569;
      }
      .resume-modern .edu-entry, .resume-modern .proj-entry {
        margin-bottom: 0.75rem;
      }
      .resume-modern .cert-item, .resume-modern .ach-item {
        font-size: 0.8rem;
        color: #475569;
        padding-left: 1rem;
        position: relative;
        margin-bottom: 0.2rem;
      }
      .resume-modern .cert-item::before, .resume-modern .ach-item::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: #6366f1;
      }
      .resume-modern .proj-tech {
        display: inline-flex;
        gap: 0.35rem;
        flex-wrap: wrap;
        margin-top: 0.2rem;
      }
      .resume-modern .tech-tag {
        padding: 0.1rem 0.5rem;
        background: #eef2ff;
        color: #4f46e5;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 500;
      }
    </style>
    <div class="resume-modern">
      <div class="header-section">
        <div class="name">${p.name || 'Your Name'}</div>
        ${p.title ? `<div class="title">${p.title}</div>` : ''}
        <div class="contact-info">${contactItems.join('')}</div>
      </div>
      <div class="body-section">
        ${data.summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary-text">${data.summary}</div>
          </div>
        ` : ''}
        
        ${data.experience && data.experience.length > 0 ? `
          <div class="section">
            <div class="section-title">Work Experience</div>
            ${data.experience.map(exp => `
              <div class="exp-entry">
                <div class="exp-header">
                  <div>
                    <span class="exp-title">${exp.title}</span>
                    ${exp.company ? `<span class="exp-company"> — ${exp.company}</span>` : ''}
                  </div>
                  <div class="exp-meta">${[exp.startDate, exp.endDate].filter(Boolean).join(' — ')}${exp.location ? ` | ${exp.location}` : ''}</div>
                </div>
                ${this.renderBulletsHTML(exp.bullets)}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${data.education && data.education.length > 0 ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${data.education.map(edu => `
              <div class="edu-entry">
                <div class="exp-header">
                  <div>
                    <span class="exp-title">${edu.degree}</span>
                    ${edu.institution ? `<span class="exp-company"> — ${edu.institution}</span>` : ''}
                  </div>
                  <div class="exp-meta">${[edu.startDate, edu.endDate].filter(Boolean).join(' — ')}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
                </div>
                ${edu.highlights ? this.renderBulletsHTML(edu.highlights) : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${data.skills && Object.keys(data.skills).length > 0 ? `
          <div class="section">
            <div class="section-title">Skills</div>
            ${this.renderSkillsHTML(data.skills)}
          </div>
        ` : ''}
        
        ${data.projects && data.projects.length > 0 ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${data.projects.map(proj => `
              <div class="proj-entry">
                <div class="exp-title">${proj.name}</div>
                ${proj.description ? `<div class="summary-text">${proj.description}</div>` : ''}
                ${proj.technologies && proj.technologies.length > 0 ? `
                  <div class="proj-tech">${proj.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                ` : ''}
                ${this.renderBulletsHTML(proj.bullets)}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${data.certifications && data.certifications.length > 0 ? `
          <div class="section">
            <div class="section-title">Certifications</div>
            ${data.certifications.map(cert => `
              <div class="cert-item">${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}</div>
            `).join('')}
          </div>
        ` : ''}
        
        ${data.achievements && data.achievements.length > 0 ? `
          <div class="section">
            <div class="section-title">Achievements</div>
            ${data.achievements.map(ach => `
              <div class="ach-item">${typeof ach === 'string' ? ach : `${ach.title || ''}${ach.description ? ' — ' + ach.description : ''}`}</div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>`;
  },

  // ══════════════════════════════════════════════════════
  // CLASSIC TEMPLATE
  // ══════════════════════════════════════════════════════
  renderClassic(data) {
    const p = data.personalInfo || {};
    const contactParts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);

    return `
    <style>
      .resume-classic {
        font-family: Georgia, 'Times New Roman', serif;
        color: #1e293b;
        line-height: 1.5;
        padding: 2.5rem;
      }
      .resume-classic .header-section {
        text-align: center;
        padding-bottom: 1rem;
        border-bottom: 3px solid #1e3a5f;
        margin-bottom: 1.25rem;
      }
      .resume-classic .name {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1e3a5f;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
      }
      .resume-classic .title {
        font-size: 1rem;
        font-style: italic;
        color: #64748b;
        margin-bottom: 0.5rem;
      }
      .resume-classic .contact-info {
        font-size: 0.8rem;
        color: #475569;
      }
      .resume-classic .section {
        margin-bottom: 1.25rem;
      }
      .resume-classic .section-title {
        font-size: 1rem;
        font-weight: 700;
        color: #1e3a5f;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        padding-bottom: 0.3rem;
        border-bottom: 1.5px solid #cbd5e1;
        margin-bottom: 0.75rem;
      }
      .resume-classic .summary-text {
        font-size: 0.85rem;
        color: #334155;
        line-height: 1.65;
        text-align: justify;
      }
      .resume-classic .exp-entry {
        margin-bottom: 0.9rem;
      }
      .resume-classic .exp-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: wrap;
      }
      .resume-classic .exp-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #1e3a5f;
      }
      .resume-classic .exp-company {
        font-style: italic;
        color: #475569;
      }
      .resume-classic .exp-meta {
        font-size: 0.8rem;
        color: #94a3b8;
        font-style: italic;
      }
      .resume-classic ul {
        list-style: disc;
        padding-left: 1.25rem;
        margin: 0.3rem 0 0;
      }
      .resume-classic li {
        font-size: 0.82rem;
        color: #334155;
        margin-bottom: 0.15rem;
        line-height: 1.5;
      }
      .resume-classic .skills-category {
        margin-bottom: 0.25rem;
        font-size: 0.85rem;
      }
      .resume-classic .skills-cat-name {
        font-weight: 700;
        color: #1e3a5f;
      }
      .resume-classic .skills-list {
        color: #334155;
      }
      .resume-classic .cert-item, .resume-classic .ach-item {
        font-size: 0.82rem;
        color: #334155;
        margin-bottom: 0.2rem;
        padding-left: 1rem;
        position: relative;
      }
      .resume-classic .cert-item::before, .resume-classic .ach-item::before {
        content: '•';
        position: absolute;
        left: 0;
        color: #1e3a5f;
      }
      .resume-classic .proj-tech {
        margin-top: 0.15rem;
      }
      .resume-classic .tech-tag {
        font-size: 0.75rem;
        font-style: italic;
        color: #64748b;
      }
    </style>
    <div class="resume-classic">
      <div class="header-section">
        <div class="name">${p.name || 'Your Name'}</div>
        ${p.title ? `<div class="title">${p.title}</div>` : ''}
        <div class="contact-info">${contactParts.join('  •  ')}</div>
      </div>
      
      ${data.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="summary-text">${data.summary}</div>
        </div>
      ` : ''}
      
      ${data.experience && data.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Professional Experience</div>
          ${data.experience.map(exp => `
            <div class="exp-entry">
              <div class="exp-header">
                <div>
                  <span class="exp-title">${exp.title}</span>
                  ${exp.company ? `<span class="exp-company">, ${exp.company}</span>` : ''}
                </div>
                <div class="exp-meta">${[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}${exp.location ? ` | ${exp.location}` : ''}</div>
              </div>
              ${this.renderBulletsHTML(exp.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.education && data.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${data.education.map(edu => `
            <div class="exp-entry">
              <div class="exp-header">
                <div>
                  <span class="exp-title">${edu.degree}</span>
                  ${edu.institution ? `<span class="exp-company">, ${edu.institution}</span>` : ''}
                </div>
                <div class="exp-meta">${[edu.startDate, edu.endDate].filter(Boolean).join(' – ')}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
              </div>
              ${edu.highlights ? this.renderBulletsHTML(edu.highlights) : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.skills && Object.keys(data.skills).length > 0 ? `
        <div class="section">
          <div class="section-title">Technical Skills</div>
          ${this.renderSkillsHTML(data.skills)}
        </div>
      ` : ''}
      
      ${data.projects && data.projects.length > 0 ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${data.projects.map(proj => `
            <div class="exp-entry">
              <span class="exp-title">${proj.name}</span>
              ${proj.technologies && proj.technologies.length > 0 ? `<span class="tech-tag"> (${proj.technologies.join(', ')})</span>` : ''}
              ${proj.description ? `<div class="summary-text">${proj.description}</div>` : ''}
              ${this.renderBulletsHTML(proj.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.certifications && data.certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${data.certifications.map(cert => `
            <div class="cert-item">${cert.name}${cert.issuer ? ', ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}</div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.achievements && data.achievements.length > 0 ? `
        <div class="section">
          <div class="section-title">Achievements & Awards</div>
          ${data.achievements.map(ach => `
            <div class="ach-item">${typeof ach === 'string' ? ach : `${ach.title || ''}${ach.description ? ' — ' + ach.description : ''}`}</div>
          `).join('')}
        </div>
      ` : ''}
    </div>`;
  },

  // ══════════════════════════════════════════════════════
  // MINIMAL TEMPLATE
  // ══════════════════════════════════════════════════════
  renderMinimal(data) {
    const p = data.personalInfo || {};
    const contactParts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);

    return `
    <style>
      .resume-minimal {
        font-family: 'Inter', -apple-system, sans-serif;
        color: #0f172a;
        line-height: 1.55;
        padding: 3rem 2.5rem;
      }
      .resume-minimal .header-section {
        margin-bottom: 1.5rem;
      }
      .resume-minimal .name {
        font-size: 2.5rem;
        font-weight: 300;
        letter-spacing: -0.03em;
        color: #0f172a;
        margin-bottom: 0.25rem;
      }
      .resume-minimal .title {
        font-size: 1rem;
        font-weight: 400;
        color: #64748b;
        margin-bottom: 0.5rem;
      }
      .resume-minimal .contact-info {
        font-size: 0.8rem;
        color: #94a3b8;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;
      }
      .resume-minimal .section {
        margin-bottom: 1.25rem;
      }
      .resume-minimal .section-title {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #94a3b8;
        margin-bottom: 0.6rem;
      }
      .resume-minimal .summary-text {
        font-size: 0.85rem;
        color: #334155;
        line-height: 1.65;
      }
      .resume-minimal .exp-entry {
        margin-bottom: 0.9rem;
      }
      .resume-minimal .exp-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: wrap;
        margin-bottom: 0.2rem;
      }
      .resume-minimal .exp-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #0f172a;
      }
      .resume-minimal .exp-company {
        font-weight: 400;
        color: #475569;
      }
      .resume-minimal .exp-meta {
        font-size: 0.75rem;
        color: #94a3b8;
      }
      .resume-minimal ul {
        list-style: none;
        padding: 0;
        margin: 0.25rem 0 0;
      }
      .resume-minimal li {
        font-size: 0.82rem;
        color: #334155;
        margin-bottom: 0.15rem;
        line-height: 1.5;
        padding-left: 0.75rem;
        position: relative;
      }
      .resume-minimal li::before {
        content: '–';
        position: absolute;
        left: 0;
        color: #cbd5e1;
      }
      .resume-minimal .skills-category {
        margin-bottom: 0.25rem;
        font-size: 0.82rem;
      }
      .resume-minimal .skills-cat-name {
        font-weight: 600;
        color: #0f172a;
      }
      .resume-minimal .skills-list {
        color: #475569;
      }
      .resume-minimal .cert-item, .resume-minimal .ach-item {
        font-size: 0.82rem;
        color: #334155;
        margin-bottom: 0.15rem;
        padding-left: 0.75rem;
        position: relative;
      }
      .resume-minimal .cert-item::before, .resume-minimal .ach-item::before {
        content: '–';
        position: absolute;
        left: 0;
        color: #cbd5e1;
      }
      .resume-minimal .tech-tag {
        font-size: 0.72rem;
        color: #64748b;
        background: #f1f5f9;
        padding: 0.1rem 0.4rem;
        border-radius: 3px;
        margin-right: 0.25rem;
      }
      .resume-minimal .proj-tech {
        display: inline-flex;
        gap: 0.2rem;
        flex-wrap: wrap;
        margin-top: 0.15rem;
      }
    </style>
    <div class="resume-minimal">
      <div class="header-section">
        <div class="name">${p.name || 'Your Name'}</div>
        ${p.title ? `<div class="title">${p.title}</div>` : ''}
        <div class="contact-info">${contactParts.join('  ·  ')}</div>
      </div>
      
      ${data.summary ? `
        <div class="section">
          <div class="section-title">Summary</div>
          <div class="summary-text">${data.summary}</div>
        </div>
      ` : ''}
      
      ${data.experience && data.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Experience</div>
          ${data.experience.map(exp => `
            <div class="exp-entry">
              <div class="exp-header">
                <div>
                  <span class="exp-title">${exp.title}</span>
                  ${exp.company ? ` <span class="exp-company">at ${exp.company}</span>` : ''}
                </div>
                <div class="exp-meta">${[exp.startDate, exp.endDate].filter(Boolean).join(' — ')}${exp.location ? ` · ${exp.location}` : ''}</div>
              </div>
              ${this.renderBulletsHTML(exp.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.education && data.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${data.education.map(edu => `
            <div class="exp-entry">
              <div class="exp-header">
                <div>
                  <span class="exp-title">${edu.degree}</span>
                  ${edu.institution ? ` <span class="exp-company">at ${edu.institution}</span>` : ''}
                </div>
                <div class="exp-meta">${[edu.startDate, edu.endDate].filter(Boolean).join(' — ')}${edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
              </div>
              ${edu.highlights ? this.renderBulletsHTML(edu.highlights) : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.skills && Object.keys(data.skills).length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          ${this.renderSkillsHTML(data.skills)}
        </div>
      ` : ''}
      
      ${data.projects && data.projects.length > 0 ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${data.projects.map(proj => `
            <div class="exp-entry">
              <span class="exp-title">${proj.name}</span>
              ${proj.description ? `<div class="summary-text">${proj.description}</div>` : ''}
              ${proj.technologies && proj.technologies.length > 0 ? `
                <div class="proj-tech">${proj.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
              ` : ''}
              ${this.renderBulletsHTML(proj.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.certifications && data.certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${data.certifications.map(cert => `
            <div class="cert-item">${cert.name}${cert.issuer ? ' · ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}</div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.achievements && data.achievements.length > 0 ? `
        <div class="section">
          <div class="section-title">Achievements</div>
          ${data.achievements.map(ach => `
            <div class="ach-item">${typeof ach === 'string' ? ach : `${ach.title || ''}${ach.description ? ' — ' + ach.description : ''}`}</div>
          `).join('')}
        </div>
      ` : ''}
    </div>`;
  }
};
