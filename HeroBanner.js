import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TextInput, StyleSheet } from 'react-native';

const HeroBanner = ( {onSearch} ) => {
    const [searchText, setSearchText] = useState('');

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
  // Debounce the search function
     const debouncedSearch = useCallback(
        debounce((text) => {
            if (onSearch) { // Check if onSearch is a function
                onSearch(text);
            }
        }, 500),
        [] // This effect should run once on mount
    );

  useEffect(() => {
    // When searchText changes, call the debounced search
    debouncedSearch(searchText);

    // Cleanup the debounce function on component unmount
    return debouncedSearch.cancel;
  }, [searchText, debouncedSearch]);

  return (
    <View style={styles.bannerContainer}>
        <View style={styles.textContainer}>
            <Text style={styles.title}>Little Lemon</Text>
            <Text style={styles.subtitle}>Chicago</Text>
            <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on traditional
            recipes served with a modern twist.
            </Text>
      
            <TextInput 
            style={styles.searchBar} 
            placeholder="Search"
            onChangeText={setSearchText} // Update searchText on every change
            value={searchText}
            />
        </View>
      <Image 
        source={require('./images/Hero_image.png')} // Replace with the path to your restaurant image
        style={styles.bannerImage} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    //backgroundColor: '#fff', // Adjust to match your design
    padding: 10, // Adjust padding as needed
    alignItems: 'center', 
    backgroundColor: '#495e57',
  },
  textContainer: {
    flex: 1, // Take up the remaining space
    paddingRight: 10, // Add padding to the right of the text if needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4CE14',
    // Add more styling as needed
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    // Add more styling as needed
  },
  description: {
    textAlign: 'left',
    fontSize: 14,
    color: '#FFF',
    marginVertical: 10, 
  },
  bannerImage: {
    width: '30%', // Adjust width as needed
    height: 120, // Adjust height as needed
    resizeMode: 'cover', // or 'contain' depending on your layout
    marginVertical: 10, // Adjust as needed
    borderRadius: 8,
  },
  searchBar: {
    width: '100%',
    height: 40,
    marginVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
});

export default HeroBanner;
