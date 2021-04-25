import React,{useState} from 'react'
import {Icon,Button,Confirm} from "semantic-ui-react"
import gql from 'graphql-tag'
import {useMutation} from "@apollo/react-hooks"
import {FETCH_POSTS_QUERY} from "../utils/graphql"
import Popup from "../utils/Popup"


export default function DeleteButton(props) {
    const [confirmDelete,setConfirmDelete]=useState(false)
    const [banner,setBanner]=useState('')
    const [errors,setErrors]=useState({})
    const {postId,commentId=null,callback}=props|| {}
    
    const mutationString = commentId ? DELETE_COMMENT : DELETE_POST


    const [deleteCallback,{loading}]=useMutation(mutationString,{
        update(proxy,result){
            setConfirmDelete(false)
            console.log("result",result);
          //remove post from cache
          if(!commentId){
            const data=proxy.readQuery({query:FETCH_POSTS_QUERY});
            data.getPosts = data.getPosts.filter(post=>post.id !== postId);
            proxy.writeQuery({
                query:FETCH_POSTS_QUERY,
                data
            });
          }    
        //TODO:set a banner to confirm deletion
          if(callback){
              callback()
          }
        },
        onError(err){
        console.log("err",err);
        },
        variables:{
            postId,
            commentId
        }
    })
    return (
        <>
        <Popup
        content= {!commentId ? "Delete Post" : "Delete comment"}
        >
            <Button as="div" color="red" onClick={()=>setConfirmDelete(true)} floated="right">
            <Icon name="trash" style={{margin:0}}/>
            </Button> 
        </Popup>

        <Confirm
        open={confirmDelete}
        onCancel={()=>setConfirmDelete(false)}
        onConfirm={deleteCallback}
        />

        </>
    )
};

const DELETE_POST=gql`
mutation deletePost($postId:ID!){
    deletePost(postId:$postId)
}`

const DELETE_COMMENT=gql`
mutation deleteComment($postId:ID!,$commentId:ID!){
    deleteComment(postId:$postId,commentId:$commentId){
        id
        comments{
            id
            username
            createdAt
        }
        commentCount
    }
}`
