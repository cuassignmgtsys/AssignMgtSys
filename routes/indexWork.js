module.exports = {
    getWorkPage: (req, res) => {
        let workquery = "SELECT * FROM `works` ORDER BY id ASC"; // query database to get all the assignments

        // execute query
        db.query(workquery, (err, result) => {
            if (err) {
                res.redirect('/indexWork');
            }
            res.render('indexWork.ejs', {
                title: "Welcome to AssignMgtSys | View Works"
                ,works: result
            });
        });
    },
};
