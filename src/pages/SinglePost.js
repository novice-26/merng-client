import React,{useContext,useState,useRef} from 'react'
import gql from 'graphql-tag'
import {useQuery,useMutation} from "@apollo/react-hooks"
import { Grid,Image,Card,Button,Icon,Label, Form } from 'semantic-ui-react';
import moment from 'moment'
import LikeButton from '../components/LikeButton';
import {AuthContext} from "../context/auth";
import DeleteButton from '../components/DeleteButton';
import Popup from "../utils/Popup"

export default function SinglePost(props) {
    const  postId = props.match.params.postId;
    const [commentBody,setCommentBody]=useState("")
    const {user} = useContext(AuthContext)
    const commentInputRef=useRef(null)
    

    const [addCommentCallback,{loading}]=useMutation(ADD_COMMENT,{
        update(proxy,result){
            console.log("result",result)
      setCommentBody("")
      commentInputRef.current.blur()
        },
        onError(err){

        },
        variables:{
           postId,
           body:commentBody  
        }
    });

    function addComment(){
        addCommentCallback()
    }

    const {data={}}=useQuery(FETCH_POST,{
        variables:{
            postId
        }
    });
    const {getPost={}}=data || {};
    function deletePostCallback(){
        props.history.push('/')
    }
    let postMarkup;
    if(!getPost){
        postMarkup=<p>Loading Post</p>
    }
    else{
        const {id,body,createdAt,username,comments=[],likes=[],likeCount,commentCount}=getPost||{};
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                    <Image
                    size="small"
                    float="right"
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                    />
                    </Grid.Column>
                    <Grid.Column width={10}>
                    <Card fluid>
                    <Card.Content>
                        <Card.Header>
                            {username}
                        </Card.Header>
                        <Card.Meta>
                            {moment(createdAt).fromNow()}
                        </Card.Meta>
                        <Card.Description>
                            {body}
                        </Card.Description>
                    </Card.Content>
                    <hr/>
                    <Card.Content extra>
                    <LikeButton user={user} postInfo={{id,likeCount,likes}}/>
                    <Popup content="Comment on Post">
                    <Button  as="div" labelPosition="right" onClick={()=>{console.log("comment")}}>
                    <Button basic color="blue">
                        <Icon name="comments"/>
                    </Button>
                    <Label color="blue" basic pointing="left">
                    {commentCount}
                    </Label>
                    </Button>
                        </Popup> 

                    {
                        user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback}/> 
                    }
                    </Card.Content>
                    </Card>
                    {
                        user && (
                            <Card fluid>
                                <Card.Content>
                                <p>Post a commment</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input type="text"
                                        placeholder="Comment..."
                                        name="comment"
                                        value={commentBody}
                                        ref={commentInputRef}
                                        onChange={(event)=>setCommentBody(event.target.value)}/>
                                        <button type="submit" className="ui button teal" 
                                        onClick={addComment}
                                        disabled={commentBody.trim()===""}>Submit</button>
                                    </div>
                                </Form>
                                </Card.Content>
                            </Card>
                        )
                    }
                    {
                        !!comments.length && comments.map(comment=>(
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    )}
                                    <Card.Header>
                                        {comment.username === username ? 'You' : comment.username}
                                    </Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))
                    }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return (
        postMarkup
    )
}

const FETCH_POST=gql`
query($postId:ID!){
    getPost(postId:$postId){
        id
        body
        createdAt
        likeCount
        likes{
            username
        }
        commentCount
        username
        comments{
        id
        username
        createdAt
        body
        }
    }
}`

const ADD_COMMENT=gql`
mutation ($postId:ID!,$body:String!){
    createComment(postId:$postId,body:$body){
    id
    comments{
        id
        body
        createdAt
        username
    }
    commentCount
    }
}
`;
