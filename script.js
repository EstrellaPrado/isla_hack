/* ============================================================
   ISLA HACK — Lógica completa del juego
   ============================================================ */

// ============ CONSTANTES ============
const NUM_CASILLAS = 48;
const CASILLAS_POR_ZONA = 6;
const FILAS = 6, COLUMNAS = 8;
const TIEMPO_OBSERVAR = 20;
const TIEMPO_RETO = 60;
const CODIGO_FINAL = "37418256";
const INTERFERENCIA = new Set([5, 17, 28]);
const PISTA_FALSA = new Set([11, 23, 35]);

const SAVE_KEY = "isla_hack_partida";

const COLORES_JUGADOR = ["--jugador-1", "--jugador-2", "--jugador-3", "--jugador-4"]
  .map(nombre => getComputedStyle(document.documentElement).getPropertyValue(nombre).trim());
const COLORES_SUBRED = Array.from({ length: 8 }, (_, i) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--subred-${i + 1}`).trim()
);
const TINTA_SUBRED = getComputedStyle(document.documentElement).getPropertyValue("--tinta-primaria").trim();

const ZONAS = [
  { nombre: "Playa", habilidad: "Observación", color: COLORES_SUBRED[0], fg: TINTA_SUBRED, digito: "3", icono: "O", pista: "Es el número de lados de un triángulo." },
  { nombre: "Selva", habilidad: "Descripción", color: COLORES_SUBRED[1], fg: TINTA_SUBRED, digito: "7", icono: "D", pista: "Es el número de días de la semana." },
  { nombre: "Ruinas", habilidad: "Comparación y relación", color: COLORES_SUBRED[2], fg: TINTA_SUBRED, digito: "4", icono: "R", pista: "Es el número de estaciones del año." },
  { nombre: "Campamento", habilidad: "Clasificación", color: COLORES_SUBRED[3], fg: TINTA_SUBRED, digito: "1", icono: "C", pista: "Es el número de lunas naturales que tiene la Tierra." },
  { nombre: "Sala de servidores", habilidad: "Análisis", color: COLORES_SUBRED[4], fg: TINTA_SUBRED, digito: "8", icono: "A", pista: "Es el número de bits que forman un byte." },
  { nombre: "Torre de señal", habilidad: "Síntesis", color: COLORES_SUBRED[5], fg: TINTA_SUBRED, digito: "2", icono: "S", pista: "Es el número de estados que puede tener un bit (0 y 1)." },
  { nombre: "Consola de seguridad", habilidad: "Evaluación", color: COLORES_SUBRED[6], fg: TINTA_SUBRED, digito: "5", icono: "E", pista: "Es el número de dedos de una mano." },
  { nombre: "Núcleo del laboratorio", habilidad: "Pensamiento crítico y falacias", color: COLORES_SUBRED[7], fg: TINTA_SUBRED, digito: "6", icono: "N", pista: "Es el número de caras de un dado." },
];

// ============ TARJETAS ============
function mc(q, correcta, incorrectas, exp = "", ver = null) {
  return { tipo: "mc", q, opts: [correcta, ...incorrectas], exp: exp || `La respuesta correcta era: ${correcta}`, ver };
}
function ab(q, crit) {
  return { tipo: "abierta", q, crit, ver: null };
}
function obs(escena, q, correcta, incorrectas) {
  return mc(q, correcta, incorrectas, "", escena);
}

const FAL_INTRO = "¿Qué error de razonamiento (falacia) contiene este argumento?\n\n";
const F_PERSONA = "Ataque a la persona";
const F_GENERAL = "Generalización apresurada";
const F_DILEMA = "Falso dilema";
const F_MAYORIA = "Apelación a la mayoría";
const F_CAUSA = "Falsa causa";
const F_PENDIENTE = "Pendiente resbaladiza";
const F_AUTORIDAD = "Apelación a una autoridad no experta";

const MAZOS = [
  // 1. PLAYA
  [
    obs("Sobre la arena hay 3 conchas, 2 botellas verdes, 1 red rota y 1 bota izquierda.", "¿Cuántas botellas verdes había?", "2", ["1", "3"]),
    obs("Un cangrejo rojo camina hacia la derecha junto a una palmera inclinada y una caja de madera cerrada con candado.", "¿Hacia dónde caminaba el cangrejo?", "Hacia la derecha", ["Hacia la izquierda", "Hacia el mar"]),
    obs("En la caja de madera hay una etiqueta azul con el número 47 y un dibujo de una llave.", "¿Qué número tenía la etiqueta?", "47", ["74", "41"]),
    obs("La bandera del campamento abandonado es amarilla con una franja negra en el centro.", "¿De qué color era la franja central?", "Negra", ["Roja", "Azul"]),
    mc("Según el Capítulo 1, la técnica de los lugares para memorizar algo consiste en...", "Asignar una distribución espacial conocida a los elementos que se desean memorizar.", ["Repetir la información en voz alta una sola vez.", "Memorizar únicamente con números, sin ninguna imagen."], "El Capítulo 1 explica que, al asignar un lugar conocido a cada elemento, el aprendizaje se facilita."),
    mc("Según el Capítulo 1, olvidar es...", "Necesario y beneficioso, ya que no podríamos imaginar recordar cada minuto y detalle de nuestra existencia.", ["Siempre señal de una enfermedad grave.", "Algo que nunca le ocurre a las personas sanas."], "El Capítulo 1 señala que la relación entre memoria y olvido es incuestionable, y que olvidar no es malo."),
    mc("Según el Capítulo 6, ¿cuál de estas SÍ es un principio básico para realizar una observación?", "Debe tener un propósito específico y planearse cuidadosa y sistemáticamente.", ["Debe basarse únicamente en la intuición del observador.", "No es necesario llevar un control por escrito."], "El Capítulo 6 señala 5 principios: propósito específico, planeación cuidadosa, control por escrito, duración y frecuencia definidas, y confiabilidad y validez."),
    mc("Según el Capítulo 6, la observación es...", "Un método clásico de investigación científica y la manera básica de obtener información del mundo que nos rodea.", ["Un esquema de pensamiento para emitir juicios de valor.", "Una síntesis de las características esenciales de un objeto."], "Así abre el Capítulo 6: la observación se utiliza para recolectar los datos necesarios para un estudio."),
    mc("Según la Unidad 2, la observación es el proceso mental que sirve para...", "Identificar cosas, objetos o situaciones, captando sus características.", ["Emitir juicios de valor justificados sobre hechos.", "Integrar partes sueltas en una totalidad nueva."], "La Unidad 2 la define como el proceso de identificación de cosas, objetos o situaciones, para captar sus características."),
    mc("¿Qué principio de la observación indica que debe especificarse cuánto dura y con qué frecuencia se repite?", "Debe especificarse su duración y frecuencia.", ["Debe seguir los principios de confiabilidad y validez.", "Debe llevarse por escrito un control cuidadoso."]),
  ],
  // 2. SELVA
  [
    ab("Describe un árbol de la selva (por ejemplo una palmera) mencionando al menos 3 características.", "Vale mencionar altura o forma, tronco, hojas, color, textura o ubicación. Debes dar al menos 3 características y presentarlas con orden, por ejemplo de abajo hacia arriba."),
    ab("Describe el lugar donde estás ahora mismo mencionando al menos 3 elementos y su ubicación.", "Debes nombrar al menos 3 elementos del lugar y decir dónde están o cómo son. La descripción debe ser ordenada, de un lado a otro o de cerca a lejos."),
    ab("Describe a un compañero del equipo sin decir su nombre, con al menos 3 rasgos, para que los demás lo adivinen.", "Debes dar al menos 3 rasgos, físicos, de ropa o de forma de ser, sin mencionar el nombre. Una buena descripción permite que otros lo reconozcan."),
    ab("Describe un celular sin nombrarlo, su forma, sus partes y para qué sirve, con mínimo 3 datos.", "Debe incluir al menos 3 datos entre forma, tamaño, partes como pantalla, cámara o botones, y utilidad. Se espera orden y detalle."),
    ab("Describe cómo se ve y se escucha una tormenta tropical en la isla, con al menos 3 detalles sensoriales.", "Debes dar al menos 3 detalles sensoriales, como colores del cielo, sonido del viento o los truenos, o movimiento de palmeras y olas, presentados con orden."),
    mc("¿Cuál de estas frases es una descripción?", "El árbol es alto, de tronco grueso y con hojas verdes en la copa.", ["Ese árbol es horrible.", "Los árboles son mejores que las flores."], "Describir es explicar de forma detallada y ordenada cómo es algo. Las otras opciones son opiniones o juicios."),
    mc("Según el Capítulo 6, describir significa...", "Representar algo a través de la palabra, mediante la explicación de sus diversas partes, cualidades o circunstancias.", ["Decir si algo es bueno o malo.", "Separar un todo en partes para estudiar sus relaciones."], "Así lo define el Capítulo 6. Separar un todo en partes es analizar."),
    mc("Según la Unidad 2, la descripción es...", "La comunicación de lo observado.", ["Un juicio de valor justificado sobre un hecho.", "Una suposición provisional sobre la realidad."], "La Unidad 2 vincula ambas habilidades: observación y descripción, siendo esta última la comunicación de lo observado."),
    mc("¿Cuál descripción de un laboratorio es más detallada y ordenada?", "Es un cuarto grande con mesas metálicas al centro, tubos de ensayo en el estante de la derecha y una computadora apagada al fondo.", ["Es un lugar raro.", "Ahí trabajan científicos."]),
    mc("Para describir un objeto, de forma detallada y ordenada, conviene mencionar...", "Sus partes, cualidades y circunstancias.", ["Solo su precio.", "Solo quién lo inventó."]),
  ],
  // 3. RUINAS
  [
    mc("Según el Capítulo 1, en la analogía de la computadora, ¿qué representa el hardware (el CPU)?", "La inteligencia.", ["El pensamiento.", "La memoria a corto plazo."], "El Capítulo 1 compara el hardware con la inteligencia y el software, los programas, con el pensamiento. Ninguno funciona completo sin el otro."),
    mc("¿Cuál oración es una comparación, es decir, vincula dos términos con una semejanza?", "Su mirada era rápida como el rayo.", ["Por ejemplo, el hierro es un metal.", "Mañana lloverá."], "Según el Capítulo 6, la comparación une dos términos con una conexión gramatical que indica semejanza. La opción con 'por ejemplo' es un ejemplo, y jamás debe confundirse con una comparación."),
    mc("Un símbolo antiguo es un triángulo con un círculo dentro y otro es un triángulo con una línea dentro. ¿Qué tienen en común?", "Ambos tienen forma de triángulo.", ["Ambos tienen un círculo dentro.", "Ambos son cuadrados."]),
    ab("Compara el día con la noche, mencionando 2 semejanzas o 2 diferencias.", "Vale por ejemplo la diferencia de luz, de temperatura o de actividades. Como semejanza, ambos duran horas y forman parte del ciclo diario. Debes dar 2 puntos claros."),
    mc("Según la Unidad 2, la comparación es el proceso mental que establece...", "Diferencias y semejanzas entre las características de dos objetos o situaciones.", ["Categorías conceptuales para agrupar objetos.", "Juicios de valor justificados sobre hechos."], "La Unidad 2 define la comparación como el proceso mental que establece diferencias y semejanzas entre las características de dos objetos o situaciones."),
    mc("Según la Unidad 2, una variable es...", "Una dimensión de varias características que puede tomar valores cualitativos, cuantitativos o numéricos.", ["Un razonamiento que parece verdadero pero es falso.", "Un grupo de objetos que comparten características esenciales."], "La variable acompaña a la comparación: es la dimensión sobre la que se comparan los objetos o situaciones."),
    ab("Compara tu celular con una libreta, escribiendo 2 semejanzas y 1 diferencia.", "Semejanzas posibles: sirven para anotar, se llevan a todos lados, guardan información. Diferencia posible: el celular es electrónico y necesita batería. Debes dar 2 semejanzas y 1 diferencia."),
    mc("¿Qué relación hay entre 'semilla' y 'árbol'?", "La semilla es el origen a partir del cual puede crecer el árbol.", ["Son sinónimos.", "No tienen relación."]),
    mc("Según el Capítulo 6, comparación y relación van de la mano porque...", "Después de observar solemos comparar de manera casi automática, y de ahí surge la relación que notamos entre los objetos observados.", ["Son lo mismo que clasificar.", "Solo se usan en matemáticas."]),
    mc("¿Cuál opción es un ejemplo, y no una comparación?", "Un mamífero, por ejemplo, es el delfín.", ["Ella es fuerte como un roble.", "Tu voz es igual que una campana."], "El ejemplo solo verifica una noción general con un caso concreto. Las otras opciones comparan dos términos mediante una semejanza."),
  ],
  // 4. CAMPAMENTO
  [
    mc("Manzana, pera, plátano y zanahoria. ¿Cuál no pertenece al grupo de las frutas?", "Zanahoria", ["Pera", "Plátano"]),
    mc("Según el Capítulo 1, ¿qué tipo de inteligencia de Howard Gardner se relaciona con los números, fórmulas, símbolos y formas geométricas?", "Inteligencia lógico-matemática", ["Inteligencia naturista", "Inteligencia intrapersonal"], "El Capítulo 1 describe 8 tipos de inteligencia propuestos por Gardner en 1984."),
    mc("Según el Capítulo 1, ¿qué tipo de inteligencia se distingue por la mayor capacidad para comprender y relacionarse con los demás, trabajando bien en equipo?", "Inteligencia interpersonal", ["Inteligencia intrapersonal", "Inteligencia corporal cinestésica"], "El Capítulo 1 describe la inteligencia interpersonal como la de las personas que crean empatía y comprenden las emociones de los demás."),
    mc("¿Qué criterio agrupa a estos animales: delfín, ballena, perro y murciélago?", "Son mamíferos.", ["Viven en el agua.", "Vuelan."]),
    mc("Según el Capítulo 6, la clasificación es un proceso mental que...", "Establece categorías conceptuales y agrupa las cosas, objetos y situaciones según determinados criterios.", ["Solo memoriza datos sin ordenarlos.", "Solo compara dos objetos entre sí."]),
    mc("Según la Unidad 2, una clase es...", "Un grupo de objetos que comparten una o más características esenciales.", ["Un razonamiento con apariencia de verdadero pero falso.", "Una suposición provisional sobre la realidad."], "La Unidad 2 define clase como el grupo de objetos que comparten características esenciales, resultado del proceso de clasificación."),
    mc("Según el Capítulo 6, la división consiste en...", "Distribuir los elementos de un conjunto en cierto número de casilleros, sin relación sistemática entre ellos.", ["Emitir un juicio de valor justificado.", "Integrar partes en un todo nuevo."], "La división es, según el Capítulo 6, la forma más elemental de clasificación."),
    mc("Según el Capítulo 6, un concepto es...", "Una síntesis en que se expresan las características esenciales de procesos, seres, cosas u objetos.", ["Una opinión personal sobre algo.", "Una lista de ejemplos sin orden."]),
    mc("Según el Capítulo 7, ¿qué tipo de creatividad se relaciona con formas, colores, texturas y volúmenes en las artes visuales?", "Plástica", ["Fluente", "Científica"], "El Capítulo 7 describe la creatividad plástica como propia de la arquitectura, la escultura y la pintura."),
    ab("Clasifica en 2 grupos y explica tu criterio: gato, tiburón, águila, delfín, perro, gaviota.", "Cualquier criterio válido que incluya a todos los elementos. Ejemplos: mamíferos (gato, delfín, perro) y no mamíferos (tiburón, águila, gaviota), o terrestres, acuáticos y voladores."),
  ],
  // 5. SERVIDORES
  [
    mc("Según el Capítulo 6, analizar es...", "Separar, real o figuradamente, un todo en sus partes, para el estudio de estas y de las relaciones que entre ellas existen.", ["Integrar partes en una totalidad nueva y significativa.", "Emitir juicios de valor sin justificarlos."]),
    mc("Un correo electrónico contiene remitente, asunto, cuerpo y archivos adjuntos. Esto es un ejemplo de...", "Análisis de un todo en sus partes.", ["Síntesis.", "Evaluación."]),
    mc("La red no carga. ¿Cuál es la mejor forma de analizar el problema?", "Dividirlo en partes, como conexión, router, equipo y página, y revisarlas una por una.", ["Apagar todo y olvidarse.", "Culpar a alguien del equipo."]),
    mc("Cada letra de un mensaje fue reemplazada por la siguiente del abecedario, la A se volvió B. ¿Qué palabra original es 'IPMB'?", "HOLA", ["HALO", "LOBA"], "H pasó a I, O a P, L a M y A a B. Por eso IPMB era HOLA."),
    mc("Según el Capítulo 3, los métodos analíticos de enseñanza se basan en...", "La división y la clasificación.", ["La aplicación, comprobación y demostración.", "La conclusión, creación o diseño."], "El Capítulo 3 clasifica los métodos en deductivos, inductivos, analíticos y sintéticos."),
    mc("Según la Unidad 1, ¿qué lado del cerebro estudia las cosas paso a paso y parte por parte?", "El hemisferio izquierdo, descrito como científico y lógico.", ["El hemisferio derecho, descrito como creativo.", "Ninguno de los dos hemisferios."], "La Unidad 1 describe el hemisferio izquierdo como verbal, analítico, simbólico, abstracto, temporal y racional."),
    mc("El servidor tiene 4 partes: procesador, memoria, disco y fuente de poder. Si se apaga de golpe por falta de energía, ¿cuál parte revisarías primero?", "La fuente de poder.", ["El disco.", "La memoria."]),
    ab("Analiza un celular, mencionando al menos 4 partes que lo componen y para qué sirve cada una.", "Deben aparecer al menos 4 partes con su función. Ejemplos: pantalla (mostrar), batería (energía), cámara (fotos), bocina (sonido), memoria (guardar)."),
    ab("Analiza un partido de futbol dividiéndolo en al menos 3 elementos, como jugadores, reglas y árbitro, y explica cómo se relacionan.", "Debes separar al menos 3 elementos y decir cómo se relacionan, por ejemplo que el árbitro aplica las reglas a los jugadores."),
    mc("Según el Capítulo 6, en un análisis, además de separar las partes, se estudian...", "Las relaciones que existen entre ellas.", ["Solo su precio.", "Solo su color."]),
  ],
  // 6. TORRE
  [
    mc("Según el Capítulo 6, la síntesis es...", "El proceso más complejo del pensamiento, que integra partes, cualidades o relaciones para formar entidades o totalidades nuevas y significativas.", ["Separar un todo en partes para estudiarlas.", "Copiar un texto tal como está."]),
    mc("Pista 1, es un animal. Pista 2, vive en el mar. Pista 3, tiene ocho brazos. ¿Qué es?", "Pulpo", ["Delfín", "Tortuga"]),
    mc("Señal 1, luz roja. Señal 2, suena una alarma. Señal 3, la puerta está bloqueada. ¿Qué conclusión integra las tres señales?", "El sistema de seguridad se activó.", ["Está lloviendo.", "Es hora de comer."]),
    mc("Según el Capítulo 6, la síntesis se considera un proceso opuesto al...", "Análisis", ["Observación", "Descripción"]),
    mc("Según el Capítulo 3, los métodos sintéticos de enseñanza buscan...", "La conclusión, creación o diseño.", ["La observación, experimentación y abstracción.", "La aplicación, comprobación y demostración."], "El Capítulo 3 distingue métodos deductivos, inductivos, analíticos y sintéticos."),
    mc("Según la Unidad 1, ¿qué lado del cerebro agrupa las cosas para formar conjuntos?", "El hemisferio derecho, descrito como creativo.", ["El hemisferio izquierdo, descrito como científico.", "Ninguno de los dos hemisferios."], "La Unidad 1 describe el hemisferio derecho como no verbal, sintético, concreto, analógico y atemporal."),
    mc("Resumir un texto largo en una idea central que integra sus partes principales es...", "Síntesis", ["Análisis", "Copiar"]),
    ab("Une las palabras 'laboratorio', 'isla' y 'contraseña' en una sola oración con sentido.", "La oración debe incluir las tres palabras y formar una idea coherente y nueva, por ejemplo, en la isla el laboratorio guardaba una contraseña secreta."),
    ab("Resume en una sola frase qué es un juego de mesa, integrando las palabras 'reglas', 'objetivo' y 'jugadores'.", "Debe integrar las 3 palabras en una idea completa, por ejemplo, un juego de mesa es una actividad donde los jugadores siguen reglas para lograr un objetivo."),
    mc("Una señal luminosa hace 3 destellos cortos, 3 largos y 3 cortos, es decir SOS. ¿Qué mensaje integran?", "Una petición de auxilio.", ["Buenos días.", "Felicidades."]),
  ],
  // 7. CONSOLA
  [
    mc("Según el Capítulo 6, evaluar consiste en...", "Emitir, justificándolos, determinados juicios de valor acerca de objetos, situaciones y hechos.", ["Separar un todo en partes.", "Describir algo sin opinar."]),
    mc("Según el Capítulo 1, ¿cuál es un juicio correcto sobre el envejecimiento normal y la memoria?", "El envejecimiento normal puede causar algo de olvido, pero no conduce a una pérdida drástica de la memoria.", ["El envejecimiento normal siempre produce amnesia severa.", "El envejecimiento no afecta nunca la velocidad para aprender cosas nuevas."], "El Capítulo 1 distingue el olvido normal del envejecimiento de otras causas más graves de pérdida de memoria."),
    mc("Según el Capítulo 5, ¿qué tipo de pensamiento resuelve con éxito los problemas del vivir cotidiano?", "Constructivo o práctico", ["Destructivo", "Supersticioso"], "El Capítulo 5 describe el pensamiento constructivo o práctico como el que resuelve con éxito los problemas cotidianos."),
    mc("Según el Capítulo 5, ¿qué tipo de pensamiento tiene una actitud derrotista, fatalista y pesimista?", "Destructivo", ["Positivo", "Ecológico"], "El pensamiento destructivo se describe en el Capítulo 5 con actitud derrotista, fatalista y pesimista, o de optimismo ingenuo y equivocado."),
    mc("Según el Capítulo 5, ¿qué tipo de pensamiento clasifica los hechos en dos posiciones, todo o nada?", "Dicotómico-categórico", ["Holista", "Sistemático"], "El pensamiento dicotómico-categórico clasifica los hechos en sí o no, todo o nada, blanco o negro."),
    ab("Evalúa si es correcto trasnocharse sin descansar para terminar un proyecto. Justifica tu juicio con 2 razones.", "Debe haber un juicio claro y al menos 2 razones, por ejemplo el rendimiento, la salud, la calidad del trabajo o la planeación del tiempo."),
    ab("Evalúa si compartirías una noticia que no menciona su fuente. Justifica con 2 razones.", "Debe haber un juicio claro y 2 razones, por ejemplo que no se puede verificar, puede ser falsa, o difundirla puede causar daño."),
    mc("Un juicio de valor justificado debe incluir...", "Una opinión y las razones o criterios que la sostienen.", ["Solo una opinión.", "Solo datos sin conclusión."]),
    ab("Evalúa cuál es mejor herramienta para estudiar entre resumen, mapa mental o memorizar. Elige una y justifica con 2 criterios.", "Debes elegir una opción y justificarla con 2 criterios, como comprensión, tiempo, retención o facilidad para repasar."),
    mc("Según el Capítulo 3, ¿cuál de estas SÍ es una estrategia de aprendizaje recomendada?", "Elaborar mapas conceptuales y construir una V de Gowin.", ["Memorizar todo sin comprenderlo.", "Evitar cuestionar lo que se lee."], "El Capítulo 3 lista estrategias como cuestionar, tomar supernotas, resolver problemas, investigar, explicar con palabras propias, elaborar mapas conceptuales y construir una V de Gowin."),
  ],
  // 8. NÚCLEO
  [
    mc(FAL_INTRO + "«No hagas caso a su propuesta de seguridad, ¡si ni siquiera terminó la prepa!»", F_PERSONA, [F_DILEMA, F_CAUSA], "Rechaza el argumento atacando a la persona y no revisando las razones."),
    mc(FAL_INTRO + "«Conocí a dos personas de esa isla y eran descorteses, así que todos los de la isla lo son.»", F_GENERAL, [F_MAYORIA, F_PERSONA], "Concluye sobre todo un grupo a partir de muy pocos casos."),
    mc(FAL_INTRO + "«O apoyas mi plan al 100 %, o quieres que el equipo fracase.»", F_DILEMA, [F_GENERAL, F_PENDIENTE], "Presenta solo dos opciones cuando existen más posibilidades."),
    mc(FAL_INTRO + "«Todo el mundo usa esa app, así que debe ser segura.»", F_MAYORIA, [F_CAUSA, F_PERSONA], "Que muchos lo hagan no demuestra que sea verdad o seguro."),
    mc(FAL_INTRO + "«Me puse mi camisa azul y aprobé el examen, así que la camisa azul me hace aprobar.»", F_CAUSA, [F_DILEMA, F_AUTORIDAD], "Confunde una coincidencia en el tiempo con una relación de causa y efecto."),
    mc(FAL_INTRO + "«Si dejamos que salgan cinco minutos antes, luego querrán no venir nunca y la escuela desaparecerá.»", F_PENDIENTE, [F_MAYORIA, F_GENERAL], "Afirma sin pruebas que un paso pequeño llevará inevitablemente a un desastre."),
    mc(FAL_INTRO + "«Un famoso cantante dijo que esa dieta funciona, así que debe ser cierta.»", F_AUTORIDAD, [F_PERSONA, F_DILEMA], "Un cantante no es experto en nutrición, por lo que su opinión no prueba nada."),
    mc(FAL_INTRO + "«Ese hacker es un mentiroso, así que su descubrimiento sobre el sistema debe ser falso.»", F_PERSONA, [F_PENDIENTE, F_GENERAL], "Se ataca a quien habla y no se revisa el descubrimiento."),
    mc("¿Cuál de estos razonamientos NO es una falacia?", "Todos los mamíferos respiran aire y el delfín es un mamífero, así que el delfín respira aire.", ["Nadie ha probado que los fantasmas no existan, así que existen.", "Mi primo lo dijo, así que es verdad."], "Es un razonamiento válido: la conclusión se sigue de las premisas. Las otras dos opciones tienen apariencia de verdad pero llevan a conclusiones erróneas."),
    mc("Según el Capítulo 6, el pensamiento crítico es el proceso intelectualmente disciplinado que hace experta a una persona mediante...", "La conceptualización, aplicación, análisis, síntesis o evaluación de la información generada por la observación, la experiencia, la reflexión, el razonamiento o la comunicación.", ["La memorización repetitiva de datos sueltos.", "La aceptación sin cuestionamiento de cualquier autoridad."]),
  ],
];

const AYUDA = `CÓMO SE JUEGA

OBJETIVO
Ser el primer jugador en llegar al Núcleo del Laboratorio (casilla 48) con las 8 Cartas de Pista, una por cada subred, y deducir correctamente el Código Final para hackear el sistema de la isla.

TU TURNO
1. Presiona "Lanzar dado" y tu ficha avanza.
2. El color de la casilla indica la subred y la habilidad que se pondrá a prueba.
3. Resuelve el reto en 60 segundos.
4. Retos de OBSERVACIÓN: primero se muestra una escena durante 20 segundos.
5. Retos de respuesta abierta: escribe tu respuesta y autoevalúate con honestidad.

RESULTADOS
- Reto correcto: ganas la pista de esa subred y avanzas 2 casillas extra.
- Reto incorrecto: te quedas donde estás y pierdes tu siguiente turno.

CASILLAS ESPECIALES
- Interferencia: reto al azar de cualquier subred.
- Pista falsa: identifica la falacia. Si fallas, retrocedes 3 casillas.

NÚCLEO DEL LABORATORIO
Al llegar al Núcleo del Laboratorio con las 8 Cartas de Pista se abre la terminal. Cada carta contiene un acertijo cuyo resultado es un dígito.
El código se arma con los 8 dígitos en el orden de las subredes (1 a 8).

PARTIDA GUARDADA
El juego se guarda solo después de cada turno en tu navegador.`;

// ============ RUTA EN ESPIRAL ============
function espiral(filas, columnas) {
  const coords = [];
  let top = 0, left = 0, bottom = filas - 1, right = columnas - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) coords.push([top, c]);
    for (let r = top + 1; r <= bottom; r++) coords.push([r, right]);
    if (top < bottom) for (let c = right - 1; c >= left; c--) coords.push([bottom, c]);
    if (left < right) for (let r = bottom - 1; r > top; r--) coords.push([r, left]);
    top++; left++; bottom--; right--;
  }
  return coords;
}
const RUTA = espiral(FILAS, COLUMNAS);

function zonaDe(pos) { return Math.min(Math.floor(pos / CASILLAS_POR_ZONA), ZONAS.length - 1); }
function tipoCasilla(pos) {
  if (INTERFERENCIA.has(pos)) return "interferencia";
  if (PISTA_FALSA.has(pos)) return "falsa";
  return "zona";
}

// ============ ESTADO DEL JUEGO ============
let juego = null;
let bolsas = {};
let ocupado = false;
let timerActual = null;

// ============ UTILIDADES ============
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function guardar() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...juego, bolsas }));
    mostrarEstadoGuardado("");
  } catch (error) {
    mostrarEstadoGuardado("No se pudo guardar la partida en este navegador.");
    console.error("No se pudo guardar la partida.", error);
  }
}
function cargar() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.jugadores) || data.jugadores.length < 2 ||
        !Number.isInteger(data.turno) || data.turno < 0 || data.turno >= data.jugadores.length) {
      throw new Error("La estructura de la partida guardada no es válida.");
    }
    return data;
  } catch (error) {
    mostrarEstadoGuardado("No se pudo leer la partida guardada. Inicia una nueva.");
    console.error("No se pudo cargar la partida guardada.", error);
    return null;
  }
}
function borrarGuardado() {
  try {
    localStorage.removeItem(SAVE_KEY);
    mostrarEstadoGuardado("");
  } catch (error) {
    mostrarEstadoGuardado("No se pudo borrar la partida guardada en este navegador.");
    console.error("No se pudo borrar la partida guardada.", error);
  }
}

function mostrarEstadoGuardado(mensaje) {
  const pantallaJuego = $("#pantalla-juego");
  const aviso = pantallaJuego.classList.contains("activa")
    ? $("#estado-guardado-juego")
    : $("#estado-guardado");
  if (aviso) aviso.textContent = mensaje;
}

function escaparHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ============ JUEGO ============
function nuevoJuego(nombres) {
  const orden = [...nombres];
  for (let i = orden.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [orden[i], orden[j]] = [orden[j], orden[i]];
  }
  return {
    version: 1,
    jugadores: orden.map((n, i) => ({
      nombre: n, color: COLORES_JUGADOR[i], pos: 0, pistas: [], salta: 0
    })),
    turno: 0,
    bitacora: [],
  };
}

function jugadorActual() { return juego.jugadores[juego.turno]; }

function sacarCarta(zona) {
  if (!bolsas[zona] || bolsas[zona].length === 0) {
    bolsas[zona] = [...Array(MAZOS[zona].length).keys()];
    for (let i = bolsas[zona].length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bolsas[zona][i], bolsas[zona][j]] = [bolsas[zona][j], bolsas[zona][i]];
    }
  }
  return MAZOS[zona][bolsas[zona].pop()];
}

function pasarTurno() {
  const msgs = [];
  const n = juego.jugadores.length;
  for (let i = 0; i < n * 3; i++) {
    juego.turno = (juego.turno + 1) % n;
    const p = juego.jugadores[juego.turno];
    if (p.salta > 0) {
      p.salta--;
      msgs.push(`${p.nombre} pierde este turno.`);
      continue;
    }
    break;
  }
  return msgs;
}

function log(texto) {
  juego.bitacora.push(texto);
  if (juego.bitacora.length > 400) juego.bitacora = juego.bitacora.slice(-300);
}

// ============ MODALES ============
const overlay = $("#modal-overlay");
const modalContenido = $("#modal-contenido");
let elementoAntesModal = null;

function abrirModal(html) {
  if (!overlay.classList.contains("activa")) elementoAntesModal = document.activeElement;
  modalContenido.innerHTML = html;
  overlay.classList.add("activa");
  overlay.setAttribute("aria-hidden", "false");
  const focoInicial = modalContenido.querySelector("button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])");
  (focoInicial || modalContenido).focus();
}
function cerrarModal() {
  overlay.classList.remove("activa");
  overlay.setAttribute("aria-hidden", "true");
  modalContenido.innerHTML = "";
  if (timerActual) { clearInterval(timerActual); timerActual = null; }
  if (elementoAntesModal instanceof HTMLElement && elementoAntesModal.isConnected) elementoAntesModal.focus();
  elementoAntesModal = null;
}

overlay.addEventListener("keydown", e => {
  if (e.key === "Escape" && modalContenido.dataset.cerrable === "true") {
    cerrarModal();
    return;
  }
  if (e.key !== "Tab") return;
  const elementos = [...modalContenido.querySelectorAll("button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex='-1'])")];
  if (!elementos.length) {
    e.preventDefault();
    modalContenido.focus();
    return;
  }
  const primero = elementos[0];
  const ultimo = elementos[elementos.length - 1];
  if (e.shiftKey && document.activeElement === primero) {
    e.preventDefault();
    ultimo.focus();
  } else if (!e.shiftKey && document.activeElement === ultimo) {
    e.preventDefault();
    primero.focus();
  }
});
overlay.addEventListener("click", e => {
  if (e.target === overlay && modalContenido.dataset.cerrable === "true") cerrarModal();
});

// ============ PANTALLAS ============
function mostrarPantalla(id) {
  $$(".pantalla").forEach(p => p.classList.remove("activa"));
  $("#" + id).classList.add("activa");
}

// ============ INICIO ============
function iniciarInicio() {
  actualizarBotonContinuar();

  $$(".entrada-jugador").forEach(inp => {
    inp.addEventListener("keydown", e => {
      if (e.key === "Enter") $("#btn-nueva").click();
    });
  });

  $("#btn-nueva").addEventListener("click", () => {
    const nombres = [];
    $$(".entrada-jugador").forEach(inp => {
      let n = inp.value.trim().slice(0, 18);
      if (n) {
        let base = n, k = 2;
        while (nombres.some(x => x.toLowerCase() === n.toLowerCase())) {
          n = `${base} ${k++}`;
        }
        nombres.push(n);
      }
    });
    if (nombres.length < 2) {
      alert("Escribe al menos 2 nombres para comenzar.");
      return;
    }
    const guardada = cargar();
    if (guardada && !confirm("Ya existe una partida guardada. ¿Reemplazarla por una nueva?")) return;
    juego = nuevoJuego(nombres);
    bolsas = {};
    log("¡Comienza la aventura en Isla Hack!");
    log(`Orden de turno (aleatorio): ${juego.jugadores.map(p => p.nombre).join(", ")}.`);
    guardar();
    entrarAlJuego();
  });

  $("#btn-continuar").addEventListener("click", () => {
    const data = cargar();
    if (!data) {
      alert("No se encontró ninguna partida guardada.");
      actualizarBotonContinuar();
      return;
    }
    if (!data.jugadores || !Array.isArray(data.jugadores) || data.jugadores.length < 2) {
      alert("La partida guardada está corrupta. Inicia una nueva.");
      borrarGuardado();
      actualizarBotonContinuar();
      return;
    }
    juego = data;
    bolsas = data.bolsas && typeof data.bolsas === "object" ? data.bolsas : {};
    delete juego.bolsas;
    log("--- Se retoma la partida guardada ---");
    entrarAlJuego();
  });

  $("#btn-ayuda-inicio").addEventListener("click", () => mostrarAyuda());
}

function actualizarBotonContinuar() {
  const btn = $("#btn-continuar");
  const hay = !!cargar();
  btn.disabled = !hay;
  btn.title = hay ? "Retomar la partida guardada" : "No hay partida guardada";
}

// ============ ENTRAR AL JUEGO ============
function entrarAlJuego() {
  mostrarPantalla("pantalla-juego");
  dibujarTablero();
  actualizarPanel();
  iniciarTurno();
  if (juego.retoPendiente) reanudarRetoPendiente();
}

// ============ TABLERO ============
function dibujarTablero() {
  const tablero = $("#tablero");
  tablero.innerHTML = "";
  const filasVisibles = Array.from({ length: FILAS }, (_, indice) => {
    const fila = document.createElement("div");
    fila.className = "fila-tablero";
    fila.setAttribute("role", "row");
    fila.setAttribute("aria-rowindex", String(indice + 1));
    return fila;
  });

  RUTA.forEach(([fila, col], i) => {
    const zona = ZONAS[zonaDe(i)];
    const div = document.createElement("div");
    div.className = "casilla";
    div.style.setProperty("--color-subred", zona.color);
    div.setAttribute("role", "gridcell");
    div.setAttribute("aria-rowindex", String(fila + 1));
    div.setAttribute("aria-colindex", String(col + 1));
    div.setAttribute("aria-label", `Casilla ${i + 1}, ${zona.nombre}${INTERFERENCIA.has(i) ? ", interferencia" : PISTA_FALSA.has(i) ? ", pista falsa" : ""}`);
    div.style.gridRow = 1;
    div.style.gridColumn = col + 1;

    // número
    const num = document.createElement("span");
    num.className = "num";
    num.textContent = i + 1;
    div.appendChild(num);

    // contenido
    if (i === 0) {
      div.classList.add("inicio");
      const marcador = document.createElement("span");
      marcador.className = "marcador-terminal";
      const etiqueta = document.createElement("small");
      etiqueta.textContent = "SALIDA";
      marcador.appendChild(etiqueta);
      div.appendChild(marcador);
    } else if (i === NUM_CASILLAS - 1) {
      div.classList.add("nucleo");
      const marcador = document.createElement("span");
      marcador.className = "marcador-terminal";
      const icono = document.createElement("span");
      icono.className = "icono-nucleo";
      icono.setAttribute("aria-hidden", "true");
      const etiqueta = document.createElement("small");
      etiqueta.textContent = "NÚCLEO";
      marcador.append(icono, etiqueta);
      div.appendChild(marcador);
    } else if (INTERFERENCIA.has(i)) {
      const ic = document.createElement("span");
      ic.className = "icono-casilla";
      ic.textContent = "INT";
      div.appendChild(ic);
    } else if (PISTA_FALSA.has(i)) {
      const ic = document.createElement("span");
      ic.className = "icono-casilla pista-falsa";
      ic.textContent = "!";
      div.appendChild(ic);
    }

    // contenedor de fichas
    const fichasDiv = document.createElement("div");
    fichasDiv.className = "fichas";
    fichasDiv.dataset.pos = i;
    div.appendChild(fichasDiv);

    div.dataset.pos = i;
    filasVisibles[fila].appendChild(div);
  });
  tablero.append(...filasVisibles);

  // leyenda de zonas
  const leyenda = $("#leyenda-zonas");
  leyenda.innerHTML = "";
  ZONAS.forEach((z, k) => {
    const span = document.createElement("span");
    span.innerHTML = `<i style="background:${z.color}"></i>${k + 1}. ${z.nombre}`;
    leyenda.appendChild(span);
  });

  dibujarFichas();
}

function dibujarFichas() {
  $$(".fichas").forEach(f => f.innerHTML = "");
  const actual = jugadorActual();
  juego.jugadores.forEach(p => {
    const cont = document.querySelector(`.fichas[data-pos="${p.pos}"]`);
    if (!cont) return;
    const ficha = document.createElement("div");
    ficha.className = "ficha" + (p === actual ? " actual" : "");
    ficha.style.background = p.color;
    ficha.style.color = "#101A1C";
    ficha.textContent = p.nombre[0].toUpperCase();
    ficha.title = p.nombre;
    cont.appendChild(ficha);
  });
}

// ============ PANEL ============
function actualizarPanel() {
  const actual = jugadorActual();
  $("#lbl-turno").textContent = `Turno de: ${actual.nombre}`;
  actualizarProgresoMision(actual);

  const panel = $("#panel-jugadores");
  panel.innerHTML = "";
  juego.jugadores.forEach(p => {
    const fila = document.createElement("div");
    fila.className = "fila-jugador" + (p === actual ? " actual" : "");
    fila.setAttribute("role", "listitem");
    if (p === actual) fila.setAttribute("aria-current", "step");
    const inicial = p.nombre[0].toUpperCase();
    let html = `
      <div class="punto-jugador" style="background:${p.color}; color:#101A1C">${inicial}</div>
      <div class="nombre">${escaparHTML(p.nombre)}${p.salta ? ' <span class="salta">PAUSA</span>' : ''}</div>
      <div class="pos">${p.pos + 1}/${NUM_CASILLAS}</div>
      <div class="mini-pistas">`;
    for (let k = 0; k < 8; k++) {
      const lleno = p.pistas.includes(k);
      html += `<div class="mini-pista" title="${lleno ? "Carta reunida" : "Carta pendiente"}: ${ZONAS[k].nombre}" style="--color-subred:${ZONAS[k].color}; background:${lleno ? "var(--color-subred)" : "transparent"}; color:#F4F0E6">${lleno ? ZONAS[k].icono || (k + 1) : ""}</div>`;
    }
    html += `</div>`;
    fila.innerHTML = html;
    panel.appendChild(fila);
  });
}

function actualizarProgresoMision(jugador) {
  const cartas = $("#progreso-cartas");
  cartas.innerHTML = "";
  ZONAS.forEach((zona, i) => {
    const reunida = jugador.pistas.includes(i);
    const carta = document.createElement("span");
    carta.className = "carta-progreso" + (reunida ? " reunida" : "");
    carta.textContent = reunida ? "✓" : String(i + 1).padStart(2, "0");
    carta.title = `${reunida ? "Carta reunida" : "Pendiente"}: ${zona.nombre}`;
    carta.setAttribute("role", "listitem");
    carta.setAttribute("aria-label", `${zona.nombre}: ${reunida ? "reunida" : "pendiente"}`);
    carta.style.setProperty("--color-subred", zona.color);
    cartas.appendChild(carta);
  });

  const totalCartas = jugador.pistas.length;
  const casilla = jugador.pos + 1;
  $("#progreso-cartas-texto").textContent = `${totalCartas} / 8 cartas`;
  $("#progreso-ruta-texto").textContent = `Casilla ${casilla} de ${NUM_CASILLAS}`;
  const barra = $(".barra-progreso");
  barra.setAttribute("aria-valuenow", String(casilla));
  $("#barra-progreso-ruta").style.width = `${((casilla - 1) / (NUM_CASILLAS - 1)) * 100}%`;

  const estado = $("#estado-mision");
  if (casilla === NUM_CASILLAS - 1 && totalCartas === 8) {
    estado.textContent = "¡Listo! Deduce el Código Final y hackea el sistema.";
    estado.className = "estado-mision listo";
  } else if (casilla === NUM_CASILLAS - 1) {
    estado.textContent = `En el Núcleo, resuelve retos para conseguir ${8 - totalCartas} carta${totalCartas === 7 ? "" : "s"} más.`;
    estado.className = "estado-mision";
  } else if (totalCartas === 8) {
    estado.textContent = "¡Tienes las 8 cartas! Llega al Núcleo del Laboratorio.";
    estado.className = "estado-mision listo";
  } else {
    estado.textContent = `Reúne ${8 - totalCartas} carta${totalCartas === 7 ? "" : "s"} más, una por subred.`;
    estado.className = "estado-mision";
  }
}

// ============ DADO ============
const CARAS_DADO = {
  1: ["mc"],
  2: ["tl", "br"],
  3: ["tl", "mc", "br"],
  4: ["tl", "tr", "bl", "br"],
  5: ["tl", "tr", "mc", "bl", "br"],
  6: ["tl", "tr", "ml", "mr", "bl", "br"],
};
function dibujarDado(n) {
  const cara = $("#cara-dado");
  cara.innerHTML = "";
  cara.classList.remove("sin-lanzar");
  cara.setAttribute("aria-label", `Dado: ${n}`);
  $("#dado").setAttribute("aria-label", `Dado: ${n}`);
  CARAS_DADO[n].forEach(pos => {
    const p = document.createElement("span");
    p.className = "punto";
    p.dataset.pos = pos;
    cara.appendChild(p);
  });
  cara.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
  setTimeout(() => cara.style.transform = "rotate(0deg)", 100);
}

// ============ FLUJO DEL TURNO ============
function iniciarTurno() {
  ocupado = false;
  const p = jugadorActual();
  actualizarPanel();
  dibujarFichas();
  const btn = $("#btn-accion");
  if (p.pos === NUM_CASILLAS - 1) {
    btn.textContent = p.pistas.length === 8 ? "Hackear sistema" : "Reto del Núcleo";
  } else {
    btn.textContent = "Lanzar dado";
  }
  btn.disabled = false;
}

function accionPrincipal() {
  if (ocupado) return;
  ocupado = true;
  $("#btn-accion").disabled = true;
  const p = jugadorActual();
  if (p.pos === NUM_CASILLAS - 1) turnoNucleo();
  else lanzarDado();
}

function lanzarDado() {
  const p = jugadorActual();
  let k = 0;
  const intervalo = setInterval(() => {
    dibujarDado(Math.floor(Math.random() * 6) + 1);
    k++;
    if (k >= 12) {
      clearInterval(intervalo);
      const n = Math.floor(Math.random() * 6) + 1;
      dibujarDado(n);
      log(`${p.nombre} lanzó el dado y sacó ${n}.`);
      setTimeout(() => mover(n, alCaer), 350);
    }
  }, 70);
}

function mover(pasos, luego, sentido = 1) {
  const p = jugadorActual();
  let k = pasos;
  const paso = () => {
    const nueva = p.pos + sentido;
    if (k === 0 || nueva < 0 || nueva > NUM_CASILLAS - 1) {
      luego();
      return;
    }
    p.pos = nueva;
    k--;
    dibujarFichas();
    actualizarPanel();
    guardar();
    setTimeout(paso, 180);
  };
  paso();
}

function alCaer() {
  const p = jugadorActual();
  const pos = p.pos;
  const tipo = tipoCasilla(pos);
  let zona, titulo;
  if (tipo === "interferencia") {
    zona = Math.floor(Math.random() * ZONAS.length);
    log(`¡Interferencia! Reto al azar: ${ZONAS[zona].habilidad}.`);
    titulo = "INTERFERENCIA";
  } else if (tipo === "falsa") {
    zona = 7;
    log(`¡Pista falsa! ${p.nombre} debe detectar la falacia.`);
    titulo = "PISTA FALSA";
  } else {
    zona = zonaDe(pos);
    log(`${p.nombre} llegó a la casilla ${pos + 1}: ${ZONAS[zona].nombre}.`);
    titulo = `SUBRED ${zona + 1}`;
  }
  const carta = sacarCarta(zona);
  mostrarReto(zona, carta, titulo, ok => trasReto(ok, zona, tipo), {
    tipo: "casilla",
    tipoCasilla: tipo,
  });
}

function trasReto(ok, zona, tipo) {
  const p = jugadorActual();
  if (tipo === "falsa") {
    if (ok) {
      log(`${p.nombre} descubrió la pista falsa.`);
      finDeTurno();
    } else {
      log(`${p.nombre} cayó en la pista falsa y retrocede 3 casillas.`);
      mover(3, finDeTurno, -1);
    }
    return;
  }
  if (ok) {
    if (!p.pistas.includes(zona)) {
      p.pistas.push(zona);
      log(`¡${p.nombre} consiguió la pista de ${ZONAS[zona].nombre}!`);
    } else {
      log(`${p.nombre} acertó (pista repetida).`);
    }
    log(`${p.nombre} avanza 2 casillas extra.`);
    actualizarPanel();
    mover(2, despuesDeAvanzar);
  } else {
    p.salta = 1;
    log(`${p.nombre} falló y pierde su siguiente turno.`);
    finDeTurno();
  }
}

function despuesDeAvanzar() {
  const p = jugadorActual();
  if (p.pos === NUM_CASILLAS - 1 && p.pistas.length === 8) {
    abrirTerminal();
  } else {
    finDeTurno();
  }
}

function turnoNucleo() {
  const p = jugadorActual();
  if (p.pistas.length === 8) {
    abrirTerminal();
    return;
  }
  const faltante = [...Array(8).keys()].find(z => !p.pistas.includes(z));
  log(`${p.nombre} debe resolver un reto crítico para la pista de ${ZONAS[faltante].nombre}.`);
  const carta = sacarCarta(7);
  mostrarReto(7, carta, `RETO DEL NÚCLEO · Carta de ${ZONAS[faltante].nombre}`, ok => trasRetoNucleo(ok, faltante), {
    tipo: "nucleo",
    faltante,
  });
}

function trasRetoNucleo(ok, faltante) {
  const p = jugadorActual();
  if (ok) {
    p.pistas.push(faltante);
    log(`¡${p.nombre} consiguió la pista de ${ZONAS[faltante].nombre}!`);
    actualizarPanel();
    if (p.pistas.length === 8) {
      abrirTerminal();
      return;
    }
  } else {
    log(`${p.nombre} no lo logró, lo intentará en su siguiente turno.`);
  }
  finDeTurno();
}

function finDeTurno() {
  pasarTurno().forEach(log);
  guardar();
  iniciarTurno();
}

// ============ RETO ============
function reanudarRetoPendiente() {
  const pendiente = juego.retoPendiente;
  if (!pendiente) return;
  const contexto = pendiente.contexto;
  mostrarReto(pendiente.zonaIdx, pendiente.carta, pendiente.titulo, ok => {
    if (contexto.tipo === "nucleo") {
      trasRetoNucleo(ok, contexto.faltante);
    } else {
      trasReto(ok, pendiente.zonaIdx, contexto.tipoCasilla);
    }
  }, contexto);
}

function mostrarReto(zonaIdx, carta, titulo, onDone, contexto) {
  const completar = onDone;
  juego.retoPendiente = { zonaIdx, carta, titulo, contexto };
  guardar();
  onDone = ok => {
    delete juego.retoPendiente;
    guardar();
    completar(ok);
  };
  const zona = ZONAS[zonaIdx];
  let fase = carta.ver ? "observar" : "responder";

  function renderObservar() {
    abrirModal(`
      <div class="modal-header" style="background:${zona.color}; color:${zona.fg}">
        <span class="emblema-zona">${zona.icono}</span>
        <span>${titulo}</span>
      </div>
      <div class="modal-sub" style="background:${zona.color}; color:${zona.fg}">
        Subred: ${zona.nombre} • Habilidad: ${zona.habilidad}
      </div>
      <div class="modal-body">
        <div class="instruccion-reto">OBSERVA con atención. La escena desaparecerá pronto.</div>
        <div class="escena-observar">${escaparHTML(carta.ver)}</div>
        <div class="pildora-tiempo" id="tiempo" role="timer" aria-live="off">Tiempo de observación: ${TIEMPO_OBSERVAR} s</div>
        <div class="accion-reto">
          <button class="btn btn-primario" id="btn-memorice">Ya la memoricé</button>
        </div>
      </div>
    `);
    modalContenido.dataset.cerrable = "false";
    let restante = TIEMPO_OBSERVAR;
    const el = $("#tiempo");
    $("#btn-memorice").onclick = () => { clearInterval(timerActual); timerActual = null; renderResponder(); };
    timerActual = setInterval(() => {
      restante--;
      if (restante <= 0) {
        clearInterval(timerActual); timerActual = null;
        renderResponder();
        return;
      }
      el.textContent = `Tiempo de observación: ${restante} s`;
    }, 1000);
  }

  function renderResponder() {
    const esMC = carta.tipo === "mc";
    let bodyHTML = `<div class="texto-reto">${escaparHTML(carta.q)}</div>`;
    if (esMC) {
      const opciones = [...carta.opts];
      for (let i = opciones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
      }
      const letras = ["A", "B", "C", "D"];
      opciones.forEach((op, i) => {
        bodyHTML += `<button class="opcion" data-op="${escaparHTML(op)}">${letras[i]}. ${escaparHTML(op)}</button>`;
      });
    } else {
      bodyHTML += `<textarea class="entrada-abierta" id="txt-abierta" placeholder="Describe tu análisis..." aria-label="Respuesta abierta"></textarea>
        <div class="accion-reto">
          <button class="btn btn-primario" id="btn-enviar">Registrar respuesta</button>
        </div>`;
    }

    abrirModal(`
      <div class="modal-header" style="background:${zona.color}; color:${zona.fg}">
        <span class="emblema-zona">${zona.icono}</span>
        <span>${titulo}</span>
      </div>
      <div class="modal-sub" style="background:${zona.color}; color:${zona.fg}">
        Subred: ${zona.nombre} • Habilidad: ${zona.habilidad}
      </div>
      <div class="modal-body">
        <div class="pildora-tiempo" id="tiempo-reto" role="timer" aria-live="off">Tiempo: ${TIEMPO_RETO} s</div>
        ${bodyHTML}
      </div>
    `);
    modalContenido.dataset.cerrable = "false";

    let restante = TIEMPO_RETO;
    const el = $("#tiempo-reto");
    timerActual = setInterval(() => {
      restante--;
      if (restante <= 10) el.classList.add("critico");
      if (restante <= 0) {
        clearInterval(timerActual); timerActual = null;
        mostrarResultado(false, esMC ? carta.exp : "Criterios: " + carta.crit, "¡SE ACABÓ EL TIEMPO!", "El reto se considera no resuelto.", onDone);
        return;
      }
      el.textContent = `Tiempo: ${restante} s`;
    }, 1000);

    if (esMC) {
      modalContenido.querySelectorAll(".opcion").forEach(btn => {
        btn.onclick = () => {
          clearInterval(timerActual); timerActual = null;
          const elegida = btn.dataset.op;
          const ok = elegida === carta.opts[0];
          modalContenido.querySelectorAll(".opcion").forEach(b => {
            if (b.dataset.op === carta.opts[0]) b.classList.add("correcta");
            else if (b === btn) b.classList.add("incorrecta");
            b.disabled = true;
          });
          setTimeout(() => mostrarResultado(ok, carta.exp, null, null, onDone), 700);
        };
      });
    } else {
      $("#btn-enviar").onclick = () => {
        const texto = $("#txt-abierta").value.trim();
        if (!texto) { alert("Escribe tu respuesta antes de enviarla."); return; }
        clearInterval(timerActual); timerActual = null;
        renderAutoevaluacion(texto);
      };
    }
  }

  function renderAutoevaluacion(texto) {
    abrirModal(`
      <div class="modal-header" style="background:${zona.color}; color:${zona.fg}">
        <span class="emblema-zona">${zona.icono}</span>
        <span>Autoevaluación</span>
      </div>
      <div class="modal-sub" style="background:${zona.color}; color:${zona.fg}">
        ${zona.nombre} • ${zona.habilidad}
      </div>
      <div class="modal-body">
        <div class="etiqueta-bloque">Tu respuesta:</div>
        <div class="caja-respuesta">${escaparHTML(texto)}</div>
        <div class="etiqueta-bloque">Criterios para validar:</div>
        <div class="caja-criterios">${escaparHTML(carta.crit)}</div>
        <div class="pregunta-autoevaluacion">
          ¿Tu respuesta cumple con los criterios? Sé honesto, el juego confía en ti.
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-positivo" id="btn-si">Sí, cumplí</button>
        <button class="btn btn-critico" id="btn-no">No cumplí</button>
      </div>
    `);
    modalContenido.dataset.cerrable = "false";
    $("#btn-si").onclick = () => { cerrarModal(); onDone(true); };
    $("#btn-no").onclick = () => { cerrarModal(); onDone(false); };
  }

  function mostrarResultado(ok, detalle, encabezado, extra, done) {
    const titulo = encabezado || (ok ? "¡CORRECTO!" : "INCORRECTO");
    abrirModal(`
      <div class="modal-body resultado-cuerpo">
        <div class="resultado-sello ${ok ? 'ok' : 'mal'}">${ok ? '✓' : '✕'}</div>
        <div class="titulo-resultado ${ok ? 'ok' : 'mal'}">${titulo}</div>
        ${extra ? `<div class="extra-resultado">${escaparHTML(extra)}</div>` : ''}
        <div class="detalle-resultado">${escaparHTML(detalle)}</div>
      </div>
      <div class="modal-footer" style="justify-content:center">
        <button class="btn btn-primario" id="btn-continuar-reto">Continuar</button>
      </div>
    `);
    modalContenido.dataset.cerrable = "false";
    $("#btn-continuar-reto").onclick = () => { cerrarModal(); done(ok); };
  }

  if (fase === "observar") renderObservar();
  else renderResponder();
}

// ============ TERMINAL ============
function abrirTerminal() {
  const p = jugadorActual();
  log(`${p.nombre} llegó al Núcleo del Laboratorio para deducir el Código Final.`);
  let html = `
    <div class="terminal">
      <div class="modal-header terminal-header">
        NÚCLEO DEL LABORATORIO · ACCESO RESTRINGIDO
      </div>
      <div class="modal-body">
        <div class="terminal-instrucciones">Cada carta aporta un dígito. Descífralos en el orden de las subredes, del 1 al 8.</div>
  `;
  ZONAS.forEach((z, i) => {
    html += `<div class="pista-linea"><span class="emblema-zona">${z.icono}</span><span>Carta ${i + 1} · ${z.nombre}: ${escaparHTML(z.pista)}</span></div>`;
  });
  html += `
        <label class="terminal-label" for="input-codigo">Código final · 8 dígitos</label>
        <input type="text" class="codigo" id="input-codigo" maxlength="8" inputmode="numeric" autocomplete="off" aria-describedby="msg-terminal">
        <div class="msg-terminal" id="msg-terminal" role="status" aria-live="polite"></div>
        <div class="terminal-acciones">
          <button class="btn btn-primario" id="btn-hackear">Ejecutar intrusión</button>
          <button class="btn btn-secundario" id="btn-volver">Volver sin penalización</button>
        </div>
      </div>
    </div>
  `;
  abrirModal(html);
  modalContenido.dataset.cerrable = "false";
  const input = $("#input-codigo");
  input.focus();
  input.addEventListener("input", () => input.value = input.value.replace(/\D/g, "").slice(0, 8));
  input.addEventListener("keydown", e => { if (e.key === "Enter") hackear(); });

  function hackear() {
    const codigo = input.value.trim();
    const ok = codigo === CODIGO_FINAL;
    $("#msg-terminal").textContent = ok ? "ACCESO CONCEDIDO" : "ACCESO DENEGADO";
    $("#msg-terminal").className = "msg-terminal " + (ok ? "ok" : "mal");
    input.disabled = true;
    setTimeout(() => {
      cerrarModal();
      resultadoTerminal(ok ? "ok" : "mal");
    }, 900);
  }
  $("#btn-hackear").onclick = hackear;
  $("#btn-volver").onclick = () => { cerrarModal(); resultadoTerminal("cancelar"); };
}

function resultadoTerminal(res) {
  const p = jugadorActual();
  if (res === "ok") {
    ganar(p);
  } else if (res === "mal") {
    p.salta = 1;
    log(`${p.nombre} ingresó un código incorrecto. Pierde su siguiente turno.`);
    finDeTurno();
  } else {
    log(`${p.nombre} salió de la terminal.`);
    finDeTurno();
  }
}

function ganar(p) {
  log(`¡${p.nombre} llegó al Núcleo del Laboratorio y hackeó el sistema de la isla!`);
  borrarGuardado();
  abrirModal(`
    <div class="victoria">
      <div class="victoria-etiqueta">NÚCLEO DEL LABORATORIO · SISTEMA COMPROMETIDO</div>
      <div class="victoria-sello">ACCESO<br>CONCEDIDO</div>
      <h2>¡${escaparHTML(p.nombre)} hackeó el sistema!</h2>
      <p>Reuniste las 8 Cartas de Pista, llegaste al Núcleo y dedujiste el Código Final.</p>
      <div class="codigo-victoria" aria-label="Código final">${CODIGO_FINAL}</div>
      <button class="btn btn-primario" id="btn-nueva-partida-victoria">Jugar otra partida</button>
    </div>
  `);
  modalContenido.dataset.cerrable = "false";
  $("#btn-nueva-partida-victoria").onclick = () => location.reload();
}

// ============ PISTAS / AYUDA / BITÁCORA ============
function verPistas() {
  const p = jugadorActual();
  let contenido;
  if (p.pistas.length === 0) {
    contenido = `${p.nombre} todavía no tiene pistas.\nSupera retos para conseguirlas.`;
  } else {
    const partes = [`Pistas de ${p.nombre}\n`];
    [...p.pistas].sort((a, b) => a - b).forEach(z => {
      partes.push(`Pista ${z + 1} (${ZONAS[z].nombre}): ${ZONAS[z].pista}`);
    });
    partes.push(`\nLlevas ${p.pistas.length} de 8 pistas.`);
    contenido = partes.join("\n");
  }
  abrirModal(`
    <div class="modal-header">
      Mis pistas
    </div>
    <div class="modal-body">
      <div class="contenido-texto">${escaparHTML(contenido)}</div>
    </div>
    <div class="modal-footer" style="justify-content:center">
      <button class="btn btn-primario" onclick="cerrarModal()">Cerrar</button>
    </div>
  `);
  modalContenido.dataset.cerrable = "true";
}

function mostrarAyuda() {
  abrirModal(`
    <div class="modal-header">
      Cómo se juega
    </div>
    <div class="modal-body">
      <div class="contenido-texto">${escaparHTML(AYUDA)}</div>
    </div>
    <div class="modal-footer" style="justify-content:center">
      <button class="btn btn-primario" onclick="cerrarModal()">Cerrar</button>
    </div>
  `);
  modalContenido.dataset.cerrable = "true";
}

function mostrarBitacora() {
  // Colorear nombres de jugadores en la bitácora
  const colores = {};
  juego.jugadores.forEach(p => colores[p.nombre] = p.color);
  const nombres = Object.keys(colores).sort((a, b) => b.length - a.length);

  const lineas = juego.bitacora.slice(-150).map(linea => {
    let html = escaparHTML(linea);
    // Reemplazar cada nombre por un span con su color
    nombres.forEach(nombre => {
      const regex = new RegExp(`\\b${nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "g");
      html = html.replace(regex,
        `<span class="nombre-jugador" style="color:${colores[nombre]}">${escaparHTML(nombre)}</span>`);
    });
    return "• " + html;
  }).join("\n");

  abrirModal(`
    <div class="modal-header">
      Bitácora de la partida
    </div>
    <div class="modal-body">
      <div class="contenido-texto">${lineas}</div>
    </div>
    <div class="modal-footer" style="justify-content:center">
      <button class="btn btn-primario" onclick="cerrarModal()">Cerrar</button>
    </div>
  `);
  modalContenido.dataset.cerrable = "true";
}

// ============ EVENTOS ============
$("#btn-accion").addEventListener("click", accionPrincipal);
$("#btn-bitacora").addEventListener("click", mostrarBitacora);
$("#btn-pistas").addEventListener("click", verPistas);
$("#btn-ayuda").addEventListener("click", mostrarAyuda);
$("#btn-salir").addEventListener("click", () => {
  guardar();
  if (confirm("La partida está guardada. ¿Salir al inicio?")) {
    mostrarPantalla("pantalla-inicio");
    actualizarBotonContinuar();   // ← refresca el estado del botón
  }
});

// Exponer cerrarModal al HTML generado con onclick
window.cerrarModal = cerrarModal;

// ============ ARRANQUE ============
iniciarInicio();