
/**
 * An instantiation of the Robot class represents one connected robot
 * (finch, hummingbird, or micro:bit).
 */

const MIN_SET_ALL_INTERVAL = 10;  // OLOT, Tom changed this from 30
const MAX_LED_PRINT_WORD_LEN = 10;
const INITIAL_LED_DISPLAY_ARRAY = Array(MAX_LED_PRINT_WORD_LEN + 2).fill(0);

//Finch constants
const FINCH_TICKS_PER_CM = 49.7;
const FINCH_TICKS_PER_DEGREE = 4.335;
//This array tells the motors to keep doing what they are doing
const FINCH_INITIAL_MOTOR_ARRAY = [0, 0, 0, 1, 0, 0, 0, 1];

/**
 * Robot - Initializer called when a new robot is connected.
 *
 * @param  {Object} device    Device object from navigator.bluetooth
 */
function Robot(device) {
  this.device = device;
  this.devLetter = "X";
  this.fancyName = getDeviceFancyName(device.name);
  this.batteryLevel = Robot.batteryLevel.UNKNOWN
  this.RX = null; //receiving
  this.TX = null; //sending
  this.writeMethod = null; //Once TX is set we can determine whether we can use writeValueWithoutResponse
  this.displayElement = null;
  this.type = Robot.getTypeFromName(device.name);
  this.writeInProgress = false;
  this.dataQueue = [];
  this.printTimer = null;
  this.isCalibrating = false;
  this.setAllTimeToAdd = 0;
  this.isConnected = false;
  this.userDisconnected = false;
  //this.isReconnecting = false; //uncomment for autoreconnect
  this.currentSensorData = [];
  this.hasStartedInitialization = false;
  this.isInitialized = false;
  this.hasV2Microbit = false;
}

/**
 * Enum for robot types
 */
Robot.ofType = {
  FINCH: 1,
  HUMMINGBIRDBIT: 2,
  MICROBIT: 3,
  GLOWBOARD: 4,
}

/**
 * Properties specific to each robot type
 */
Robot.propertiesFor = {
  //finch
  1: {
    setAllLetter: 0xD0,
    setAllLength: 20,
    triLedCount: 5,
    buzzerIndex: 16,
    buzzerBytes: 4,
    stopCommand: new Uint8Array([0xDF]),
    calibrationCommand: new Uint8Array([0xCE, 0xFF, 0xFF, 0xFF]),
    calibrationIndex: 16,
    batteryIndex: 6,
    batteryFactor: 0.00937, //0.0376,
    batteryConstant: 320,
    greenThreshold: 3.51375, //3.386,
    yellowThreshold: 3.3732, //3.271
    getFirmwareCommand: new Uint8Array([0xD4])
  },
  //hummingbird bit
  2: {
    setAllLetter: 0xCA,
    setAllLength: 19,
    triLedCount: 2,
    buzzerIndex: 15,
    buzzerBytes: 4,
    stopCommand: new Uint8Array([0xCB, 0xFF, 0xFF, 0xFF]),
    calibrationCommand: new Uint8Array([0xCE, 0xFF, 0xFF, 0xFF]),
    calibrationIndex: 7,
    batteryIndex: 3,
    batteryFactor: 0.0406,
    batteryConstant: 0,
    greenThreshold: 4.75,
    yellowThreshold: 4.4,
    getFirmwareCommand: new Uint8Array([0xCF])
  },
  //micro:bit
  3: {
    setAllLetter: 0x90,
    setAllLength: 8,
    triLedCount: 0,
    buzzerIndex: 1,
    buzzerBytes: 5,
    stopCommand: new Uint8Array([0xCB, 0xFF, 0xFF, 0xFF]),
    calibrationCommand: new Uint8Array([0xCE, 0xFF, 0xFF, 0xFF]),
    calibrationIndex: 7,
    batteryIndex: null, //no battery monitoring for micro:bit
    batteryFactor: null,
    batteryConstant: null,
    greenThreshold: null,
    yellowThreshold: null,
    getFirmwareCommand: new Uint8Array([0xCF])
  },
  //GlowBoard
  4: {
    setAllLetter: 0x50,
    setAllLength: 80,
    triLedCount: 0,
    buzzerIndex: null,
    buzzerBytes: null,
    stopCommand: new Uint8Array([0x51, 0x02]),
    calibrationCommand: null,
    calibrationIndex: null,
    batteryIndex: 6,
    batteryFactor: 0.41,
    batteryConstant: 0,
    greenThreshold: 223,
    yellowThreshold: 210,
    getFirmwareCommand: null
  }
}

