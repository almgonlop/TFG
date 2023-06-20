import { StyleSheet, Text, View,TouchableOpacity} from 'react-native'
import React from 'react';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

///////////////////////////////
////
////      PANTALLA DEL JUEGO DE PAREJAS
////
//////////////////////////////////


const PairGameScreen = () => {
  const navigation = useNavigation();

    return (
      <View style={styles.container}>
      <View style={styles.caja}>
      <Text style={styles.titulo}>
    Selecciona el modo de juego:
  </Text>
  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pinyin Parejas')}>
          
          <Text style={styles.buttonText}>Modo Pinyin</Text>
          <View style={styles.rightContent}>
            <Icon name="arrow-right" size={20} color="white" />
          </View>
        </TouchableOpacity>
      
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Significado Parejas')}>
        
        <Text style={styles.buttonText}>Modo Significado</Text>
        <View style={styles.rightContent}>
          <Icon name="arrow-right" size={20} color="white" />
        </View>
      </TouchableOpacity>
          </View>
        </View>
      );
}

export default PairGameScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#E95050'
    
  }, 
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:15
  },
  caja: {
    flexGrow: 1, // Ocupa el espacio restante en el contenedor principal
    margin: 20,
    padding: 10,
    paddingTop:20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Alinea los elementos a los extremos del contenedor
    margin: 10,
    padding: 16,
    backgroundColor: '#E95050',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  rightContent: {
    marginLeft: 8,
  }
})