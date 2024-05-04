import {Router} from 'express';
import * as commentData from '../data/comments.js'
import { userData } from "../data/index.js"; 
import * as helpers from '../helper.js'
import xss from 'xss';


const router = Router();

const sanitizeMiddleware = (req, res, next) => {
    req.body = sanitizeEverything(req.body);
    req.params = sanitizeEverything(req.params);
    next();
}

const sanitizeEverything = (obj) => {
    if (!obj || typeof obj !== 'object'){
        return obj;
    }

    const sanitized = {};
    for (const [key, val] of Object.entries(obj)){
        sanitized[key] = xss(val);
    }
    return sanitized;
}

router.route('/:id/add').post(sanitizeMiddleware, async (req, res) => {
    //console.log('In the comment route');

    try{
        const postId = req.params.id;
        const userComment = req.body; 
        const userId = req.session.user._id;

        const content = helpers.sanitizeData(userComment.comment);

        const commentObj = {postId, content, userId};

        const commentId = await commentData.createComment(commentObj);
        const user = await userData.getUserById(userId);

        commentObj.id = commentId;

        res.status(200).json({ message: 'Comment added successfully', commentId: commentId, comment: content, author: user.firstName + ' ' + user.lastName, profileImg: user.profileImage.path });

    }catch (error) {
        //console.log(error);
        return res.status(400).json({ message: error });
    }
})

router.route('/edit').post(sanitizeMiddleware, async (req, res) => {
    //console.log('IN the comment route');

    try{
        const userComment = req.body; 

        const commentId = userComment.commentId;
        const comment = helpers.sanitizeData(userComment.updatedComment);

        const userId = req.session.user._id;


        console.log('Comment ID: ' + commentId);

        const commentObj = {comment, userId, commentId};


        const editedComment = await commentData.editComment(commentObj);

        res.status(200).json({ message: 'Comment edited successfully' });

    }catch (error) {
        //console.log(error);
        return res.status(400).json({ message: error });
    }
})

router.route('/delete').post(sanitizeMiddleware, async (req, res) => {
    //console.log('In the comment route');

    try{
        const userComment = req.body; 

        const commentId = userComment.commentId;
        const userId = req.session.user._id;


        //console.log('Comment ID: ' + commentId);

        const deletedComment = await commentData.deleteComment(userId, commentId);

        res.status(200).json({ message: 'Comment deleted successfully' });

    }catch (error) {
        //console.log(error);
        return res.status(400).json({ message: error });
    }
})

export default router;