/**
 * Enum for battery level options
 */
Robot.batteryLevel = {
  HIGH: 2,
  MEDIUM: 1,
  LOW: 0,
  UNKNOWN: 4
}

/**
 * Robot.getTypeFromName - Returns the robot type based on the advertised name.
 *
 * @param  {string} name  Advertised robot name
 * @return {Robot.ofType} Robot type
 */
Robot.getTypeFromName = function(name) {
  if (name.startsWith("FN")) {
    return Robot.ofType.FINCH
  } else if (name.startsWith("BB")) {
    return Robot.ofType.HUMMINGBIRDBIT
  } else if (name.startsWith("MB")) {
    return Robot.ofType.MICROBIT
  } else if (name.startsWith("GB")) {
    return Robot.ofType.GLOWBOARD
  } else return null;
}

/**
 * Robot.initialSetAllFor - Return the inital setAll array for the specified
 * robot type.
 *
 * @param  {Robot.ofType} type  Robot type
 * @return {Uint8Array}         initial set all for given type
 */
Robot.initialSetAllFor = function(type) {
  //var array = new Uint8Array(Robot.propertiesFor[type].setAllLength);
  var array = Array(Robot.propertiesFor[type].setAllLength).fill(0);
  array[0] = Robot.propertiesFor[type].setAllLetter;
  if (type == Robot.ofType.HUMMINGBIRDBIT) {
    array[9] = 0xFF;
    array[10] = 0xFF;
    array[11] = 0xFF;
    array[12] = 0xFF;
  }
  if (type == Robot.ofType.GLOWBOARD) {
    array[1] = 0b01100000 //96 mode dim
    array[20] = array[0]
    array[21] = 0b01100101 //101 mode red
    array[40] = array[0]
    array[41] = 0b01101010 //106 mode green
    array[60] = array[0]
    array[61] = 0b01101111 //111 mode blue
  }
  return array;
}

Robot.prototype.initialize = function() {

  if (this.hasStartedInitialization) {
    console.log(this.fancyName + " initialization in progress or complete.")
    return;
  }
  this.hasStartedInitialization = true;

  if ("writeValueWithoutResponse" in this.TX) { //Available in Chrome 85+
    this.writeMethod = this.TX.writeValueWithoutResponse
    console.log("Using writeValueWithoutResponse")
  } else {
    this.writeMethod = this.TX.writeValue
    console.log("Using writeValue")
  }

  //Robot state arrays
  this.initializeDataArrays();
  this.isConnected = true;
  this.userDisconnected = false;
  //this.isReconnecting = false; //uncomment for autoreconnect

  if (Robot.propertiesFor[this.type].getFirmwareCommand != null) {
    //Read the current robot's firmware version to determine if it includes a V2 micro:bit
    this.write(Robot.propertiesFor[this.type].getFirmwareCommand)
  } else {
    this.write(Uint8Array.of(0x62, 0x67));
    this.startSetAll();
    this.isInitialized = true;
  }
}

/**
 * Robot.prototype.initializeDataArrays - Set all data arrays to initial values.
 * States starting with 'old' represent the last state sent to the robot and
 * should not be modified. Other arrays represent the next state to be sent and
 * should be modified using updateData.
 */
Robot.prototype.initializeDataArrays = function() {
  this.setAllData = new RobotData(Robot.initialSetAllFor(this.type));
  this.ledDisplayData = new RobotData(INITIAL_LED_DISPLAY_ARRAY);
  if (this.isA(Robot.ofType.FINCH)) {
    this.motorsData = new RobotData(FINCH_INITIAL_MOTOR_ARRAY);
  }
}

/**
 * Robot.prototype.startSetAll - Start the timer that periodically sends data
 * to the robot. Stops the current timer if one is running.
 */
