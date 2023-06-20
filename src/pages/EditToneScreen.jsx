import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ScrollView} from 'react-native';
import { firebase } from '../../firebase-config.js';
import { CirclePicker } from 'react-color';

///////////////////////////////
////
////      PANTALLA PARA ELEGIR LOS TONOS
////
//////////////////////////////////


export default function EditToneScreen() {
  const [tono1, setTono1] = useState('');
  const [tono2, setTono2] = useState('');
  const [tono3, setTono3] = useState('');
  const [tono4, setTono4] = useState('');
  const [tonoSeleccionado, setTonoSeleccionado] = useState('');
  const currentUserUid = firebase.auth().currentUser.uid;
  //Carga la configuracón del usuario
  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('UsuConfig').doc(currentUserUid)
      .onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          setTono1(data.tono1);
          setTono2(data.tono2);
          setTono3(data.tono3);
          setTono4(data.tono4);
        }
      }, error => {
        console.log('Error al recuperar la configuración del usuario:', error);
      });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  //Guardar la configuración de los tonos del usuario
  const guardarCambios = () => {
    firebase.firestore().collection('UsuConfig').doc(currentUserUid)
      .set({
        tono1,
        tono2,
        tono3,
        tono4
      }, { merge: true })// evita modificar otros datos
      .then(() => {
        console.log('Configuración de tonos guardada correctamente');
      })
      .catch(error => {
        console.log('Error al guardar la configuración de tonos:', error);
      });
  };
  
  //Cambia el tono
  const handleChange = (color, setTono) => {
    setTono(color);
  };

  //Actualiza el tono
  const handleTonoSeleccionado = tono => {
    setTonoSeleccionado(tono);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.caja}>
        <Text style={styles.titulo}>
          Selecciona el color de los tonos:
        </Text>
        <Text style={styles.subtitulo}>
          ¡Puedes editar los colores para facilitar tu aprendizaje!
        </Text>
        
        <View style={styles.columna}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={[styles.ejemplo, { color: tono1 }]}>ā</Text>
          <Text style={[styles.ejemplo, { color: tono2 }]}>é</Text>
          <Text style={[styles.ejemplo, { color: tono3 }]}>ǒ</Text>
          <Text style={[styles.ejemplo, { color: tono4 }]}>ù</Text></View>

          {/*Muesta un circulo con el color seleccionado, 
          al clicar se abre un panel donde poder seleccionar otros colores*/}
          <TouchableOpacity style={styles.fila} onPress={() => handleTonoSeleccionado('tono1')}>
            <Text style={styles.texto}>Tono 1:</Text>
            <View style={[{backgroundColor: tono1}, styles.colores]}/>
          </TouchableOpacity>
          {tonoSeleccionado === 'tono1' && (<View style={styles.centrar}>
            <CirclePicker color={tono1} onChangeComplete={color =>
                handleChange(color.hex, setTono1)
              }
            /></View>
          )}


          <TouchableOpacity style={styles.fila} onPress={() => handleTonoSeleccionado('tono2')}>
            <Text style={styles.texto}>Tono 2:</Text>
            <View style={[{backgroundColor: tono2}, styles.colores]}/>
            </TouchableOpacity>
            {tonoSeleccionado === 'tono2' && (<View style={styles.centrar}>
              <CirclePicker color={tono2} onChangeComplete={color =>
                handleChange(color.hex, setTono2)
              }
              /></View>
            )}


            <TouchableOpacity style={styles.fila} onPress={() => handleTonoSeleccionado('tono3')}>
            <Text style={styles.texto}>Tono 3:</Text>
            <View style={[{backgroundColor: tono3}, styles.colores]}/>
            </TouchableOpacity>
            {tonoSeleccionado === 'tono3' && (<View style={styles.centrar}>
              <CirclePicker color={tono3} onChangeComplete={color =>
                handleChange(color.hex, setTono3)
              }
              /></View>
            )}


            <TouchableOpacity style={styles.fila} onPress={() => handleTonoSeleccionado('tono4')}>
            <Text style={styles.texto}>Tono 4:</Text>
            <View style={[{backgroundColor: tono4}, styles.colores]}/>
            </TouchableOpacity>
              {tonoSeleccionado === 'tono4' && (<View style={styles.centrar}>
                <CirclePicker color={tono4} onChangeComplete={color =>
                  handleChange(color.hex, setTono4)
                }
              /></View>
            )}


          </View>
          <TouchableOpacity style={styles.button} onPress={() => guardarCambios()}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
          );
}

const styles = StyleSheet.create({
  centrar:{
    alignItems: 'center'
  },
  container: {
    flex: 1,
    padding: 20,paddingHorizontal: 10,
    backgroundColor: '#E95050',
    alignSelf: 'center'
    
  },  caja: {
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
  ejemplo: {
    flexDirection: 'row',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10
  },
  subtitulo: {
    fontSize: 17,
    marginTop:5,
    textAlign: 'center'

  },
  columna: {
    flexDirection: 'column',
    marginTop: 20,
  },
  fila: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center', 
  },
  texto: {
    fontSize: 18,
    fontWeight: 'bold',
    flexWrap: 'nowrap', // Evita la separación de línea en el texto
    marginRight: 10, // Agrega un margen derecho para separar el texto del círculo de color
  },
  colores: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#E95050',
    borderRadius: 25,
    padding: 12,
    paddingHorizontal: 30,
    margin: 20,
    
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  }
});
