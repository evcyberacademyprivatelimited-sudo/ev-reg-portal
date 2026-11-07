export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateRegistrationForm(data: {
  full_name: string;
  email: string;
  phone: string;
  course_id: string;
  college_company: string;
  experience_level: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Full name
  if (!data.full_name || data.full_name.trim().length < 2) {
    errors.full_name = 'Please provide your full legal or professional name (min 2 characters).';
  } else if (data.full_name.trim().length > 100) {
    errors.full_name = 'Name must be under 100 characters.';
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid corporate or personal email address.';
  }

  // Phone
  const cleanedPhone = data.phone ? data.phone.replace(/[\s\-\(\)]/g, '') : '';
  const phoneRegex = /^(\+?[0-9]{7,15})$/;
  if (!cleanedPhone || !phoneRegex.test(cleanedPhone) || cleanedPhone.length < 10) {
    errors.phone = 'Please provide a valid 10-15 digit phone number (with country code if outside India).';
  }

  // Course selection
  if (!data.course_id || data.course_id === '') {
    errors.course_id = 'Please select a cybersecurity program.';
  }

  // College or Company
  if (!data.college_company || data.college_company.trim().length < 2) {
    errors.college_company = 'Please enter your current university, college, or employer name.';
  }

  // Experience level
  if (!data.experience_level) {
    errors.experience_level = 'Please select your current tech experience level.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