Robot.prototype.startSetAll = function() {
  //console.log("Starting setAll. interval=" + (MIN_SET_ALL_INTERVAL + this.setAllTimeToAdd));
  if (this.setAllInterval != null) {
    clearInterval(this.setAllInterval)
  }

  let interval = MIN_SET_ALL_INTERVAL + this.setAllTimeToAdd
  if (this.isA(Robot.ofType.GLOWBOARD)) {
    interval = MIN_SET_ALL_INTERVAL + this.setAllTimeToAdd
  }

  this.setAllInterval = setInterval( this.sendSetAll.bind(this), interval );
}

/**
 * Robot.prototype.increaseSetAllInterval - Increase the interval in which
 * data is sent to the robot and restart the timer.
 */
Robot.prototype.increaseSetAllInterval = function() {
  this.setAllTimeToAdd += 10;
  this.startSetAll();
}

/**
 * Robot.prototype.decreaseSetAllInterval - Decreases the interval in which
 * data is sent to the robot and restart the timer. OLOT - this was added to the code
 * because otherwise set all interval only increases with time. We may add this
 * into the regular webapp codebase to improve the BLE communication speed
 */
Robot.prototype.decreaseSetAllInterval = function() {
  this.setAllTimeToAdd -= 5;
  this.startSetAll();
}

/**
 * Robot.prototype.isA - Return true if this Robot is of the type specified.
 *
 * @param  {Robot.ofType} type Robot type to compare this to
 * @return {boolean}      True if this is a Robot of the type specified
 */
Robot.prototype.isA = function(type) {
  if (this.type === type) return true
  else return false
}

Robot.prototype.setDisconnected = function() {
  this.isConnected = false;
  this.hasStartedInitialization = false;
  this.isInitialized = false;
  this.devLetter = "X"
  this.RX = null
  this.TX = null
  this.batteryLevel = Robot.batteryLevel.UNKNOWN
  if (this.setAllInterval != null) {
    clearInterval(this.setAllInterval)
  }
  updateConnectedDevices();
}

/**
 * Robot.prototype.disconnect - Disconnect this robot and remove it from the
 * list.
 */
Robot.prototype.userDisconnect = function() {
  //console.log("User disconnected " + this.fancyName)
  //var index = robots.indexOf(this);
  //if (index !== -1) robots.splice(index, 1);
  this.userDisconnected = true;
  this.setDisconnected()
  this.device.gatt.disconnect();

}

/**
 * Robot.prototype.externalDisconnect - Called when the robot disconnects
 * (rather than the user disconnecting through the app)
 */
Robot.prototype.externalDisconnect = function() {
  this.setDisconnected()

  //uncomment for autoreconnect
  /*setTimeout(function() {
    //console.log("Attempting to reconnect to " + this.fancyName)
    this.isReconnecting = true
    connectToRobot(this)
  }.bind(this), 1000)*/
}

/**
 * Robot.prototype.write - Send data to the physical robot over ble.
 *
 * @param  {Uint8Array} data The data to send
 */
Robot.prototype.write = function(data) {
  if (this.TX == null) {
    console.error("No TX set for " + this.fancyName);
    return;
  }

  if (this.writeInProgress) {
    //console.log("Write already in progress. data = " + data)
    if (data != null) {
      //console.log(data);
      this.dataQueue.push(data);
    }
    setTimeout(function() {
      //console.log("Timeout. data queue length = " + this.dataQueue.length);
      this.write()
    }.bind(this), MIN_SET_ALL_INTERVAL);
    return;
  }

  //console.log("About to write:");
  //console.log(data);
  this.writeInProgress = true;
  if (this.dataQueue.length != 0) {
    if (data != null) { this.dataQueue.push(data); }
    data = this.dataQueue.shift();
    //console.log(data);
    if (this.dataQueue.length > 10) {
      //console.log("Too many writes queued (" + this.dataQueue.length + "). Increasing interval between setAll attempts...")
      this.increaseSetAllInterval();
    }
  }
  // OLOT change - this was added to decrease connection interval
  if((this.dataQueue.length < 7) && (this.setAllTimeToAdd > 0)) {
    //console.log("Less than 7 writes queued (" + this.dataQueue.length + "). Decreasing interval between setAll attempts...")
    this.decreaseSetAllInterval();
  }

  this.writeMethod.call(this.TX, data).then(_ => {
      //console.log('Wrote to ' + this.fancyName + ":");
      //console.log(data);
      console.log('Wrote to ' + this.fancyName + ": [" + (data.length == 1 ? data[0] : Array.apply([], data).join(",")) + "]")
      //console.log('Time added to interval ' + this.setAllTimeToAdd)
      this.writeInProgress = false;
    }).catch(error => {
      console.error("Error writing to " + this.fancyName + ": " + error);
      this.writeInProgress = false;
    });

}

