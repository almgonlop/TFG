import React, { useState, useEffect } from 'react';
import { Text, View, FlatList,StyleSheet,TouchableOpacity } from 'react-native';
import { firebase } from '../../firebase-config.js';
import { useNavigation } from '@react-navigation/native';


const CardFirstChoice = () => {
  const [mazos, setMazos] = useState([]);
  const [usuarioMazos, setUsuarioMazos] = useState([]);
  const usuario = firebase.auth().currentUser; //Usuario actualmente autenticado
  const usuarioRef = firebase.firestore().collection('Usuarios').doc(usuario.uid); //Conseguir referencia al doc de la ID del usuario
  
  const navigation=useNavigation();

  useEffect(() => {
    const mazosRef = firebase.firestore().collection('Mazos');//COnseguir referencia a la colección Mazos
    
//Detectar un cambio en la colección "Suscripciones" del usuario actual y actualiza los mazos que tiene el usuario asociados
    const usuarioMazosListener = usuarioRef.collection('Suscripciones').onSnapshot(snapshot => {
      const mazoIds = snapshot.docs.map(doc => doc.id);
      setUsuarioMazos(mazoIds);
    });

    //Detectar un cambio en la colección "Mazos" y actualizar los mazos que tiene el usuario asociados
    const mazosListener = mazosRef.onSnapshot(snapshot => {
      const mazoData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMazos(mazoData);
    });

    return () => {
      usuarioMazosListener();
      mazosListener();
    };
  }, []);

 //Añade el mazo a las suscripciones del usuario
 const anadirMazo = async (mazoId) => {
  await usuarioRef.collection('Suscripciones').doc(mazoId).set({});
};

//Quita el mazo de las suscripciones del usuario
const quitarMazo = async (mazoId) => {
  await usuarioRef.collection('Suscripciones').doc(mazoId).delete();
};

  return (
    <View style={styles.container}>
    <View  style={styles.caja}>
      <Text style={styles.titulo}>Mis mazos:</Text>

      {/*Este FLatList permite renderizar la lista de los mazos a los que está suscrito el usuario*/}
      <FlatList
        data={mazos.filter(mazo => usuarioMazos.includes(mazo.id))}
        renderItem={({ item }) => (
          <View  style={styles.lista}>
            <Text style={styles.text}>{item.id}</Text>
            <TouchableOpacity style={styles.buttonDel} onPress={() => quitarMazo(item.id)}>
        <Text style={styles.buttonTextDel}>Quitar</Text>
        
      </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Text style={styles.titulo}>Mazos disponibles:</Text>

      {/*Este FLatList permite renderizar la lista de los mazos a los que NO está suscrito el usuario*/}
      <FlatList
        data={mazos.filter(mazo => !usuarioMazos.includes(mazo.id))}
        renderItem={({ item }) => (
          <View style={styles.lista}> 
            <Text style={styles.text}>{item.id}</Text>
            <TouchableOpacity style={styles.buttonAdd} onPress={() => anadirMazo(item.id)}>
        <Text style={styles.buttonTextAdd}>Añadir</Text>
        
      </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Continuar</Text>
        
      </TouchableOpacity>

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
    flexGrow: 1,
    margin: 20,
    padding: 10,
    paddingTop:20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  lista:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  titulo:{
    fontSize: 18,
    fontWeight: 'bold',
  },
  text:{
    fontSize: 18,
  },
  buttonTextAdd: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },    
  buttonAdd: {
    backgroundColor: '#E95050',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical:5,
    position: 'absolute',
    marginRight:10,
    right:0
  },  
  buttonTextDel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },    
  buttonDel: {
    backgroundColor: 'gray',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical:5,
    position: 'absolute',
    marginRight:10,
    right:0
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderColor:'#E95050',
    borderWidth: 5
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E95050',
    textAlign: 'center',
  }
});
export default CardFirstChoice;
