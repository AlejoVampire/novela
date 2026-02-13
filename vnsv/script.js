// ============= PROTOTIPOS =============
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    return this;
};

// ============= VARIABLES GLOBALES =============
let state = {
    primeraImpresion: null,
    afrontar: null,
    respondiocumplido: null,
    aceptaSentimientos: null,
    foto: null,
    subioCarro: null,
    dijoQueSi: null,
    ojoscerrados: null,
    terminar: null,
    preguntaQueSon: null
};
let currentScene = null;
let lineIndex = 0;
let puntos = 0;
let maxpuntos_antes = 16;
let minpuntos_antes = 7;
let maxpuntos_despues = 18;
let minpuntos_despues = 8;
let specialImageActive = false;
let typingInterval = null;
let isTyping = false;
let finalType = null;
let textHistory = [];
const MAX_HISTORY = 10;
let currentBackground = null;
let currentPlaylist = [];
let currentTrackIndex = 0;
let savesMode = "save";

// ============= ELEMENTOS DEL DOM =============
let vn, vnText, nextBtn, vnChoices, bg, startBtn, historyBtn, saveBtn, loadBtn, 
    historyScreen, historyList, savesScreen, cameraFlash, photoReveal, cameraSound, 
    specialImage, finalScreen, finalPerfectoText, game, whiteTransition, imageContainer;

// ============= SONIDOS =============
const uiSounds = {
    hover: new Audio("hoversound.mp3"),
    click_comenzar: new Audio("clickcomenzar.mp3"),
    click_siguiente: new Audio("clicksiguiente.mp3")
};

const choiceSounds = {
    hover: new Audio("hoverchoice.mp3"),
    click: new Audio("clickchoice.mp3")
};

const music = {
    main: [
        new Audio("blueslow.mp3"),
        new Audio("onlyslow.mp3"),
        new Audio("nuvole.mp3")
    ],
    bad: [
        new Audio("lovehurts.mp3")
    ],
    neutral: [
        new Audio("snowmanslow.mp3")
    ],
    perfect: [
        new Audio("flowerdance.mp3")
    ]
};

// ============= CONFIGURACIÓN DE AUDIO =============
uiSounds.click_comenzar.volume = 0.3;
uiSounds.click_siguiente.volume = 0.4;
uiSounds.hover.volume = 0.4;
choiceSounds.hover.volume = 0.4;
choiceSounds.click.volume = 0.4;
Object.values(music).flat().forEach(track => {
    track.volume = 0.35;
});

