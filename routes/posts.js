const router = require("express").Router();
const {setErrorResponse, setSuccessResponse} = require("../services/api-handler");
const Post = require("../models/Post");
const ERROR = require(`../handlers/error-keys`);

/**
 * API to create posts in app.
 * @param req {objects}
 * @param res {objects}
 */
router.post('/', async (req, res) => {
    const {body: {title}} = req;
    const exPost = await Post.findOne({title});
    if(exPost) {
        setErrorResponse(null, ERROR.POST_ALREADY_PRESENT, res);
        return;
    }
    const newPost = new Post(req.body);
    try {
        const savePost = await newPost.save();
        setSuccessResponse({post: savePost}, res);
    } catch (err) {
        setErrorResponse(err, ERROR.GETTING_DATA, res);
    }
});

/**
 * API to update post details in app.
 * @param req {objects}
 * @param res {objects}
 */
router.put('/:id', async (req, res) => {
    const { params: {
        id
    }, body: {username}} = req;

    try {
        const post = await Post.findById(id);
        if(!post) {
            setErrorResponse(null, ERROR.UNAUTHORIZED_POST_ERROR, res);
            return;
        }
        if(post?.username === username) {
            try {
                const updatePost = await Post.findByIdAndUpdate(id, {
                    $set: req.body
                }, { new: true });
                setSuccessResponse({post: updatePost}, res);
            } catch (err) {
                setErrorResponse(err, ERROR.GETTING_DATA, res);
            }
        }
    } catch (err) {
        setErrorResponse(err, ERROR.POST_NOT_FOUND, res);
    }
});

/**
 * API to delete post in app.
 * @param req {objects}
 * @param res {objects}
 */
router.delete('/:id', async (req, res) => {
    const { params: {
        id
    }, body: {username}} = req;

    try {
        const post = await Post.findById(id);
        if(!post) {
            setErrorResponse(null, ERROR.UNAUTHORIZED_POST_ERROR, res);
            return;
        }
        if(post?.username === username) {
            try {
                await post.delete();
                setSuccessResponse({message: "Post has been deleted"}, res);
            } catch (err) {
                setErrorResponse(err, ERROR.GETTING_DATA, res);
            }
        }
    } catch (err) {
        setErrorResponse(err, ERROR.POST_NOT_FOUND, res);
    }
});

/**
 * API to get post details in app.
 * @param req {objects}
 * @param res {objects}
 */
router.get('/:id', async (req, res) => {
    const {
        params: {
            id
        }
    } = req;

    try {
        const post = await Post.findById(id);
        setSuccessResponse({ post }, res);
    }catch (err) {
        setErrorResponse(err, ERROR.GETTING_DATA, res);
    }
});

/**
 * API to get all the posts in app.
 * @param req {objects}
 * @param res {objects}
 */
router.get('/', async (req, res) => {
    const {
        params: {
            id
        },
        query: {
            username,
            category
        }
    } = req;

    try {
        let posts = [];
        if(username || category) {
            posts = await Post.find(req.query);
        } else {
            posts = await Post.find();
        }

        setSuccessResponse({ posts }, res);
    }catch (err) {
        setErrorResponse(err, ERROR.GETTING_DATA, res);
    }
});

module.exports = router;