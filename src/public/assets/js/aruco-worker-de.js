importScripts('../plugins/aruco.js', '../plugins/cv.js');

const detector = new AR.Detector();
console.log("Aruco worker initialized");
self.addEventListener('message', (event) => {
    let image = event.data.imageData;    
    let totalGray = 0;
    let minGray = 255, maxGray = 0;
    for (let i = 0; i < image.data.length; i += 4) {
        let r = image.data[i];
        let g = image.data[i + 1];
        let b = image.data[i + 2];
        
        if (r > 160 && g > 160 && b < 150) {
            image.data[i] = 0;      // R
            image.data[i + 1] = 0;  // G
            image.data[i + 2] = 255; // B
            r = image.data[i];
            g = image.data[i + 1];
            b = image.data[i + 2];
        }

        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        if (gray < minGray) minGray = gray;
        if (gray > maxGray) maxGray = gray;
    }
    
    postMessage({imageData:image});
    let grayRange = maxGray - minGray;
    let contrast = (grayRange / 255) * 400;
    
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < image.data.length; i += 4) {
        let r = image.data[i];
        let g = image.data[i + 1];
        let b = image.data[i + 2];

        r = factor * (r - 128) + 128;
        g = factor *  (g - 128) + 128;
        b =  factor * (b - 128) + 128;

        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        image.data[i] = r;
        image.data[i + 1] = g;
        image.data[i + 2] = b;
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        totalGray += gray;
    }
        
    postMessage({imageData: image});
    let markers = detector.detect(image, 0);
    console.log("Markers detected: " , markers);
    if (markers.length > 0){postMessage(markers);}
});


