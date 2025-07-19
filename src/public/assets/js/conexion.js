/* BLUETOOTH CONNECTION MANAGEMENT */

// Declaración de variables
let device, rxCharacteristic, mapa;
const services = {
    microbit: {
        textname: "Microbit",
        name: "BBC micro:bit",
        service: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
        characteristic: "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
            // característica receive 6e400003
            // característica send 6e400002
    },
    escornabot: {
        textname: "Esconabot",
        name: "MLT",
        service: "0000ffe0-0000-1000-8000-00805f9b34fb",
        characteristic: "0000ffe1-0000-1000-8000-00805f9b34fb"
    },
    bluebot: {
            textname: "Blue-Bot",
            name: "BlueBot",
            service: "0000fff0-0000-1000-8000-00805f9b34fb",
            characteristic: "0000fff2-0000-1000-8000-00805f9b34fb"
        },

    finch: {
            textname: "Finch",
            name: "FN",
            service: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
            characteristic: "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
        }
};

let selectedDevice = services.microbit; // Robot predeterminado
var lang = localStorage.getItem('idioma') || 'es'; 

async function buscarDispositivos(selectedDevice) {
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: selectedDevice.name }],
            optionalServices: [selectedDevice.service]
        }); //Buscar dispositivo con nombre y servicio

        const server = await device.gatt.connect(); //Conexión con el dispositivo
        const uartService = await server.getPrimaryService(selectedDevice.service); //Conexión servicio UART
        rxCharacteristic = await uartService.getCharacteristic(selectedDevice.characteristic); //Obtención caracteristica para enviar|recivir
        Swal.fire({ //Mensaje de conexión exitosa
            title: translations[lang]['conexion'],
            confirmButtonText: translations[lang]['aceptar'],
            confirmButtonColor: '#00a135',
        }).then((result) => {
        document.getElementById("btn blt").innerHTML = '<img src="assets/images/unpair.png" data-translate="disconectBtn">'; //Cambio de icono
        document.getElementById("btn blt").setAttribute("onclick", "Desemparejar()"); //Cambio de función del botón a desemparejar
        });

    } catch (error) { //Error en la conexión
        Swal.fire({ //Mensaje de error con consejos y opción de reintentar
            width: '700px',  
            padding: '50px', 
            icon: 'error',
            title: translations[lang]['error'] + ' ' + selectedDevice.textname,
            showCloseButton: true,
            confirmButtonText: translations[lang]['reintentar'],
            html: `<b>${translations[lang]['consejos']}:</b><br><div style="text-align: left;"><br>1. ${translations[lang]['consejo1']}<br>2. ${translations[lang]['consejo2']} ${selectedDevice.textname}.<br>3. ${translations[lang]['consejo3']}</div>`,
            confirmButtonColor: 'green',
        }).then((result) => { //Si se pulsa reintentar se vuelve a buscar el dispositivo
            if (result.isConfirmed) {
            buscarDispositivos(selectedDevice);
            }
        });
    }
}

function Desemparejar() {
    if (!device) { //Si no hay dispositivo connectado da error
        Swal.fire({ 
            title: translations[lang]['noconectado'],
            confirmButtonText: translations[lang]['aceptar'],
            confirmButtonColor: '#00a135',
        })
        return;
    } if (device.gatt.connected) {
        device.gatt.disconnect(); //Desconexión
        Swal.fire({ 
            title: translations[lang]['desemparejar'],
            confirmButtonText: translations[lang]['aceptar'],
            confirmButtonColor: '#00a135',
        })
        document.getElementById("btn blt").innerHTML = '<img src="assets/images/bluetooth.png" data-translate="bluetoothBtn">'; //Cambio de icono
        document.getElementById("btn blt").setAttribute("onclick", "PopUp()"); //Cambio de función del botón a desemparejar
    } 
}


function getAction(robotType, id) {
    if (robotType === "Microbit") {
        return getArucoActionGeneric(id);
    } else if (robotType === "Blue-Bot") {
        return getBluebotCommand(id);
    } else if (robotType === "Escornabot") {
        return getEscornaAction(id);
    } else if (robotType === "Finch") {
        return getFinchAction(id);
    }
    return null;
}

