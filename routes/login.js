module.exports = {
    getLoginPage: (req, res) => {
            res.render('login.ejs', {
                title: "Welcome to AssignMgtSys | Login Lecturer"
                ,message: ''
            });
   },  

   loginPage: (req, res) => {
            res.render('login.ejs', {
                title: "Welcome to AssignMgtSys | Login lecturer"
                ,message: ''
            });
    },

    loginLecturerPage: (req, res) => {
        res.render('login-lecturer.ejs', {
            title: "Welcome to AssignMgtSys | Login lecturer"
            ,message: ''
        });
    },

    loginStudentPage: (req, res) => {
        res.render('login-student.ejs', {
            title: "Welcome to AssignMgtSys | Login student"
            ,message: ''
        });
    },


    loginLecturer: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let loginLectQuery = "SELECT * FROM `lecturer` WHERE `email` = '" + email + "' and `password` = '"+ password +"'";
        db.query(loginLectQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
       if(result.length >0){
            res.redirect('/home');
        }else{
            return res.status(400).send("Email and password does not match.");                
        } 
      });             
    }, 

    loginStudent: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let loginLectQuery = "SELECT * FROM `student` WHERE `email` = '" + email + "' and `password` = '"+ password +"'";
        db.query(loginLectQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
       if(result.length >0){
            res.redirect('/home');
        }else{
            return res.status(400).send("Email and password does not match.");                
        } 
      });             
    }, 



    registerLecturerPage: (req, res) => {
        res.render('register-lecturer.ejs', {
            title: "Welcome to AssignMgtSys | Register a new lecturer"
            ,message: ''
        });
    },
    registerLecturer: (req, res) => {
        let today = new Date();
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let password = req.body.password;
        let day = today.getDate().toString();
        let month = (today.getMonth()+1).toString();
        let year = today.getFullYear().toString(); 
        let date = year.concat('-',month,'-',day);
        let regLectQuery = "INSERT INTO `lecturer` (`first_name`, `last_name`, `email`, `password`, `date`) VALUES ('" + first_name + "', '" + last_name + "', '" + email + "', '" + password + "', '" + date + "')";
        db.query(regLectQuery, (err, result) => {    
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/login_lecturer');
        });      
    },

    registerStudentPage: (req, res) => {
        res.render('register-student.ejs', {
            title: "Welcome to AssignMgtSys | Register a new lecturer"
            ,message: ''
        });
    },
    registerStudent: (req, res) => {
        let today = new Date();
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let password = req.body.password;
        let day = today.getDate().toString();
        let month = (today.getMonth()+1).toString();
        let year = today.getFullYear().toString(); 
        let date = year.concat('-',month,'-',day);
        let regStudQuery = "INSERT INTO `student` (`first_name`, `last_name`, `email`, `password`, `date`) VALUES ('" + first_name + "', '" + last_name + "', '" + email + "', '" + password + "', '" + date + "')";
        db.query(regStudQuery, (err, result) => {    
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/login_student');
        });      
    },

};