// ============= ESCENAS =============
const scenes = {
    escena1: {
        lines: [
            "Septiembre de 2023.",
            "Segundo ciclo.",
            "Senati.",
            "La vi por primera vez y por su actuar, me dio cierta impresión. Yo..."
        ],
        choices: [
            {
                text: "Pensé que era creída",
                action: () => {
                    state.primeraImpresion = "creida";
                    loadScene("escena2_creida");
                    puntos += 2;
                }
            },
            {
                text: "Pensé que era diferente",
                action: () => {
                    state.primeraImpresion = "diferente";
                    loadScene("escena2_diferente");
                    puntos += 1;
                }
            }
        ]
    },
    escena2_creida: {
        lines: [
            "Nos juntaron por un trabajo grupal.",
            "Códigos, mensajes, tareas.",
            "Con los días, esa idea se fue por completo.",
            "Parecía centrada en los estudios.",
            "Y por eso, la evitaba."
        ],
        next: "escena2_decision"
    },
    escena2_diferente: {
        lines: [
            "Nos juntaron por un trabajo grupal.",
            "Códigos, mensajes, tareas.",
            "Algo en ella me llamó la atención desde el inicio.",
            "Quizá se deba a la forma fría en la que miraba a los demás.",
            "Y por eso, la evitaba."
        ],
        next: "escena2_decision"
    },
    escena2_decision: {
        lines: [
            "Un día la encontré en mi PC junto con su amiga copiando un código."
        ],
        choices: [
            {
                text: "Le pregunté por qué lo hacía",
                action: () => {
                    state.afrontar = true;
                    loadScene("escena2_cafe_afrontar");
                    puntos += 2;
                }  
            },
            {
                text: "Me hice el distraído",
                action: () => {
                    state.afrontar = false;
                    loadScene("escena2_cafe_distraido");
                    puntos += 1;
                }
            }
        ]
    },
    escena2_cafe_afrontar: {
        lines: [
            "Explicaron sus motivos y luego se fueron.",
            "No entendía qué pasaba, pero al final era mejor dejarlo así como estaba.",
            "Al llegar la noche, me llegó un mensaje.",
            "Se disculpó por WhatsApp.",
            "Y me ofreció un café.",
            "Ese café, aunque parecía no afectar en nada, fue el primer giro de la historia."
        ],
        next: "escena3"
    },
    escena2_cafe_distraido: {
        lines: [
            "Retrocedí y salí del salón.",
            "Di una pequeña vuelta y regresé.",
            "Ellas ya no estaban.",
            "Al llegar la noche, me llegó un mensaje.",
            "Se disculpó por WhatsApp.",
            "Y me ofreció un café.",
            "Ese café, aunque parecía no afectar en nada, fue el primer giro de la historia."
        ],
        next: "escena3"
    },
    escena3: {
        lines: [
            "Me prometí no volver a sentir algo así.",
            "Pero negar que me gustaba",
            "solo hacía que piense más en ella."
        ],
        choices: [
            {
                text: "Seguir ignorándolo",
                action: () => {
                    state.aceptaSentimientos = false;
                    loadScene("escena3_ignorar");
                }
            },
            {
                text: "Aceptar que me gustaba",
                action: () => {
                    state.aceptaSentimientos = true;
                    loadScene("escena3_aceptar");
                    puntos += 2;
                }
            }
        ]
    },
    escena3_ignorar: {
        lines: [
            "Llegó tercer ciclo.",
            "Me había cortado el pelo.",
            "Me preocupaba lo que pensara ella de mí, pero no entendía bien por qué.",
            "Llegó un poco tarde y para mi sorpresa, también se había cortado el pelo.",
            "Y aunque no quería pensar mucho en ello, me gustaba cómo se veía.",
        ],
        next: "escena3_decision"
    },
    escena3_aceptar: {
        lines: [
            "Llegó tercer ciclo.",
            "Me había cortado el pelo.",
            "Tenía miedo de que no le gustase mi corte nuevo o de que se burlase.",
            "Llegó un poco tarde y para mi sorpresa, también se había cortado el pelo.",
            "El look me impresionó, me gustaba mucho y sentí algo en el pecho.",
        ],
        next: "escena3_decision"
    },
    escena3_decision: {
        lines: [
            "Antes de tomar asiento, se acercó al mío y me susurró: \"Te ves muy guapo\"."
        ],
        choices: () => state.aceptaSentimientos ? 
        [
            {
                text: "Me ruboricé y quedé sorprendido.",
                action: () => {
                    state.respondiocumplido = false;
                    loadScene("escena4_rubor");
                    puntos += 2;
                }
            },
            {
                text: "Le dije que ella también se veía guapa",
                action: () => {
                    state.respondiocumplido = true;
                    loadScene("escena4_cumplido");
                    puntos += 1;
                }
            }
        ] : [
            {
                text: "Me quedé en shock y no supe qué decir.",
                action: () => {
                    state.respondiocumplido = false;
                    loadScene("escena4_shock");
                }
            }
        ]
    },
    escena4_rubor: {
        lines: [
            "No me dio tiempo de reaccionar más allá de eso.",
            "Al siguiente día, llegamos temprano a clase.",
            "Decidí sentarme detrás de ella."
        ],
        next: "escena4_decision"
    },
    escena4_cumplido: {
        lines: [
            "Me respondió con una sonrisa y un \"Gracias\".",
            "Se notaba algo nerviosa, quizá no lo esperaba.",
            "Al siguiente día, llegamos temprano a clase.",
            "Decidí sentarme detrás de ella."
        ],
        next: "escena4_decision"
    },
    escena4_shock: {
        lines: [
            "Tampoco quería dejarlo ahí no más, pero no pude responderle.",
            "Al siguiente día, llegamos temprano a clase.",
            "Elegí un sitio que esté por el fondo.",
            "Comenzó a darme sueño, así que me quedé dormido."
        ],
        next: "finalmalo"
    },
    escena4_decision: {
        lines: [
            "Se veía muy tranquila..."
        ],
        choices: [
            {
                text: "Así que le tomé una foto.",
                action: () => {
                    state.foto = true;
                    tomarFoto(() => {
                        loadScene("escena5_foto");
                        puntos += 2;
                    });
                }
            },
            {
                text: "Así que decidí no molestarla.",
                action: () => {
                    state.foto = false;
                    loadScene("escena5_no_foto");
                    puntos += 1;
                }
            }
        ]
    },
    escena5_foto: {
        lines: [
            "Era la primera foto que tenía de ella.",
            "Me dio la determinación de hacer algo.",
            "Regalarle chocolates para San Valentín.",
            "No me alcanzaba para algo elaborado, así que le di un paquete de Travesuras.",
            "Me lo agradeció por mensaje. Me sentí muy feliz por eso."
        ],
        next: "escena5_decision"
    },
    escena5_no_foto: {
        lines: [
            "Me preguntaba si podía hacer algo para ser más cercano a ella.",
            "Le pedí consejo a mi amiga y como venía San Valentín, me sugirió regalarle chocolates.",
            "No me alcanzaba algo elaborado, así que le di un paquete de Travesuras.",
            "Me lo agradeció por mensaje. Me sentí muy feliz por eso."
        ],
        next: "escena5_decision"
    },
    escena5_decision: {
        lines: [
            "Noté que ella tomaba un carro hacia una dirección en la que yo podía dirigirme también.",
            "Se lo comenté a mi amiga y me dijo que me subiera.",
            "Era una buena oportunidad para hablar con ella."
        ],
        choices: [
            {
                text: "Subirme al carro",
                action: () => {
                    state.subioCarro = true;
                    loadScene("escena6_carro");
                    puntos += 2;
                }
            },
            {
                text: "No subirme al carro",
                action: () => {
                    state.subioCarro = false;
                    loadScene("escena6_no_carro");
                    puntos += 1;
                }
            }
        ]
    },
    escena6_carro: {
        lines: [
            "Y comenzamos a hablar de más temas.",
            "Sus pensamientos, su pasado, sus gustos.",
            "La dejaba hasta su paradero y luego me iba caminando a ver a mi mamá.",
            "...",
            "En lo posible, trataba de formar grupo con ella en trabajos.",
            "También la seguía si tenía que salir a algún lugar como al cafetín, tienda o baño.",
            "Supe que a más chicos les gustaba, pero sabía que por su religión, no los aceptaría.",
            "Claro que eso me incluía a mí, pero no me importaba. Solo quería estar cerca de ella.",
            "...",
            "Una vez, en el carro, después de un silencio, me preguntó si yo gustaba de ella."
        ],
        next: "escena6_decision"
    },
    escena6_no_carro: {
        lines: [
            "Me costaba más de lo que podía gastar, llegaba a casa más rápido si caminaba desde Senati.",
            "Pero debía buscar más formas de acercarme a ella.",
            "En lo posible, trataba de formar grupo con ella en trabajos.",
            "También la seguía si tenía que salir a algún lugar como al cafetín, tienda o baño.",
            "Supe que a más chicos les gustaba, pero sabía que por su religión, no los aceptaría.",
            "Claro que eso me incluía a mí, pero no me importaba. Solo quería estar cerca de ella.",
            "...",
            "Una vez, antes de despedirnos en la entrada de Senati, me preguntó si yo gustaba de ella."
        ],
        next: "escena6_decision"
    },
    escena6_decision: {
        lines: [
            "Giré rápidamente la cabeza y estaba dudando en qué decirle.",
        ],
        choices: [
            {
                text: "Decirle que sí",
                action: () => {
                    state.dijoQueSi = true;
                    if (state.subioCarro){
                        loadScene("escena7_si");
                        puntos += 2;
                    } else {
                        loadScene("escena7_si_no_carro");
                        puntos += 1;
                    }
                }
            },
            {
                text: "Decirle que no",
                action: () => {
                    state.dijoQueSi = false;
                    loadScene("finalmalo_1");
                }
            }
        ]       
    },
    escena7_si: {
        lines: [
            "Hablamos un poco de lo obvia que era.",
            "Y cuando llegamos al paradero, ella habló conmigo un poco más.",
            "Me dijo que no era posible que podamos ser algo más.",
            "Ella era testigo, los testigos no pueden tener pareja que no sea testigo también.",
            "Yo sabía la respuesta, así que solo la acepté.",
            "Pero esta escena se volvió algo que ambos nunca olvidaríamos.",
            "Vino un viento fuerte y cayó tierra en mis ojos.",
            "Eso hizo que se pusieran llorosos justo en el momento en el que me rechazaba.",
            "Creyó que me había hecho llorar aunque yo traté de explicarle de que era la tierra,",
            "pero para fastidiarme después, no lo quiso aceptar de esa forma.",
        ],
        next: "escena8"
    },
    escena7_si_no_carro: {
        lines: [
            "Hablamos un poco de lo obvia que era.",
            "Nos fuimos a un lugar donde no incomodemos a nadie y entonces me dijo que no era posible que podamos ser algo más.",
            "Ella era testigo, los testigos no pueden tener pareja que no sea testigo también.",
            "Yo sabía la respuesta, así que solo la acepté."
        ],
        next: "escena8"
    },
    escena8: {
        lines: [
            "...",
            "Regresé a casa pensando en que debería declararme correctamente, así que la cité en Senati.",
            "En un árbol que había en el descampado del instituto. Le dije todo lo que sentía.",
            "Claro que sin esperar respuesta, pues ya me había rechazado.",
            "...",
            "Seguí pasando tiempo con ella a pesar de que dijo que era mejor que disminuyamos eso.",
            "Pero yo quería pasar el tiempo que pudiera con ella, más aún si iba a viajar.",
            "Y aunque mencionó eso, constantemente me preguntaba si aún seguía sintiendo algo, a lo que yo respondía que sí.",
            "...",
            "Llegaron las vacaciones y al final su viaje no ocurrió.",
            "Para ella era algo malo, pero para mí me alegró mucho, podía seguir viéndola.",
            "Nos seguimos mutuamente en Tiktok y para mantener la racha, nos enviábamos mensajes constantemente.",
            "A veces, enviaba tiktoks o mensajes que no sabía cómo interpretar, no quería pensar nada incorrecto.",
            "Me rechazó, ¿por qué entonces me enviaría cosas así?",
            "No podía soportarlo más, así que le pedí una salida para aclarar las cosas.",
            "...",
            "Fuimos a comer a un chifa, y aún me da gracia lo que hice en ese momento.",
            "Le dije que pagara más de lo que yo pagaría. Trataba de ser gracioso, pero en retrospectiva, fue algo raro.",
            "Luego nos fuimos a un parque y nos sentamos en una banca.",
            "Le pregunté directamente \"¿Qué somos?\"",
            "Le di una explicación de lo que estaba ocurriendo, pero en vez de tener una respuesta clara, me comentó sobre su pasado.",
            "Un chico que le gustaba, su vida en primaria.",
            "Y luego me dijo nuevamente lo de los testigos, que no podía ser algo más entre nosotros.",
            "Me sentí mal, pero no podía hacer nada al respecto.",
            "Lo curioso vino después.",
            "...",
            "Al poco tiempo, nos casamos en roblox.",
            "Y al día siguiente, en una conversación nocturna.",
            "Hablamos sobre lo complicado que es el matrimonio incluso cuando ambos son testigos.",
            "Me dijo que se casaría en el paraíso, pero yo le dije \"O conmigo\".",
            "Ella respondió que ni siquiera le pedí matrimonio. A lo que yo respondí que ni siquiera podemos afirmar un noviazgo.",
            "Entonces, para mi sorpresa, me pidió que fuera su novio, que al menos ella sabría eso.",
            "Acepté sin dudar. Y así, desencadenamos toda una serie de alegrías y conflictos."
        ],
        next: "escena9_comienzo"
    },
    escena9_comienzo: {
        lines: [
            "Nosotros fuimos muy atrevidos los primeros meses, avanzamos mucho.",
            "A los 4 días de ser pareja, nos dimos el primer beso."
        ],
        choices: [
            {
                text: "Cerrar los ojos y besarla dramáticamente",
                action: () => {
                    state.ojoscerrados = true;
                    loadScene("escena9_ojos_cerrados");
                    puntos += 2;
                }
            },
            {
                text: "Darle un pico",
                action: () => {
                    state.ojoscerrados = false;
                    loadScene("escena9_pico");
                    puntos += 1;
                }
            }
        ]
    },
    escena9_ojos_cerrados: {
        lines: [
            "Ella tenía los ojos abiertos, fue algo vergonzoso.",
            "De nuevo, es algo que usa para molestarme cada vez que lo recuerda.",
            "Y a partir de ahí fuimos subiendo de nivel, incluso en Senati.",
            "Se debía a las ganas de experimentar que tenía ella. Y yo, no podía negarme a ello, me encantaba estar con ella.",
            "Pero quizá debimos mantener un equilibrio e ir paso a paso.",
            "Ya que, debido a ello, supimos que vemos las cosas de una manera muy distinta.",
            "Me hizo saber que ella esperaba que la relación fuera como ella lo imaginaba, lo cual... era un poco complicado para mí."
        ],
        next: "escena10"
    },
    escena9_pico: {
        lines: [
            "Después de todo era su primer beso, y no parecía dispuesta a cerrar los ojos.",
            "Con el tiempo, pudimos mejorar en la forma de darnos besos, más ella.",
            "Y a partir de ahí fuimos subiendo de nivel, incluso en Senati.",
            "Se debía a las ganas de experimentar que tenía ella. Y yo, no podía negarme a ello, me encantaba estar con ella.",
            "Pero quizá debimos mantener un equilibrio e ir paso a paso.",
            "Ya que, debido a ello, supimos que vemos las cosas de una manera muy distinta.",
            "Me hizo saber que ella esperaba que la relación fuera como ella lo imaginaba, lo cual... era un poco complicado para mí."
        ],
        next: "escena10"
    },
    escena10: {
        lines: [
            "En esos meses de relación, tuvimos muchas experiencias hermosas e inolvidables.",
            "Pero también, momentos de peleas, malas decisiones, hasta incluso llegamos a terminar 2 veces.",
            "Cada vez se hacía peor para ella. Mentirle a sus padres, el miedo a que la deje después de habernos casado.",
            "La presión de la congregación, posibles miradas, comentarios, soledad.",
            "Quería que todo valiera la pena al menos conmigo demostrando que la amo.",
            "Pero mi forma de demostrar amor no era lo que ella esperaba.",
            "A pesar de ello, insistía en seguir con ella, porque realmente la amaba, y no quería perderla por nada del mundo.",
            "Aunque se me diera mal, le daba detalles, no siempre, pero lo intentaba.",
            "...",
            "Como un medio de olvidarnos de los problemas, nos metimos a algo que quizá no debimos hacer aún.",
            "Fuimos muy apresurados. Nos metimos a un hotel.",
            "Comenzamos a ir más seguido, al final, ocurrió lo que tenía que ocurrir.",
            "Sus padres descubrieron que estábamos juntos debido a un chupetón en su cuello que no pudo ocultar.",
            "Nos alejamos por un tiempo, y volvimos a terminar."
        ],
        choices: () => {
            const porcentajecomp = ((puntos - minpuntos_antes) / (maxpuntos_antes - puntos))*100;  
            if (porcentajecomp > 60){
                return [
                    {
                        text: "Aceptarlo, pero...",
                        action: () => {
                            state.terminar = false;
                            loadScene("escena11_aceptar_pero");
                            puntos += 2;
                        }
                    }
                ];
            } else {
                return [
                     {
                        text: "Aceptarlo",
                        action: () => {
                            state.terminar = true;
                            loadScene("escena11_aceptar");
                            puntos += 1;
                        }
                     }
                ];
            }
        }
    },
    escena11_aceptar: {
        lines: [
            "Acepté que era lo mejor para ella, aunque me dolió mucho.",
            "Quería que pudiéramos seguir pero... algo en mí sentía que faltaban cosas por vivir.",
            "Me convencí de que ella estaba mejor sin mí.",
            "A partir de ese día, solo hablábamos como amigos, nos ayudábamos cuando podíamos, pero no era lo mismo.",
            "A pesar de todo, me alegro de haberla conocido, de haber vivido lo que vivimos, y de haberla amado.",
            "Adiós, Niurka."
        ],
        next: "finalnormal"
    },
    escena11_aceptar_pero: {
        lines: [
            "Acepté, pero no podía dejarlo ahí.",
            "Algo en mí hizo que recordara los momentos vividos.",
            "Conversaciones que me hicieron decidirme.",
            "Casarnos solucionaría una parte de los problemas, pero en nuestra situación, no podíamos.",
            "Por eso, después de clase, le pedí que hablemos.",
            "Le dije que está bien, que por ahora no seremos pareja, pero, que en 5 años, tendríamos que casarnos.",
            "Ella aceptó, y con un beso de despedida, cada uno fue a su hogar."
        ],
        next: "finalbueno"
    },
    finalmalo: {
        onEnter: () => playPlaylist(music.bad),
        lines: [
            "Mi vida en Senati fue muy complicada, he hecho las prácticas solo y mi tesis solo.",
            "Claro que recibía ayuda de ella, y yo también la ayudaba, pero esas eran las únicas interacciones.",
            "Muchas veces dejé de comer por no tener la manera de hacerlo, los horarios eran injustos.",
            "Adelgacé mucho, me sentía algo enfermo, pero debía seguir.",
            "Me pregunto si habrá habido alguna forma de poder estar con ella, no creo siquiera que me hubiera hecho caso.",
            "Pero bueno, de todas formas, me había prometido que no sentiría algo así de nuevo y que me concentraría en los estudios.",
            "Ahora empiezo la universidad, de nuevo.",
            "Y cada vez que voy camino a la universidad, llegan memorias que no son mías, de un mundo en el que sí fui feliz."
        ],
        onEnd: () => {
            finalType = "malo";
            showFinal();
        }
    },
    finalmalo_1: {
        onEnter: () => playPlaylist(music.bad),
        lines: [
            "Le mentí. Pero era mejor mantener los momentos con ella siendo su amigo y no nada más.",
            "De todas formas... me iba a rechazar, ¿no?",
            "...",
            "Después de nuestra tesis. Nos despedimos y prometimos mantener contacto.",
            "Se fue a Tingo María, así que en realidad, no muchas veces conversábamos.",
            "Por mi parte, yo empecé la universidad, preguntándome si mi decisión fue la mejor.",
            "Pero no se puede saber nada en este mundo. Y como sello para olvidarla, deseé que le fuera bien en su vida."
        ],
        onEnd: () => {
            finalType = "malo";
            showFinal();
        }
    },
    finalnormal: {
        onEnter: () => playPlaylist(music.neutral),
        lines: [
            "Empecé la universidad.",
            "Extrañaba mucho su presencia.",
            "Dejamos de hablar por unos meses, al final, es lo que yo le sugerí que hiciéramos cuando llegáramos a terminar.",
            "Pasaron unos años.",
            "Estaba titulado y buscando trabajo.",
            "Me aceptaron en una empresa para trabajar de contador en un restaurante.",
            "Lo que no esperaba es que...",
            "Era el restaurante de Niurka.",
            "Y cuando la volví a ver, no pude evitar llorar.",
            "Cuando me reconoció, fue directo hacia mí, me abrazó y me dijo que se alegraba de verme.",
            "Una nueva etapa comenzaba, y aunque no sabía qué pasaría, solo quería estar con ella."
        ],
        onEnd: () => {
            finalType = "neutral";
            showFinal();
        }
    },
    finalbueno: {
        lines: [
            "No fue una historia perfecta.",
            "Me repito, hubo peleas.",
            "Miedos.",
            "Culpa.",
            "Pero también hubo muchas cosas hermosas.",
            "Y aunque no fue fácil, fue contigo.",
            "Niurka, gracias por haberme dado la oportunidad de amarte y de vivir lo que vivimos.",
            "Soy muy feliz sabiendo que mi esposa serás tú, espero que nos vaya muy bien.",
            "Y aunque no sé qué nos deparará el futuro, solo quiero que sepas que te amo y que siempre te amaré."
        ],
        choices: () => {
            const porcentajecomp = ((puntos - minpuntos_despues) / (maxpuntos_despues - puntos))*100;
            if (porcentajecomp > 60 && state.primeraImpresion === "creida" && state.afrontar && state.aceptaSentimientos &&
                !state.respondiocumplido && state.foto && state.subioCarro && state.dijoQueSi && state.ojoscerrados && !state.terminar) {
                    return [
                        {
                            text: "Te amo",
                            action: () => {
                                finalperfecto();
                            }
                        }
                    ];
            } else {
                finalType = "malo";
                showFinal();
                return [];
            }
        }
    }
};

