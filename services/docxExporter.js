/**
 * DOCX Export Service
 * Generates professional Word documents from resume data
 */

const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, 
        TabStopPosition, TabStopType, BorderStyle, Packer,
        SectionType, convertInchesToTwip } = require('docx');

/**
 * Create a section heading with underline
 */
function createSectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '2563EB' }
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 24,
        color: '1E3A5F',
        font: 'Calibri'
      })
    ]
  });
}

/**
 * Create a bullet point paragraph
 */
function createBullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: text,
        size: 21,
        font: 'Calibri'
      })
    ]
  });
}

/**
 * Generate a DOCX buffer from resume data
 */
async function generateDOCX(resumeData) {
  const { personalInfo, summary, skills, experience, education, projects, certifications, achievements } = resumeData;
  
  const children = [];
  
  // ─── Header: Name & Contact ─────────────────────────
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: personalInfo.name || 'Your Name',
          bold: true,
          size: 36,
          color: '1E3A5F',
          font: 'Calibri'
        })
      ]
    })
  );
  
  if (personalInfo.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: personalInfo.title,
            size: 24,
            color: '555555',
            font: 'Calibri'
          })
        ]
      })
    );
  }
  
  // Contact line
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.github) contactParts.push(personalInfo.github);
  
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 2, color: '2563EB' }
        },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 20,
            color: '666666',
            font: 'Calibri'
          })
        ]
      })
    );
  }
  
  // ─── Summary ────────────────────────────────────────
  if (summary) {
    children.push(createSectionHeading('Professional Summary'));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: summary,
            size: 21,
            font: 'Calibri'
          })
        ]
      })
    );
  }
  
  // ─── Experience ─────────────────────────────────────
  if (experience && experience.length > 0) {
    children.push(createSectionHeading('Work Experience'));
    
    for (const exp of experience) {
      // Job title and company
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: exp.title || 'Position',
              bold: true,
              size: 22,
              font: 'Calibri'
            }),
            new TextRun({
              text: `  —  ${exp.company || 'Company'}`,
              size: 22,
              font: 'Calibri'
            })
          ]
        })
      );
      
      // Dates and location
      const dateParts = [];
      if (exp.startDate || exp.endDate) {
        dateParts.push(`${exp.startDate || ''} — ${exp.endDate || 'Present'}`);
      }
      if (exp.location) dateParts.push(exp.location);
      
      if (dateParts.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: dateParts.join('  |  '),
                italics: true,
                size: 20,
                color: '888888',
                font: 'Calibri'
              })
            ]
          })
        );
      }
      
      // Bullet points
      if (exp.bullets && exp.bullets.length > 0) {
        for (const bullet of exp.bullets) {
          children.push(createBullet(bullet));
        }
      }
    }
  }
  
  // ─── Education ──────────────────────────────────────
  if (education && education.length > 0) {
    children.push(createSectionHeading('Education'));
    
    for (const edu of education) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: edu.degree || 'Degree',
              bold: true,
              size: 22,
              font: 'Calibri'
            }),
            new TextRun({
              text: `  —  ${edu.institution || 'Institution'}`,
              size: 22,
              font: 'Calibri'
            })
          ]
        })
      );
      
      const eduDetails = [];
      if (edu.startDate || edu.endDate) {
        eduDetails.push(`${edu.startDate || ''} — ${edu.endDate || 'Present'}`);
      }
      if (edu.location) eduDetails.push(edu.location);
      if (edu.gpa) eduDetails.push(`GPA: ${edu.gpa}`);
      
      if (eduDetails.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: eduDetails.join('  |  '),
                italics: true,
                size: 20,
                color: '888888',
                font: 'Calibri'
              })
            ]
          })
        );
      }
      
      if (edu.highlights && edu.highlights.length > 0) {
        for (const h of edu.highlights) {
          children.push(createBullet(h));
        }
      }
    }
  }
  
  // ─── Skills ─────────────────────────────────────────
  if (skills && Object.keys(skills).length > 0) {
    children.push(createSectionHeading('Skills'));
    
    for (const [category, skillList] of Object.entries(skills)) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${category}: `,
              bold: true,
              size: 21,
              font: 'Calibri'
            }),
            new TextRun({
              text: Array.isArray(skillList) ? skillList.join(', ') : skillList,
              size: 21,
              font: 'Calibri'
            })
          ]
        })
      );
    }
  }
  
  // ─── Projects ───────────────────────────────────────
  if (projects && projects.length > 0) {
    children.push(createSectionHeading('Projects'));
    
    for (const proj of projects) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: proj.name || 'Project',
              bold: true,
              size: 22,
              font: 'Calibri'
            }),
            ...(proj.technologies && proj.technologies.length > 0 ? [
              new TextRun({
                text: `  —  ${proj.technologies.join(', ')}`,
                italics: true,
                size: 20,
                color: '888888',
                font: 'Calibri'
              })
            ] : [])
          ]
        })
      );
      
      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: proj.description,
                size: 21,
                font: 'Calibri'
              })
            ]
          })
        );
      }
      
      if (proj.bullets && proj.bullets.length > 0) {
        for (const b of proj.bullets) {
          children.push(createBullet(b));
        }
      }
    }
  }
  
  // ─── Certifications ─────────────────────────────────
  if (certifications && certifications.length > 0) {
    children.push(createSectionHeading('Certifications'));
    
    for (const cert of certifications) {
      const certText = [cert.name, cert.issuer, cert.date].filter(Boolean).join('  —  ');
      children.push(createBullet(certText));
    }
  }
  
  // ─── Achievements ───────────────────────────────────
  if (achievements && achievements.length > 0) {
    children.push(createSectionHeading('Achievements'));
    
    for (const ach of achievements) {
      if (typeof ach === 'string') {
        children.push(createBullet(ach));
      } else {
        const achText = [ach.title, ach.description].filter(Boolean).join(' — ');
        children.push(createBullet(achText));
      }
    }
  }
  
  // ─── Build Document ─────────────────────────────────
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.6),
            right: convertInchesToTwip(0.7),
            bottom: convertInchesToTwip(0.6),
            left: convertInchesToTwip(0.7)
          }
        }
      },
      children
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

module.exports = { generateDOCX };
