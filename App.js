import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeNavegation from "./src/navigations/HomeNavegation.jsx";
import CardFirstChoice from "./src/pages/CardFirstChoice.jsx";
import LoginNavegation from "./src/navigations/LoginNavegation.jsx";

const Stack = createNativeStackNavigator();

/////////////////////////////////////////////////////////
//
//      PUNTO DE ENTRADA DE LA APLICACIÓN
//
/////////////////////////////////////////////////////////


export default function App() {
  return (
    <NavigationContainer >
        <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="Login" component={LoginNavegation} />
        <Stack.Screen options={{headerShown:false}} name="Primera elección" component={CardFirstChoice} />
        
        <Stack.Screen options={{headerShown:false}} name="Home" component={HomeNavegation} />
      </Stack.Navigator>
    </NavigationContainer>
    
    
  );
}