// ============= FUNCIONES =============
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function stopMusic() {
    Object.values(music).flat().forEach(track => {
        try {
            track.pause();
            track.currentTime = 0;
        } catch (e) {
        }
    });
}

function playPlaylist(list) {
    stopMusic();
    currentPlaylist = list;
    currentTrackIndex = 0;
    playCurrentTrack();
}

function playCurrentTrack() {
    if (!currentPlaylist || currentPlaylist.length === 0) {
        console.log("No hay playlist para reproducir");
        return;
    }
    if (currentTrackIndex >= currentPlaylist.length) {
        currentTrackIndex = 0;
    }
    const track = currentPlaylist[currentTrackIndex];
    if (!track) {
        console.error("Track no encontrado en índice:", currentTrackIndex);
        return;
    }
    console.log("Reproduciendo track:", currentTrackIndex, track.src);
    stopMusic();
    try {
        track.currentTime = 0;
        const playPromise = track.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Error al reproducir (autoplay bloqueado?):", error);
            });
        }
        track.onended = () => {
            currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
            playCurrentTrack();
        };
    } catch (e) {
        console.error("Error al reproducir:", e);
    }
}

function changeBackground(image) {
    currentBackground = image;
    bg.style.opacity = "0";
    setTimeout(() => {
        if (image) {
            bg.style.backgroundImage = `url("${image}")`;
        } else {
            bg.style.backgroundImage = "none";
        }
        bg.style.opacity = "1";
    }, 300);
}

