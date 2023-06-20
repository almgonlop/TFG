import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, CheckBox, Animated, Image } from 'react-native';
import { firebase } from '../../firebase-config.js';

///////////////////////////////
////
////      PANTALLA DEL JUEGO DE TARJETA MODO DE SIGNIFICADO
////
//////////////////////////////////

const CardMeanScreen = () => {
  const [mazos, setMazos] = useState([]);
  const [currentMazoIndex, setCurrentMazoIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [config, setConfig] = useState({});
  const animatedValue = useRef(new Animated.Value(0)).current;

  const currentUserUid = firebase.auth().currentUser.uid;
  const db = firebase.firestore();
  useEffect(() => {

    // Obtener los mazos suscritos del usuario
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
            const { palabra, pinyin, pinyintono, significado } = subdoc;
            mazos.push({ palabra, pinyin, pinyintono, significado });
          });
        });
        setMazos(mazos);
        console.log(mazos);
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

  useEffect(() => {
    animatedValue.setValue(0); //Reiniciar la animación al cambiar la tarjeta actual
  }, [currentMazoIndex]);

  //Mostar el pinyin
  const togglePinyin = () => {
    setShowPinyin(!showPinyin);
  };

  //Mostar el color del tono
  const toggleColor = () => {
    setShowColor(!showColor);
  };

  //Ir al siguiente mazo
  const goToNextMazo = () => {
    if (currentMazoIndex < mazos.length - 1) {
      setCurrentMazoIndex(currentMazoIndex + 1);
      setShowAnswer(false);
    }
  };

  //Ir al anterior mazo
  const goToPrevMazo = () => {
    if (currentMazoIndex > 0) {
      setCurrentMazoIndex(currentMazoIndex - 1);
      setShowAnswer(false);
    }
  };

  const currentMazo = mazos[currentMazoIndex];

  //Guardar cada palabra de pinyintono
  const pinyintonoWords = currentMazo && currentMazo.pinyintono ? currentMazo.pinyintono.split(' ') : [];

  //Guardar cada caracter de 'palabra' (los simbolos)
  const symbolChars = currentMazo && currentMazo.palabra ? currentMazo.palabra.split('') : [];
  
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
        style.fontSize=30;
        style.fontWeight= 'bold';
      }
    }

    const symbol = symbolChars[index];

    return (
      <Text key={index} style={style}>
        {symbol}
      </Text>
    );
  });

  // Animación de girar la tarjeta
  const handleFlip = () => {
    Animated.timing(animatedValue, {
      toValue: showAnswer ? 0 : 180,
      
    }).start(() => {
      setShowAnswer(!showAnswer);
    });
  };

  /*Estilos para la parte frontal y trasera de la tarjeta.
    Necesarios para poder ver la animación de rotación y que el contenido de las tarjetas se vea  */
  const interpolatedRotateFront = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const interpolatedRotateBack = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: interpolatedRotateFront }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: interpolatedRotateBack }],
  };
  const designUrl = `${config.diseño}.jpg`; // URL de la imagen del diseño seleccionado
  console.log(designUrl)

  return (
    <View style={styles.container}>
      <View style={styles.caja}>
        <Text style={styles.text}>¡Presiona la tarjeta para darle la vuelta!</Text>
        <TouchableOpacity style={styles.card} onPress={handleFlip}>
          <Animated.View style={[styles.cardFront, frontAnimatedStyle]}>
            <Image source={{ uri: designUrl }} style={styles.backgroundImageTop} />
            {showAnswer ? (
              <Text style={styles.text}></Text>
            ) : (
              <View style={styles.wordContainer}>
                <Text style={styles.word}>{showAnswer? currentMazo && currentMazo.palabra
                  : showColor
                  ? currentMazo && words
                  : currentMazo && currentMazo.palabra}</Text>
                <Text style={styles.text}>
                  {showAnswer
                    ? currentMazo && ''
                    : showPinyin
                    ? currentMazo && currentMazo.pinyin
                    : currentMazo && ''}
                </Text>
              </View>
            )}
          </Animated.View>
          
          <Animated.View style={[styles.cardBack, backAnimatedStyle]}>
            <Image source={{ uri: designUrl }} style={[styles.backgroundImage]} />
            {showAnswer ? (
              <View style={styles.wordContainer}>
                <Text style={styles.word}>{currentMazo && currentMazo.significado}</Text>
              </View>
            ) : (
              <Text style={styles.text}></Text>
            )}
          </Animated.View>

        </TouchableOpacity>
        <View style={styles.checkboxContainer}>
          <CheckBox value={showPinyin} onValueChange={togglePinyin} />
          <Text style={styles.checkboxLabel}>Mostrar pinyin</Text>
          <CheckBox value={showColor} onValueChange={toggleColor} />
          <Text style={styles.checkboxLabel}>Mostrar color de tonos</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={goToPrevMazo}>
            <Text style={styles.buttonText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToNextMazo}>
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#E95050'
  },
  caja: {
    flexGrow: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 10,
    paddingTop:20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginTop: 15,
    marginBottom: 16,
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
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
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  wordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 20
  },
  word: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 18,
    margin: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#E95050',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical:5,
    margin:5
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
    transform:[{ rotate: '180deg' }] 
  },  backgroundImageTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
   
  },
};

export default CardMeanScreen;
