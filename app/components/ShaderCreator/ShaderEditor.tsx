'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { useShaderContext } from '../../context/ShaderContext'; 
import styles  from './ShaderEditor.module.css';
import CodeEditor from '@uiw/react-textarea-code-editor';
import SaveShaderButton from "../SaveShaderButton/SaveShaderButton";
import { SaveShader } from '@/app/actions/saveShader';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
const ShaderEditor: React.FC = () => {
    const { setShaderText } = useShaderContext(); 
    const [inputText, setInputText] = useState(`void mainImage(out vec4 fragColor, in vec2 fragCoord)\n{\n   fragColor = vec4(0.9, 0.1, 0.8, 1.0);\n}`);

    //get the session info
    const { data: session, status } = useSession()

    //create a router
    const router = useRouter();

    const handleLoginClick = () => 
        {
            router.push("/login")
        }
    
    //TODO: create a text box that can be used to set this shader title
    // Possibly in a popup
    const [title, setTitle] = useState("Untitled Shader")

    const [shaderVis, setShaderVis] = useState(true);

    const handleShaderSave = async () => 
        {
            if(inputText === "" || null)
                {
                    alert("Error: Shader is empty")
                    return
                }
                
            const result = await SaveShader(inputText,title,shaderVis);
            if(result.success)
                {
                    alert("Shader Saved");
                    router.push(`/shader/${result.shaderId}`)
                }
            else
                {
                    alert("Error: " + result.error)
                }
        }

    const handleCaptureClick = useCallback(() => {
        setShaderText(inputText); 
        //console.log('Shader saved via shortcut or button');
    }, [inputText, setShaderText]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault(); // Stop browser from opening "Save Page" dialog
                handleCaptureClick();
            }
        };

        // Attach event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup: remove listener when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleCaptureClick]); // Re-bind whenever handleCaptureClick updates
    // ------------------------------------

    return (
        <div className={styles.mainContainer}>
            <h3>GLSL Fragment Shader Editor</h3>
            
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='m-0.5'></input>

            {/*Create an input with a checkbox here that uses onChange with the visibilityBool */}
            <label htmlFor="privBox">Public </label>
            <input name='privBox' type="checkbox" defaultChecked onChange={(e) => setShaderVis(e.target.checked)}></input>
            
        
            <CodeEditor
                value={inputText}
                language="glsl"
                autoCapitalize="none"
                placeholder="Write your GLSL Fragment Shader code here. Press Ctrl+S to compile."
                onChange={(e) => setInputText(e.target.value)}
                padding={15}
                 style={{
                    fontSize: 14,
                    backgroundColor: "#1e1e1e",
                    fontFamily: 'Fira Code, monospace',
                    borderRadius: '5px',
                    minHeight: 250,
                    marginBottom: '10px'
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
                    cursor: 'pointer',
                    marginRight: '5px'
                }}
            >
              Compile Shader (Ctrl+S)
            </button>

                {session? (
            <button 
                onClick={handleShaderSave}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '5px'
                }}
            >
              Save Shader
            </button>
            ) : 
            (<button 
                onClick={handleLoginClick}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '5px'
                }}
            >
              Login To Save
            </button>)}

            {/*session? (<p>logged in</p>) : (<p>logged out</p>)*/}
        </div>
    );
}

export default ShaderEditor;