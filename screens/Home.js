import React from 'react';
import { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity,Text, Button, Pressable, StyleSheet, SafeAreaView, ScrollView, FlatList, ActivityIndicator} from 'react-native';
import Logo from '../images/Logo.png'; // Adjust the path as necessary
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupDatabaseAsync, storeDataInDbAsync, fetchDataFromDbAsync } from '../Database';
import CategoryList from '../CategoryList';
import HeroBanner from '../HeroBanner';



const Header = ({ onAvatarPress, userData }) => {
  return (
    <View style={styles.headerContainer}>
      <Image source={Logo} style={styles.logo} />
      <TouchableOpacity onPress={onAvatarPress}>
        {userData && userData.image ? (
          <Image source={{ uri: userData.image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </TouchableOpacity>
    </View>
  );
};


const Home = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

  const getMenu = async () => {
  try { 
    const response = await fetch(
      'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
    const json = await response.json();
    await storeDataInDbAsync(json.menu); // Store fetched data in DB
    setData(json.menu);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  const initializeApp = async () => {
    try {
      await setupDatabaseAsync();
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
        const dataFromDb = await fetchDataFromDbAsync();
        if (dataFromDb.length === 0) {
          await getMenu(); // Fetch from the server if DB is empty
        } else {
          setData(dataFromDb); // Use data from DB
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  initializeApp();
  }, []);


   const Item = ({ name, price, description, image }) => (
     <View style={styles.itemContainer}>
    <View style={styles.textContainer}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>{'$' + price}</Text>
    </View>
    <Image source={getImage(image)} style={styles.dishimage} />
  </View>
   ); 
   const renderItem = ({ item }) => (
    <Item name={item.name} price={item.price} description={item.description} image={item.image} />
   );

   // Function to require images dynamically
  const getImage = (imageName) => {
    switch (imageName) {
      case 'greekSalad.jpg': return require('../images/Greek_salad.png');
      case 'bruschetta.jpg': return require('../images/Bruschetta.png');
      case 'grilledFish.jpg': return require('../images/Grilled_fish.png');
      case 'pasta.jpg': return require('../images/Pasta.png');
      case 'lemonDessert.jpg': return require('../images/Lemon_dessert.png');
    // Add cases for all your images
      default: return require('../images/Bruschetta.png'); // a default placeholder in case the image name doesn't match
  }
};

  return (
     <SafeAreaView style={styles.safeArea}>
        <Header userData={userData} onAvatarPress={() => navigation.navigate('Profile')} />
        <HeroBanner />
          <View style={styles.middleContainer}>
            <CategoryList />
          </View>

          {isLoading ? (
         <ActivityIndicator />
         ) : (
         <FlatList
          data={data}
          keyExtractor={(item, index) => `menu-item-${index}`}
          renderItem={renderItem}
          style={styles.menuList}
         />
         )}

          <Pressable
            style={styles.btn}
            onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.btnText}>Go to Profile</Text>
          </Pressable>
        
    </SafeAreaView>      

  );
};

const styles = StyleSheet.create({
 safeArea: {
    flex: 1,
    backgroundColor: '#fff', // or any other background color
  },
  container: {
  flex: 1,
 },
  middleContainer: {
    flex: 1, // Use flex to allocate available space
    justifyContent: 'center', // Align children vertically in the center
    paddingHorizontal: 10,
    maxHeight: 100,
  },
  menuList: {
        flex: 1, // Allocate twice as much space for the menu list
  },
   logo: {
    width: 120,
    height: 60, 
    resizeMode: 'contain',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0b9a6a",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#DEE3E9',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8', 
    elevation: 2, // Shadow for Android
    shadowOpacity: 0.1, // Shadow for iOS
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    zIndex: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    fontSize: 16,
    color: 'grey',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  dishimage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginLeft: 10,
  },
  scrollView: {
   marginTop: 120, // Adjust based on the height of your header
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    margin: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cc9a22",
  },
  btnText: {
    fontSize: 18,
    color: "#3e524b",
    fontFamily: "Karla-Bold",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },

  innerContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#495E57',
    flexDirection: 'row',
    justifyContent: 'space-between',
 },
 itemText: {
    color: '#F4CE14',
    fontSize: 22,
 },
 headerText: {
    color: '#495E57',
    fontSize: 30,
    textAlign: 'center',
 },

});

export default Home;
