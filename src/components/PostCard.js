import React, {useContext} from 'react'
import {Card,Icon,Label,Image,Button,} from "semantic-ui-react"
import moment from "moment"
import {Link} from "react-router-dom"
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton"
import {AuthContext} from "../context/auth"
import Popup from "../utils/Popup"
export default function PostCard({post:{body,createdAt,id={},username,likeCount=0,commentCount,likes=[]}}) {

  const {user}=useContext(AuthContext);
    const likePost=(e)=>console.log("likepost")
    const commentOnPost=(e)=>console.log("comment on post")


    return (
        <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
      <LikeButton user={user} postInfo={{id,likeCount,likes}}/>
      <Popup
      content="Comment on Post">
        <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
        <Button color='blue' basic>
          <Icon name='comments' />
        </Button>
        <Label  basic color='teal' pointing='left'>
          {commentCount}
        </Label>
      </Button>
      </Popup>
    {
      user && user.username === username && (
         <DeleteButton postId={id}/>
      )
    }
      </Card.Content>
    </Card>
    )
}
