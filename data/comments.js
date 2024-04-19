import { ObjectId } from 'mongodb';
import { comments } from '../config/mongoCollections.js';
import { getCurrentDateTime, validators } from "../helper.js";
import * as postData from "../data/posts.js";


const createComment = async (commentObj) => {
    if(!commentObj.content) throw "Content needs to be provided"; 
    if(!commentObj.postId) throw "Post ID needs to be provided"; 
    if(!commentObj.userId) throw "User ID needs to be provided"; 

    commentObj.content = validators.checkString(commentObj.content);
    commentObj.userId = validators.checkId(commentObj.userId);
    commentObj.postId = validators.checkId(commentObj.postId);

    const post = await postData.getPostsbyID(commentObj.postId);
    if(!post) throw `No post with ID: ${commentObj.postId}`;

    // TODO: check if user is present

    const updatedTime = getCurrentDateTime();

    const newComment = {
        content: commentObj.content,
        postId: new ObjectId(commentObj.postId),
        updatedTime: updatedTime,
        userId: new ObjectId(commentObj.userId)
    }

    const commentCollection = await comments();
    const createComment = await commentCollection.insertOne(newComment);
    if (!createComment.acknowledged || !createComment.insertedId) throw "Could not add comment";

    const newId = createComment.insertedId.toString();
    return newId;
    
};

const getCommentById = async (commentId) => {
    if(!commentId) throw "Comment ID needs to be provided";
    commentId = validators.checkId(commentId);
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: new ObjectId(commentId)});
    if(!comment) throw `No comment found with ID: ${commentId}`;
    return comment;
}

const getAllComments = async (postId) => {
    // TODO: check if postId, userId needs to be checked
    if(!postId) throw "Post ID needs to be provided";
    postId = validators.checkId(postId);

    const post = await postData.getPostsbyID(commentObj.postId);
    if(!post) throw `No post found with ID: ${postId}`;

    const commentCollection = await comments();
    const postCommentsList = await commentCollection.find({postId: new ObjectId(postId)});
    //if (!postCommentsList) throw "No comments present for the post"; -- empty if no comments in UI 
    return postCommentsList;
};

const deleteComment = async(commentId) => {
    // TODO: check if postId, userId needs to be checked
    if(!commentId) throw "Comment ID needs to be provided";

    commentId = validators.checkId(commentId);

    const commentCollection = await comments();
    const deletedCommentInfo = await commentCollection.findOneAndDelete({_id: new ObjectId(commentId)});
    if(!deletedCommentInfo) throw `The comment with ID ${commentId} does not exist and could not be deleted`;
    return deletedCommentInfo.value._id;
} 

const editComment = async (commentObj) => {
    if(!commentObj.content) throw "Content needs to be provided"; 
    if(!commentObj.postId) throw "Post ID needs to be provided"; 
    if(!commentObj.userId) throw "User ID needs to be provided"; 

    commentObj.content = validators.checkString(commentObj.content);
    commentObj.userId = validators.checkId(commentObj.userId);
    commentObj.postId = validators.checkId(commentObj.postId);

    const post = await postData.getPostsbyID(commentObj.postId);
    if(!post) throw `No post found with ID: ${commentObj.postId}`;

    // TODO: check if user is present

    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: new ObjectId(commentObj.commentId) }); 
    if (!comment) throw `No comment found with the ID: ${commentObj.commentId}`;

    const updatedTime = getCurrentDateTime();

    const updatedComment = {
        content: commentObj.content,
        updatedTime: updatedTime
    };
    
    const updatedCommentInfo = commentCollection.findOneAndUpdate(
        {_id: new ObjectId(commentObj.commentId)},
        {$set: updatedComment},
        {returnDocument: 'after'}
    );

    if(!updatedCommentInfo) throw `The comment with ID ${commentObj.commentId} could not be updated`;

    return updatedCommentInfo.value._id;
}



// TODO: delete all comments if user, product deleted

export {createComment, getCommentById, getAllComments, deleteComment, editComment};