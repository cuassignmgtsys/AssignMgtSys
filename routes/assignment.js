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
        image_name = lecturer_code + '.' + fileExtension;         

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
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }   
                        // send the player's details to the database  
                        let addquery = "INSERT INTO `assignments` (`assignment_number`, `course_code`, `module_code`, `lecturer_code`, `release_date`, `assignment_title`, `content`, `due_date`, `image`) VALUES ('" +
                            assignment_number + "', '" + course_code + "', '" + module_code + "', '" + lecturer_code + "', '" + release_date + "', '" + assignment_title + "', '" + content + "', '" + due_date + "', '" + image_name + "')";
                        db.query(addquery, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
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
            res.render('edit-player.ejs', {
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
        let remark = req.body.remark;


        let query = "UPDATE `assignments` SET `Assignment Number` = '" + assignment_number + "', `Course Code` = '" + course_code + "', `Module Code` = '" + module_code + "', `Lecturer Code` = '" + lecturer_code + 
            "', `Release Date` = '" + release_date + "', `Assignment Title` = '" + assignment_title + "', `Content` = '" + content + "', `Due Date` = '" + due_date + "', `Image` = '" + image + "' WHERE `assignments`.`id` = '" + assignmentId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
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
                    res.redirect('/');
                });
            });
        }); 
    }
};
