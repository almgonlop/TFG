import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, signOut } from 'firebase/auth';//ESTO ES PARA EL BOTON DE CERRAR SESION

const SettingsScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada");
        navigation.navigate('LoginScreen');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.caja}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Edición de Tonos')}>
        <Text style={styles.text}>Edición de Tonos</Text>
        <View style={styles.rightContent}>
          <Icon name="arrow-right" size={20} color="black" />
        </View>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Edición de Mazos')}>
        <Text style={styles.text}>Edición de Mazos</Text>
        <View style={styles.rightContent}>
          <Icon name="arrow-right" size={20} color="black" />
        </View>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Edición de Estilos')}>
        <Text style={styles.text}>Edición de Estilos</Text>
        <View style={styles.rightContent}>
          <Icon name="arrow-right" size={20} color="black" />
        </View>
      </TouchableOpacity>
 
      <View style={{flex: 1}}>
      <TouchableOpacity style={styles.buttonLogOut} onPress={handleSignOut}>
        <Text style={styles.textLogOut}>Cerrar sesión</Text>
        <View style={styles.rightContent}>
          <Icon name="sign-out" size={20} color="white" />
        </View>
      </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#E95050'
  },
  caja: {
    flexGrow: 1, // Ocupa el espacio restante en el contenedor principal
    margin: 20,
    padding: 10,
    paddingTop:20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: '#E95050',
  },
  buttonLogOut: {
    position: 'absolute',
    bottom: 0, // Coloca el botón en la parte inferior del contenedor
    left: 0, // Alinea el botón a la izquierda
    right: 0, // Alinea el botón a la derecha
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centrar horizontalmente
    margin: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E95050',
    borderRadius: 20,
  },
  button: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  textLogOut: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
  },
  text: {
    fontSize: 18,
    flex: 1,
  },
  rightContent: {
    marginLeft: 8,
  },
});

