import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, StyleSheet, Text, KeyboardAvoidingView, Platform, TextInput, Pressable } from "react-native";
import Logo from '../images/Logo.png'
import { validateEmail, validateName } from '../ValidationUtils';
import { useFonts } from "expo-font";
import { StatusBar } from 'react-native';

const Onboarding = ({ onOnboardingComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(!nameError && !emailError && name && email);
  }, [name, email, nameError, emailError]);

  const handleNameChange = (name) => {
    setName(name);
    setNameError(validateName(name));
  };

  const handleEmailChange = (email) => {
    setEmail(email);
    setEmailError(validateEmail(email));
  };

  const handleOnboarding = () => {
    if (isFormValid) {
      onOnboardingComplete(); // Call the completion handler
    }
  };

//   const validateName = (name) => {
//     if (!name.trim()) {
//       setNameError('Name cannot be empty');
//       return false;
//     } else if (!/^[a-zA-Z\s]*$/.test(name)) {
//       setNameError('Name must contain only letters');
//       return false;
//     } else {
//       setNameError('');
//       return true;
//     }
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//     if (!emailRegex.test(email)) {
//       setEmailError('Invalid email format');
//       return false;
//     } else {
//       setEmailError('');
//       return true;
//     }
//   };

  // FONTS
  const [fontsLoaded] = useFonts({
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
  });


  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Image source={Logo} style={styles.logo} />
      </View>
      <Text style={styles.welcomeText}>Let us get to know you</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={handleNameChange}
          onBlur={() => setNameError(validateName(name))}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={handleEmailChange}
          onBlur={() => setEmailError(validateEmail(email))}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      <Pressable
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleOnboarding}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  header: {
    width: '120%',
    maxHeight: '15%',
    marginBottom: 80,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#DEE3E9",
    
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 50,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'blue',
  },
  input: {
    width: '80%',
    backgroundColor: '#EDEFEE',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 9,
    padding: 10,
    paddingHorizontal: 30, 
    fontSize: 16,
  },
    welcomeText: {
    fontFamily: "MarkaziText-Medium",
    color: "#495E57",
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
   // fontFamily: "Karla-ExtraBold",
    fontWeight: '400',
    color: "#495E57",
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',

  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    width: '50%', // Adjust width as needed
    paddingVertical: 15, // Adjust vertical padding as needed
    paddingHorizontal: 30, // Adjust horizontal padding as needed
    backgroundColor: '#ffe600', // Adjust this to match your button color
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default Onboarding;
