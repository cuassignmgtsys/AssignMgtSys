module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `assignments` ORDER BY id ASC"; // query database to get all the assignments

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to AssignMgtSys | View Assignments"
                ,assignments: result
            });
        });
    },
};
