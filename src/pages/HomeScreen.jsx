import { ScrollView, Text, View, StyleSheet,TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebase } from '../../firebase-config.js';


///////////////////////////////
////
////      PANTALLA PRINCIPAL
////
//////////////////////////////////



export default function HomeScreen() {
  const navigation = useNavigation();
  const [mazos, setMazos] = useState([]);
  const currentUserUid = firebase.auth().currentUser?.uid;

  useEffect(() => {//Acceso actualizado a la colección Suscripciones del usuario
    const unsubscribe = firebase.firestore().collection('Usuarios').doc(currentUserUid).collection('Suscripciones')
      .onSnapshot((snapshot) => {
        const mazoIds = snapshot.docs.map((doc) => doc.id);
        const mazoPromises = mazoIds.map((mazoId) => {
          return firebase.firestore().collection('Mazos').doc(mazoId).get();
        });
        Promise.all(mazoPromises).then((mazoDocs) => {
          const mazoData = mazoDocs.map((doc) => ({
            mazoId: doc.id,
            nombre: doc.data().nombre,
          }));
          setMazos(mazoData);
        });
      });

    return () => unsubscribe();
  }, []);

  if (mazos.length === 0) {//si no hya mazos muestra un mensaje
    return <View style={styles.container}><View style={styles.caja}><Text style={styles.titulo}>No hay mazos para mostrar.</Text>
    <Text style={styles.titulo}>Ve a los ajustes para añadir mazos.</Text></View></View>;
  }


  return (
    <ScrollView  style={styles.container}>
      <View style={styles.caja}>
        <Text style={styles.titulo}>Estos son tus mazos actuales:</Text>
        <View style={styles.columnContainer}>
          {mazos.map((mazo, index) => (
            mazo && (
              <View key={mazo.mazoId || index} style={styles.columnItem}>
                <Text style={styles.text}>{mazo.mazoId}</Text>
              </View>
            )
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Juego de Tarjetas')}>
          <View style={styles.leftContent}>
            <Text style={styles.simbolo}>寫</Text>
          </View>
          <Text style={styles.buttonText}>Tarjetas</Text>
          <View style={styles.rightContent}>
            <Icon name="arrow-right" size={20} color="white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Juego de Mecanografía')}>
          <View style={styles.leftContent}>
            <Icon name="keyboard-o" size={20} color="red" />
          </View>
          <Text style={styles.buttonText}>Mecanografía</Text>
          <View style={styles.rightContent}>
            <Icon name="arrow-right" size={20} color="white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Juego de Parejas')}>
          <View style={styles.leftContent}>
            <Icon name="clone" size={20} color="red" />
          </View>
          <Text style={styles.buttonText}>Parejas</Text>
          <View style={styles.rightContent}>
            <Icon name="arrow-right" size={20} color="white" />
          </View>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  columnItem: {
    width: '50%', 
    paddingHorizontal: 10,
    marginBottom: 10,
  },
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
  simbolo: {
    color: '#E95050',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:15
  },
  text:{
     fontSize: 18, 
     fontWeight: 'bold',
     marginBottom:10
    },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    margin: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E95050',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  leftContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    width: 40,
    height: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  rightContent: {
    marginLeft: 8,
  },
});