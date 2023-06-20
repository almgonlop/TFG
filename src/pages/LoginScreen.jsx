import {StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

///////////////////////////////
////
////      PANTALLA INICIAL
////
//////////////////////////////////


export default function LoginScreen(){
  const navigation=useNavigation();

  return(
    <View style={styles.container}>
      <ImageBackground source={require('../data/fondo.jpg')} style={styles.backgroundImage}>
        <View style={styles.contentContainer}>
          <Text style={styles.welcome}>¡Bienvenido!</Text>
          <TouchableOpacity
            style={styles.buttonReg}
            onPress={() => navigation.navigate('Registrarse')}
          >
            <Text style={styles.buttonTextReg}>Registrarse</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Iniciar sesión')}
          >
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          
        </View>
      </ImageBackground>
    </View>
  );
  } 
   
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
      flex: 1,
      resizeMode: 'stretch', 
      justifyContent: 'center'
    },
    contentContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 20,
      padding: 30,
      alignSelf: 'center',
      alignItems: 'center',
    },
    welcome: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 20,
      textAlign: 'center',
      textShadowColor: 'black', // Color de la sombra
  textShadowOffset: { width: 1, height: 1 }, // Tamaño de la sombra
  textShadowRadius: 2,
    },
    button: {
      backgroundColor: 'white',
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 30,
      marginVertical: 10,
    },buttonReg: {
      backgroundColor: '#E95050',
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 30,
      marginVertical: 10,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#E95050',
      textAlign: 'center',
    },buttonTextReg: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
  });
  