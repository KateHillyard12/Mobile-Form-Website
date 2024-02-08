//Libraries
const path = require('path');
const express = require('express');
const multer = require('multer');
const { check, checkSchema, validationResult } = require('express-validator');


//Setup defaults for script
const app = express();
const storage = multer.diskStorage({
    //Logic where to upload file
    destination: function (request, file, callback) {
        callback(null, 'uploads/')
    },
    //Logic to name the file when uploaded
    filename: function (request, file, callback) {
        /**
         * @source https://stackoverflow.com/questions/19811541/get-file-name-from-absolute-path-in-nodejs
         */
        callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.parse(file.originalname).ext)
    }
})
const upload = multer({
    storage: storage,
    //Validation for file upload
    fileFilter: (request, file, callback) => {
        const allowedFileMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
        callback(null, allowedFileMimeTypes.includes(file.mimetype));
    }
});
const port = 80 //Default port to http server
app.post(
  '/',
  upload.fields([{ name: 'file', maxCount: 1 }]),

  check('chara', 'Please choose a character.').isIn(['Brr','Claw','Grave','Spell', 'Spore','Stab']),

  check('played','Please select an option. ').isIn(['Yes','No']),

  check('WGame', 'Please enter a game name.').isLength({ min: 5}),

  check('element', 'Please choose a element.').isIn(['Inc','Cor','Sho','Exp', 'Cry','Rad']),

  check('HPlayed', 'Please enter the number of hours played.').isNumeric(),

  checkSchema({
        'file': {
            custom: {
                options: (value, { req, path }) => !!req.files[path],
                errorMessage: 'Please upload an image of your favorite gun.',
            },
        },
    }),
    (request, response) => {
        //Validate request; If there any errors, send 400 response back
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response
                .status(400)
                .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                });
        }

        //Default response object
        response
            .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
            .json({ message: 'Request fields and files are valid.' });
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});