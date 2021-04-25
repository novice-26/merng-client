import React,{useContext,useState} from 'react'
import {Form,Button} from "semantic-ui-react"
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag';

import {useForm} from '../utils/hook'
import {AuthContext} from "../context/auth"

export default function Register(props) {
    const [errors,setErrors]=useState({});
    const context=useContext(AuthContext);
    const initialState={
        username:"",
        password:"",
        confirmPassword:"",
        email:"",
    };
    const {onChange,onSubmit,values}=useForm(registerUser,initialState);
   
    const [addUser,{loading}]=useMutation(REGISTER_USER,{
        update(proxy,result){
            const {data={}}=result || {};
            const {register:userData={}}=data || {};
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

    function registerUser(){
        addUser()
    }

  

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate>
                <h1>Register</h1>
                <Form.Input label="Username"
                placeholder="Username.."
                name="username"
                value={values.username}
                onChange={onChange}
                type="text"
                error={errors.username || false}
                />
                <Form.Input label="Email"
                placeholder="Email.."
                name="email"
                value={values.email}
                onChange={onChange}
                type="email"
                error={errors.email || false}
                />
                <Form.Input label="Password"
                placeholder="Password.."
                name="password"
                value={values.password}
                onChange={onChange}
                type="password"
                error={errors.password || false}
                />
                <Form.Input label="Confirm Password"
                placeholder="Password.."
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={onChange}
                type="password"
                error={errors.confirmPassword || false}
                />
                <Button type="submit" primary>Register</Button>
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

const REGISTER_USER=gql`
mutation register(
$username:String!
$email:String!
$password:String!
$confirmPassword:String!
){
    register(
        registerInput:{
        username:$username
        email:$email
        password:$password
        confirmPassword:$confirmPassword
    }
    ){
        id
        email
        username
        createdAt
        token
    }
}
`;  

