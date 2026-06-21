const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Construct the file URL for index.html
        const filePath = `file://${path.join(__dirname, 'index.html').replace(/\\/g, '/')}`;
        console.log(`Navigating to ${filePath}...`);
        
        await page.goto(filePath, { waitUntil: 'networkidle0' });

        const pdfPath = path.join(__dirname, 'How_to_Attract_Women.pdf');
        console.log(`Generating PDF at ${pdfPath}...`);
        
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            }
        });

        console.log('PDF generated successfully!');
        await browser.close();
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
})();
