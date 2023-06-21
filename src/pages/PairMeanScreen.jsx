import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { firebase } from '../../firebase-config.js';

///////////////////////////////
////
////      PANTALLA DEL JUEGO DE PAREJA MODO DE SIGNIFICADO
////
//////////////////////////////////

const PairMeanScreen = () => {
  const [parejas, setParejas] = useState([]);
  const [parejasMezcladas, setParejasMezcladas] = useState([]);
  const [parejaActual, setParejaActual] = useState(0);
  const [cartasVisibles, setCartasVisibles] = useState([]);
  const [cartasAcertadas, setCartasAcertadas] = useState([]);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState([]);
  const [respuestasIncorrectas, setRespuestasIncorrectas] = useState([]);
  const [juegoFinalizado, setJuegoFinalizado] = useState(false);
  const MAX_PAREJAS = 10; // Establecer el límite de parejas a mostrar

  const currentUserUid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  useEffect(() => {
    
    // Obtener los mazos suscritos por el usuario
    const userMazosRef = db.collection('Usuarios').doc(currentUserUid).collection('Suscripciones');
    userMazosRef.onSnapshot((querySnapshot) => {
      const mazoPromises = querySnapshot.docs.map((doc) => {
        const mazoId = doc.id;
        return db.collection('Mazos').doc(mazoId).get();
      });
  
      //consulta a los mazos y obtener el simbolo y el significado
      Promise.all(mazoPromises).then((mazoSnapshots) => {
        const mazosData = mazoSnapshots.map((snapshot) => snapshot.data());
        const parejasData = mazosData.flatMap((mazoData) => Object.values(mazoData));
        const parejas = parejasData.map((subdoc) => {
          const { palabra, significado } = subdoc;
          return { palabra, significado };
        });
  
        const parejasAleatorias = shuffle(parejas).slice(0, MAX_PAREJAS);
        setParejas(parejasAleatorias);
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

  //Verificación si la selección es correcta o no
  const handleSelect = (index) => {
    const parejaSeleccionada = parejasMezcladas[index];
    const parejaCorrecta = parejas[parejaActual];

    //si la pareja es incorrecta
    if (parejaSeleccionada.significado !== parejaCorrecta.significado) {
      setCartasVisibles([...cartasVisibles, index]);//se mantiene esa carta en el juego
      setRespuestasIncorrectas([...respuestasIncorrectas, parejaSeleccionada]);//la selección se guarda en respuestasIncorrectas
      setTimeout(() => {
        setCartasVisibles(cartasVisibles.filter((item) => item !== index));//eliminar la carta seleccionada incorrecta del arreglo cartasVisibles
      }, 1000);                                                           //de esta manera se elima el estilo 'incorrectCard'
    } else {//si se acierta 
      setRespuestasCorrectas([...respuestasCorrectas, parejaSeleccionada]);//se guarda la pareja en respuestasCorrectas
      setCartasAcertadas([...cartasAcertadas, index]);//se guarda la pareja en cartasAcertadas para el seguimiento
  
      if (parejaActual + 1 < parejasMezcladas.length) {//si todavia hay parejas restantes
        setTimeout(() => {//avanza a la siguiente parejas si aun hay mas parejas para jugar
          setParejaActual(parejaActual + 1);
          setCartasVisibles([]);//oculta las cartas
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
    const isCardVisible = cartasVisibles.includes(index);//compruebas la carta visible
    const isCardCorrect = cartasAcertadas.includes(index);//comprueba si es correcta
    const cardStyle = [styles.item];
  
    if (isCardVisible) {
      cardStyle.push(styles.incorrectCard);//le pone estilo a la selección incorrecta
    }
  
    if (isCardCorrect) {
      cardStyle.push(styles.correctCard);//le pone estilo a la selección correcta
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

  //organizar aleatoriamente un array
  function shuffle(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  //volver a generar otra tanda de parejas aleatoria cuando el juego se reinicia
  const generarParejasAleatorias = () => {   
    const userMazosRef = db.collection('Usuarios').doc(currentUserUid).collection('Suscripciones');
    userMazosRef.onSnapshot((querySnapshot) => {
      const mazoPromises = querySnapshot.docs.map((doc) => {
        const mazoId = doc.id;
        return db.collection('Mazos').doc(mazoId).get();
      });
      
      Promise.all(mazoPromises).then((mazoSnapshots) => {
        const mazosData = mazoSnapshots.map((snapshot) => snapshot.data());
        const parejasData = mazosData.flatMap((mazoData) => Object.values(mazoData));
        const parejas = parejasData.map((subdoc) => {
          const { palabra, significado } = subdoc;
          return { palabra, significado };
        });
  
        const parejasAleatorias = shuffle(parejas).slice(0, MAX_PAREJAS);
        setParejas(parejasAleatorias);
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
                {parejas[parejaActual]?.significado}
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
    flexGrow: 1,
    margin: 20,
    padding: 10,
    paddingTop:20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  pregunta: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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

export default PairMeanScreen;
