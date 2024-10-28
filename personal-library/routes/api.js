/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { Book, Comment } = require("../models.js");

module.exports = function (app) {

    app.route('/api/books')
        .get(function (request, response) {
            Book.find()
            .then(documents => {
                return response.json(documents);
            })
            .catch(error => {
                console.error(error);

                return response.send("There was an error while fetching the books");
            });
        })

        .post(function (request, response) {
            let title = request.body.title;

            if (!title) {
                return response.send("missing required field title");
            }

            const book = new Book();
            book.title = title;

            book.save()
            .then(document => {
                return response.json({
                    _id: document._id,
                    title: document.title
                });
            })
            .catch(error => {
                console.error(error);

                return response.send("There was an error while creating the book");
            })
        })

        .delete(function (request, response) {
            Book.deleteMany()
            .then(() => {
                return response.send("complete delete successful");
            })
            .catch(error => {
                console.error(error);

                return response.send("There was an error while deleting the books");
            })
        });



    app.route('/api/books/:id')
        .get(function (request, response) {
            let bookid = request.params.id;

            Book.findOne({
                _id: bookid
            })
            .then(document => {
                if (!document) {
                    return response.send("no book exists");
                }
                
                Comment.find({
                    book_id: document._id
                })
                .then(commentDocuments => {
                    if (!commentDocuments) {
                        commentDocuments = [];
                    }

                    return response.json({
                        _id: document._id,
                        title: document.title,
                        comments: commentDocuments.map(commentDocument => commentDocument.text)
                    });
                })
                .catch(error => {
                    console.error(error);

                    return response.send("There was an error while fetching the comments");
                })
            })
            .catch(error => {
                console.error(error);

                return response.send("There was an error while fetching the book");
            });
        })

        .post(function (request, response) {
            let bookid = request.params.id;
            let comment = request.body.comment;

            if (!comment) {
                return response.send("missing required field comment");
            }

            Book.findOne({
                _id: bookid
            })
            .then(document => {
                if (!document) {
                    return response.send("no book exists");
                }

                const commentObject = new Comment({
                    text: comment,
                    book_id: bookid
                })
                
                commentObject.save()
                .then(commentDocument => {
                    Book.updateOne(
                        {
                            _id: bookid
                        },
                        {
                            commentcount: document.commentcount + 1
                        },
                        {
                            new: true,
                            runValidators: true
                        }
                    )
                    .then(bookDocument => {
                        Comment.find({
                            book_id: document._id
                        })
                        .then(commentDocuments => {
                            if (!commentDocuments) {
                                commentDocuments = [];
                            }
        
                            return response.json({
                                _id: document._id,
                                title: document.title,
                                comments: commentDocuments.map(commentDocument => commentDocument.text)
                            });
                        })   
                    })
                    .catch(error => {
                        console.error(error);

                        return response.send("There was an error while updating the book");
                    });
                })
                .catch(error => {
                    console.error(error);

                    return response.send("There was an error while creating the comment");
                });
            })
            .catch(error => {
                console.error(error);

                return response.send("There was an error while fetching the book");
            });
        })

        .delete(function (request, response) {
            let bookid = request.params.id;
            
            Book.findOneAndDelete({
                _id: bookid
            })
            .then(document => {
                if (!document) {
                    return response.send("no book exists");
                }

                Comment.deleteMany({
                    book_id: bookid
                })
                .then(documents => {
                    return response.send("delete successful");
                })
                .catch(error => {
                    console.error(error);

                    return response.send("There was an error while deleting the comments");
                });
            })
            .catch(error => {
                console.error(error);

                return response.send("There was an error while deleting the book");
            })
        });

};