/**
 * Robot.prototype.sendSetAll - Send the next state to the robot if it differs
 * from the current state. Called periodically (ever SET_ALL_INTERVAL ms) with
 * a setInterval set up in the initializer (setAllInterval).
 */
Robot.prototype.sendSetAll = function() {
  if (this.isA(Robot.ofType.GLOWBOARD)) {
    console.log("setall")
    if (this.setAllData.isNew) {
      const data = this.setAllData.getSendable();

      console.log("sending setDim " + data.slice(0,20))
      this.write(data.slice(0,20))
      setTimeout(function() {
        console.log("sending setRed " + data.slice(20,40))
        this.write(data.slice(20,40))
      }.bind(this), MIN_SET_ALL_INTERVAL/4)
      setTimeout(function() {
        console.log("sending setGreen " + data.slice(40,60))
        this.write(data.slice(40,60))
      }.bind(this), MIN_SET_ALL_INTERVAL/2)
      setTimeout(function() {
        console.log("sending setBlue " + data.slice(60,80))
        this.write(data.slice(60,80))
      }.bind(this), MIN_SET_ALL_INTERVAL*3/4)
    }

    return
  }
  //var setAllChanged = !Robot.dataIsEqual(this.setAllData, this.oldSetAllData);

  //console.log("sendSetAll " + setAllChanged + " " + this.setAllData + " " + this.oldSetAllData);
  //if (setAllChanged) {
  if (this.setAllData.isNew) {
    //const data = this.setAllData.slice();
    const data = this.setAllData.getSendable();
    this.clearBuzzerBytes();
    //this.oldSetAllData = this.setAllData.slice();
    this.write(data);
  }

  //in another half cycle, check to see if the other data needs to be sent
  setTimeout(function() {
    //const ledArrayChanged = !Robot.dataIsEqual(this.ledDisplayData, this.oldLedDisplayData);

    if (this.isA(Robot.ofType.FINCH)) {
      let symbolSet = false
      let flashSet = false
      let ledArray = [];

      //if (ledArrayChanged) {
      if (this.ledDisplayData.isNew) {
        symbolSet = (this.ledDisplayData.values[1] == 0x80)
        //if (!symbolSet) { flashSet = true; }
        if (!symbolSet) { flashSet = (this.ledDisplayData.values[1] != 0) }
        //console.log("Found new led display data. Symbol? " + symbolSet + " flash? " + flashSet);
        ledArray = Array.prototype.slice.call(this.ledDisplayData.getSendable(flashSet), 2);
      }
      //const motorsChanged = !Robot.dataIsEqual(this.motorsData, this.oldMotorsData);
      //TODO: when should this be done?
      //this.oldLedDisplayData = this.ledDisplayData.slice();
      //this.oldMotorsData = this.motorsData.slice();

      let motorArray = []
      /*if (motorsChanged) {
        motorArray = Array.prototype.slice.call(this.motorsData);
        this.motorsData = FINCH_INITIAL_MOTOR_ARRAY.slice();
      }*/
      const motorsChanged = this.motorsData.isNew;
      if (motorsChanged) {
        motorArray = Array.prototype.slice.call(this.motorsData.getSendable(true));
        //this.motorsData.update(0, FINCH_INITIAL_MOTOR_ARRAY);
      }

      let mode = 0x00
      if (motorsChanged && flashSet) {
          mode = 0x80 + this.ledDisplayData.length - 2
      } else if (motorsChanged && symbolSet) {
          mode = 0x60
      } else if (motorsChanged) {
          mode = 0x40
      } else if (flashSet) {
          mode = this.ledDisplayData.length - 2
      } else if (symbolSet) {
          mode = 0x20
      }

      if (mode != 0) {
        //const cmdArray = [0xD2, mode].concat(motorArray, Array.prototype.slice.call(this.ledDisplayData, 2))

        const cmdArray = [0xD2, mode].concat(motorArray, ledArray);
        //console.log("Sending " + cmdArray);
        const command = new Uint8Array(cmdArray)
        this.write(command);
      }

    } else {
      /*if (ledArrayChanged) {
        this.write(this.ledDisplayData);
        this.oldLedDisplayData = this.ledDisplayData.slice();
      }*/
      if (this.ledDisplayData.isNew) {
        const data = this.ledDisplayData.getSendable();
        if (data[1] != 0x80 && data[1] != 0) {
          this.ledDisplayData.reset(); //reset after flash command
        }
        this.write(data);
      }
    }
  }.bind(this), MIN_SET_ALL_INTERVAL/2)
}

