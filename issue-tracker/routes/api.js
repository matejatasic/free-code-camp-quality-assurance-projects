"use strict";

const { Issue } = require("../models.js");

module.exports = function (app) {

    app.route("/api/issues/:project")

        .get(function (request, response) {
            let project = request.params.project;
            const filters = {
                project,
                ...request.query
            }

            Issue.find(filters)
            .then(documents => {
                if (!documents) {
                    return [];
                }

                response.json(
                    documents.map(document => {
                        return {
                            _id: document._id,
                            issue_title: document.issue_title,
                            issue_text: document.issue_text,
                            created_on: document.created_on,
                            updated_on: document.updated_on,
                            created_by: document.created_by,
                            assigned_to: document.assigned_to ? document.assigned_to : "",
                            open: document.open,
                            status_text: document.status_text ? document.status_text : ""
                        }
                    })
                )
            })
            .catch(error => {
                console.error(error);

                return response.send("There was an error while fetching the issues");
            });
        })

        .post(function (request, response) {
            let project = request.params.project;
            const {
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text
            } = request.body;

            if (
                !issue_title
                || !issue_text
                || !created_by
            ) {
                return response.json({
                    error: "required field(s) missing"
                });
            }

            const issue = new Issue({
                project,
                issue_title,
                issue_text,
                created_on: new Date(),
                updated_on: new Date(),
                created_by,
                assigned_to,
                status_text,
            });

            issue.save()
                .then(document => {
                    return response.json({
                        _id: document._id,
                        issue_title: document.issue_title,
                        issue_text: document.issue_text,
                        created_on: document.created_on,
                        updated_on: document.updated_on,
                        created_by: document.created_by,
                        assigned_to: document.assigned_to ? document.assigned_to : "",
                        open: document.open,
                        status_text: document.status_text ? document.status_text : "",
                    });
                })
                .catch(error => {
                    console.error(error);

                    return response.send("There was an error while creating the issue");
                });
        })

        .put(function (request, response) {
            let project = request.params.project;

            const {
                _id,
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
                open
            } = request.body;
            
            if (!_id) {
                return response.json({
                    error: "missing _id"
                });
            }

            const updateParams = {};

            if (issue_title) {
                updateParams.issue_title = issue_title;
            }

            if (issue_text) {
                updateParams.issue_text = issue_text;
            }

            if (created_by) {
                updateParams.created_by = created_by;
            }

            if (assigned_to) {
                updateParams.assigned_to = assigned_to;
            }

            if (status_text) {
                updateParams.status_text = status_text;
            }

            if (open) {
                updateParams.open = open;
            }

            if (Object.keys(updateParams).length === 0) {
                return response.json({
                    error: "no update field(s) sent",
                    _id
                });
            }

            updateParams.updated_on = new Date();

            Issue.findOneAndUpdate(
                {
                    _id
                },
                updateParams,
                {
                    new: true,
                    runValidators: true
                }
            )
                .then((document) => {
                    if (!document) {
                        return response.json({
                            error: "could not update", 
                            _id
                        });
                    }

                    return response.json({
                        result: "successfully updated",
                        _id
                    })
                })
                .catch((error) => {
                    console.error(error);

                    return response.json({
                        error: "could not update", 
                        _id
                    });
                });;
        })

        .delete(function (request, response) {
            let project = request.params.project;
            
            if (!request.body._id) {
                return response.json({
                    error: "missing _id"
                });
            }

            Issue.findOneAndRemove({
                _id: request.body._id
            })
            .then(document => {
                if (!document) {
                    return response.json({
                        error: "could not delete",
                        _id: request.body._id
                    });
                }

                return response.json({
                    result: "successfully deleted",
                    _id: request.body._id
                })
            })
            .catch(error => {
                console.error(error);

                return response.json({
                    error: "could not delete",
                    _id: request.body._id
                });
            });
        });

};