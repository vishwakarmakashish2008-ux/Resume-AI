/**
 * PDF Export Service
 * Uses Puppeteer to generate high-quality PDFs from HTML resume content
 */

const puppeteer = require('puppeteer');

/**
 * Generate a PDF buffer from HTML content
 * @param {string} html - The complete HTML document string
 * @returns {Promise<Buffer>} PDF file as a buffer
 */
async function generatePDF(html) {
  let browser = null;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set content with print media emulation
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Emulate print media for better resume rendering
    await page.emulateMediaType('print');
    
    // Generate PDF with resume-optimized settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false
    });
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { generatePDF };
