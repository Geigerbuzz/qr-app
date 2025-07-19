/* 

GESTIÓN DE LA CAMARA Y DETECCIÓN DE ARUCOS

*/
// detector.js

var imageData, data, closest, x = 0, marker;
var markers, requestID, miss = [];
var encoder = new TextEncoder();
var img = new Image();

let video = document.createElement("video");
let canvasElement = document.getElementById("aruco-canvas");
let canvas = canvasElement.getContext("2d", { willReadFrequently: true });

var blocanva = document.getElementById("blocs-canvas");
var ctx = blocanva.getContext("2d");
const detector = new AR.Detector();
const language = localStorage.getItem('idioma') || 'es';
let utterance;
let frameCounter = 0;
const SAMPLING_RATE = 15;
var lastWidth = 0;
var lastHeight = 0;

function getArucoActionGeneric(id) {
    if ([0,1,2,3,4,5,6, 17 ].includes(id)) return "GreenFlag";
    if ([100, 101,102,103,104,105].includes(id)) return "Right";
    if ([120, 121, 122, 123, 124, 125, 126,127].includes(id)) return "Forward";
    if ([140, 141, 142, 143, 144, 145].includes(id)) return "Backward";
    if ([110, 111, 112, 113, 114, 115].includes(id)) return "Left";
    if ([160, 161, 162, 163, 164, 165].includes(id)) return "TurnRight";
    if ([150, 151,152,153,154,155].includes(id)) return "TurnLeft";
    if ([300, 301, 302, 303, 304].includes(id)) return "Sound";
    if ([200, 201, 202, 203, 204, 205].includes(id)) return "Talk";
    if ([370, 371, 372, 373, 374].includes(id)) return "LoopStart";
    if ([380, 381, 382, 383, 384].includes(id)) return "LoopEnd";
    if ([350, 351, 352].includes(id)) return "Wait";
    if (id === 450) return "End";
    if ([500, 501, 502, 503, 504].includes(id)) return "x2";
    if ([505, 506, 507, 508, 509].includes(id)) return "x3";
    if ([510, 511, 512, 513, 514].includes(id)) return "x4";
    if ([455, 456].includes(id)) return "RepeatAll";

    return null; // o "Unknown", según prefieras manejar IDs no definidos
}


function getEscornaAction(id) {
    if ([0,1,2,3,4,5,6 ].includes(id)) return "GreenFlag";
    if ([100, 101,102,103,104,105].includes(id)) return "w";
    if ([120, 121, 122, 123, 124, 125, 126,127].includes(id)) return "s";
    if ([140, 141, 142, 143, 144, 145].includes(id)) return "n";
    if ([110, 111, 112, 113, 114, 115].includes(id)) return "e";
    if ([150, 151,152,153,154,155].includes(id)) return "e";
    if ([160, 161,162,163,164,165].includes(id)) return "w";
    if ([370, 371, 372, 373, 374].includes(id)) return "LoopStart";
    if ([380, 381, 382, 383, 384].includes(id)) return "LoopEnd";
    if ([350, 351, 352].includes(id)) return "Wait";
    if (id === 450) return "End";
    if ([500, 501, 502, 503, 504].includes(id)) return "x2";
    if ([505, 506, 507, 508, 509].includes(id)) return "x3";
    if ([510, 511, 512, 513, 514].includes(id)) return "x4";
    if ([455, 456].includes(id)) return "RepeatAll";
    
    return null;
}