function typeText(text) {
    clearInterval(typingInterval);
    vnText.textContent = "";
    isTyping = true;
    nextBtn.style.display = "none";
    let i = 0;
    typingInterval = setInterval(() => {
        vnText.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typingInterval);
            isTyping = false;
            nextBtn.style.display = "block";
            addToHistory(text);
        }
    }, 35);
}

function addToHistory(text) {
    textHistory.push(text);
    if (textHistory.length > MAX_HISTORY) {
        textHistory.shift();
    }
}

function loadScene(sceneId) {
    currentScene = scenes[sceneId];
    lineIndex = 0;
    vnChoices.style.display = "none";
    nextBtn.style.display = "block";
    if (currentScene.onEnter) currentScene.onEnter();
    showLine();
}

function showLine() {
    const line = currentScene.lines[lineIndex];
    if (!line) return;
    typeText(line);
    // Fondos específicos
    if (line === "Senati.") {
        changeBackground("senati.jpg");
    } else if (line === "Al llegar la noche, me llegó un mensaje." || line === "Comenzó a darme sueño, así que me quedé dormido."
        || line === "Regresé a casa pensando en que debería declararme correctamente, así que la cité en Senati."
        || line === "Al poco tiempo, nos casamos en roblox." || line === "En esos meses de relación, tuvimos muchas experiencias hermosas e inolvidables."
        || line === "Le mentí. Pero era mejor mantener los momentos con ella siendo su amigo y no nada más."
        || line === "Empecé la universidad." || line === "No fue una historia perfecta.") {
        changeBackground("fondonegro.jpg");
    } else if (line === "Llegó tercer ciclo." || line === "En lo posible, trataba de formar grupo con ella en trabajos."
        || line === "Nos alejamos por un tiempo, y volvimos a terminar.") {
        changeBackground("senati2.webp");
    } else if (line === "Noté que ella tomaba un carro hacia una dirección en la que yo podía dirigirme también.") {
        changeBackground("afuera.jpg");
    } else if (line === "Y comenzamos a hablar de más temas." || line === "Una vez, en el carro, después de un silencio, me preguntó si yo gustaba de ella.") {
        changeBackground("carro.png");
    } else if (line === "Una vez, antes de despedirnos en la entrada de Senati, me preguntó si yo gustaba de ella." 
        || line === "Y a partir de ahí fuimos subiendo de nivel, incluso en Senati.") {
        changeBackground("senati.jpg");
    } else if (line === "Y cuando llegamos al paradero, ella habló conmigo un poco más.") {
        changeBackground("paradero.jpg");
    } else if (line === "Seguí pasando tiempo con ella a pesar de que dijo que era mejor que disminuyamos eso."
        || line === "A pesar de ello, insistía en seguir con ella, porque realmente la amaba, y no quería perderla por nada del mundo.") {
        changeBackground(null);
    } else if (line === "Fuimos a comer a un chifa, y aún me da gracia lo que hice en ese momento.") {
        changeBackground("chifa.jpg");
    } else if (line === "Luego nos fuimos a un parque y nos sentamos en una banca.") {
        changeBackground("plaza.jpg");
    } else if (line === "A los 4 días de ser pareja, nos dimos el primer beso.") {
        changeBackground("parque.png");
    } else if (line === "Como un medio de olvidarnos de los problemas, nos metimos a algo que quizá no debimos hacer aún.") {
        changeBackground("hotel.png");
    }
    if (line === "Al poco tiempo, nos casamos en roblox.") {
        showSpecialImage();
    }
    if (currentScene.choices && lineIndex === currentScene.lines.length - 1) {
        nextBtn.style.display = "none";
    }
}