async function Enviar() {
    try {
        if (!device) {
            Swal.fire({
                title: translations[lang]['noconectado'],
                confirmButtonText: translations[lang]['aceptar'],
                confirmButtonColor: '#00a135',
            });
            return;
        }

        const robotType = selectedDevice.textname;
        let encodeData = robotType !== "Blue-Bot" && robotType !== "Finch";

        if (getAction(robotType, miss[miss.length - 1]) === "End") {
            miss.pop();
        }
        start = getAction(robotType, miss[0]);
        if (start === "GreenFlag") { miss.shift(); }
        await EnviarInstrucciones(miss, robotType, encodeData);
        if (robotType === "Escornabot") {
            const data = encoder.encode("g\n");
            await rxCharacteristic.writeWithoutResponse(data);
        }
    } catch (error) {
        Swal.fire({
            title: translations[lang]['sendError'],
            text: translations[lang]['reenviar'],
            confirmButtonText: translations[lang]['aceptar'],
            confirmButtonColor: '#00a135',
        });
    }
}

function createFinchMoveCommand(direction, distance, speed) {
    const shouldFlip = (distance < 0);
    const shouldGoForward = (direction === "Forward" && !shouldFlip) || (direction === "Backward" && shouldFlip);
    const shouldGoBackward = (direction === "Backward" && !shouldFlip) || (direction === "Forward" && shouldFlip);
    const moveTicks = Math.abs(distance * FINCH_TICKS_PER_CM);
    
    if (moveTicks !== 0) {
        if (shouldGoForward) {
            return createMotorCommand(speed, moveTicks, speed, moveTicks);
        } else if (shouldGoBackward) {
            return createMotorCommand(-speed, moveTicks, -speed, moveTicks);
        }
    }
    return null;
}

// Función para crear comandos de giro del Finch
function createFinchTurnCommand(direction, angle, speed) {
    const shouldFlip = (angle < 0);
    const shouldTurnRight = (direction === "Right" && !shouldFlip) || (direction === "Left" && shouldFlip);
    const shouldTurnLeft = (direction === "Left" && !shouldFlip) || (direction === "Right" && shouldFlip);
    const turnTicks = Math.abs(angle * FINCH_TICKS_PER_DEGREE);
    
    if (turnTicks !== 0) {
        if (shouldTurnRight) {
            return createMotorCommand(speed, turnTicks, -speed, turnTicks);
        } else if (shouldTurnLeft) {
            return createMotorCommand(-speed, turnTicks, speed, turnTicks);
        }
    }
    return null;
}

// Función para crear comandos de motor del Finch
function createMotorCommand(leftSpeed, leftTicks, rightSpeed, rightTicks) {
    if (leftSpeed > 100) { leftSpeed = 100; }
    if (leftSpeed < -100) { leftSpeed = -100; }
    if (rightSpeed > 100) { rightSpeed = 100; }
    if (rightSpeed < -100) { rightSpeed = -100; }

    function scaledVelocity(speed) {
        const speedScaling = 36 / 100;
        let vel = Math.round(speed * speedScaling);
        if (speed > 0 && vel < 3) vel = 3;
        if (speed < 0 && vel > -3) vel = -3;
        if (vel > 0 && vel < 128) {
            return vel + 128;
        } else if (vel <= 0 && vel > -128) {
            return Math.abs(vel);
        } else {
            console.error("bad speed value " + speed);
            return 0;
        }
    }

    const buffer = new Uint8Array(20);
    buffer[0] = 0xD2; // Comando para motor + LED
    buffer[1] = 0x40; // Solo cambio de motor.

    // Velocidad del motor izquierdo.
    buffer[2] = scaledVelocity(leftSpeed);

    // Ticks izquierdos.
    buffer[3] = (leftTicks >> 16) & 0xFF;
    buffer[4] = (leftTicks >> 8) & 0xFF;
    buffer[5] = leftTicks & 0xFF;

    // Velocidad del motor derecho.
    buffer[6] = scaledVelocity(rightSpeed);

    // Ticks derechos.
    buffer[7] = (rightTicks >> 16) & 0xFF;
    buffer[8] = (rightTicks >> 8) & 0xFF;
    buffer[9] = rightTicks & 0xFF;

    return buffer;
}

// Función para detener todos los motores del Finch
function createFinchStopCommand() {
    return createMotorCommand(0, 0, 0, 0);
}

