import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { firebase } from '../../firebase-config.js';

const PairPinyinScreen = () => {
  const [parejas, setParejas] = useState([]);
  const [parejasMezcladas, setParejasMezcladas] = useState([]);
  const [parejaActual, setParejaActual] = useState(0);
  const [cartasVisibles, setCartasVisibles] = useState([]);
  const [cartasAcertadas, setCartasAcertadas] = useState([]);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState([]);
  const [respuestasIncorrectas, setRespuestasIncorrectas] = useState([]);
  const [juegoFinalizado, setJuegoFinalizado] = useState(false);
  const MAX_PAREJAS = 10; // Establecer el límite de parejas a mostrar

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
  
    // Obtener los mazos suscritos por el usuario
    const userMazosRef = db.collection('Usuarios').doc(uid).collection('Suscripciones');
    userMazosRef.get().then((querySnapshot) => {
      const mazoPromises = querySnapshot.docs.map((doc) => {
        const mazoId = doc.id;
        return db.collection('Mazos').doc(mazoId).get();
      });
  
      Promise.all(mazoPromises).then((mazoSnapshots) => {
        const mazosData = mazoSnapshots.map((snapshot) => snapshot.data());
        const parejasData = mazosData.flatMap((mazoData) => Object.values(mazoData));
        const parejas = parejasData.map((subdoc) => {
          const { palabra, pinyin } = subdoc;
          return { palabra, pinyin };
        });
  
        const parejasAleatorias = shuffle(parejas).slice(0, MAX_PAREJAS);
        setParejas(parejasAleatorias);
        setParejasMezcladas(shuffle(parejasAleatorias));
      });
    });
  }, []);
  

  useEffect(() => {
    // Mezclar las parejas
    const parejasMezcladas = shuffle(parejas);
    setParejasMezcladas(parejasMezcladas);
    setParejaActual(0);
    setCartasVisibles([]);
  }, [parejas]);

  const handleSelect = (index) => {
    const parejaSeleccionada = parejasMezcladas[index];
    const parejaCorrecta = parejas[parejaActual];
  
    if (parejaSeleccionada.pinyin !== parejaCorrecta.pinyin) {
      setCartasVisibles([...cartasVisibles, index]);
      setRespuestasIncorrectas([...respuestasIncorrectas, parejaSeleccionada]);
      setTimeout(() => {
        setCartasVisibles(cartasVisibles.filter((item) => item !== index));
      }, 1000);
    } else {
      setRespuestasCorrectas([...respuestasCorrectas, parejaSeleccionada]);
      setCartasAcertadas([...cartasAcertadas, index]);
  
      if (parejaActual + 1 < parejasMezcladas.length) {
        setTimeout(() => {
          setParejaActual(parejaActual + 1);
          setCartasVisibles([]);
        }, 1000);
      } else {
        // Finalizar el juego
        
        setParejasMezcladas([]);
        setCartasVisibles([]);
        setJuegoFinalizado(true);
      }
    }
  };
  
  const mayor = respuestasCorrectas.length > respuestasIncorrectas.length ? 'correctas' : 'incorrectas';

  const renderItem = ({ item, index }) => {
    const isCardVisible = cartasVisibles.includes(index);
    const isCardCorrect = cartasAcertadas.includes(index);
    const cardStyle = [styles.item];
  
    if (isCardVisible) {
      cardStyle.push(styles.incorrectCard);
    }
  
    if (isCardCorrect) {
      cardStyle.push(styles.correctCard);
    }
  
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={() => handleSelect(index)}
        disabled={isCardVisible}
      >
        <Text style={styles.itemText}>{item.palabra}</Text>
      </TouchableOpacity>
    );
  };

  function shuffle(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }
  const generarParejasAleatorias = () => {
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
  
    // Obtener los mazos suscritos por el usuario
    const userMazosRef = db.collection('Usuarios').doc(uid).collection('Suscripciones');
    userMazosRef.get().then((querySnapshot) => {
      const mazoPromises = querySnapshot.docs.map((doc) => {
        const mazoId = doc.id;
        return db.collection('Mazos').doc(mazoId).get();
      });
  
      Promise.all(mazoPromises).then((mazoSnapshots) => {
        const mazosData = mazoSnapshots.map((snapshot) => snapshot.data());
        const parejasData = mazosData.flatMap((mazoData) => Object.values(mazoData));
        const parejas = parejasData.map((subdoc) => {
          const { palabra, pinyin } = subdoc;
          return { palabra, pinyin };
        });
  
        const parejasAleatorias = shuffle(parejas).slice(0, MAX_PAREJAS);
        setParejas(parejasAleatorias);
        setParejasMezcladas(shuffle(parejasAleatorias));
      });
    });
  };
  
  
  const reiniciarJuego = () => {
    setParejaActual(0);
    setParejasMezcladas(shuffle(parejas));
    setCartasVisibles([]);
    setCartasAcertadas([]);
    setJuegoFinalizado(false);
    setRespuestasIncorrectas([]);
    generarParejasAleatorias();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.caja}>
      {parejas.length === 0 ? (
        <Text>No tienes mazos asignados</Text>
      ) : (
        <>
          {!juegoFinalizado && (
            <>
              <Text style={styles.pregunta}>
                ¿Qué pareja corresponde a la siguiente palabra?
              </Text>
              <Text style={styles.palabra}>
                {parejas[parejaActual]?.pinyin}
              </Text>
            </>
          )}
          <FlatList
            data={parejasMezcladas}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.palabra}-${index}`}
            numColumns={2}
            contentContainerStyle={styles.itemsContainer}
          />
          {juegoFinalizado && (
            <View style={styles.caja}>
              <Text style={styles.felicidades}>¡Felicidades, has terminado el juego!</Text>
              <Text style={styles.resumen}>
                Respuestas incorrectas: {respuestasIncorrectas.length} 
                {'\n'}
                La mayoría de tus respuestas han sido {mayor}.
              </Text>
              <TouchableOpacity style={styles.button} onPress={reiniciarJuego}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
            </View>
          )}
        </>
      )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E95050',
    paddingHorizontal: 10,
  },
  caja: {
    flexGrow: 1, // Ocupa el espacio restante en el contenedor principal
    margin: 20,
    padding: 10,
    paddingTop:20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  pregunta: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  palabra: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemsContainer: {
    alignItems: 'center',
  },
  item: {
    backgroundColor: 'white',
    borderColor:'#E95050',
    borderWidth: 3,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  correctCard: {
    backgroundColor: 'green',
  },
  incorrectCard: {
    backgroundColor: 'red',
  },
  felicidades: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resumen: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
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

export default PairPinyinScreen;