function showChoices(choices) {
    vnChoices.innerHTML = "";
    vnChoices.style.display = "flex";
    const resolvedChoices = typeof choices === "function" ? choices() : choices;
    resolvedChoices.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt.text;
        btn.addEventListener("mouseenter", () => {
            playSound(choiceSounds.hover);
        });
        btn.addEventListener("click", () => {
            playSound(choiceSounds.click);
            opt.action();
            vnChoices.style.display = "none";
        });
        vnChoices.appendChild(btn);
    });
}

function proceed() {
    if (lineIndex < currentScene.lines.length) {
        showLine();
    } else if (currentScene.choices) {
        showChoices(currentScene.choices);
    } else if (currentScene.next) {
        loadScene(currentScene.next);
    } else if (currentScene.onEnd) {
        currentScene.onEnd();
    }
}

function startVN() {
    textHistory = [];
    loadScene("escena1");
}

function startGame() {
    imageContainer.classList.add("flip");
    setTimeout(() => {
        whiteTransition.classList.add("active");
    }, 1000);
    setTimeout(() => {
        game.style.display = "none";
        vn.style.display = "block";
        whiteTransition.classList.remove("active");
        startVN();
    }, 1500);
}

function tomarFoto(callback) {
    nextBtn.style.display = "none";
    vnChoices.style.display = "none";
    cameraFlash.classList.add("active");
    cameraSound.currentTime = 0;
    cameraSound.play();
    setTimeout(() => {
        photoReveal.classList.add("show");
    }, 300);
    setTimeout(() => {
        photoReveal.classList.remove("show");
        cameraFlash.classList.remove("active");
        nextBtn.style.display = "block";
        callback();
    }, 3000);
}

function showSpecialImage() {
    specialImage.classList.add("visible");
    specialImageActive = true;
}

function hideSpecialImage(callback) {
    specialImage.classList.remove("visible");
    setTimeout(() => {
        specialImageActive = false;
        if (callback) callback();
    }, 800);
}

function showFinal() {
    finalScreen.classList.remove("hidden");
    finalPerfectoText.innerHTML = "";
    let subtitleText = "";
    let subtitleClass = "";
    switch (finalType) {
        case "malo":
            subtitleText = "final malo";
            subtitleClass = "final-malo";
            break;
        case "neutral":
            subtitleText = "final neutral";
            subtitleClass = "final-neutral";
            break;
        case "bueno":
            subtitleText = "final bueno";
            subtitleClass = "final-bueno";
            break;
    }
    finalPerfectoText.innerHTML = `
        <div class="fade-in wave">FIN</div>
        <div class="fade-in ${subtitleClass}" style="margin-top: 20px; font-size: 1.4rem;">
            ${subtitleText}
        </div>
    `;
    let clickeado = false;
    finalScreen.addEventListener("click", function onClick() {
        if (clickeado) return;
        clickeado = true;
        finalScreen.removeEventListener("click", onClick);
        location.reload();
    });
}

