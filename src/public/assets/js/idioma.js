const translations = {
    es: {
        settings: "Configuración",
        informacionBtn: "Información",
        configTitle: "Configuración",
        scanBtn: "Abrir cámara",
        sendBtn: "Enviar bloques",
        repeatBtn: "Eliminar bloques",
        conexion: "Dispositivo conectado",
        aceptar: "Aceptar",
        error: "Error al conectar con",
        consejos: "Consejos para solucionar el problema:",
        consejo1: "Comprueba que el robot está encendido y cerca del ordenador.",
        consejo2: "Asegurate de haber cargado el programa en",
        consejo3: "Asegurate de haber escogido el dispositivo correcto.",
        reintentar: "Reintentar",
        noconectado: "No hay ningún dispositivo conectado",
        desemparejar: "Dispositivo desconectado",
        sendError: "Error al enviar los bloques",
        reenviar: "Por favor, intenta voler a enviar los bloques",
        makeCodeLink: "Código de MakeCode",
        robot: "Selecciona un robot",
        camaraErrortitle: "Error al acceder a la cámara",
        camaraErrorText: "Asegúrate de que la cámara está conectada y activada. Si es así, asegurate que la configuración de tu navegador permite el acceso a la cámara a través de la página web.",
        bluetoothBtn: "Emparejar dispositivo",
        disconectBtn: "Desemparejar",
        cancel: "Cancelar",
        infoTitle: "Información",
        GreenFlag: "Bandera verde",
        Forward: "Adelante", 
        Left: "Izuierda",
        Right: "Derecha",
        Backward: "Atrás",
        TurnRight: "Derecha", 
        TurnLeft: "Izquierda", 
        Sound: "Sonido",
        Talk: "Habla", 
        Wait: "Esperar",
        LoopStart: "Inicio de bucle",
        LoopEnd: "Final de bucle",
        End: "Final", 
        x2: "Repetir dos veces",
        x3: "Repetir tres veces",
        x4: "Repetir cuatro veces",
        repeatAll: "Repetir la secuencia",
        infoContent: {
            introTitle: "Introducción",
            intro: "La aplicación Scratch Tactile App (Beta) permite escanear bloques físicos de <a href='https://www.scratchjrtactile.org/' target='_blank'>Scratch Tactile</a> con la cámara, como piezas de puzzle que forman una secuencia, la cual es leída en voz alta. Luego, la secuencia se envía a un robot, como un vehículo, a través de Bluetooth, ordenándose que realice movimientos como avanzar o girar. Además, facilita la conexión con Bluetooth para controlar robots como Mcqueen, Escornabot o Bluebot, y está diseñada con funciones de accesibilidad, como lector por voz e iconos intuitivos.",
            compatibleTitle: "Compatibilidad",
            compatible: "Los dispositivos compatibles son:",
            comptaibleList: [
                "Navegador Chrome o Edge en cualquier ordenador (excepto Linux).",
                "Navegador Chrome en dispositivos Windows y Android (móviles o tabletas).",
                "Actualmente, el Bluetooth no es compatible para iOS (móviles o tabletas)."
            ],
            bltTitle: "Conexión por Bluetooth",
            bltList: {
                microbit: {
                    desc: "Puedes usarlo para conectarte con cualquier micro:bit y enviarle información a través de Bluetooth.",
                    detail: "Para mover un robot que use micro:bit como controlador, deberás hacer un pequeño programa que “traduzca” las órdenes recibidas por bluetooth en movimientos o órdenes para el robot. Nosotros te proporcionamos un codigo MakeCode ya hecho para manejar estas “traducciones” para Micro:bit Mcqueen, que puedes obtener y/o modificar para que se ajuste a tus necesidades: <a href='https://makecode.microbit.org/S74304-48867-59540-86098' target='_blank'>Código MakeCode</a>"
                },
                escornabot: {
                    desc: "Ten en cuenta que debes tener el código bien instalado en Escornabot para su uso con Bluetooth y el módulo Bluetooth instalado. A continuación te explicamos qué debes tener en cuenta.",
                    steps: [
                        "Adquirir e instalar módulo Bluetooth.",
                        "Descargar el siguiente paquete y descomprimirlo: <a href='https://drive.google.com/file/d/1_Ey0nOIGWiZlZrsmrnRih37I_dIH4Ubc/view?usp=share_link' target='_blank'>Paquete Escornabot</a>",
                        "Abrirlo en Arduino IDE y cargarlo en Escornabot."
                    ]
                },
                bluebot: {
                    desc: "Puedes conectar tu bluebot a Scratch Tactile Reader App sin necesidad de ninguna configuración adicional, pero ten en cuenta que al realizar la conexión, dejaras de tener acceso a la programación de bluebot a través de los botones.",
                }
            },
            accessibilityTitle: "Accesibilidad",
            accessibility: {
                desc: "Esta aplicación se ha diseñado para tener en cuenta la accesibilidad y está en continua evolución y mejora. Actualmente, incorpora las siguientes funciones de accesibilidad:",
                list: [
                    "Lectura de bloques con cámara.",
                    "Lector por voz.",
                    "Iconos intuitivos.",
                    "Texto alternativo a imágenes e iconos."
                ]
            },
            gratitudeList:"Agradecimientos",
            gratitude: "Queremos expresar nuestro más sincero agradecimiento a todas las personas y grupos que han contribuido al desarrollo y éxito de esta aplicación: a Renato, por su colaboración y apoyo, y a Luke, como desarrollador principal, por su esfuerzo y dedicación en este proyecto; a CRE once, por su valiosa ayuda en el testeo y mejora del sistema, dedicando su tiempo a ofrecer otro punto de vista y sugerencias; a la comunidad de usuarios, por su constante apoyo, confianza y por apostar por esta herramienta como recurso educativo inclusivo. Por último, a ti, que formas parte de este camino. ¡Gracias a todos seguimos mejorando cada día!",
            contactTitle: "¿Quieres colaborar? ¿Tienes sugerencias? Contáctanos",
            contact: "Si eres desarrollador, usuario o simplemente te gustaría colaborar en la mejora de Scratch Tactile Reader App o proponernos alguna sugerencia, contactanos.",
            contactBtn: "Contacta con nosotros"
        }   
    },
    ca: {
        settings: "Configuració",
        informacionBtn: "Informació",
        configTitle: "Configuració",
        scanBtn: "Escanejar",
        sendBtn: "Enviar blocs",
        repeatBtn: "Eliminar blocs",
        conexion: "Dispositiu conectat",
        aceptar: "Acceptar",
        error: "Error al conectar amb",
        consejos: "Consells per solucionar el problema:",
        consejo1: "Comprova que el robot està engegat i a prop de l'ordinador.",
        consejo2: "Assegura't d'haver carregat el programa a",
        consejo3: "Assegura't d'haver escollit el dispositiu correcte.",
        reintentar: "Tornar a intentar",
        noconectado: "No hi ha cap dispositiu connectat",
        desemparejar: "Dispositiu desconectat",
        sendError: "Error al enviar els blocs",
        reenviar: "Si us plau, torna a intentar enviar els blocs",
        makeCodeLink: "Codi de MakeCode",
        robot: "Selecciona un robot",
        camaraErrortitle: "Error en accedir a la càmera",
        camaraErrorText: "Assegura't que la càmera està connectada i activada. Si és així, assegura't que la configuració del teu navegador permet l'accés a la càmera a través de la pàgina web.",
        bluetoothBtn: "Emparellar dispositiu",
        disconectBtn: "Desemparellar",
        cancel: "Cancelar",
        infoTitle: "Informació",
        infoText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ex odio. Vivamus eget efficitur ante. Nam nec sapien elit. Ut vestibulum rutrum interdum. Nullam efficitur risus ac enim placerat, vel dictum tortor efficitur. Duis rutrum tincidunt urna, nec laoreet purus vestibulum nec. Fusce mattis velit in sapien auctor faucibus. Fusce feugiat vestibulum sapien, sed posuere odio efficitur vel. Quisque feugiat convallis nibh ut rutrum.",
        GreenFlag: "Bandera verda",
        Forward: "Endavant", 
        Left: "Esquerra",
        Right: "Dreta",
        Backward: "Enrere",
        TurnRight: "Dreta", 
        TurnLeft: "Esquerra", 
        Sound: "So",
        Talk: "Parlar", 
        Wait: "Esperar",
        LoopStart: "Inici de bucle",
        LoopEnd: "Final de bucle",
        End: "Final", 
        x2: "Repetir 2 vegades",
        x3: "Repetir 3 vegades",
        x4: "Repetir 4 vegades",
        repeatAll: "Repetir la seqüència",
        infoContent: {
            introTitle: "Introducció",
            intro: "L'aplicació Scratch Tactile App (Beta) permet escanejar blocs físics de <a href='https://www.scratchjrtactile.org/' target='_blank'>Scratch Tactile</a> amb la càmera, com a peces de trencaclosques que formen una seqüència, la qual és llegida en veu alta. Després, la seqüència s'envia a un robot, com un vehicle, a través de Bluetooth, ordenant-li que realitzi moviments com avançar o girar. A més, facilita la connexió amb Bluetooth per controlar robots com Mcqueen, Escornabot o Bluebot, i està dissenyada amb funcions d'accessibilitat, com lector per veu i icones intuïtius.",
            compatibleTitle: "Compatibilitat",
            compatible: "Els dispositius compatibles són:",
            comptaibleList: [
                "Navegador Chrome o Edge en qualsevol ordinador (excepte Linux).",
                "Navegador Chrome en dispositius Windows i Android (mòbils o tauletes).",
                "Actualment, el Bluetooth no és compatible amb iOS (mòbils o tauletes)."
            ],
            bltTitle: "Connexió per Bluetooth",
            bltList: {
                microbit: {
                    des: "Pots utilitzar-lo per connectar-te amb qualsevol micro:bit i enviar-li informació a través de Bluetooth.",
                    detail: "Per moure un robot que utilitzi micro:bit com a controlador, hauràs de fer un petit programa que 'tradueixi' les ordres rebudes per Bluetooth en moviments o ordres per al robot. Nosaltres et proporcionem un codi MakeCode ja fet per gestionar aquestes 'traduccions' per a Micro:bit Mcqueen, que pots obtenir i/o modificar perquè s'adapti a les teves necessitats: <a href='https://makecode.microbit.org/S74304-48867-59540-86098' target='_blank'>Codi MakeCode</a>"
                },
                escornabot: {
                    desc: "Tingues en compte que has de tenir el codi ben instal·lat a Escornabot per al seu ús amb Bluetooth i el mòdul Bluetooth instal·lat. A continuació t'expliquem què has de tenir en compte.",
                    steps: [
                        "Adquirir i instal·lar mòdul Bluetooth.",
                        "Descarregar el següent paquet i descomprimir-lo: <a href='https://drive.google.com/file/d/1_Ey0nOIGWiZlZrsmrnRih37I_dIH4Ubc/view?usp=share_link' target='_blank'>Paquet Escornabot</a>",
                        "Obrir-lo a Arduino IDE i carregar-lo a Escornabot."
                    ]
                },
                bluebot: {
                    desc: "Pots connectar el teu Bluebot a Scratch Tactile Reader App sense necessitat de cap configuració addicional, però tingues en compte que en fer la connexió, deixaràs de tenir accés a la programació de Bluebot a través dels botons."
                }
            },
            accessibilityTitle: "Accessibilitat",
            accessibility: {
                desc: "Aquesta aplicació s'ha dissenyat per tenir en compte l'accessibilitat i està en contínua evolució i millora. Actualment, incorpora les següents funcions d'accessibilitat:",
                list: [
                    "Lectura de blocs amb càmera.",
                    "Lector per veu.",
                    "Icones intuïtius.",
                    "Text alternatiu a imatges i icones."
                ]
            },
            gratitudeList: "Agraïments",
            gratitude: "Volem expressar el nostre més sincer agraïment a totes les persones i grups que han contribuït al desenvolupament i èxit d'aquesta aplicació: a Renato, per la seva col·laboració i suport, i a Luke, com a desenvolupador principal, per l'esforç i dedicació en aquest projecte; a CRE ONCE, per la seva valuosa ajuda en el testatge i millora del sistema, dedicant el seu temps a oferir un altre punt de vista i suggeriments; a la comunitat d'usuaris, pel seu constant suport, confiança i per apostar per aquesta eina com a recurs educatiu inclusiu. Finalment, a tu, que formes part d'aquest camí. Gràcies a tots seguim millorant cada dia!",
            contactTitle: "Vols col·laborar? O tens suggeriments? Contacta'ns",
            contact: "Si ets desenvolupador, usuari o simplement t'agradaria col·laborar en la millora de Scratch Tactile Reader App o proposar-nos alguna suggerència, contacta'ns.",
            contactBtn: "Contacta amb nosaltres"
        }        
    },
    en: {
        settings: "Settings",
        informacionBtn: "Information",
        configTitle: "Settings",
        scanBtn: "Open camera",
        sendBtn: "Send blocks",
        repeatBtn: "Remove blocks",
        conexion: "Device conected",
        aceptar: "Ok",
        error: "Error connecting with",
        consejos: "Tips to solve the problem:",
        consejo1: "Check that the robot is on and near the computer.",
        consejo2: "Make sure you have uploaded the program to",
        consejo3: "Make sure you have chosen the correct device.",
        reintentar: "Retry",
        noconectado: "No device connected",
        desemparejar: "Device disconnected",
        sendError: "Error sending the blocks",
        reenviar: "Please, try to send the blocks again",
        makeCodeLink: "MakeCode code",
        robot: "Choose a robot",
        camaraErrortitle: "Error accessing the camera",
        camaraErrorText: "Make sure the camera is connected and activated. If so, make sure your browser settings allow access to the camera through the website.",
        bluetoothBtn: "Pair device",
        disconectBtn: "Unpair",
        cancel: "Cancel",
        infoTitle: "Information",
        infoText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ex odio. Vivamus eget efficitur ante. Nam nec sapien elit. Ut vestibulum rutrum interdum. Nullam efficitur risus ac enim placerat, vel dictum tortor efficitur. Duis rutrum tincidunt urna, nec laoreet purus vestibulum nec. Fusce mattis velit in sapien auctor faucibus. Fusce feugiat vestibulum sapien, sed posuere odio efficitur vel. Quisque feugiat convallis nibh ut rutrum.",
        GreenFlag: "Green flag",
        Forward: "Forward", 
        Left: "Left",
        Right: "Right",
        Backward: "Backward",
        TurnRight: "Right", 
        TurnLeft: "Left", 
        Sound: "Sound",
        Talk: "Talk", 
        Wait: "Wait",
        LoopStart: "Loop start",
        LoopEnd: "Loop end",
        End: "End", 
        x2: "Repeat 2 times",
        x3: "Repeat 3 times",
        x4: "Repeat 4 times",
        repeatAll: "Repeat the sequence",
        infoContent: {
            introTitle: "Introduction",
            intro: "The Scratch Tactile App (Beta) allows scanning physical blocks of <a href='https://www.scratchjrtactile.org/' target='_blank'>Scratch Tactile</a> using the camera, like puzzle pieces that form a sequence, which is read aloud. Then, the sequence is sent to a robot, such as a vehicle, via Bluetooth, instructing it to perform movements like moving forward or turning. Additionally, it facilitates Bluetooth connection to control robots like Mcqueen, Escornabot, or Bluebot, and it is designed with accessibility features such as voice reader and intuitive icons.",
            compatibleTitle: "Compatibility",
            compatible: "The compatible devices are:",
            comptaibleList: [
                "Chrome or Edge browser on any computer (except Linux).",
                "Chrome browser on Windows and Android devices (phones or tablets).",
                "Currently, Bluetooth is not supported on iOS (phones or tablets)."
            ],
            bltTitle: "Bluetooth Connection",
            bltList: {
                microbit: {
                    des: "You can use it to connect with any micro:bit and send information via Bluetooth.",
                    detail: "To move a robot that uses micro:bit as a controller, you will need to create a small program that 'translates' the commands received via Bluetooth into movements or commands for the robot. We provide you with a pre-made MakeCode program to handle these 'translations' for Micro:bit Mcqueen, which you can obtain and/or modify to suit your needs: <a href='https://makecode.microbit.org/S74304-48867-59540-86098' target='_blank'>MakeCode Program</a>"
                },
                escornabot: {
                    desc: "Keep in mind that you need to have the code properly installed on Escornabot for its use with Bluetooth and the Bluetooth module installed. Below we explain what you need to consider.",
                    steps: [
                        "Acquire and install the Bluetooth module.",
                        "Download the following package and unzip it: <a href='https://drive.google.com/file/d/1_Ey0nOIGWiZlZrsmrnRih37I_dIH4Ubc/view?usp=share_link' target='_blank'>Escornabot Package</a>",
                        "Open it in Arduino IDE and upload it to Escornabot."
                    ]
                },
                bluebot: {
                    desc: "You can connect your Bluebot to Scratch Tactile Reader App without any additional configuration, but keep in mind that when connecting, you will no longer have access to programming Bluebot through the buttons."
                }
            },
            accessibilityTitle: "Accessibility",
            accessibility: {
                desc: "This application has been designed with accessibility in mind and is in continuous evolution and improvement. Currently, it incorporates the following accessibility features:",
                list: [
                    "Reading blocks with a camera.",
                    "Voice reader.",
                    "Intuitive icons.",
                    "Alternative text for images and icons."
                ]
            },
            gratitudeList: "Acknowledgments",
            gratitude: "We want to express our sincerest gratitude to all the people and groups who have contributed to the development and success of this application: to Renato, for his collaboration and support, and to Luke, as the main developer, for his effort and dedication to this project; to CRE ONCE, for their valuable help in testing and improving the system, dedicating their time to offering another perspective and suggestions; to the user community, for their constant support, trust, and for choosing this tool as an inclusive educational resource. Finally, to you, who are part of this journey. Thanks to everyone, we continue improving every day!",
            contactTitle: "Want to collaborate? Or have suggestions? Contact us",
            contact: "If you are a developer, user, or would simply like to collaborate on improving Scratch Tactile Reader App or propose any suggestions, contact us.",
            contactBtn: "Contact us"
        }        
    },
    de: {
        settings: "Einstellungen",
        informacionBtn: "Information",
        configTitle: "Einstellungen",
        scanBtn: "Kamera öffnen",
        sendBtn: "Blöcke senden",
        repeatBtn: "Blöcke entfernen",
        conexion: "Verbundenes Gerät",
        aceptar: "Akzeptieren",
        error: "Fehler beim Verbinden mit",
        consejos: "Tipps zur Problemlösung:",
        consejo1: "Überprüfen Sie, ob der Roboter eingeschaltet ist und in der Nähe des Computers steht.",
        consejo2: "Stellen Sie sicher, dass Sie das Programm auf",
        consejo3: "Stellen Sie sicher, dass Sie das richtige Gerät ausgewählt haben.",
        reintentar: "Wiederholen",
        noconectado: "Kein Gerät verbunden",
        desemparejar: "Gerät getrennt",
        sendError: "Fehler beim Senden der Blöcke",
        reenviar: "Bitte versuchen Sie, die Blöcke erneut zu senden",
        makeCodeLink: "MakeCode-Code",
        robot: "Wählen Sie einen Roboter",
        robot: "Wählen Sie einen Roboter",
        camaraErrortitle: "Fehler beim Zugriff auf die Kamera",
        camaraErrorText: "Stellen Sie sicher, dass die Kamera angeschlossen und aktiviert ist. Wenn ja, stellen Sie sicher, dass die Browsereinstellungen den Zugriff auf die Kamera über die Website zulassen.",
        bluetoothBtn: "Gerät koppeln",
        disconectBtn: "Entkoppeln",
        cancel: "Abbrechen",
        infoTitle: "Information",
        infoText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ex odio. Vivamus eget efficitur ante. Nam nec sapien elit. Ut vestibulum rutrum interdum. Nullam efficitur risus ac enim placerat, vel dictum tortor efficitur. Duis rutrum tincidunt urna, nec laoreet purus vestibulum nec. Fusce mattis velit in sapien auctor faucibus. Fusce feugiat vestibulum sapien, sed posuere odio efficitur vel. Quisque feugiat convallis nibh ut rutrum.",
        GreenFlag: "Grüne flagge",
        Forward: "Nach vorne", 
        Left: "Links",
        Right: "Rechts",
        Backward: "Rückwärts",
        TurnRight: "Rechts", 
        TurnLeft: "Links", 
        Sound: "Klang",
        Talk: "Sprechen", 
        Wait: "Warten",
        LoopStart: "Schleifenstart",
        LoopEnd: "Schleifenende",
        End: "Ende", 
        x2: "2 Mal wiederholen",
        x3: "3 Mal wiederholen",
        x4: "4 Mal wiederholen",
        repeatAll: "Wiederholen Sie die Sequenz",
        infoContent: {
            introTitle: "Einleitung",
            intro: "Die Scratch Tactile App (Beta) ermöglicht das Scannen physischer Blöcke von <a href='https://www.scratchjrtactile.org/' target='_blank'>Scratch Tactile</a> mit der Kamera, ähnlich wie Puzzleteile, die eine Sequenz bilden, welche laut vorgelesen wird. Anschließend wird die Sequenz über Bluetooth an einen Roboter, wie z. B. ein Fahrzeug, gesendet und angewiesen, Bewegungen wie Vorwärtsfahren oder Drehen auszuführen. Außerdem erleichtert sie die Bluetooth-Verbindung, um Roboter wie Mcqueen, Escornabot oder Bluebot zu steuern, und ist mit Barrierefreiheitsfunktionen wie Sprachleser und intuitiven Symbolen ausgestattet.",
            compatibleTitle: "Kompatibilität",
            compatible: "Die kompatiblen Geräte sind:",
            comptaibleList: [
                "Chrome- oder Edge-Browser auf jedem Computer (außer Linux).",
                "Chrome-Browser auf Windows- und Android-Geräten (Handys oder Tablets).",
                "Derzeit wird Bluetooth auf iOS (Handys oder Tablets) nicht unterstützt."
            ],
            bltTitle: "Bluetooth-Verbindung",
            bltList: {
                microbit: {
                    des: "Sie können es verwenden, um sich mit jedem micro:bit zu verbinden und Informationen über Bluetooth zu senden.",
                    detail: "Um einen Roboter zu bewegen, der micro:bit als Controller verwendet, müssen Sie ein kleines Programm erstellen, das die über Bluetooth empfangenen Befehle in Bewegungen oder Befehle für den Roboter 'übersetzt'. Wir stellen Ihnen ein vorgefertigtes MakeCode-Programm zur Verfügung, um diese 'Übersetzungen' für Micro:bit Mcqueen zu handhaben, das Sie erhalten und/oder an Ihre Bedürfnisse anpassen können: <a href='https://makecode.microbit.org/S74304-48867-59540-86098' target='_blank'>MakeCode-Programm</a>"
                },
                escornabot: {
                    desc: "Beachten Sie, dass der Code ordnungsgemäß auf dem Escornabot installiert sein muss, um ihn mit Bluetooth nutzen zu können, und dass das Bluetooth-Modul installiert sein muss. Im Folgenden erklären wir, was Sie beachten müssen.",
                    steps: [
                        "Bluetooth-Modul erwerben und installieren.",
                        "Das folgende Paket herunterladen und entpacken: <a href='https://drive.google.com/file/d/1_Ey0nOIGWiZlZrsmrnRih37I_dIH4Ubc/view?usp=share_link' target='_blank'>Escornabot-Paket</a>",
                        "Es in der Arduino IDE öffnen und auf den Escornabot hochladen."
                    ]
                },
                bluebot: {
                    desc: "Sie können Ihren Bluebot mit der Scratch Tactile Reader App verbinden, ohne zusätzliche Konfigurationen vornehmen zu müssen. Beachten Sie jedoch, dass Sie nach der Verbindung keine Programmierung des Bluebots über die Tasten mehr vornehmen können."
                }
            },
            accessibilityTitle: "Zugänglichkeit",
            accessibility: {
                desc: "Diese Anwendung wurde unter Berücksichtigung der Barrierefreiheit entwickelt und befindet sich in ständiger Weiterentwicklung und Verbesserung. Derzeit bietet sie folgende Barrierefreiheitsfunktionen:",
                list: [
                    "Lesen von Blöcken mit der Kamera.",
                    "Sprachleser.",
                    "Intuitive Symbole.",
                    "Alternativtext für Bilder und Symbole."
                ]
            },
            gratitudeList: "Danksagungen",
            gratitude: "Wir möchten unseren aufrichtigen Dank an alle Menschen und Gruppen aussprechen, die zur Entwicklung und zum Erfolg dieser Anwendung beigetragen haben: an Renato für seine Zusammenarbeit und Unterstützung, und an Luke als Hauptentwickler für seine Bemühungen und Hingabe an dieses Projekt; an CRE ONCE für ihre wertvolle Hilfe beim Testen und Verbessern des Systems, die ihre Zeit gewidmet haben, um eine andere Perspektive und Vorschläge anzubieten; an die Benutzer-Community für ihre kontinuierliche Unterstützung, ihr Vertrauen und dafür, dass sie dieses Tool als inklusives Bildungsressource gewählt haben. Schließlich auch an Sie, die Teil dieses Weges sind. Dank allen machen wir jeden Tag Fortschritte!",
            contactTitle: "Möchten Sie mitwirken? Oder haben Sie Vorschläge? Kontaktieren Sie uns",
            contact: "Wenn Sie Entwickler, Benutzer sind oder einfach nur zur Verbesserung der Scratch Tactile Reader App beitragen oder Vorschläge unterbreiten möchten, kontaktieren Sie uns.",
            contactBtn: "Kontaktieren Sie uns"
        }        
    },
    pt: {
        settings: "Configurações",
        informacionBtn: "Informação",
        configTitle: "Configurações",
        scanBtn: "Abrir câmera",
        sendBtn: "Enviar blocos",
        repeatBtn: "Remover blocos",
        conexion: "Dispositivo conectado",
        aceptar: "aceitar",
        error: "Erro ao conectar com",
        consejos: "Dicas para resolver o problema:",
        consejo1: "Verifique se o robô está ligado e perto do computador.",
        consejo2: "Certifique-se de ter carregado o programa em",
        consejo3: "Certifique-se de ter escolhido o dispositivo correto.",
        reintentar: "Tentar novamente",
        noconectado: "Nenhum dispositivo conectado",
        desemparejar: "Dispositivo desconectado",
        sendError: "Erro ao enviar os blocos",
        reenviar: "Por favor, tente enviar os blocos novamente",
        makeCodeLink: "Código MakeCode",
        robot: "Escolha um robô",
        camaraErrortitle: "Erro ao acessar a câmera",
        camaraErrorText: "Certifique-se de que a câmera está conectada e ativada. Se sim, certifique-se de que as configurações do seu navegador permitem o acesso à câmera através do site.",
        bluetoothBtn: "Emparelhar dispositivo",
        disconectBtn: "Desemparelhar",
        cancel: "Cancelar",
        infoTitle: "Informação",
        infoText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ex odio. Vivamus eget efficitur ante. Nam nec sapien elit. Ut vestibulum rutrum interdum. Nullam efficitur risus ac enim placerat, vel dictum tortor efficitur. Duis rutrum tincidunt urna, nec laoreet purus vestibulum nec. Fusce mattis velit in sapien auctor faucibus. Fusce feugiat vestibulum sapien, sed posuere odio efficitur vel. Quisque feugiat convallis nibh ut rutrum.",
        GreenFlag: "Bandeira verde",
        Forward: "Avançar", 
        Left: "Esquerda",
        Right: "Certo",
        Backward: "Voltar",
        TurnRight: "Certo", 
        TurnLeft: "Esquerda", 
        Sound: "Som",
        Talk: "Falar", 
        Wait: "Esperar",
        LoopStart: "Início do ciclo",
        LoopEnd: "Fim do ciclo",
        End: "Fim", 
        x2: "Repita 2 vezes",
        x3: "Repita 3 vezes",
        x4: "Repita 4 vezes",
        repeatAll: "Repita a sequência",
        infoContent: {
            introTitle: "Introdução",
            intro: "O aplicativo Scratch Tactile App (Beta) permite escanear blocos físicos de <a href='https://www.scratchjrtactile.org/' target='_blank'>Scratch Tactile</a> com a câmera, como peças de quebra-cabeça que formam uma sequência, que é lida em voz alta. Em seguida, a sequência é enviada para um robô, como um veículo, via Bluetooth, instruindo-o a realizar movimentos como avançar ou girar. Além disso, facilita a conexão via Bluetooth para controlar robôs como Mcqueen, Escornabot ou Bluebot, e foi projetado com funções de acessibilidade, como leitor de voz e ícones intuitivos.",
            compatibleTitle: "Compatibilidade",
            compatible: "Os dispositivos compatíveis são:",
            comptaibleList: [
                "Navegador Chrome ou Edge em qualquer computador (exceto Linux).",
                "Navegador Chrome em dispositivos Windows e Android (celulares ou tablets).",
                "Atualmente, o Bluetooth não é compatível com iOS (celulares ou tablets)."
            ],
            bltTitle: "Conexão via Bluetooth",
            bltList: {
                microbit: {
                    des: "Você pode usá-lo para se conectar a qualquer micro:bit e enviar informações via Bluetooth.",
                    detail: "Para mover um robô que usa micro:bit como controlador, você precisará criar um pequeno programa que 'traduza' os comandos recebidos via Bluetooth em movimentos ou ordens para o robô. Fornecemos um código MakeCode já pronto para gerenciar essas 'traduções' para o Micro:bit Mcqueen, que você pode obter e/ou modificar conforme suas necessidades: <a href='https://makecode.microbit.org/S74304-48867-59540-86098' target='_blank'>Código MakeCode</a>"
                },
                escornabot: {
                    desc: "Observe que você deve ter o código corretamente instalado no Escornabot para usá-lo com Bluetooth e o módulo Bluetooth instalado. A seguir, explicamos o que você precisa considerar.",
                    steps: [
                        "Adquirir e instalar o módulo Bluetooth.",
                        "Baixar o seguinte pacote e descompactá-lo: <a href='https://drive.google.com/file/d/1_Ey0nOIGWiZlZrsmrnRih37I_dIH4Ubc/view?usp=share_link' target='_blank'>Pacote Escornabot</a>",
                        "Abrir no Arduino IDE e carregar no Escornabot."
                    ]
                },
                bluebot: {
                    desc: "Você pode conectar seu Bluebot ao Scratch Tactile Reader App sem necessidade de configuração adicional, mas lembre-se de que, ao fazer a conexão, você deixará de ter acesso à programação do Bluebot através dos botões."
                }
            },
            accessibilityTitle: "Acessibilidade",
            accessibility: {
                desc: "Este aplicativo foi projetado considerando a acessibilidade e está em constante evolução e melhoria. Atualmente, incorpora as seguintes funcionalidades de acessibilidade:",
                list: [
                    "Leitura de blocos com a câmera.",
                    "Leitor de voz.",
                    "Ícones intuitivos.",
                    "Texto alternativo para imagens e ícones."
                ]
            },
            gratitudeList: "Agradecimentos",
            gratitude: "Gostaríamos de expressar nosso mais sincero agradecimento a todas as pessoas e grupos que contribuíram para o desenvolvimento e sucesso deste aplicativo: a Renato, por sua colaboração e apoio, e a Luke, como desenvolvedor principal, por seu esforço e dedicação a este projeto; ao CRE ONCE, por sua valiosa ajuda nos testes e na melhoria do sistema, dedicando seu tempo para oferecer outra perspectiva e sugestões; à comunidade de usuários, por seu apoio contínuo, confiança e por apostar nesta ferramenta como um recurso educacional inclusivo. Finalmente, a você, que faz parte deste caminho. Graças a todos, continuamos melhorando a cada dia!",
            contactTitle: "Quer colaborar? Ou tem sugestões? Entre em contato",
            contact: "Se você é desenvolvedor, usuário ou simplesmente gostaria de colaborar na melhoria do Scratch Tactile Reader App ou sugerir algo, entre em contato conosco.",
            contactBtn: "Entre em contato"
        }
        
    }
};

function cargarIdioma() {
    const idioma = localStorage.getItem('idioma') || 'es';
    aplicarTraduccion(idioma);
}

function aplicarTraduccion(idioma) {
    const elementos = document.querySelectorAll('[data-translate]');

    elementos.forEach(elemento => {
        const clave = elemento.getAttribute('data-translate');

        if (elemento.id === 'modoToggleBtn') {
            if (translations[idioma] ) {
                elemento.textContent = translations[idioma];
            }
        } 
        else if (translations[idioma] && translations[idioma][clave]) {
            elemento.textContent = translations[idioma][clave];
        }
    });
}