// Modificar la función getAction para manejar comandos del Finch
function getAction(robotType, id) {
    if (robotType === "Microbit") {
        return getArucoActionGeneric(id);
    } else if (robotType === "Blue-Bot") {
        return getBluebotCommand(id);
    } else if (robotType === "Escornabot") {
        return getEscornaAction(id);
    } else if (robotType === "Finch") {
        return getFinchCommand(id);
    }
    return null;
}

// Modificar la función EnviarInstrucciones para manejar comandos del Finch
async function EnviarInstrucciones(miss, robotType, encodeData) {
    let loop_start = 0;

    for (let i = 0; i < miss.length; i++) {
        const action = getAction(robotType, miss[i]);
        
        if (action === "LoopStart") {
            loop_start = i + 1;
        } else if (action === "LoopEnd") {
            if (["x2", "x3", "x4"].includes(getAction(robotType, miss[i + 1]))) {
                const times = parseInt(String(getAction(robotType, miss[i + 1])).slice(-1)) - 1;
                for (let j = 0; j < times; j++) {
                    for (let k = loop_start; k < i; k++) {
                        const cmd = getAction(robotType, miss[k]);
                        await sendRobotCommand(cmd, robotType, encodeData);
                    }
                }
            } else {
                continue;
            }
        } else if (action === "Wait" || action === "Esperar") {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos de espera
        } else if (action === "RepeatAll") {
            miss.pop();
            await EnviarInstrucciones(miss, robotType, encodeData);
        } else if (["x2", "x3", "x4"].includes(action)) {
            if (getAction(robotType, miss[i-1]) === "LoopEnd") continue;
            const repeatCount = parseInt(String(action).slice(-1)) - 1;
            const cmd = getAction(robotType, miss[i - 1]);
            for (let r = 0; r < repeatCount; r++) {
                await sendRobotCommand(cmd, robotType, encodeData);
            }
        } else {
            await sendRobotCommand(action, robotType, encodeData);
        }
    }
}

// Nueva función para enviar comandos a cualquier robot
async function sendRobotCommand(action, robotType, encodeData) {
    let message;
    
    if (robotType === "Finch" && typeof action === "object" && action.type === "finch_move") {
        // Comando especial del Finch
        if (action.cmd === "move") {
            if (action.distance == null) throw new TypeError("action.distance is null");
            message = createFinchMoveCommand(action.direction, action.distance, action.speed);
        } else if (action.cmd === "turn") {
            if (action.angle == null) throw new TypeError("action.angle is null");
            message = createFinchTurnCommand(action.direction, action.angle, action.speed);
        }
        
        if (message) {
            await rxCharacteristic.writeValueWithoutResponse(message);
            // Agregar un pequeño delay para que el robot procese el comando
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } else {
        message = encodeData ? encoder.encode(action + "\n") : action;
        await rxCharacteristic.writeValueWithoutResponse(message);
    }
}

// Función auxiliar para enviar comandos de parada al Finch
async function stopFinch() {
    if (selectedDevice.textname === "Finch") {
        const stopCommand = createFinchStopCommand();
        await rxCharacteristic.writeValueWithoutResponse(stopCommand);
    }
}

// Función para establecer LEDs del Finch
function setFinchLED(port, red, green, blue) {
    const buffer = new Uint8Array(20);
    buffer[0] = 0xD2; // Comando LED
    buffer[1] = port;
    buffer[2] = red;
    buffer[3] = green;
    buffer[4] = blue;
    
    for (let i = 5; i < 20; i++) {
        buffer[i] = 0;
    }
    
    return buffer;
}

// Función para reproducir sonidos en el Finch
function setFinchBuzzer(note, duration) {
    const buffer = new Uint8Array(20);
    buffer[0] = 0xD3; // Comando buzzer
    buffer[1] = note & 0xFF;
    buffer[2] = (note >> 8) & 0xFF;
    buffer[3] = duration & 0xFF;
    buffer[4] = (duration >> 8) & 0xFF;
    
    for (let i = 5; i < 20; i++) {
        buffer[i] = 0;
    }
    
    return buffer;
}

// Función para resetear encoders del Finch
function resetFinchEncoders() {
    const buffer = new Uint8Array(20);
    buffer[0] = 0xD5; // Comando reset encoders
    
    for (let i = 1; i < 20; i++) {
        buffer[i] = 0;
    }
    
    return buffer;
}