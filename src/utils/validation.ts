export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
  }
  return { isValid: true };
};

export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password.trim()) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegistrationForm = (
  email: string, 
  password: string, 
  confirmPassword: string,
  firstName: string,
  lastName: string,
  role: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message!;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!role) {
    errors.role = 'Please select a role';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProfileForm = (data: Record<string, any>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (data.linkedIn && !data.linkedIn.trim()) {
    errors.linkedIn = 'LinkedIn username cannot be empty if provided';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};