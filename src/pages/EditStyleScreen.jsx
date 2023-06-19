import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { firebase } from '../../firebase-config';

const EditStyleScreen = () => {
  const [designUrls, setDesignUrls] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState('');
  const uid = firebase.auth().currentUser.uid;

  useEffect(() => {
    const storageRef = firebase.storage().ref().child('tarjetas'); //Referencia a la carpeta 'tarjeta' de Storage

    //Se lista los elementos que hay en "tarjetas" y se obtine la url de cada elemento
    storageRef.listAll().then((res) => {
        const urls = res.items.map((item) => item.getDownloadURL());
        return Promise.all(urls); //espera que las promesas se resuelvan
      })
      .then((downloadUrls) => {
        setDesignUrls(downloadUrls);
      })
      .catch((error) => {
        console.log('Error al obtener los diseños de tarjeta:', error);
      });
  }, []);

  useEffect(() => {
  
    const configRef = firebase.firestore().collection('UsuConfig').doc(uid);
  
    const unsubscribe = configRef.onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setSelectedDesign(data.design || '');
      }
    }, (error) => {
      console.log('Error al obtener el diseño guardado:', error);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  //Acceder a la configuración del usuario y actualizar el diseño  por la url del seleccionado
  const handleSelectDesign = async (designUrl) => {
    try {
      const configRef = firebase.firestore().collection('UsuConfig').doc(uid);

      await configRef.update({ design: designUrl });
      setSelectedDesign(designUrl);
      console.log('Diseño guardado correctamente');
    } catch (error) {
      console.log('Error al guardar el diseño:', error);
    }
  };

  //Mostrar cada imagen en la pantalla y ponerle el estilo correspondiente a la seleccionada
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
      style={[styles.designItem, item === selectedDesign && styles.selectedDesignItem]}

        onPress={() => handleSelectDesign(item)}
      >
        <Image source={{ uri: item }} style={styles.designImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.caja}>
      <Text style={styles.titulo}>Selecciona un diseño de tarjeta:</Text>
      <View style={styles.columna}>
      <FlatList
        data={designUrls}
        numColumns={2}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.designList}
      />
      </View>
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
  columna: {
    flexDirection: 'column',
    marginTop: 20,
  },
  caja: {
    flexGrow: 1, // Ocupa el espacio restante en el contenedor principal
    margin: 20,
    padding: 10,
    paddingTop:20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  designList: {
    alignItems: 'center',
    margin: 10,
    
  },
  designItem: {
    margin: 8,
    borderWidth: 4,
    borderColor: 'gray',
    borderRadius: 8,
  },
  selectedDesignItem: {
    borderColor: '#E95050',
  },
  designImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default EditStyleScreen;