/**
 * Robot.prototype.setLED - Set a single, one color LED. Hummingbird only.
 *
 * @param  {number} port      port of the LED to set (1-3)
 * @param  {number} intensity brightness to set (0-100)
 */
Robot.prototype.setLED = function(port, intensity) {
  //Only Hummingbird bits have single color leds
  if (!this.isA(Robot.ofType.HUMMINGBIRDBIT)) {
    //console.log("setLED called but robot is not a hummingbird.");
    return;
  }

  var index;
  switch (port) {
    case 1:
      index = 1;
      break;
    case 2:
      index = 13;
      break;
    case 3:
      index = 14;
      break;
    default:
      console.log("setLED invalid port: " + port);
      return;
  }

  this.setAllData.update(index, [intensity]);
}

/**
 * Robot.prototype.setTriLED - Set a single tri color LED to the given intensity
 * values. Hummingbird and Finch only.
 *
 * @param  {number} port  Position of the LED to set (1-triLedCount)
 * @param  {number} red   Red intensity (0-255)
 * @param  {number} green Green intensity (0-255)
 * @param  {number} blue  Blue intensity (0-255)
 */
Robot.prototype.setTriLED = function(port, red, green, blue) {
  //microbits do not have any trileds
  if (this.isA(Robot.ofType.MICROBIT)) {
    //console.log("setTriLED called on a robot of type microbit");
    return;
  }
  if (port == "all") { //finch tail requests only
    if (this.type != Robot.ofType.FINCH) {
      //console.log("setTriLED port=all only for finch tail leds.");
      return;
    }

    this.setAllData.update(4, [red, green, blue,
      red, green, blue, red, green, blue, red, green, blue]);

  } else {
    if (port < 1 || port > Robot.propertiesFor[this.type].triLedCount){
      //console.log("setTriLED invalid port: " + port);
      return;
    }
    var index;
    const portAdjust = (port - 1) * 3;
    switch(this.type) {
      case Robot.ofType.HUMMINGBIRDBIT:
        index = 3 + portAdjust;
        break;
      case Robot.ofType.FINCH:
        index = 1 + portAdjust;
        break;
      default:
        console.error("setTriLED invalid robot type: " + this.type);
        return;
    }

    this.setAllData.update(index, [red, green, blue]);
  }
}

/**
 * Robot.prototype.setServo - Set the position or speed of a servo. Hummingbird
 * only.
 *
 * @param  {number} port  Position of the servo to set (1-4)
 * @param  {number} value Speed (rotation servo) or angle (position servo)
 */
Robot.prototype.setServo = function(port, value) {
  if (!this.isA(Robot.ofType.HUMMINGBIRDBIT)) {
    //console.log("Only hummingbirds have servos.")
    return
  }
  if (port < 1 || port > 4) {
    //console.log("setServo invalid port: " + port);
    return
  }

  this.setAllData.update(port + 8, [value]);
}

/**
 * Robot.prototype.setMotors - Set the motors each to givien speed for given
 * distance. Ticks=0 for continuous motion. Finch only.
 *
 * @param  {number} speedL Speed to set left motor to (-100 to 100)
 * @param  {number} ticksL Distance for the left motor to travel in encoder ticks.
 * @param  {number} speedR Speed to set right motor to (-100 to 100)
 * @param  {number} ticksR Distance for the right motor to travel in encoder ticks.
 */
