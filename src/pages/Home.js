import React, { useContext } from 'react'
import {useQuery} from '@apollo/react-hooks'
import { Grid, GridColumn, Image,Transition } from 'semantic-ui-react'

import {AuthContext} from "../context/auth"
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../utils/graphql"


export default function Home() {
    const {loading,data}=useQuery(FETCH_POSTS_QUERY);
    const {getPosts:posts=[]}=data || {};
    const { user=null }=useContext(AuthContext); 

    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
        <Grid.Row>
            {
                user &&(
                    <Grid.Column>
                        <PostForm/>
                    </Grid.Column>
                )
            }
            {
                loading ? (<h1>Loading posts</h1>) : (
                    <Transition.Group>
                        {
                        posts && posts.map(post=>{

                            return (
                                <Grid.Column key={post.id} style={{"marginBottom":"20px"}}>
                                <PostCard post={post}/>
                               </Grid.Column>
                            )
  
                        }

                        )
            }
                        </Transition.Group>
                    
                )
            }
        </Grid.Row>
        </Grid>
    )
}



