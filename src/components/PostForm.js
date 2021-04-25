import React,{useState} from 'react'
import {Form,Button } from "semantic-ui-react"
import gql from "graphql-tag"
import {useMutation} from "@apollo/react-hooks"
import {useForm} from '../utils/hook'
import { FETCH_POSTS_QUERY } from "../utils/graphql"

export default function PostForm() {
    
    const {values,onChange,onSubmit}=useForm(createPostCallback,{
        body:''
    });
    const [errors,setErrors]=useState({});

    const [createPost,{loading=null}]=useMutation(CREATE_POST,{
        variables:values,
        update(proxy,result){
            const cachedData = proxy.readQuery({query:FETCH_POSTS_QUERY,
            })
            // cachedData.getPosts=[result.data.createPost,...cachedData.getPosts];
            // proxy.writeQuery({query:FETCH_POSTS_QUERY,cachedData})
            //https://github.com/apollographql/apollo-client/issues/5903
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                  getPosts: [
                    result.data.createPost,
                    ...cachedData.getPosts,
                  ],
                },
              })
            values.body='';
        },onError(error={}){

            const {graphQLErrors=[]}=error;
            const {message=''}=graphQLErrors[0]||{};
            setErrors({error:message})
        }
    })


    function createPostCallback(){
            createPost()


    }
    return (
    
        <>
        <Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input placeholder="Hi world.."
                name="body"
                onChange={onChange}
                error={!!errors.length}
                value={values.body}/>
            
                <Button type="submit" color="teal">Submit</Button>
            </Form.Field>
        </Form>
        {
            !!Object.keys(errors).length && (
                <div className="ui error message" style={{marginbBottom:20}}>
                    <ul className="list">
                        <li>{
                            errors.error
                        }</li>
                    </ul>
                </div>
            )
        }
        </>
    );
}

const CREATE_POST=gql`
mutation createPost(
$body:String!
){
    createPost(body:$body){
      id
      body
      createdAt
      username
      likes{
          id
          username
          createdAt
      }
      comments{
      id
      body
      username
      createdAt
      }
      likeCount
      commentCount
    }
}`;