function finalperfecto() {
    playPlaylist(music.perfect);
    vn.style.display = "none";
    vnChoices.style.display = "none";
    nextBtn.style.display = "none";
    finalScreen.classList.remove("hidden");
    const frases = [
        "Hola Niurka.",
        "Felicidades por desbloquear este final.",
        "Espero que te haya gustado y lo siento si no sientes bien los otros finales.",
        "Pero lo que quería transmitir con esto es que:",
        "A pesar de todo lo que hemos pasado, nuestro amor sigue vigente.",
        "Aunque tengamos discrepancias, seguimos queriendo estar con el otro.",
        "Lo nuestro perdurará, no importa qué.",
        "Pero claro, debemos ser fuertes para mantenerlo así.",
        "Te amo tanto, haremos lo mejor para que podamos llegar a estar juntos en lo que yo estoy en la universidad.",
        "Muchas gracias por todo hasta hora. Me haces muy feliz.",
        "Con amor, Manuel, tu caramelito. ❤️"
    ];
    let index = 0;
    let terminado = false;
    let clickeado = false;
    function mostrarFrase() {
        if (index < frases.length) {
            const texto = frases[index];
            finalPerfectoText.innerHTML = "";
            finalPerfectoText.className = "wave fade-in";
            texto.split("").forEach((char, i) => {
                const span = document.createElement("span");
                span.textContent = char === " " ? "\u00A0" : char;
                span.style.animationDelay = `${i * 0.06}s`;
                finalPerfectoText.appendChild(span);
            });
            setTimeout(() => {
                finalPerfectoText.classList.remove("fade-in");
                finalPerfectoText.classList.add("fade-out");
            }, 3000);
            setTimeout(() => {
                finalPerfectoText.classList.remove("fade-out");
                index++;
                mostrarFrase();
            }, 5000);
        } else {
            terminado = true;
            finalPerfectoText.innerHTML = "";
            finalPerfectoText.className = "";
            const finDiv = document.createElement("div");
            finDiv.className = "fade-in wave";
            finDiv.style.fontSize = "3rem";
            finDiv.style.marginBottom = "20px";
            "FIN".split("").forEach((char, i) => {
                const span = document.createElement("span");
                span.textContent = char;
                span.style.animationDelay = `${i * 0.15}s`;
                finDiv.appendChild(span);
            });
            finalPerfectoText.appendChild(finDiv);
            const perfectoDiv = document.createElement("div");
            perfectoDiv.className = "fade-in";
            perfectoDiv.style.marginTop = "20px";
            perfectoDiv.style.fontSize = "1.5rem";
            perfectoDiv.style.color = "#f1c40f";
            perfectoDiv.textContent = "final perfecto";
            finalPerfectoText.appendChild(perfectoDiv);
        }
    }
    finalScreen.removeEventListener("click", finalScreen.click);
    finalScreen.addEventListener("click", function onClick(e) {
        if (clickeado) return;
        if (terminado) {
            clickeado = true;
            finalScreen.removeEventListener("click", onClick);
            location.reload();
        }
    });
    mostrarFrase();
}

function mostrarFinPerfecto(callback) {
    finalPerfectoText.innerHTML = "";
    const fin = "FIN";
    [...fin].forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.animationDelay = `${i * 0.15}s`;
        finalPerfectoText.appendChild(span);
    });
    const br = document.createElement("br");
    finalPerfectoText.appendChild(br);
    const sub = document.createElement("span");
    sub.textContent = "final perfecto";
    sub.style.display = "block";
    sub.style.marginTop = "20px";
    sub.style.fontSize = "1.5rem";
    sub.style.color = "#f1c40f";
    finalPerfectoText.appendChild(sub);
    finalPerfectoText.className = "wave fade-in";
    setTimeout(() => {
        if (callback) callback();
    }, 5000);
}

function animarInicio() {
    const content = document.querySelector(".content-container");
    const image = document.querySelector(".image-container");
    const title = document.getElementById("title");
    const subtitle = document.querySelector(".subtitle");
    const paragraphs = document.querySelectorAll("#text p");
    const button = document.querySelector("#choices button");
    
    game.classList.add("start-hidden");
    [content, image, title, subtitle, button, ...paragraphs].forEach(el => {
        if (el) el.className = el.className;
    });
    
    setTimeout(() => { if (content) content.classList.add("slide-left"); }, 200);
    setTimeout(() => { if (image) image.classList.add("slide-right"); }, 600);
    setTimeout(() => { if (title) title.classList.add("slide-up"); }, 1200);
    setTimeout(() => { if (subtitle) subtitle.classList.add("fade-in"); }, 1700);
    
    paragraphs.forEach((p, i) => {
        setTimeout(() => { if (p) p.classList.add("fade-in"); }, 2200 + i * 400);
    });
    
    setTimeout(() => {
        if (button) button.classList.add("slide-up");
        game.classList.remove("start-hidden");
    }, 3000);
}

function openHistory() {
    historyList.innerHTML = "";
    textHistory.forEach(text => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.textContent = text;
        historyList.appendChild(div);
    });
    setTimeout(() => {
        historyList.scrollTop = historyList.scrollHeight;
    }, 50);
    historyScreen.classList.remove("hidden");
}

function closeHistory() {
    historyScreen.classList.add("hidden");
}

function openSaves(mode) {
    savesMode = mode;
    console.log("Abriendo guardados en modo:", mode);
    loadSavesUI();
    savesScreen.classList.remove("hidden");
}

function closeSaves() {
    console.log("Cerrando pantalla de guardados");
    savesScreen.classList.add("hidden");
    savesMode = "save";
}

function captureVN() {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext("2d");
    return new Promise((resolve) => {
        if (currentBackground) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = currentBackground;
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                drawTextBox(ctx, canvas.width, canvas.height);
                drawChoices(ctx, canvas.width, canvas.height); // <-- DIBUJAR OPCIONES
                resolve(canvas.toDataURL("image/jpeg", 0.7));
            };
            img.onerror = function() {
                drawGradientBackground(ctx, canvas.width, canvas.height);
                drawTextBox(ctx, canvas.width, canvas.height);
                drawChoices(ctx, canvas.width, canvas.height); // <-- DIBUJAR OPCIONES
                resolve(canvas.toDataURL("image/jpeg", 0.7));
            };
        } else {
            drawGradientBackground(ctx, canvas.width, canvas.height);
            drawTextBox(ctx, canvas.width, canvas.height);
            drawChoices(ctx, canvas.width, canvas.height); // <-- DIBUJAR OPCIONES
            resolve(canvas.toDataURL("image/jpeg", 0.7));
        }
    });
}

