import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {Button,Icon,Label} from 'semantic-ui-react'
import Popup from "../utils/Popup"


export default function LikeButton(props) {
    const {postInfo:{id={},likes=[],likeCount=0},user}=props
    const [likedPost,setlikedPost]=useState(false)
    useEffect(()=>{
        if(user && likes.find(like=>like.username===user.username)){
            setlikedPost(true)
        }
        else setlikedPost(false)
    },[user,likes])

    const [likePostCallback,{loading}]=useMutation(LIKE_POST,{
        variables:{postId:id}
    })
 

    const likeBtn=user ?(
        likedPost ?(
            <Button color='teal'>
            <Icon name='heart' />
          </Button>

        ):( <Button color='teal'basic>
        <Icon name='heart' />
      </Button>)
    ):(<Button as={Link} to="/login" color='teal'basic>
    <Icon name='heart' />
  </Button>)

    return (
     <>
       <Button as='div' labelPosition='right' onClick={likePostCallback}>
        <Popup content={likedPost ? "Dislike":"Like"}>
        {likeBtn}
        </Popup>
        <Label  basic color='teal' pointing='left'>
          {likeCount}
        </Label>      
        </Button>
        </>



    )
}

const LIKE_POST=gql`
mutation likePost($postId:ID!){
    likePost(postId:$postId){
       id
       likes{
           id
           username
       }
       likeCount
    }
}
`;