Robot.prototype.setMotors = function(speedL, ticksL, speedR, ticksR) {
  if (!this.isA(Robot.ofType.FINCH)) {
    //console.log("Only finches have motors.")
    return
  }

	//Make sure speeds do not exceed 100%
	if (speedL > 100) { speedL = 100; }
	if (speedL < -100) { speedL = -100; }
	if (speedR > 100) { speedR = 100; }
	if (speedR < -100) { speedR = -100; }

  let scaledVelocity = function(speed) {
    const speedScaling = 36/100;
    let vel = Math.round(speed * speedScaling);
    if (speed > 0 && vel < 3) { vel = 3; }
    if (speed < 0 && vel > -3) { vel = -3; }
    if (vel > 0 && vel < 128) {
      return vel + 128;
    } else if (vel <= 0 && vel > -128) {
      return Math.abs(vel);
    } else {
      console.error("bad speed value " + speed);
      return 0;
    }
  }

  this.motorsData.update(0, [
    scaledVelocity(speedL), ((ticksL & 0x00ff0000) >> 16),
    ((ticksL & 0x0000ff00) >> 8), (ticksL & 0x000000ff),
    scaledVelocity(speedR), ((ticksR & 0x00ff0000) >> 16),
    ((ticksR & 0x0000ff00) >> 8), (ticksR & 0x000000ff)
  ])
}

/**
 * Robot.prototype.setBuzzer - Set the buzzer. Hummingbird and Finch only.
 *
 * @param  {number} note     Midi note to play
 * @param  {number} duration Duration of the sound in ms
 */
Robot.prototype.setBuzzer = function(note, duration) {
  var index = Robot.propertiesFor[this.type].buzzerIndex
  if (index == null) {
    //console.log("setBuzzer invalid robot type: " + this.type);
    return;
  }

  let frequency = 440 * Math.pow(2, (note - 69)/12)
  let period = (1/frequency) * 1000000
  //TODO: check if period is in range?

  let buzzerArray = [period >> 8, period & 0x00ff, duration >> 8, duration & 0x00ff]
  if (this.isA(Robot.ofType.MICROBIT)) {
    buzzerArray.splice(3, 0, 0x20)
  }

  this.setAllData.update(index, buzzerArray)
}

/**
 * Robot.prototype.clearBuzzerBytes - Clear the data bytes for the buzzer so
 * that a note is only sent to the robot once.
 */
Robot.prototype.clearBuzzerBytes = function() {
  let index = Robot.propertiesFor[this.type].buzzerIndex
  let bytes = Robot.propertiesFor[this.type].buzzerBytes
  if (index == null || bytes == null) {
    //console.log("clearBuzzerBytes invalid robot type: " + this.type);
    return;
  }

  this.setAllData.reset(index, index + bytes);
}

/**
 * Robot.prototype.setSymbol - Set the led display to a symbol specified by a
 * string of true/false statements - one for each led in the display.
 *
 * @param  {string} symbolString String representation of the symbol to display
 */
Robot.prototype.setSymbol = function(symbolString) {
  //If a string of text is printing on the display, we must interupt it.
  if (this.printTimer !== null) { clearTimeout(this.printTimer); }

  let data = [];
  data[0] = 0xCC
  data[1] = 0x80 //set symbol
  const sa = symbolString.split("/")
  let iData = 2
  let shift = 0

  //Convert the true/false or bit string to bits. Requires 4 data bytes.
  for (let i = 24; i >= 0; i--) {
    let bit = false;
    if (FinchBlox) {
      bit = ( symbolString.charAt(i) == "1" )
    } else {
      bit = ( sa[i] == "true" )
    }
    data[iData] = bit ? (data[iData] | (1 << shift)) : (data[iData] & ~(1 << shift));
    if (shift == 0) {
      shift = 7
      iData += 1
    } else {
      shift -= 1
    }
  }

  this.ledDisplayData.update(0, data);
}