function getBluebotCommand(id) {
    const FORWARD = new Uint8Array([0xaa, 0x03, 0x81, 0x11, 0x07, 0x64]);
    const BACKWARD = new Uint8Array([0xaa, 0x03, 0x81, 0x11, 0x04, 0x67]);
    const LEFT = new Uint8Array([0xaa, 0x03, 0x81, 0x11, 0x05, 0x66]);
    const RIGHT = new Uint8Array([0xaa, 0x03, 0x81, 0x11, 0x06, 0x65]);

    if ([0,1,2,3,4,5,6 ].includes(id)) return "GreenFlag";
    if ([100, 101,102,103,104,105].includes(id)) return Uint8Array([0xaa, 0x03, 0x81, 0x11, 0x07, 0x64]);
    if ([120, 121, 122, 123, 124, 125, 126,127].includes(id)) return BACKWARD;
    if ([140, 141, 142, 143, 144, 145].includes(id)) return LEFT;
    if ([110, 111, 112, 113, 114, 115].includes(id)) return RIGHT;
    if ([150, 151,152,153,154,155].includes(id)) return RIGHT;
    if ([160, 161, 162, 163, 164, 165].includes(id)) return LEFT;
    if ([370, 371, 372, 373, 374].includes(id)) return "LoopStart";
    if ([380, 381, 382, 383, 384].includes(id)) return "LoopEnd";
    if ([350, 351, 352].includes(id)) return "Wait";
    if (id === 450) return "End";
    if ([500, 501, 502, 503, 504].includes(id)) return "x2";
    if ([505, 506, 507, 508, 509].includes(id)) return "x3";
    if ([510, 511, 512, 513, 514].includes(id)) return "x4";
    if ([455, 456].includes(id)) return "RepeatAll";

    return null;
}

const FINCH_TICKS_PER_DEGREE = 4.335; // Constante para giros
const FINCH_TICKS_PER_CM = 49.7; // Constante para movimientos

// Función mejorada para comandos del Finch
function getFinchCommand(id) {
    if ([0,1,2,3,4,5,6].includes(id)) return "GreenFlag";
    if ([370, 371, 372, 373, 374].includes(id)) return "LoopStart";
    if ([380, 381, 382, 383, 384].includes(id)) return "LoopEnd";
    if ([350, 351, 352].includes(id)) return "Wait";
    if (id === 450) return "End";
    if ([500, 501, 502, 503, 504].includes(id)) return "x2";
    if ([505, 506, 507, 508, 509].includes(id)) return "x3";
    if ([510, 511, 512, 513, 514].includes(id)) return "x4";
    if ([455, 456].includes(id)) return "RepeatAll";
    
    if ([120, 121, 122, 123, 124, 125, 126, 127].includes(id)) {
        return {
            type: "finch_move",
            cmd: "move",
            direction: "Forward",
            distance: 10, // 10 cm
            speed: 50
        };
    }
    if ([140, 141, 142, 143, 144, 145].includes(id)) {
        return {
            type: "finch_move",
            cmd: "move",
            direction: "Backward",
            distance: 10,
            speed: 50
        };
    }
    if ([110, 111, 112, 113, 114, 115].includes(id)) {
        return {
            type: "finch_move",
            cmd: "move",
            direction: "Left",
            distance: 10,
            speed: 50
        };
    }
    if ([100, 101,102,103,104,105].includes(id)) {
        return {
            type: "finch_move",
            cmd: "move",
            direction: "Right",
            distance: 10,
            speed: 50
        };
    }
    if ([160, 161, 162, 163, 164, 165].includes(id)) {
        return {
            type: "finch_move",
            cmd: "turn",
            direction: "Right",
            angle: 90,
            speed: 50
        };
    }
    if ([150, 151,152,153,154,155].includes(id)) {
        return {
            type: "finch_move",
            cmd: "turn",
            direction: "Left",
            angle: 90,
            speed: 50
        };
    }
    return null;
}

const codigos = { //Códigos de idioma para la función de texto a voz
    es: 'es-ES',
    en: 'en-US',
    ca: 'ca-ES',
    de: 'de-DE',
    pt: 'pt-PT',
    //pl: 'pl-PL',
    //ro: 'ro-RO',
    //hu: 'hu-HU',
    //el: 'el-GR'
};

