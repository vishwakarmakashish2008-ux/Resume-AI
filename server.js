const express = require('express');
const cors = require('cors');
const path = require('path');
const { enhanceResumeContent, generateResumeSections } = require('./services/aiEngine');
const { generatePDF } = require('./services/pdfExporter');
const { generateDOCX } = require('./services/docxExporter');
const { getTemplates, getTemplateById } = require('./services/templateService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Page Routes (before static to override index.html at /) ───
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/builder', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Static files (with index disabled so our / route takes priority)
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// ─── API Routes ────────────────────────────────────────────

// Get available templates
app.get('/api/templates', (req, res) => {
  try {
    const templates = getTemplates();
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single template
app.get('/api/templates/:id', (req, res) => {
  try {
    const template = getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI-enhance resume content
app.post('/api/resume/enhance', (req, res) => {
  try {
    const { section, content } = req.body;
    if (!section || !content) {
      return res.status(400).json({ success: false, error: 'Section and content are required' });
    }
    const enhanced = enhanceResumeContent(section, content);
    res.json({ success: true, enhanced });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate full resume
app.post('/api/resume/generate', (req, res) => {
  try {
    const resumeData = req.body;
    if (!resumeData || !resumeData.personalInfo) {
      return res.status(400).json({ success: false, error: 'Resume data is required' });
    }
    const generatedResume = generateResumeSections(resumeData);
    res.json({ success: true, resume: generatedResume });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export as PDF
app.post('/api/export/pdf', async (req, res) => {
  try {
    const { html, templateId } = req.body;
    if (!html) {
      return res.status(400).json({ success: false, error: 'HTML content is required' });
    }
    const pdfBuffer = await generatePDF(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export as DOCX
app.post('/api/export/docx', async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ success: false, error: 'Resume data is required' });
    }
    const docxBuffer = await generateDOCX(resumeData);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.docx');
    res.send(Buffer.from(docxBuffer));
  } catch (error) {
    console.error('DOCX generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve the frontend (Express v5 compatible catch-all)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  🚀 ResumeAI Server is running!`);
  console.log(`  ➜ Local:   http://localhost:${PORT}`);
  console.log(`  ➜ API:     http://localhost:${PORT}/api\n`);
});