Robot.prototype.setGlowBoard = function(color, brightness, symbolString) {
  if (!this.isA(Robot.ofType.GLOWBOARD)) {
    console.error("setGlowBoard only available for GlowBoards.")
    return
  }

  //console.log("set Glowboard! " + symbolString)

  let data = [];
  const sa = symbolString.split("/")
  let iData = 2
  let shift = 7

  //Convert the true/false or bit string to bits. Requires 4 data bytes.
  for (let i = 0; i < 144; i++) {
    let bit = ( sa[i] == "true" )
    data[iData] = bit ? (data[iData] | (1 << shift)) : (data[iData] & ~(1 << shift));
    if (shift == 0) {
      shift = 7
      iData += 1
    } else {
      shift -= 1
    }
  }

  let fullArray = this.setAllData.values.slice(); //TODO: don't pull data this way - there may be pending changes
  let setArrayValues = function(set, offset) {
    console.log("setArrayValues: " + set + ", " + offset + ", " + data)
    for (let i = 2; i < 20; i++) {
      if (set) {
        fullArray[i + offset] = fullArray[i + offset] | data[i]
      } else {
        fullArray[i + offset] = fullArray[i + offset] & ~data[i]
      }
    }
  }

  const rgb = Robot.getColorArray(color, brightness)

  for (let i = 0; i < 4; i++) {
    setArrayValues(rgb[i], i*20)
  }

  console.log(color)
  console.log(brightness)
  console.log(rgb)
  console.log(fullArray)
  this.setAllData.update(0, fullArray);
}
Robot.getColorArray = function(color, brightness) {
  let rgb = [false, false, false]
  switch (color) {
    case "white":
      rgb = [true, true, true]
      break;
    case "red":
      rgb = [true, false, false]
      break;
    case "yellow":
      rgb = [true, true, false]
      break;
    case "green":
      rgb = [false, true, false]
      break;
    case "cyan":
      rgb = [false, true, true]
      break;
    case "blue":
      rgb = [false, false, true]
      break;
    case "magenta":
      rgb = [true, false, true]
      break;
    case "black":
      rgb = [false, false, false]
      break;
    default:
      console.error("Unhandled glow board color: " + color);
  }
  rgb.unshift(brightness == "dim") //first value will be brightness

  return rgb
}

Robot.prototype.setGBPoint = function(xPos, yPos, color, brightness) {
  console.log("setGPPoint " + xPos + ", " + yPos + ", " + color + ", " + brightness)
  const rgb = Robot.getColorArray(color, brightness)

  xPos -= 1
  yPos -= 1
  const bitIndex = xPos + (yPos)*12
  let byte = 1 << (7 - (bitIndex % 8))
  let index = Math.floor(bitIndex/8)

  let fullArray = this.setAllData.values.slice(); //TODO: don't pull data this way - there may be pending changes
  for (let i = 0; i < 4; i++) {
    let offset = 2 + i*20
    if (rgb[i]) {
      fullArray[index + offset] = fullArray[index + offset] | byte
    } else {
      fullArray[i + offset] = fullArray[i + offset] & ~byte
    }
  }

  this.setAllData.update(0, fullArray);
}

/**
 * Robot.prototype.setPrint - Print out a string on the led display
 *
 * @param  {Array.string} printChars Array of single characters to print
 */
Robot.prototype.setPrint = function(printChars) {
  //If a string of text is printing on the display, we must interupt it.
  if (this.printTimer !== null) { clearTimeout(this.printTimer); }

  //Only MAX_LED_PRINT_WORD_LEN characters can be sent to the robot at once
  if (printChars.length > MAX_LED_PRINT_WORD_LEN) {
    let nextPrintChars = printChars.slice(MAX_LED_PRINT_WORD_LEN, printChars.length);
    this.printTimer = setTimeout (function () {
      this.setPrint(nextPrintChars);
    }.bind(this), MAX_LED_PRINT_WORD_LEN * 600);  // number of chars * 600ms per char

    printChars = printChars.slice(0, MAX_LED_PRINT_WORD_LEN);
  }

  let data = [];
  data[0] = 0xCC
  data[1] = printChars.length | 0x40;

  for (var i = 0; i < printChars.length; i++) {
    data[i+2] = printChars[i].charCodeAt(0);
  }

  this.ledDisplayData.update(0, data);
}

/**
 * Robot.prototype.stopAll - Stop all robot actions and reset states.
 */
Robot.prototype.stopAll = function() {
  if (this.printTimer !== null) { clearTimeout(this.printTimer); }
  this.write(Robot.propertiesFor[this.type].stopCommand);
  this.initializeDataArrays();
}