//Funciones
//--------------------------------
function PopUp() { // Ventana emergente para conectar por bluetooth el robot
    Swal.fire({
        width: '60%',
        height: "auto",  
        padding: '3%', 
        title: translations[language]['robot'],
        html: `
        <div style="display: grid; grid-template-columns: auto auto;  grid-template-rows: auto auto; gap: 2% 1%; margin: 2%;">
            <div style="text-align:center; padding: 2%">
                <img id="microbit" src="assets/images/microbit.png" alt="Microbit" style="cursor: pointer; height: 150px; ">
                <p><a href="https://makecode.microbit.org/S74304-48867-59540-86098" target="_blank">${translations[language]['makeCodeLink']}</a></p>
            </div>
            <div style="text-align:center; padding: 2%">
                <img id="esconarbot" src="assets/images/escornabot.png" alt="Esconarbot" style="cursor: pointer; height: 180px;">
            </div>
            <div style="text-align:center; padding: 2%;">
                <img id="bluebot" src="assets/images/bluebot.png" alt="Bluebot" style="cursor: pointer; height: 200px;">
            </div>
            <div style="text-align:center; padding: 2%;">
                <img id="finch" src="assets/images/finch.png" alt="Finch" style="cursor: pointer; height: 180px;">
            </div>
        </div>`,
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
            const microbitImage = Swal.getPopup().querySelector('#microbit');
            const esconarbotImage = Swal.getPopup().querySelector('#esconarbot');
            const bluebotImage = Swal.getPopup().querySelector('#bluebot');
            const FinchImage = Swal.getPopup().querySelector('#finch');

            microbitImage.addEventListener('click', () => {
              buscarDispositivos(services.microbit);
              selectedDevice = services.microbit;
              Swal.close();});

            esconarbotImage.addEventListener('click', () => {
              buscarDispositivos(services.escornabot);
              selectedDevice = services.escornabot;
              Swal.close();});

            bluebotImage.addEventListener('click', () => {
              buscarDispositivos(services.bluebot);
              selectedDevice = services.bluebot;
              Swal.close();});

            FinchImage.addEventListener('click', () => {
              buscarDispositivos(services.finch);
              selectedDevice = services.finch;
              Swal.close();});
        }
    });
}

function openCamera() {
    miss=[];
    x=0; 
    // Restablecer la posición del canvas a la definida en index.css
    blocanva.style.position = '';
    blocanva.style.top = '';
    blocanva.style.left = '';
    blocanva.style.transform = '';
    ctx.clearRect(0, 0, blocanva.width, blocanva.height);

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }) .then(function(stream) { //Configuraciones del vídeo y acceso a la cámara
        video.srcObject = stream;
        canvasElement.hidden = false;
        video.setAttribute("playsinline", true);
        video.play();

        video.addEventListener('loadedmetadata', function() {
            document.getElementById("send").innerHTML = '<img src="assets/images/cancel.png" data-translate="Cancelar">'; //Cambio de icono a cancelar
            document.getElementById("send").setAttribute("onclick", "cancelLecture()"); //Cambio de función del botón a cancelar lectura de bloques
            document.getElementById("camara").innerHTML = '<img src="assets/images/ok.png" data-translate="aceptar">'; //Cambio de icono a OK
            document.getElementById("camara").setAttribute("onclick", "acceptLecture()"); //Asignacion del botón a acceptar lectura de bloques
            document.getElementById("repeat").hidden = false;
            document.getElementById("repeat").innerHTML = '<img src="assets/images/repeat.png" data-translate="repeat">';
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
            
            Deteccion();
            });

        }).catch(function(err) {
            Swal.fire({
                title: translations[language]['camaraError'],
                text: translations[language]['camaraErrorText'],
                confirmButtonText: translations[language]['aceptar'],
            });
        });
}


