import * as React from 'react'; 
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import PairMeanScreen from '../pages/PairMeanScreen.jsx';
import PairGameScreen from'../pages/PairGameScreen.jsx';
import PairPinyinScreen from'../pages/PairPinyinScreen.jsx';

/////////////////////////////////////////////////////////
//
//      NAVEGACIÓN DE LA PANTALLA DEL JUEGO DE PAREJAS
//
/////////////////////////////////////////////////////////


export default function PairGameNavegation(){
  const Stack = createNativeStackNavigator();
    return (
      
        <Stack.Navigator>
          <Stack.Screen options={{headerShown:false}} name="Parejas" component={PairGameScreen} />
          <Stack.Screen options={{headerShown:false}} name="Significado Parejas" component={PairMeanScreen} />
          <Stack.Screen options={{headerShown:false}} name="Pinyin Parejas" component={PairPinyinScreen} />
        
        </Stack.Navigator>
    
    );
  }

  