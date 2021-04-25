import React,{useContext,useState} from 'react'
import {Form,Button} from "semantic-ui-react"
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag';

import {useForm} from '../utils/hook'
import {AuthContext} from "../context/auth"

export default function Login(props) {
    const [errors,setErrors]=useState({});
    const context=useContext(AuthContext);
    const initialState={
        username:"",
        password:"",
    };
    const {onChange,onSubmit,values}=useForm(loginUserCallback,initialState);
   
    const [loginUser,{loading}]=useMutation(LOGIN_USER,{
        update(proxy,result){
            const {data={}}=result || {};
            const {login:userData={}}=data || {};
            context.login(userData);
            props.history.push("/")
        },
        onError(err){
         const {graphQLErrors=[]}=err||{}
         const {extensions={}}=graphQLErrors[0]||{}
         const {exception={}}=extensions||{};
         const {errors={}}=exception || {};
         setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables:values
    });

    function loginUserCallback(){
        loginUser()
    }

  

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate>
                <h1>Login</h1>
                <Form.Input label="Username"
                placeholder="Username.."
                name="username"
                value={values.username}
                onChange={onChange}
                type="text"
                error={errors.username || false}
                />
                <Form.Input label="Password"
                placeholder="Password.."
                name="password"
                value={values.password}
                onChange={onChange}
                type="password"
                error={errors.password || false}
                />
                <Button type="submit" primary>Login</Button>
            </Form>
            {
                Object.keys(errors).length > 0 &&            
                 <div className="ui error message">
                <ul className="list">
                    {
                        Object.values(errors).map(value=>(
                            <li key={value}>
                                {value}
                            </li>
                        ))
                    }
                </ul>
            </div>
            }

        </div>
    )
}

const LOGIN_USER=gql`
mutation login(
$username:String!
$password:String!   
){
    login(
        username:$username
        password:$password
    ){
        id
        email
        username
        createdAt
        token
    }
}
`;  

