import * as React from 'react'; 
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import CardGameScreen from '../pages/CardGameScreen.jsx';
import CardMeanScreen from '../pages/CardMeanScreen.jsx';
import CardPinyinScreen from '../pages/CardPinyinScreen.jsx';


////////////////////////////////////
//    NAVEGACIÓN DE LA PANTALLA DE TARJETAS
//    
/////////////////////////////////////


export default function CardGameNavegation(){
  const Stack = createNativeStackNavigator();
    return (
      
        <Stack.Navigator>
          
          <Stack.Screen options={{headerShown:false}} name="Tarjetas" component={CardGameScreen} />
          <Stack.Screen options={{headerShown:false}} name="CardPinyin" component={CardPinyinScreen} />
          <Stack.Screen options={{headerShown:false}} name="CardSignificado" component={CardMeanScreen} />
        
        </Stack.Navigator>
    
    );
  }

  