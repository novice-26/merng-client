import React,{useContext} from 'react'
import {Route,Redirect} from "react-router-dom"
import {AuthContext} from "../context/auth"


export default function AuthRoute({component:Component,...restProps}) {
    const {user=null}=useContext(AuthContext);
    return (
        <Route
        {...restProps}
        render={props=>
        user ? <Redirect to="/"/>
        :<Component {...props}/>
        }
        />
    );
}