function drawGradientBackground(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#6a0572");
    gradient.addColorStop(0.5, "#ab83a1");
    gradient.addColorStop(1, "#f7b2cc");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function drawChoices(ctx, width, height) {
    if (vnChoices && vnChoices.style.display === "flex") {
        const buttons = vnChoices.querySelectorAll('button');
        if (buttons.length > 0) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, width, height);
            const startY = height / 2 - ((buttons.length * 60) - 20) / 2;
            buttons.forEach((btn, index) => {
                const btnY = startY + (index * 60);
                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 4;
                ctx.fillStyle = "linear-gradient(135deg, #d63384, #a61e4d)";
                const gradient = ctx.createLinearGradient(0, btnY, 0, btnY + 50);
                gradient.addColorStop(0, "#d63384");
                gradient.addColorStop(1, "#a61e4d");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(width/2 - 160, btnY, 320, 50, 25);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
                ctx.fillStyle = "#ffffff";
                ctx.font = "18px 'Raleway', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                let buttonText = btn.textContent || "Opción";
                if (buttonText.length > 30) {
                    buttonText = buttonText.slice(0, 27) + "...";
                }
                ctx.fillText(buttonText, width/2, btnY + 25);
                ctx.textAlign = "left";
            });
        }
    }
}

function drawTextBox(ctx, width, height) {
    ctx.fillStyle = "rgba(255, 245, 250, 0.95)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(50, 300, 700, 100, 20);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = "#4a2a40";
    ctx.font = "18px 'Raleway', sans-serif";
    const text = vnText ? vnText.textContent.slice(0, 80) : "No fue fácil. Pero fue contigo.";
    ctx.fillText(text || "No fue fácil. Pero fue contigo.", 70, 350);
}

function getCurrentSaveData() {
    const sceneId = Object.keys(scenes).find(k => scenes[k] === currentScene);
    return {
        sceneId: sceneId,
        lineIndex: lineIndex,
        text: vnText ? vnText.textContent : "",
        background: currentBackground,
        playlist: currentPlaylist,
        trackIndex: currentTrackIndex,
        screenshot: captureVN(),
        timestamp: Date.now()
    };
}

async function saveGame(slot) {
    console.log("=== GUARDANDO EN SLOT", slot, "===");
    if (!currentScene) {
        console.error("❌ No hay escena actual");
        return;
    }
    if (isTyping) {
        clearInterval(typingInterval);
        isTyping = false;
        if (currentScene && currentScene.lines && currentScene.lines[lineIndex]) {
            vnText.textContent = currentScene.lines[lineIndex];
        }
        nextBtn.style.display = "block";
    }
    const sceneId = Object.keys(scenes).find(k => scenes[k] === currentScene);
    let playlistId = null;
    if (currentPlaylist === music.main) playlistId = "main";
    else if (currentPlaylist === music.bad) playlistId = "bad";
    else if (currentPlaylist === music.neutral) playlistId = "neutral";
    else if (currentPlaylist === music.perfect) playlistId = "perfect";
    const choicesVisible = vnChoices ? vnChoices.style.display === "flex" : false;
    const screenshot = await captureVN();
    const data = {
        sceneId: sceneId,
        lineIndex: lineIndex,
        text: vnText ? vnText.textContent : "",
        background: currentBackground,
        playlistId: playlistId,
        trackIndex: currentTrackIndex,
        screenshot: screenshot,
        timestamp: Date.now(),
        choicesVisible: choicesVisible,
        state: { ...state },
        puntos: puntos,
        history: [...textHistory]
    };
    try {
        localStorage.setItem("save_" + slot, JSON.stringify(data));
        console.log("✅ Guardado exitoso en slot:", slot);
        loadSavesUI();
    } catch (e) {
        console.error("❌ Error al guardar:", e);
    }
}

function loadGame(slot) {
    console.log("=== CARGANDO SLOT", slot, "===");
    const data = JSON.parse(localStorage.getItem("save_" + slot));
    if (!data) {
        console.error("No hay datos en el slot", slot);
        return;
    }
    savesScreen.classList.add("hidden");
    clearInterval(typingInterval);
    isTyping = false;
    typingInterval = null;
    specialImageActive = false;
    stopMusic();
    if (data.history && Array.isArray(data.history)) {
        textHistory = [...data.history];
    } else {
        textHistory = [];
    }
    vn.style.display = "block";
    game.style.display = "none";
    if (data.state) {
        state = { ...data.state };
    }
    if (data.puntos !== undefined) {
        puntos = data.puntos;
        console.log("Puntos restaurados:", puntos);
    } else {
        puntos = 0;
    }
    if (data.sceneId && scenes[data.sceneId]) {
        currentScene = scenes[data.sceneId];
        lineIndex = data.lineIndex || 0;
        if (vnText) {
            vnText.textContent = data.text || "";
        }
        nextBtn.style.display = "block";
        if (data.background) {
            changeBackground(data.background);
        } else {
            changeBackground(null);
        }
        if (data.playlistId) {
            currentPlaylist = music[data.playlistId] || [];
            currentTrackIndex = data.trackIndex || 0;
            if (currentPlaylist.length > 0) {
                setTimeout(() => playCurrentTrack(), 100);
            }
        }
        if (data.choicesVisible) {
            if (currentScene.choices) {
                showChoices(currentScene.choices);
            }
        } else {
            vnChoices.style.display = "none";
        }
        console.log("✅ Juego cargado correctamente");
    }
}

function loadSavesUI() {
    console.log("Cargando UI de guardados");
    const slots = document.querySelectorAll(".save-slot");
    slots.forEach(slot => {
        const i = slot.dataset.slot;
        const data = localStorage.getItem("save_" + i);
        slot.innerHTML = "";
        slot.classList.remove("disabled", "empty");
        slot.removeAttribute("style");
        if (!data) {
            slot.classList.add("empty");
            const emptyText = document.createElement("span");
            emptyText.textContent = "Vacío";
            emptyText.style.color = "white";
            emptyText.style.display = "flex";
            emptyText.style.justifyContent = "center";
            emptyText.style.alignItems = "center";
            emptyText.style.width = "100%";
            emptyText.style.height = "100%";
            emptyText.style.fontFamily = "'Raleway', sans-serif";
            slot.appendChild(emptyText);
            if (savesMode === "load") {
                slot.classList.add("disabled");
            }
        } else {
            try {
                const parsed = JSON.parse(data);
                const img = document.createElement("img");
                img.src = parsed.screenshot || "";
                img.alt = "Save " + i;
                slot.appendChild(img);
                slot.classList.remove("disabled");
            } catch (e) {
                console.error("Error al cargar slot", i, e);
            }
        }
    });
}

