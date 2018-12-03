const fs = require('fs');


module.exports = {
    addAssignmentPage: (req, res) => {
        res.render('add-assignment.ejs', {
            title: "Welcome to AssignMgtSys | Add a new assignment"
            ,message: ''
        });
    },
    addAssignment: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let assignment_number = req.body.assignment_number;
        let course_code = req.body.course_code;
        let module_code = req.body.module_code;
        let lecturer_code = req.body.lecturer_code;
        let release_date = req.body.release_date;
        let assignment_title = req.body.assignment_title;
        let content = req.body.content;
        let due_date = req.body.due_date;
        let uploadedFile = req.files.image;   
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = assignment_number + '.' + fileExtension;         

        let assignNumQuery = "SELECT * FROM `assignments` WHERE `assignment_number` = '" + assignment_number + "'";

        db.query(assignNumQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Assignment number already exists';
                res.render('add-assignment.ejs', {
                    message,
                    title: "Welcome to AssignMgtSys | Add a new assignment"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif'  || uploadedFile.mimetype === 'text/plain') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }   
                        // send the assignment's details to the database  
                        let addquery = "INSERT INTO `assignments` (`assignment_number`, `course_code`, `module_code`, `lecturer_code`, `release_date`, `assignment_title`, `content`, `due_date`, `image`) VALUES ('" +
                            assignment_number + "', '" + course_code + "', '" + module_code + "', '" + lecturer_code + "', '" + release_date + "', '" + assignment_title + "', '" + content + "', '" + due_date + "', '" + image_name + "')";
                        db.query(addquery, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/home');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-assignment.ejs', {
                        message,
                        title: "Welcome to AssignMgtSys | Add a new assignment."
                    });
                }   
            }
        });
    },
    editAssignmentPage: (req, res) => {
        let assignmentId = req.params.id;
        let query = "SELECT * FROM `assignments` WHERE `id` = '" + assignmentId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-assignment.ejs', {
                title: "Edit  Assignment"
                ,assignment: result[0]
                ,message: ''
            });
        });
    },
    editAssignment: (req, res) => {
        let assignmentId = req.params.id;
        let assignment_number = req.body.assignment_number;
        let course_code = req.body.course_code;
        let module_code = req.body.module_code;
        let lecturer_code = req.body.lecturer_code;
        let release_date = req.body.release_date;
        let assignment_title = req.body.assignment_title;
        let content = req.body.content;
        let due_date = req.body.due_date;
        let image = req.body.image;


        let query = "UPDATE `assignments` SET `assignment_number` = '" + assignment_number + "', `course_code` = '" + course_code + "', `module_code` = '" + module_code + "', `lecturer_code` = '" + lecturer_code + 
            "', `release_date` = '" + release_date + "', `assignment_title` = '" + assignment_title + "', `content` = '" + content + "', `due_date` = '" + due_date + "', `image` = '" + image + "' WHERE `assignments`.`id` = '" + assignmentId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/home');
        });
    },
    deleteAssignment: (req, res) => {
        let assignmentId = req.params.id;
        let getImageQuery = 'SELECT image from `assignments` WHERE id = "' + assignmentId + '"';
        let deleteUserQuery = 'DELETE FROM assignments WHERE id = "' + assignmentId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/home');
                });
            });
        }); 
    },
    getWorkPage: (req, res) => {
        let workquery = "SELECT * FROM `works` ORDER BY id ASC"; // query database to get all the assignments

        // execute query
        db.query(workquery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('indexWork.ejs', {
                title: "Welcome to AssignMgtSys | View Works"
                ,works: result
            });
        });
    },
    submitWorkPage: (req, res) => {
        let workId = req.params.id;
        let queryId = "SELECT * FROM `works` WHERE `id` = '" + workId + "' ";
        db.query(queryId, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('submit-work.ejs', {
                title: "Submit Work"
                ,work: result[0]
                ,message: ''
            });
        });
    },
    submitWork: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let assignment_number = req.body.assignment_number;
        let student_number = req.body.student_number;
        let work_submit_date = req.body.work_submit_date;
        let uploadedFile = req.files.work_file;   
        let file_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        file_name = assignment_number + '_' + student_number + '.' + fileExtension;         

        let workId = req.params.id;
        let workQuery = "SELECT * FROM `works` WHERE `id` = '" + workId + "'";

        db.query(workQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif' || uploadedFile.mimetype === 'text/plain') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${file_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }   
                        // send the work's details to the database  
                        let submitquery = "INSERT INTO `works` (`assignment_number`, `student_number`, `work_submit_date`, `work_file`) VALUES ('" +
                            assignment_number + "', '" + student_number + "', '" + work_submit_date + "', '" + file_name + "')";
                        db.query(submitquery, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/submit_work');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg', 'png' and 'txt' files are allowed.";
                    res.render('submit-work.ejs', {
                        message,
                        title: "Welcome to AssignMgtSys | Submit a new work."
                    });
                }   
            }
        });
    },    
    submitMarkPage: (req, res) => {
        let workId = req.params.id;
        let query = "SELECT * FROM `works` WHERE `id` = '" + workId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('submit-mark.ejs', {
                title: "Submit Mark"
                ,mark: result[0]
                ,message: ''
            });
        });
    },
    submitMark: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let lecturer_code = req.body.lecturer_code;
        let mark_submit_date = req.body.mark_submit_date;
        let mark_score = req.body.mark_score;
        let uploadedFile = req.files.mark_file;   
        let file_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        file_name = lecturer_code + '_marked_' + '.' + fileExtension;         

        let workId = req.params.id;
        let workQuery = "SELECT * FROM `works` WHERE `id` = '" + workId + "'";

        db.query(workQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif' || uploadedFile.mimetype === 'text/plain') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${file_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }   
                        // send the mark's details to the database  
                       let submitquery = "UPDATE `works` SET `lecturer_code` = '" + lecturer_code + "', `mark_submit_date` = '" + mark_submit_date + "', `mark_score` = '" + mark_score + "', `mark_file` = '" + file_name + "' WHERE `id` = '" + workId + "'" ;           
            
            db.query(submitquery, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/submit_work');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg', 'png' and 'txt' files are allowed.";
                    res.render('submit-work.ejs', {
                        message,
                        title: "Welcome to AssignMgtSys | Submit a new mark."
                    });
                }   
            }
        });
    },        
};
