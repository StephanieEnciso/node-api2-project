const express = require('express')

const Post = require('./posts-model')

const router = express.Router()

router.get('', (req, res) => {
    Post.find()
      .then(posts => {
          res.status(200).json(posts)
      })
      .catch(err => {
          res.status(500).json({
            message: "The posts information could not be retrieved"
          })
      })
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try{
        const post = await Post.findById(id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            res.status(200).json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be retrieved"
        })
    }
})

router.post('', async (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        try{
         const newPostId = await Post.insert(req.body)  
         const newPost = await Post.findById(newPostId.id)
         res.status(201).json(newPost) 
        } catch (err) {
            res.status(500).json({
                message: "There was an error while saving the post to the database" 
            })
        }
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
         try{
            const post = await Post.findById(id)
            if(!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist" 
                })
            } else {
                const updatedPost = await Post.update(id, req.body)
                const newPost = await Post.findById(id)
                res.status(200).json(newPost)
            }
        } catch (err) {
            res.status(500).json({
                message: "The post information could not be modified"
            })
        }
    }
   
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try{
        const post = await Post.findById(id)
        if(!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const deletedPost = await Post.remove(id)
            res.status(200).json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed"
        })
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params
    try{
        const post = await Post.findById(id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const postComments = await Post.findPostComments(id)
            res.status(200).json(postComments)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    }
})

module.exports = router;