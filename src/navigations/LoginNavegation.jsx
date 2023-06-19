import * as React from 'react'; 
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from "../pages/LoginScreen.jsx";
import SignInScreen from '../pages/SignInScreen.jsx';
import SignUpScreen from '../pages/SignUpScreen.jsx';
import CardFirstChoice from '../pages/CardFirstChoice.jsx';

/////////////////////////////////////////////////////////
//
//      NAVEGACIÓN DE LA PANTALLA INICIAL
//
/////////////////////////////////////////////////////////

export default function LoginNavegation(){
  const Stack = createNativeStackNavigator();
    return (
      
        <Stack.Navigator>
          
          <Stack.Screen options={{headerShown: false}} name="LoginScreen" component={LoginScreen} />
          <Stack.Screen options={styles.header} name="Iniciar sesión" component={SignInScreen} />
          <Stack.Screen options={styles.header} name="Registrarse" component={SignUpScreen} />
          <Stack.Screen options={styles.header} name="Primera elección" component={CardFirstChoice} />
          
        
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

  