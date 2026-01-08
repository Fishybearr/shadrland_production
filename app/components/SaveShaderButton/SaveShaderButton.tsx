'use client'
import { auth } from "@/auth"

export default function SaveShaderButton()
{
    /*const session = await auth()

    if(!session)
        {
            return
        }*/
    return(<button style={{
                    padding: '10px 20px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>Save Shader</button>)
}