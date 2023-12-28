import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getFilteredMenuItems } from './Database';

const CategoryList = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([
    { id: 'starters', name: 'Starters', selected: false },
    { id: 'mains', name: 'Mains', selected: false },
    { id: 'desserts', name: 'Desserts', selected: false },
    { id: 'drinks', name: 'Drinks', selected: false },
    { id: 'specials', name: 'Specials', selected: false },
    
  ]);

  const [activeCategories, setActiveCategories] = useState([]);

  useEffect(() => {
    const loadFilteredMenu = async () => {
      try {
        const filteredMenuItems = await getFilteredMenuItems(activeCategories);
        console.log('Filtered Menu Items: ', filteredMenuItems);
        // can set these filtered items to state or context as required
      } catch (error) {
        console.error('Failed to filter menu items:', error);
      }
    };

    if (activeCategories.length > 0) {
      loadFilteredMenu();
    }
  }, [activeCategories]); // Re-run the effect when activeCategories change

//   const onCategorySelect = (category) => {
//   setActiveCategories(prevActiveCategories => {
//     // Check if the category is already selected
//     if (prevActiveCategories.includes(category)) {
//       // If it is, remove it from the array
//       return prevActiveCategories.filter(cat => cat !== category);
//     } else {
//       // Otherwise, add it to the array
//       return [...prevActiveCategories, category];
//     }
//   });
// };

 const toggleCategory = (id) => {
    setCategories((prevCategories) =>
      prevCategories.map(category => {
        if (category.id === id) {
        const updatedCategory = { ...category, selected: !category.selected};
          onCategorySelect(updatedCategory); // Call the callback with the updated category
          return updatedCategory;
        }
        return category;
      })
    );
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, item.selected && styles.categoryItemSelected]}
      onPress={() => toggleCategory(item.id)}
    >
      <Text style={[styles.categoryText, item.selected && styles.categoryTextSelected]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
    <Text style={styles.titleText}>ORDER FOR DELIVERY!</Text>
    <FlatList
      horizontal
      data={categories}
      renderItem={renderCategory}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesList}
    />
    </>
    
  );
};

const styles = StyleSheet.create({
 
  categoriesList: {
    flexDirection: 'row',
    marginTop: 10,
  },
  categoryItem: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    height: 40,
  },
  categoryItemSelected: {
    backgroundColor: '#333',
  },
  categoryText: {
    color: '#000',
    //fontSize: 14,
  },
  categoryTextSelected: {
    color: '#fff', 
  },
  titleText: {
    padding: 6,
    fontSize: 16,
    fontWeight: 'bold',
    
  },
});


export default CategoryList;