function Deteccion() {
    requestID = window.requestAnimationFrame(Deteccion); 
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    frameCounter++; //Nomes llegir cada frameCounter frames
    if (frameCounter % SAMPLING_RATE === 0) {
        var imageData = canvas.getImageData(0, 0, canvasElement.width-10, canvasElement.height-10);
        // Suavizado inicial (oscurece ligeramente)
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] *= 0.6;       // R
            imageData.data[i + 1] *= 0.7;   // G
            imageData.data[i + 2] *= 0.7;   // B
        }

        // Convertir img a escala de grises
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = gray;
        }
        // Invertir la imagen en escala de grises
        for (let i = 0; i < imageData.data.length; i += 4) {
            let gray = imageData.data[i];
            gray = 255 - gray;
            imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = gray;
        }

        // Aumentar el contraste
        for (let i = 0; i < imageData.data.length; i ++) {
            let gray = imageData.data[i];
            if (gray >= 230) {
            gray = 255;
            } else if (gray <= 50) {
            gray = 0;
            }
            imageData.data[i] 
        }

        
        let markers = detector.detect(imageData, 0);
        //console.log('Detected markers:', markers.length);
        if (markers.length > 0) {
            handleDetection({ data: { markers } });
        }
        }
}

async function handleDetection(markers) {
    markers = markers.data.markers;
    //console.log("Detected markers:", markers);
    if (markers.length > 1) {
        //console.log("Multiple markers detected, sorting them");
        markers.sort((a, b) => {
            if (Math.abs(a.corners[0].x - b.corners[0].x) > 10) {
                return a.corners[0].x - b.corners[0].x;
            }
            return a.corners[0].y - b.corners[0].y;
        });}
    
    for (const marker of markers) {
        //console.log("Evaluating markers", marker.id);
        if (!miss.includes(marker.id)) {
            if ([500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514].includes(marker.id)) {
                await Contadores(marker, markers);
            } else {
                await Bloques(marker);   
            }
        }
    }
}

async function Contadores(marker, markers) {
    closest = findClosestMarker(markers, marker);
    if (closest != null && !miss.includes(closest.id)) {
        miss.push(closest.id);
        speak(closest.id, language);
        await drawBlocks(closest.id);
    }
    if (!miss.includes(marker.id)) {
        miss.push(marker.id);
        speak(marker.id, language);
        await drawBlocks(marker.id);
    }
}

async function Bloques(marker) {
    miss.push(marker.id);
    speak(marker.id, language);
    await drawBlocks(marker.id);
}

function findClosestMarker(markers, marker) {
    let closestMarker = null;
    let minDistance = Infinity;

    for (let j = 0; j < markers.length; j++) {
        if (markers[j].id !== marker.id) {
            const dx = markers[j].corners[0].x - marker.corners[0].x;
            const dy = markers[j].corners[0].y - marker.corners[0].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance && distance <= 70) {
                minDistance = distance;
                closestMarker = markers[j];
            }
        }
    }
    return closestMarker;
}

async function drawBlocks(id) {
    return new Promise((resolve) => {
        block = getArucoActionGeneric(id)
        if (block === null) {
            return;
        }
        img.src = "assets/images/blocks/" + String(block) + ".png";
        img.onload = function() {
            const canvasWidth = ctx.canvas.width;
            const canvasHeight = ctx.canvas.height;
            const blockWidth = canvasWidth * 0.15;
            const aspectRatio = img.height / img.width;
            const blockHeight = blockWidth * aspectRatio * 1.8;
            const y = canvasHeight * 0.3;

            if (["x2", "x3", "x4"].includes(block)) {
                let counterx = x + (canvasWidth * 0.02) - lastWidth;
                let countery = y + lastHeight - (canvasHeight * 0.05);
                ctx.drawImage(img, counterx, countery, blockWidth, blockHeight);
            } else if ("LoopStart" === block) {
                let yPosition = y * 0.5;
                ctx.drawImage(img, x, yPosition, blockWidth, blockHeight);
                x += blockWidth - (canvasWidth * 0.077);
            } else if ("LoopEnd" === block) {
                let yPosition = y * 0.5;
                ctx.drawImage(img, x - canvasWidth * 0.08, yPosition, blockWidth * 1.6, blockHeight * 1.6);
                lastWidth = blockWidth + blockWidth * 0.1;
                x += blockWidth - (canvasWidth * 0.012);
            } else if (["GreenFlag", "End", "RepeatAll"].includes(block)) {
                let yPosition = y * 0.95;
                ctx.drawImage(img, x + canvasWidth * 0.001, yPosition, blockWidth * 1.1, blockHeight * 1.2);
                x += blockWidth * 1.1 - (canvasWidth * 0.02);
            } else if ("Wait" === block) {
                ctx.drawImage(img, x, y-canvasWidth * 0.02, blockWidth * 1.1, blockHeight * 1.1);
                lastWidth = blockWidth - (canvasWidth * 0.0005);
                lastHeight = blockHeight + (canvasHeight * 0.0015);
                x += blockWidth - (canvasWidth * 0.01);
            } else {
                ctx.drawImage(img, x, y, blockWidth, blockHeight);
                lastWidth = blockWidth;
                lastHeight = blockHeight;
                x += blockWidth - (canvasWidth * 0.02);
            }
            resolve();
        };
    });
}


