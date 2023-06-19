import * as React from 'react'; 
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import EditCardScreen from "../pages/EditCardScreen.jsx";
import EditToneScreen from '../pages/EditToneScreen.jsx';
import EditStyleScreen from '../pages/EditStyleScreen.jsx';
import SettingsScreen from '../pages/SettingsScreen.jsx';


/////////////////////////////////////////////////////////
//
//      NAVEGACIÓN DE LA PANTALLA DE AJUSTES
//
/////////////////////////////////////////////////////////


export default function SettingsNavegation(){
  const Stack = createNativeStackNavigator();
    return (
      
        <Stack.Navigator>
          
          <Stack.Screen options={styles.header} name="Ajustes" component={SettingsScreen} />
          <Stack.Screen options={styles.header} name="Edición de Tonos" component={EditToneScreen} />
          <Stack.Screen options={styles.header} name="Edición de Mazos" component={EditCardScreen} />
          <Stack.Screen options={styles.header} name="Edición de Estilos" component={EditStyleScreen} />
        
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
  })