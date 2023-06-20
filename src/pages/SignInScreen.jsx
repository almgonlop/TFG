import {StyleSheet, Button, TextInput, View,TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { initializeApp} from 'firebase/app';
import { firebaseConfig } from "../../firebase-config";
import { useNavigation } from '@react-navigation/native';


const app= initializeApp(firebaseConfig);
const auth= getAuth(app);

///////////////////////////////
////
////      PANTALLA DEL LOGIN
////
//////////////////////////////////



export default function SignInScreen(){
  const [email,setEmail] = React.useState('')
  const [password,setPassword] = React.useState('')
  const navigation=useNavigation();
  auth.languageCode = 'es';

  //Incio de sesión facilitado por Firebase Authetication
const handleSignIn=() => {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      console.log('Iniciado');
      navigation.navigate('Home');//Si se logea con éxito pasa a la página principal
  })
  .catch((error) => {
    // Manejar el error
    const errorCode = error.code;
    let errorMessage = error.message;
    
    // Verificar si el error es de autenticación
    if (errorCode === 'auth/internal-error') {
      // Cambiar el mensaje de error
      errorMessage = 'Te faltan datos';
    }else if(errorCode === 'auth/weak-password'){
      errorMessage = 'La contraseña es débil.';
    }else if(errorCode === 'auth/missing-password'){
        errorMessage = 'Falta poner la contraseña.';
    }else if(errorCode === 'auth/invalid-email'){
      errorMessage = 'El formato del e-mail es erróneo.';
    }else if(errorCode === 'auth/user-not-found'){
      errorMessage = 'El usuario no se encuentra.';
    }else if(errorCode === 'auth/wrong-password'){
      errorMessage = 'La contraseña es incorrecta.';
    }
    
    // Mostrar el mensaje de error personalizado
    alert(errorMessage);
  })
}

  return(
    <View style={styles.form}>
                <Text style={styles.text}>E-mail</Text>
                <TextInput style={styles.input} onChangeText={(text)=>setEmail(text)} name='email' placeholder="ejemplo@email.com" ></TextInput>
                <Text style={styles.text}>Contraseña</Text>
                <TextInput style={styles.input} onChangeText={(text)=>setPassword(text)} name='password' placeholder='********' secureTextEntry></TextInput>
                
                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                  <Text style={styles.buttonText}>Iniciar sesión</Text>
                </TouchableOpacity>
            </View>
  )
}

const styles=StyleSheet.create({
  input:{
    fontSize: 18,
    backgroundColor: '#D4D4D4',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  form:{
      margin:12,
      paddingTop:30
      
  },
  button: {
    backgroundColor: '#E95050',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },  
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E95050',
  }
})