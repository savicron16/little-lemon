
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail, validateName } from '../ValidationUtils';
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";
import Checkbox from "expo-checkbox";
import { useOnboarding } from '../OnboardingContext';

const Profile = ({ navigation }) => {
const [userData, setUserData] = useState({
    image: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
});

const [discard, setDiscard] = useState(false);

const { setIsOnboarded } = useOnboarding();
  
 const getIsFormValid = () => {
    return (
      !validateName(userData.firstName) &&
      !validateName(userData.lastName) &&
      !validateEmail(userData.email) &&
      validateNumber(userData.phoneNumber)
    );
  };

  useEffect(() => {
  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData !== null) {
        const data = JSON.parse(storedUserData);
        setUserData(data);
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  loadUserData();
}, [discard]);


  const validateNumber = number => {
    if (isNaN(number)) {
      return false;
    } else if (number.length == 10) {
      return true;
    }
  };
  const updateUserData = (key, value) => {
    setUserData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSave = async (data) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error saving user data', error);
    alert('Failed to update profile.');
  }
};

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    setIsOnboarded(false);
    navigation.navigate('Onboarding');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData(prevState => ({
        ...prevState,
        ["image"]: result.assets[0].uri,
      }));
    }
  };

  const removeImage = () => {
    setUserData(prevState => ({
      ...prevState,
      ["image"]: "",
    }));
  };



  return (

  <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <View style={styles.header}>
      <Image
          style={styles.logo}
          source={require("../images/Logo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
    </View>

    <ScrollView style={styles.viewScroll}>
      <Text style={styles.headertext}>Personal information</Text>
      <Text style={styles.text}>Avatar</Text>
      <View style={styles.avatarContainer}>
          {userData.image ? (
            <Image source={{ uri: userData.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
                {userData.firstName && Array.from(userData.firstName)[0]}
                {userData.lastName && Array.from(userData.lastName)[0]}
              </Text>
            </View>
          )}
          <View style={styles.avatarButtons}>
            <Pressable
              style={styles.changeBtn}
              title="Pick an image from camera roll"
              onPress={pickImage}
            >
              <Text style={styles.saveBtnText}>Change</Text>
            </Pressable>
            <Pressable
              style={styles.removeBtn}
              title="Pick an image from camera roll"
              onPress={removeImage}
            >
              <Text style={styles.discardBtnText}>Remove</Text>
            </Pressable>
          </View>
        </View>
        <Text
          style={[
            styles.text,
            !validateName(userData.firstName) ? "" : styles.error,
          ]}
        >
          First Name
        </Text>
        <TextInput
          style={styles.inputBox}
          value={userData.firstName}
          onChangeText={newValue => updateUserData("firstName", newValue)}
          placeholder={"First Name"}
        />
        <Text
          style={[
            styles.text,
            !validateName(userData.lastName) ? "" : styles.error,
          ]}
        >
          Last Name
        </Text>
        <TextInput
          style={styles.inputBox}
          value={userData.lastName}
          onChangeText={newValue => updateUserData("lastName", newValue)}
          placeholder={"Last Name"}
        />
        <Text
          style={[
            styles.text,
            !validateEmail(userData.email) ? "" : styles.error,
          ]}
        >
          Email
        </Text>
        <TextInput
          style={styles.inputBox}
          value={userData.email}
          keyboardType="email-address"
          onChangeText={newValue => updateUserData("email", newValue)}
          placeholder={"Email"}
        />
        <Text
          style={[
            styles.text,
            validateNumber(userData.phoneNumber) ? "" : styles.error,
          ]}
        >
          Phone number (10 digit)
        </Text>
        <TextInput
          style={styles.inputBox}
          value={userData.phoneNumber}
          keyboardType="phone-pad"
          onChangeText={newValue => updateUserData("phoneNumber", newValue)}
          placeholder={"Phone number"}
        />
        <Text style={styles.headertext}>Email notifications</Text>
        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={userData.orderStatuses}
            onValueChange={newValue => updateUserData("orderStatuses", newValue)}
            color={"#495e57"}
          />
          <Text style={styles.paragraph}>Order statuses</Text>
        </View>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
      <View style={styles.buttons}>
          <Pressable style={styles.discardBtn} onPress={() => setDiscard(true)}>
            <Text style={styles.discardBtnText}>Discard changes</Text>
          </Pressable>
          <Pressable
            style={[styles.saveBtn, getIsFormValid() ? "" : styles.btnDisabled]}
            onPress={() => handleSave(userData)}
            disabled={!getIsFormValid()}
          >
            <Text style={styles.saveBtnText}>Save changes</Text>
          </Pressable>
      </View>
    </ScrollView>
      
    </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoutButton: {
    backgroundColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginVertical: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cc9a22",
  },
  logoutButtonText: {
    fontSize: 18,
    color: "#3e524b",
    fontFamily: "Karla-Bold",
    alignSelf: "center",
    
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#dee3e9",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  viewScroll: {
    flex: 1,
    padding: 10,
  },
  headertext: {
    fontSize: 22,
    paddingBottom: 10,
    fontFamily: "Karla-ExtraBold",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Karla-Medium",
  },
  inputBox: {
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 9,
    borderColor: "#dfdfe5",
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginVertical: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cc9a22",
  },
  btnDisabled: {
    backgroundColor: "#98b3aa",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#495e57",
    borderRadius: 9,
    alignSelf: "stretch",
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f554d",
  },
  saveBtnText: {
    fontSize: 18,
    color: "#FFFFFF",
    alignSelf: "center",
    fontFamily: "Karla-Bold",
  },
  discardBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#83918c",
  },
  discardBtnText: {
    fontSize: 18,
    color: "#3e524b",
    alignSelf: "center",
    fontFamily: "Karla-Bold",
  },
  btntext: {
    fontSize: 22,
    color: "#3e524b",
    fontFamily: "Karla-Bold",
    alignSelf: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
  error: {
    color: "#d14747",
    fontWeight: "bold",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEmpty: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0b9a6a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  avatarButtons: {
    flexDirection: "row",
  },
  changeBtn: {
    backgroundColor: "#495e57",
    borderRadius: 9,
    marginHorizontal: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f554d",
  },
  removeBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    padding: 10,
    borderWidth: 1,
    borderColor: "#83918c",
  },
});

export default Profile;
