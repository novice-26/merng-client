import React from 'react'
import {Popup as PopUp_ui} from "semantic-ui-react"


export default function Popup({content,children}) {
    return <PopUp_ui inverted  content={content} trigger={children}/>
}
