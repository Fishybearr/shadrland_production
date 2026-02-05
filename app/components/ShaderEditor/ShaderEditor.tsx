'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { useShaderContext } from '../../context/ShaderContext'; 
import styles  from './ShaderEditor.module.css';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { UpdateShader } from '@/app/actions/UpdateShader';
import { ShaderSaveAs } from '@/app/actions/ShaderSaveAs';
import { DeletShader } from '@/app/actions/DeleteShader';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import PopupModal from "../PopupModals/PopupModal"
import ForkShaderModal from "@/app/components/PopupModals/ForkShaderModal"
import { Prisma } from "@/prisma/app/generated/prisma/client";
import Link from 'next/link';

//This is the actual editor for pre existing shaders
// Needs to validate the user and read input from the
// passed in shaderID


type ShaderWithAuthor = Prisma.ShaderGetPayload<{
  include: { author: true }
}>;


export default function ShaderEditor({ shader } : {shader: ShaderWithAuthor}) {

    const { setShaderText } = useShaderContext(); 
    const [inputText, setInputText] = useState(shader.shaderText);

    //get the session info
    const { data: session, status } = useSession()

    //create a router
    const router = useRouter();

    const handleLoginClick = () => 
        {
            router.push("/login")
        }

    
    //get the title from our passed in shader
    const shaderTitle = shader?.title || "Untitled Shader";
    
    //TODO: create a text box that can be used to set this shader title
    // Possibly in a popup
    const [title, setTitle] = useState(shaderTitle)

    const [shaderVis, setShaderVis] = useState(shader.public);

    // If this is false, we want to update the 
    // save functionality to
    // create a new shader
    // with our current user's id, and all of the
    // code from our editor
    // Possibly keep some kind of record of who
    // this was forked from
    // Then reroute to the new shader url
    const isOwner = session?.user?.id === shader.authorId;

    const handleShaderSave = async () => 
        {
            if(inputText === "" || null)
                {
                    alert("Error: Shader is empty")
                    return
                }
                
            const result = await UpdateShader(inputText,title,shaderVis,shader.id);
            if(result.success)
                {
                    //alert("Shader Updated");
                }
            else
                {
                    alert("Error: " + result.error)
                }
        }


        //Used for "forking" a shader to a new user
        const handleShaderSaveAs = async () => 
        {
            if(inputText === "" || null)
                {
                    alert("Error: Shader is empty")
                    return
                }
                
            const result = await ShaderSaveAs(inputText,title,shaderVis);
            if(result.success)
                {
                    //alert("New shader created");
                    //Reroute to new shader here
                    router.push(`/shader/${result.shaderId}`)
                }
            else
                {
                    alert("Error: " + result.error)
                }
        }

        //Used for deleting a shader
        const handleDeleteShader = async () => 
        {       
            const result = await DeletShader(shader.id);
            if(result.success)
                {
                    //Reroute to new shader here
                    router.push(`/profile/${session?.user?.name}`)
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


        const [isImageModalOpen, setIsImageModalOpen] = useState(false);

        //Fork Modal
        const [isForkModalOpen, setIsForkModalOpen] = useState(false);

    return (
        <div className={styles.mainContainer}>

            <div className="flex items-center gap-4">
            

            {/*if user owns shader turn title into text box */}
            {session?.user?.id === shader.authorId?  (<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='m-0.5'></input>) : (<h3>{shader.title}</h3>) } 

            {/*show trash can if owner is viewing shader */}
            {(session?.user?.id === shader.authorId) ? (<Image onClick={() => setIsImageModalOpen(true)} style={{marginLeft: 'auto', color:'#ff0000'}} src={'/assets/icons/bin.png'} alt='trash' width={24} height={24}></Image>) :
            (<Link href={`/profile/${shader.author.name}`} style={{marginLeft: 'auto'}}> By {shader.author.name}</Link>)}

            <PopupModal 
            isOpen={isImageModalOpen} 
            onClose={() => setIsImageModalOpen(false)} 
            title={`Are you sure you want to delete "${shader.title}"`}
            >
            {/*<p className="mt-4 text-red-500">Are You Sure You Want To Delete This Shader?</p> */}
            <div className='flex justify-center align-middle gap-4 w-full pt-1 pb-1'>
                <button style={{
                    padding: '10px 20px',
                    backgroundColor: '#ff0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '5px'
                }} onClick={handleDeleteShader}>Yes, Delete it</button>

                <button style={{
                    padding: '10px 20px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '5px'
                }} onClick={() => setIsImageModalOpen(false)}>No, Keep it</button>
            </div>
            </PopupModal>
            </div>

            {/*Public toggle that only appears if user owns the shader */}
            {session?.user?.id === shader.authorId && <label htmlFor="privBox">Public </label>}
            {session?.user?.id === shader.authorId && <input name='privBox' type="checkbox" defaultChecked={shader.public} onChange={(e) => setShaderVis(e.target.checked)}></input>}

            
            
        
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
                    color: "#ededed",
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

            {/* TODO: update this to show 
            update for owner,
            forl for other logged in user,
            login, for logged out user
             */}


                {session? ( isOwner ?
            (<button 
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
              Update Shader
            </button>)

                //This should open a modal that then handles saveAs
            : (<button 
                onClick={() => setIsForkModalOpen(true)}
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
              Fork Shader
            </button>)
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

                {/*This should be right aligned in the future */}  
            Last Updated: {new Date(shader.updatedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}

            {/*session? (<p>logged in</p>) : (<p>logged out</p>)*/}

            <ForkShaderModal
            isOpen={isForkModalOpen} 
            onClose={() => setIsForkModalOpen(false)} 
            title={`Fork "${shader.title}"?`}
            > 
            <label htmlFor="shaderName">Shader Name: </label>
            <input name="shaderName"type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='m-0.5'></input>
            <br></br>

            {/*Create an input with a checkbox here that uses onChange with the visibilityBool */}
            <label htmlFor="privBox">Public: </label>
            <input name='privBox' type="checkbox" defaultChecked={shader.public} onChange={(e) => setShaderVis(e.target.checked)}></input>

            <br></br>
            {/*Button for doing the actual fork */}
            <button 
                onClick={handleShaderSaveAs}
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
              Fork Shader
            </button>

            </ForkShaderModal>

            
        </div>
        
    );
}