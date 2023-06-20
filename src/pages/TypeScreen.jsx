import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, CheckBox, Animated,Image,TouchableOpacity } from 'react-native';
import { firebase } from '../../firebase-config.js';

///////////////////////////////
////
////      PANTALLA DEL JUEGO DE MECANOGRAFÍA
////
//////////////////////////////////

const TypeScreen = () => {
  const [userMazos, setUserMazos] = useState([]);
  const [mazoIndex, setMazoIndex] = useState(0);
  const [answerValue, setAnswerValue] = useState('');
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [intervalId, setIntervalId] = useState(null); // Almacenar el ID del intervalo
  const [showColor, setShowColor] = useState(false);
  const [config, setConfig] = useState({});
  const currentUserUid = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  useEffect(() => {
  
    // Obtener los mazos suscritos por el usuario
    const userMazosRef = db.collection('Usuarios').doc(currentUserUid).collection('Suscripciones');
    
    const unsubscribe = userMazosRef.onSnapshot((querySnapshot) => {
      const mazoIds = querySnapshot.docs.map((doc) => doc.id);

      // Obtener los datos de los mazos
      const mazoPromises = mazoIds.map((mazoId) => {
        return db.collection('Mazos').doc(mazoId).get();
      });

      Promise.all(mazoPromises).then((mazoSnapshots) => {
        const mazos = [];
        mazoSnapshots.forEach((snapshot) => {
          const mazoData = snapshot.data();
          const subdocumentData = Object.values(mazoData);
          subdocumentData.forEach((subdoc) => {
            const { palabra, pinyin, pinyintono } = subdoc;
            mazos.push({ palabra, pinyin, pinyintono });
          });
        });
        setUserMazos(mazos);
      });
    });

    return () => unsubscribe();
  }, []);

// Obtener la configuración del usuario
  useEffect(() => {
    const configRef = db.collection('UsuConfig').doc(currentUserUid);
    const unsubscribe = configRef.onSnapshot((doc) => {
      const data = doc.data();
      if (data) {
        setConfig({
          tono1: data.tono1,
          tono2: data.tono2,
          tono3: data.tono3,
          tono4: data.tono4,
          diseño: data.design,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Formatear el timepo transcurrido desde que empezó el juego hasta que se completó
const formatTimeElapsed = (startTime, endTime) => {
  if (startTime === 0 || endTime === 0) {
    return '00:00';
  }

  const timeElapsed = Math.floor((endTime - startTime) / 1000); // Tiempo transcurrido en segundos
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const formattedTime = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  return formattedTime;
};

  useEffect(() => {
    // Iniciar el temporizador cuando el juego comienza
    if (gameStarted) {
      setStartTime(Date.now());

      const id = setInterval(() => {
        setEndTime(Date.now());
      }, 1000);

      setIntervalId(id); // Almacenar el ID del intervalo

      return () => {
        clearInterval(intervalId);
      }; // Detener el temporizador cuando el juego finaliza
    }
  }, [gameStarted]);

  // Cunado el usuario escribe realiza la verificación
  const handleAnswerChange = (value) => {
    setAnswerValue(value);
    checkAnswer(value);
  };

  // Comprueba si lo que sse ha escrito es correcto. Pasa a la siguiente palabra o para el juego
  const checkAnswer = (value) => {
    const mazo = userMazos[mazoIndex] || {};
    if (value === mazo.pinyin || value === mazo.pinyintono) {
      setScore(score + 1);
      if (mazoIndex >= userMazos.length - 1) {
        setCompleted(true);
        setEndTime(Date.now());
        clearInterval(intervalId); // Limpiar el intervalo del temporizador
      } else {
        setMazoIndex(mazoIndex + 1);
        setAnswerValue('');
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    setMazoIndex(0);
    setAnswerValue('');
    setCompleted(false);
    setGameStarted(false);
    setStartTime(0);
    setEndTime(0);
    setScore(0);
  };

  // Mostar el color del tono
  const toggleColor = () => {
    setShowColor(!showColor);
  };

  const mazo = userMazos[mazoIndex] || {};

  //Guardar cada palabra de pinyintono
  const pinyintonoWords = mazo && mazo.pinyintono ? mazo.pinyintono.split(' ') : [];

  //Guardar cada caracter de 'palabra' (los simbolos)
  const symbolChars = mazo && mazo.palabra ? mazo.palabra.split('') : [];

  //Extrae los números que se encuentran en pinyintonoWords para identificar el tono y pintar el simbolo
  const words = pinyintonoWords.map((word, index) => {//iteracion sobre cada palabra de pinyintonoWords
    const style = {};
    const tones = {};

    for (const field in config) {
      if (config[field]) {
        tones[field.slice(-1)] = config[field];
      }
    }

    for (let i = 0; i < word.length; i++) {
      const num = parseInt(word[i], 10);
      if (tones[num]) {
        style.color = tones[num];
      }
    }

    const symbol = symbolChars[index];

    return (
      <Text key={index} style={style}>
        {symbol}
      </Text>
    );
  });

  if (completed) {
    const timeElapsed = Math.floor((endTime - startTime) / 1000); // Tiempo transcurrido en segundos
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const formattedTime = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    return (// Devuelve la interfaz del juego cuando finaliza
      <View style={styles.caja}>
        <Text style={styles.completedMessage}>¡Completado!</Text>
        <Text style={styles.text}>Tiempo transcurrido: {formattedTime}</Text>
        <Text style={styles.text}>Número total de palabras acertadas: {score}</Text>
        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const designUrl = `${config.diseño}.jpg`; // URL de la imagen del diseño seleccionado


  return (    
 
    <View style={styles.container}>
      <View  style={styles.caja}>
      {!gameStarted ? (// Muestra una pantalla donde da las introducciones para completar el juego
        <><Text style={styles.text}>Para acertar el simbolo puedes escribir la respuesta de dos formas.</Text>
        <Text style={styles.text}>Ejemplo: 妈妈</Text>
        <Text style={styles.text}>Respuestas: mā ma / ma1 ma0</Text>
        <Text style={styles.titulo}>¡Pulsa el botón para empezar!</Text>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
        </>
      ) : (// Muestra el juego
        <><Text style={styles.text}>Escribe el pinyin correspondiente</Text>
        <View style={styles.card}>
          <Animated.View style={[styles.cardFront]}>
        <Image source={{ uri: designUrl }} style={styles.backgroundImage}/>
          <View style={styles.wordContainer}>
          <Text style={styles.simbolo}>{ showColor
              ? words
              : mazo && mazo.palabra}</Text>
            </View>
              
              </Animated.View>
              </View>
          <TextInput style={styles.input} value={answerValue} onChangeText={handleAnswerChange} />
          <Text style={styles.text}>Tiempo transcurrido: {formatTimeElapsed(startTime, endTime)}</Text>
          <Text style={styles.text}>Número de palabras acertadas: {score}</Text>
          <View style={styles.checkboxContainer}>
        <CheckBox value={showColor} onValueChange={toggleColor} />
        <Text style={styles.checkboxLabel}>Mostrar color de tonos</Text>
          </View>
        </>
      )}
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#E95050'
  },

  caja: {
    flexGrow: 1, // Ocupa el espacio restante en el contenedor principal
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 10,
    paddingTop:20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
    cardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  text:{
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 18,
  },
  titulo:{
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
    card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  wordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 20
  },
  completedMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  simbolo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginTop:10,
    marginBottom: 20,
    width: '80%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 18
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
  },  
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },    
  button: {
    backgroundColor: '#E95050',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical:10,
    marginTop:15
  }
});

export default TypeScreen;
