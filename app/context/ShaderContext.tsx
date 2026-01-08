import React, { createContext, useState, useContext, useCallback } from 'react';

// 1. Define the TypeScript types for the Context
interface ShaderContextType {
  // The string captured from the editor
  shaderText: string | null; 
  // The function to update the global state
  setShaderText: (text: string) => void; 
}

// 2. Create the Context object
const ShaderContext = createContext<ShaderContextType>({
  shaderText: null,
  setShaderText: () => {}, 
});

// 3. Create the Provider Component
interface ShaderProviderProps {
  children: React.ReactNode;
}

export const ShaderProvider: React.FC<ShaderProviderProps> = ({ children }) => {
  const [shaderText, setText] = useState<string | null>(null);

  // Memoize the setter function for performance
  const setShaderText = useCallback((text: string) => {
    setText(text);
  }, []);

  const value = { shaderText, setShaderText };

  return (
    <ShaderContext.Provider value={value}>
      {children}
    </ShaderContext.Provider>
  );
};

// 4. Create a custom hook for easy access
export const useShaderContext = () => {
  const context = useContext(ShaderContext);
  if (context === undefined) {
    throw new Error('useShaderContext must be used within a ShaderProvider');
  }
  return context;
};