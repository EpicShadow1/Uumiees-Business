// Helper function to safely extract string from query parameters
export const getQueryParam = (value: unknown, defaultValue: number): number => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  if (Array.isArray(value)) {
    return parseInt(String(value[0])) || defaultValue;
  }
  
  return parseInt(String(value)) || defaultValue;
};

// Helper function to safely extract string from path parameters
export const getPathParam = (value: string | string[]): string => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};