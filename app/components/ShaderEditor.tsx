// components/ShaderEditor.tsx

import React, { useState, useCallback } from 'react';
import { useShaderContext } from '../context/ShaderContext'; 

// This component uses the context to set the global shaderText state.
const ShaderEditor: React.FC = () => {
    // 1. Get the setter function from the global context
    // This allows the component to update the state accessible by ShaderPlane.
    const { setShaderText } = useShaderContext(); 
    
    // State to hold the text currently being typed in the textarea
    const [inputText, setInputText] = useState('');

    // Handler to update the local state as the user types
    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(event.target.value);
    }, []);

    // Handler for the button click
    const handleCaptureClick = useCallback(() => {
        // 2. Call the global setter function with the current text
        setShaderText(inputText); 
        console.log('Shader Text Captured to Context:', inputText.substring(0, 30) + '...');
    }, [inputText, setShaderText]); // setShaderText is stable (memoized in context), inputText tracks current value

    return (
        <div style={{ 
            marginTop: '20px',
            width: '500px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px'
        }}>
            <h3>GLSL Fragment Shader Editor</h3>
            
            <textarea
                value={inputText}
                onChange={handleTextChange}
                placeholder={`Paste your GLSL Fragment Shader code here.\n\nExample:\nvoid main() {\n  gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);\n}`}
                rows={12}
                cols={50}
                style={{ 
                    width: '100%', 
                    fontFamily: 'monospace',
                    marginBottom: '10px',
                    padding: '10px',
                    boxSizing: 'border-box'
                }}
            />
            
            <button 
                onClick={handleCaptureClick}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
              Update Shader in Canvas
            </button>
        </div>
    );
}

export default ShaderEditor;