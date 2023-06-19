import {StyleSheet, Button, TextInput, View, TouchableOpacity, Text  } from 'react-native';
import React, {useEffect} from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { initializeApp} from 'firebase/app';
import { firebaseConfig } from "../../firebase-config";
import { useNavigation } from '@react-navigation/native';

import { firebase } from '../../firebase-config.js';


const app= initializeApp(firebaseConfig);
const auth= getAuth(app);
const adduid = firebase.firestore().collection('Usuarios');
//auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);//BORRAR ESTO CUANDO TERMINE LAS PRUEBAS DE LOS USUARIOS PERMANENTES

/////////////////////////////////////
////////  ESTE ES EL REGISTER////
/////////////////////////////////////////////////



export default function SignUpScreen(){
  const [email,setEmail] = React.useState('')
  const [password,setPassword] = React.useState('')
  const [passwordConfirm,setPasswordConfirm] = React.useState('')
  const navigation=useNavigation();
  auth.languageCode = 'es';
  
  
  const handleCreateAccount=() => {
    if (password === passwordConfirm) {
    createUserWithEmailAndPassword(auth,email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        ///Esto es para almacenar la uid del usuario una vez se cree
        const uid = user.uid;
        const usuConfigRef = firebase.firestore().collection('UsuConfig').doc(uid);
        adduid.add({
          uid: uid,
        });
        usuConfigRef.set({
          uid: uid,
          tono0: 'black',
          tono1: 'red',
          tono2: 'green',
          tono3: 'blue',
          tono4: 'orange',
          design: 'https://firebasestorage.googleapis.com/v0/b/tfgchinodef.appspot.com/o/tarjetas%2Ftarjeta1.jpg?alt=media&token=c14835c4-4957-4178-85c0-c8cc06c76842'
        });
        console.log(user.email);
        console.log('Cuenta creada');
        navigation.navigate('Primera elección')
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
      }else if(errorCode === 'auth/invalid-email'){
        errorMessage = 'El formato del e-mail es erróneo.';
      }else if(errorCode === 'auth/email-already-in-use'){
        errorMessage = 'El usuario ya existe.';
      }
      
      // Mostrar el mensaje de error personalizado
      alert(errorMessage);
    })
  } else {
    alert("Las contraseñas no coinciden");
  }
}
  //BORRAR ESTO CUANDO TERMINE LAS PRUEBAS DE LOS USUARIOS PERMANENTES
  //-----------------
/*  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Usuario conectado, navegar a la pantalla principal
        navigation.navigate('Home')
      }
    })

    return unsubscribe
  }, [])
*/
  //--------------------------------------------------------------

  return(
    <View style={styles.form}>
      <Text style={styles.text}>E-mail</Text>
                <TextInput style={styles.input} onChangeText={(text)=>setEmail(text)} name='email' placeholder="ejemplo@email.com" ></TextInput>
                <Text style={styles.text}>Contraseña *</Text>
                <TextInput style={styles.input} onChangeText={(text)=>setPassword(text)} name='password' placeholder="********" secureTextEntry></TextInput>
                <Text style={styles.text}>Confirme su contraseña</Text>
                <TextInput style={styles.input} onChangeText={(text)=>setPasswordConfirm(text)} name='password-confirm' placeholder="********" secureTextEntry></TextInput>
                <Text style={styles.norma}>* La contraseña debe contener mínimo 6 carácteres</Text>
                <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                  <Text style={styles.buttonText}>Registrarse</Text>
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
  },
  norma: {
    fontSize: 15,
    color: '#E95050',
  }
})