function handleSlotClick(e) {
    e.stopPropagation();
    const slot = e.currentTarget;
    const i = slot.dataset.slot;
    if (slot.classList.contains('disabled')) {
        console.log(`Slot ${i} deshabilitado, ignorando click`);
        return;
    }
    console.log("✅ Click detectado en slot:", i, "Modo:", savesMode);
    if (savesMode === "save") {
        if (!currentScene) {
            console.error("❌ No hay escena actual");
            return;
        }
        saveGame(i);
    } else if (savesMode === "load") {
        const saveData = localStorage.getItem("save_" + i);
        if (!saveData) {
            console.log("Slot vacío, no se puede cargar");
            return;
        }
        closeSaves();
        setTimeout(() => {
            loadGame(i);
        }, 50);
    }
}

// ============= INICIALIZACIÓN =============
document.addEventListener('DOMContentLoaded', function() {
    vn = document.getElementById("vn");
    vnText = document.getElementById("vnText");
    nextBtn = document.getElementById("nextBtn");
    vnChoices = document.getElementById("vnChoices");
    bg = document.querySelector(".vn-background");
    startBtn = document.getElementById("startBtn");
    historyBtn = document.getElementById("historyBtn");
    saveBtn = document.getElementById("saveBtn");
    loadBtn = document.getElementById("loadBtn");
    historyScreen = document.getElementById("historyScreen");
    historyList = document.getElementById("historyList");
    savesScreen = document.getElementById("savesScreen");
    cameraFlash = document.getElementById("cameraFlash");
    photoReveal = document.getElementById("photoReveal");
    cameraSound = document.getElementById("cameraSound");
    specialImage = document.getElementById("specialImage");
    finalScreen = document.getElementById("finalScreen");
    finalPerfectoText = document.getElementById("finalPerfectoText");
    game = document.getElementById("game");
    whiteTransition = document.getElementById("whiteTransition");
    imageContainer = document.getElementById("imageContainer");
    
    // Event Listeners
    if (startBtn) {
        startBtn.addEventListener("mouseenter", () => playSound(uiSounds.hover));
        startBtn.addEventListener("click", () => {
            playSound(uiSounds.click_comenzar);
            startGame();
            playPlaylist(music.main);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener("mouseenter", () => playSound(uiSounds.hover));
        nextBtn.addEventListener("click", () => {
            playSound(uiSounds.click_siguiente);
            if (isTyping) {
                clearInterval(typingInterval);
                vnText.textContent = currentScene.lines[lineIndex];
                isTyping = false;
                nextBtn.style.display = "block";
                return;
            }
            if (specialImageActive) {
                hideSpecialImage(() => {
                    lineIndex++;
                    proceed();
                });
                return;
            }
            lineIndex++;
            proceed();
        });
    }
    
    if (historyBtn) historyBtn.addEventListener("click", openHistory);
    if (saveBtn) saveBtn.addEventListener("click", () => openSaves("save"));
    if (loadBtn) loadBtn.addEventListener("click", () => openSaves("load"));
    
    const historyClose = document.querySelector(".history-close");
    if (historyClose) historyClose.addEventListener("click", closeHistory);
    
    const closeSavesBtn = document.getElementById("closeSaves");
    if (closeSavesBtn) {
        closeSavesBtn.onclick = function(e) {
            e.stopPropagation();
            closeSaves();
        };
    }
    
    // Setup slots de guardado
    function asignarListenersSlots() {
        const slots = document.querySelectorAll(".save-slot");
        console.log("Asignando listeners a", slots.length, "slots (permanente)");
        
        slots.forEach(slot => {
            // Remover listener viejo (por si acaso)
            slot.removeEventListener("click", handleSlotClick);
            // Agregar listener nuevo
            slot.addEventListener("click", handleSlotClick);
        });
    }
    asignarListenersSlots();
    
    // Observer para slots dinámicos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Buscar si se agregaron nuevos slots
                const nuevosSlots = document.querySelectorAll(".save-slot");
                nuevosSlots.forEach(slot => {
                    slot.removeEventListener("click", handleSlotClick);
                    slot.addEventListener("click", handleSlotClick);
                });
            }
        });
    });
    
    if (savesScreen) {
        observer.observe(savesScreen, { childList: true, subtree: true });
    }

    function debugEstado() {
        console.log("========== ESTADO ACTUAL ==========");
        console.log("📍 PUNTOS:", puntos);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🎯 state.primeraImpresion:", state.primeraImpresion);
        console.log("🎯 state.afrontar:", state.afrontar);
        console.log("🎯 state.respondiocumplido:", state.respondiocumplido);
        console.log("🎯 state.aceptaSentimientos:", state.aceptaSentimientos);
        console.log("🎯 state.foto:", state.foto);
        console.log("🎯 state.subioCarro:", state.subioCarro);
        console.log("🎯 state.dijoQueSi:", state.dijoQueSi);
        console.log("🎯 state.ojoscerrados:", state.ojoscerrados);
        console.log("🎯 state.terminar:", state.terminar);
        console.log("🎯 state.preguntaQueSon:", state.preguntaQueSon);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📊 Resumen:");
        console.log("   - Primera impresión:", state.primeraImpresion || "❌ no definido");
        console.log("   - Afrontó:", state.afrontar !== null ? (state.afrontar ? "✅ sí" : "❌ no") : "⏳ pendiente");
        console.log("   - Respondió cumplido:", state.respondiocumplido !== null ? (state.respondiocumplido ? "✅ sí" : "❌ no") : "⏳ pendiente");
        console.log("   - Aceptó sentimientos:", state.aceptaSentimientos !== null ? (state.aceptaSentimientos ? "✅ sí" : "❌ no") : "⏳ pendiente");
        console.log("   - Tomó foto:", state.foto !== null ? (state.foto ? "✅ sí" : "❌ no") : "⏳ pendiente");
        console.log("   - Subió al carro:", state.subioCarro !== null ? (state.subioCarro ? "✅ sí" : "❌ no") : "⏳ pendiente");
        console.log("   - Dijo que sí:", state.dijoQueSi !== null ? (state.dijoQueSi ? "✅ sí" : "❌ no") : "⏳ pendiente");
        console.log("   - Ojos cerrados:", state.ojoscerrados !== null ? (state.ojoscerrados ? "✅ sí" : "❌ no") : "⏳ pendiente");
        console.log("   - Terminar:", state.terminar !== null ? (state.terminar ? "✅ sí" : "❌ no") : "⏳ pendiente");
        console.log("   - Pregunta qué son:", state.preguntaQueSon !== null ? (state.preguntaQueSon ? "✅ sí" : "❌ no") : "⏳ pendiente");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🎲 TOTAL PUNTOS:", puntos);
        console.log("======================================");
    }
    
    // Iniciar animación
    animarInicio();
    debugEstado();
});