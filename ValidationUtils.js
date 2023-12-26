export const validateEmail = (email) => {
  if (!email) return ''; // Return an empty string if email is undefined or null
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  } 
  return '';
};

export const validateName = (name) => {
  if (!name) return ''; // Return an empty string if name is undefined or null
  if (!name.trim()) {
    return 'Name cannot be empty';
  } else if (!/^[a-zA-Z\s]*$/.test(name)) {
    return 'Name must contain only letters';
  }
  return '';
};
