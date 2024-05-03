import {Router} from 'express';
import * as commentData from '../data/comments.js'
import * as helpers from '../helper.js'

const router = Router();

router.route('/:id/add').post(async (req, res) => {
    console.log('IN the comment route')

    try{
        const postId = req.params.id;
        const userComment = req.body; 
        const userId = req.session.user._id

        const content = helpers.sanitizeData(userComment.comment)

        const commentObj = {postId, content, userId}

        const commentId = await commentData.createComment(commentObj)

        commentObj.id = commentId

        res.status(200).json({ message: 'Comment added successfully', comment: content });

    }catch (error) {
        console.log(error)
        return res.status(400).json({ message: error });
    }
})

router.route('/edit').post(async (req, res) => {
    console.log('IN the comment route')

    try{
        const userComment = req.body; 

        const commentId = userComment.commentId
        const comment = helpers.sanitizeData(userComment.updatedComment)

        const userId = req.session.user._id


        console.log('Comment ID: ' + commentId)

        const commentObj = {comment, userId, commentId}


        const editedComment = await commentData.editComment(commentObj)

        res.status(200).json({ message: 'Comment edited successfully' });

    }catch (error) {
        console.log(error)
        return res.status(400).json({ message: error });
    }
})

router.route('/delete').post(async (req, res) => {
    console.log('IN the comment route')

    try{
        const userComment = req.body; 

        const commentId = userComment.commentId

        console.log('Comment ID: ' + commentId)

        const deletedComment = await commentData.deleteComment(commentId)

        res.status(200).json({ message: 'Comment deleted successfully' });

    }catch (error) {
        console.log(error)
        return res.status(400).json({ message: error });
    }
})

export default router