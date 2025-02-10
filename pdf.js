// Function to open PDF in a new tab
function openPdfInNewTab(pdfPath) {
    window.open(pdfPath, '_blank');
}

// Function to open PDF in full-screen mode
function openFullScreenPdf(pdfPath) {
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfIframe = document.getElementById('pdf-iframe');

    // Set the PDF path in the iframe
    pdfIframe.src = pdfPath;

    // Show the full-screen viewer
    pdfViewer.style.display = 'block';
}

// Function to close the full-screen PDF viewer
function closeFullScreenPdf() {
    const pdfViewer = document.getElementById('pdf-viewer');

    // Hide the full-screen viewer
    pdfViewer.style.display = 'none';

    // Clear the iframe source to stop the PDF from loading
    const pdfIframe = document.getElementById('pdf-iframe');
    pdfIframe.src = '';
}