function cancelLecture() {
    miss = [];
    closeCamera();
    ctx.clearRect(0, 0, blocanva.width, blocanva.height);
    document.getElementById("send").innerHTML = '<img src="assets/images/startbloq.png" data-translate="sendBtn">';
    document.getElementById("send").removeAttribute("onclick");
    document.getElementById("repeat").hidden = true;
}

function acceptLecture() {
    closeCamera();
    if (miss.length !== 0) {
        document.getElementById("send").innerHTML = '<img src="assets/images/start.png" data-translate="sendBtn">';
        document.getElementById("send").setAttribute("onclick", "Enviar()");
    }else{
        document.getElementById("send").innerHTML = '<img src="assets/images/startbloq.png" data-translate="sendBtn">';
    }
    
    blocanva.style.position = 'absolute';
    blocanva.style.top = '50%';
    blocanva.style.left = '50%';
    blocanva.style.transform = 'translate(-50%, -50%)';

    if (miss.length !== 0) {
        document.getElementById("repeat").innerHTML = '<img src="assets/images/remove.png" data-translate="remove">';
    }
}

function closeCamera() {
    frameCounter = 0;
    document.getElementById("repeat").hidden = true;
    if (requestID != null) {
        window.cancelAnimationFrame(requestID);
        requestID = null;
        video.srcObject.getTracks().forEach(track => track.stop());
        canvasElement.hidden = true;
        document.getElementById("camara").innerHTML = '<img src="assets/images/open.png" data-translate="scanBtn">';
        document.getElementById("camara").setAttribute("onclick", "openCamera()");
    }
}


function RemoveCode() { //Borra los bloques leídos
    ctx.clearRect(0, 0, blocanva.width, blocanva.height); // Limpia el canvas donde se muestran los bloques
    miss=[]; // Vacía el array de bloques leídos
    x = 0; // Reinicia la posición del bloque
    lastWidth = 0; // Reinicia el ancho del último bloque
    lastHeight = 0; // Reinicia la altura del último bloque
    document.getElementById("remove").innerHTML = '<img src="assets/images/removebloq.png" data-translate="remove">'; //Cambio de icono a remove bloqueado por falta de bloques
    document.getElementById("remove").removeAttribute;// Elimina la función del botón
    document.getElementById("send").innerHTML = '<img src="assets/images/startbloq.png" data-translate="sendBtn">'; //Cambio de icono a Enviar desactivado
    document.getElementById("send").removeAttribute;// Elimina la función del botón send
}

function speak(id, lang) { // Función para convertir texto a voz
    console.log(translations[lang]);
    console.log(getArucoActionGeneric(id));
    console.log("Block ID: " + id);
    utterance = new SpeechSynthesisUtterance(translations[lang][String(getArucoActionGeneric(id))]); // Obtiene el mensaje a leer
    utterance.lang = codigos[lang]; // Establece el idioma
    speechSynthesis.speak(utterance); // Lee el mensaje
}


