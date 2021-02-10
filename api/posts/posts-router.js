// implement your posts router here
const Posts = require('./posts-model');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    Posts.find()
      .then(posts => {
          res.status(200).json(posts)
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              message: 'The posts information could not be retrieved.'
          })
      });
});

router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post) {
          res.status(200).json(post); 
        } else {
          res.status(404).json({
              message: 'The post with the specified ID does not exist.'
            })
        }  
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'The post information could not be retrieved.'
        })
    });
});

router.post('/', (req, res) => {
  Posts.insert(req.body)
    .then(post => {
        if (post.title === '' || post.contents === '') {
            res.status(400).json({
                message: 'Please provide title and contents for the post.'
            })
        } else {
            res.status(201).json(req.body);
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'There was an error while saving the post to the database.'
        });
    });
});

router.put('/:id', (req, res) => {
    const postChange = req.body;
    const id = req.params.id;
    Posts.update(id, postChange)
      .then(post => {
          if (post) {
              Posts.findById(id).then(newPost => {
              res.status(200).json(newPost);
            })
         } else if (postChange.title === '' || postChange.contents === '' ) {
              res.status(400).json({
                  message: 'Please provide title and contents for the post.'
              })
         } else {
              res.status(404).json({
                  message: 'The post with the specified ID does not exist.'
              });
          };
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              message: 'The post information could not be modified.'
          });
      });
});

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
      .then(post => {
          if (post) {
              res.status(200).json(post);
          } else {
              res.status(404).json({
                  message: 'The post with the specified ID does not exist.'
              })
          }
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              message: 'The post could not be removed.'
          });
      });
});

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
      .then(postComments => {
          if (postComments) {
              res.status(200).json(postComments);
          } else {
              res.status(404).json({
                  message: 'The post with the specified ID does not exist.'
              });
          };
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              message: 'The comments information could not be retrieved.'
          });
      });
});

module.exports = router;