/**
 * Robot.prototype.resetEncoders - Send the robot a command to reset its encoder
 * values to 0.
 */
Robot.prototype.resetEncoders = function() {
  if (!this.isA(Robot.ofType.FINCH)) {
    console.log("Only finches have encoders.")
    return
  }

  this.write(new Uint8Array([0xD5]));
}

/**
 * Robot.prototype.startCalibration - Send the robot a command to start
 * magnetometer calibration. (required for magnetometer and compass blocks)
 */
Robot.prototype.startCalibration = function() {
  this.write(Robot.propertiesFor[this.type].calibrationCommand);
  //It takes a bit for the robot to start calibrating
  setTimeout(() => { this.isCalibrating = true; }, 500);
}

/**
 * Robot.prototype.receiveSensorData - Called when the robot updates its sensor
 * data. This function will update the battery value and check the calibration
 * state
 *
 * @param  {Uint8Array} data Incoming data
 */
Robot.prototype.receiveSensorData = function(data) {
  if (!this.isInitialized) {
    //This data is the response to the get firmware version command.
    console.log(this.fancyName + " firmware: [" + (data.length == 1 ? data[0] : Array.apply([], data).join(",")) + "]")
    this.hasV2Microbit = data[3] == 0x22

    //Start polling sensors
    var pollStart = Uint8Array.of(0x62, 0x67);
    if (this.hasV2Microbit) {
      console.log(this.fancyName + " has a V2 micro:bit")
      if (FinchBlox) {
        fbFrontend.CallbackManager.robot.updateHasV2Microbit(this.device.name, 'true')
      }
      //trigger V2 specific notifications
      pollStart = Uint8Array.of(0x62, 0x70);
    } else {
      console.log(this.fancyName + " does not have a V2 micro:bit")
      if (FinchBlox) {
        fbFrontend.CallbackManager.robot.updateHasV2Microbit(this.device.name, 'false')
      }
    }
    var pollStop = Uint8Array.of(0x62, 0x73);
    this.write(pollStart);

    //Start the setAll timer
    this.startSetAll();
    this.isInitialized = true
    return
  }

  this.currentSensorData = data
  //console.log(data)
  sendMessage({
    robot: this.devLetter,
    robotType: this.type,
    sensorData: data,
    hasV2Microbit: this.hasV2Microbit
  });

  const batteryIndex = Robot.propertiesFor[this.type].batteryIndex;
  const batteryFactor = Robot.propertiesFor[this.type].batteryFactor;
  const batteryConstant = Robot.propertiesFor[this.type].batteryConstant;
  const greenThreshold = Robot.propertiesFor[this.type].greenThreshold;
  const yellowThreshold = Robot.propertiesFor[this.type].yellowThreshold;

  if (batteryIndex != null) { //null for micro:bit which does not have battery monitoring
    var newLevel = Robot.batteryLevel.UNKNOWN
    if (this.hasV2Microbit && this.isA(Robot.ofType.FINCH)) {
      newLevel = data[batteryIndex] & 0x3
      //Battery level 3 represents a complete charge and is not currently handled.
      if (newLevel == 3) { newLevel = Robot.batteryLevel.HIGH }
    } else {
      const rawVoltage = data[batteryIndex]
      const voltage = batteryFactor * (rawVoltage + batteryConstant)//rawVoltage * batteryFactor
      if (voltage > greenThreshold) {
        newLevel = Robot.batteryLevel.HIGH
      } else if (voltage > yellowThreshold) {
        newLevel = Robot.batteryLevel.MEDIUM
      } else {
        newLevel = Robot.batteryLevel.LOW
      }
    }

    if (newLevel != this.batteryLevel) {
      this.batteryLevel = newLevel
      updateBatteryStatus()
    }
  }

  if (this.isCalibrating) {
    const calibrationByte = data[Robot.propertiesFor[this.type].calibrationIndex];
    switch(calibrationByte & 0x0C) { //0x0C = 0000 1100
      case 4: //calibration success
        this.isCalibrating = false;
        updateCalibrationStatus(true);
        break;
      case 8: //calibration failure
        this.isCalibrating = false;
        updateCalibrationStatus(false);
    }
  }
}
