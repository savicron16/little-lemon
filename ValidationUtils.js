export const validateEmail = (email) => {
  // validation logic
   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    } 
      return '';
};

export const validateName = (name) => {
  // validation logic
  if (!name.trim()) {
      return 'Name cannot be empty';
    } else if (!/^[a-zA-Z\s]*$/.test(name)) {
      return 'Name must contain only letters';
    }
      return '';
};
