import * as React from 'react'; 
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "../pages/HomeScreen.jsx";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity,StyleSheet } from 'react-native';
import SettingsNavegation from './SettingsNavegation.jsx';
import CardGameNavegation from './CardGameNavegation.jsx';
import PairGameNavegation from './PairGameNavegation.jsx';
import TypeScreen from '../pages/TypeScreen.jsx';

/////////////////////////////////////////////////////////
//
//      NAVEGACIÓN DE LA PANTALLA PRINCIPAL
//
/////////////////////////////////////////////////////////


export default function HomeNavegation({ navigation }){
  const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator>
          <Stack.Screen  options={{
            headerLeft: null,
            headerTitleStyle: {    fontSize: 18,
              fontWeight: 'bold', color: '#E95050' },
            headerTintColor: '#E95050',
            headerTitleAlign: 'center',
            headerRight: () => (
                       <TouchableOpacity onPress={() => navigation.navigate('Ajustes')}>
                                <Ionicons name="settings-outline" size={24} color="black" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        )
                      }} name="Página Principal" component={HomeScreen} />

          <Stack.Screen options={{headerShown:false}} name="Ajustes" component={SettingsNavegation} />

          <Stack.Screen options={styles.header} name="Juego de Tarjetas" component={CardGameNavegation} />
          <Stack.Screen options={styles.header} name="Juego de Mecanografía" component={TypeScreen} />
          <Stack.Screen options={styles.header} name="Juego de Parejas" component={PairGameNavegation} />
        </Stack.Navigator>
    
    );
  }

  export const styles = StyleSheet.create({
    header:{
    headerStyle: { backgroundColor: 'white' },
    headerTitleStyle: {    fontSize: 18,
      fontWeight: 'bold', color: '#E95050' },
    headerTintColor: '#E95050',
    headerTitleAlign: 'center'}
  });

  