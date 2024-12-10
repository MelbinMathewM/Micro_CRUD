// Simple logger utility for the service (you can replace this with a logger package like Winston)
const logInfo = (message) => {
    console.log(`[INFO] ${message}`);
  };
  
  const logError = (message) => {
    console.error(`[ERROR] ${message}`);
  };
  
  export { logInfo, logError };
  