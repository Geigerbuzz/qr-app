importScripts('../plugins/aruco.js', '../plugins/cv.js');

const detector = new AR.Detector();
console.log('Aruco worker initialized');

self.addEventListener('message', (event) => {
    console.log('Detecting markers in worker ');

    let image = event.data.imageData;

    // Suavizado inicial (oscurece ligeramente)
    for (let i = 0; i < image.data.length; i += 4) {
        image.data[i] *= 0.6;       // R
        image.data[i + 1] *= 0.7;   // G
        image.data[i + 2] *= 0.7;   // B
    }

    // Convertir img a escala de grises
    for (let i = 0; i < image.data.length; i += 4) {
        const r = image.data[i];
        const g = image.data[i + 1];
        const b = image.data[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        image.data[i] = image.data[i + 1] = image.data[i + 2] = gray;
    }
    // Invertir la imagen en escala de grises
    for (let i = 0; i < image.data.length; i += 4) {
        let gray = image.data[i];
        gray = 255 - gray;
        image.data[i] = image.data[i + 1] = image.data[i + 2] = gray;
    }

        // Aumentar el contraste
    for (let i = 0; i < image.data.length; i ++) {
        let gray = image.data[i];
        if (gray >= 230) {
            gray = 255;
        } else if (gray <= 50) {
            gray = 0;
        }
        image.data[i] = gray;
    }

    // Detectar marcadores
    let markers = detector.detect(image, 0);
    if (markers.length > 0) {
        postMessage({ markers});
    }
});
