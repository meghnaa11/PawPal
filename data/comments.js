import { ObjectId } from 'mongodb';
import { comments } from '../config/mongoCollections.js';
import { getCurrentDateTime, validators } from "../helper.js";
import * as postData from "../data/posts.js";
import  userDataFunctions  from "../data/users.js";


const createComment = async (commentObj) => {
    if(!commentObj.content) throw "Content needs to be provided"; 
    if(!commentObj.postId) throw "Post ID needs to be provided"; 
    if(!commentObj.userId) throw "User ID needs to be provided"; 

    commentObj.content = validators.checkString(commentObj.content);
    commentObj.userId = validators.checkId(commentObj.userId);
    commentObj.postId = validators.checkId(commentObj.postId);

    const post = await postData.getPostsbyID(commentObj.postId);
    if(!post) throw `No post with ID: ${commentObj.postId}`;

    const user = await userDataFunctions.getUserById(commentObj.userId);

    if(!user){
        throw `User does not exist with ID: ${commentObj.userId}`;
    }


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

    await postData.addCommentToPost(commentObj.postId, newId);
    await userDataFunctions.addUsersComments(commentObj.userId, newId);

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
    if(!postId) throw "Post ID needs to be provided";
    postId = validators.checkId(postId);

    const post = await postData.getPostsbyID(postId);
    if(!post) throw `No post found with ID: ${postId}`;

    const commentCollection = await comments();
    const postCommentsList = await commentCollection.find({postId: new ObjectId(postId)}).toArray();
    postCommentsList.forEach(element => {
        element._id = element._id.toString();
        element.userId = element.userId.toString();

    }); 
    return postCommentsList;
};

const deleteComment = async(userId, commentId) => {
    if(!commentId) throw "Comment ID needs to be provided";

    commentId = validators.checkId(commentId);

    const commentCollection = await comments();

    const comment = await commentCollection.findOne({ _id: new ObjectId(commentId) }); 
    if (!comment) throw `No comment found with the ID: ${commentId}`;

    if(comment.userId.toString() !== userId){
        throw "Only the commenter can delete the comment";
    }

    const deletedCommentInfo = await commentCollection.findOneAndDelete({_id: new ObjectId(commentId)});
    if(!deletedCommentInfo) throw `The comment with ID ${commentId} does not exist and could not be deleted`;
    await postData.deleteCommentFromPost(deletedCommentInfo.postId.toString(), commentId);
    await userDataFunctions.deleteUsersComments(userId, commentId);
    return true;
} 

const editComment = async (commentObj) => {
    if(!commentObj.comment) throw "Content needs to be provided"; 
    if(!commentObj.userId) throw "User ID needs to be provided"; 
    if(!commentObj.commentId) throw "Comment ID needs to be provided"; 


    commentObj.comment = validators.checkString(commentObj.comment);
    commentObj.userId = validators.checkId(commentObj.userId);

    const user = await userDataFunctions.getUserById(commentObj.userId);

    if(!user){
        throw `User does not exist with the ID: ${commentObj.userId}`;
    }



    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: new ObjectId(commentObj.commentId) }); 
    if (!comment) throw `No comment found with the ID: ${commentObj.commentId}`;

    if(comment.userId.toString() !== commentObj.userId){
        throw "Only the commenter can edit the comment";
    }

    const updatedTime = getCurrentDateTime();

    const updatedComment = {
        content: commentObj.comment,
        updatedTime: updatedTime
    };
    
    const updatedCommentInfo = commentCollection.findOneAndUpdate(
        {_id: new ObjectId(commentObj.commentId)},
        {$set: updatedComment},
        {returnDocument: 'after'}
    );

    if(!updatedCommentInfo) throw `The comment with ID ${commentObj.commentId} could not be updated`;

    return updatedCommentInfo._id;
}

const deleteUserComments = async (userId) => {
    if(!userId) throw "User ID needs to be provided";
    userId = validators.checkId(userId);

    const commentCollection = await comments();
    const deletedCommentsInfo = await commentCollection.deleteMany({userId: new ObjectId(userId)});
    if(deletedCommentsInfo.deletedCount === 0) throw `No comments found with user ID: ${userId}`;

    return deletedCommentsInfo.deletedCount;
}

const deletePostComments = async (postId) => {
    if(!postId) throw "Post ID needs to be provided";
    postId = validators.checkId(postId);

    const commentCollection = await comments();
    const deletedCommentsInfo = await commentCollection.deleteMany({postId: new ObjectId(postId)});
    //if(deletedCommentsInfo.deletedCount === 0) throw `No comments found with post ID: ${postId}`;

    return deletedCommentsInfo.deletedCount;

}


export {createComment, getCommentById, getAllComments, deleteComment, editComment, deletePostComments, deleteUserComments};