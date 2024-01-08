require('dotenv/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');

const port = process.env.PORT || 4001;

// import router
const router = require('./src/router');
const prisma = require('./src/config/database');

// middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

app.use('/create', async (req, res) => {
    try {
        const existingRole = await prisma.tbl_user_type.findFirst({ where: { type: 'admin' } });

        if (!existingRole) {
            await prisma.tbl_user_type
                .create({
                    data: {
                        user_type_id: 1,
                        type: 'admin',
                        description: 'admin'
                    }
                })
                .then(async result => {
                    const user_code = '007';
                    const username = 'admin';
                    const password = 'admin@1234';

                    const existingAdmin = await prisma.tbl_user.findFirst({ where: { user_code, username } });

                    if (!existingAdmin) {
                        const hashPassword = bcrypt.hashSync(password, 10);

                        await prisma.tbl_user.create({
                            data: {
                                user_id: 1,
                                user_code: '007',
                                username,
                                password: hashPassword,
                                user_rank: 'Admin',
                                user_type_id: result.user_type_id,
                                type: result.type,
                                description: result.description
                            }
                        });
                    }

                    res.status(201).send('User has been created successfully.');
                })
                .catch(error => console.log(error));
        }
    } catch (error) {
        console.log(error);
    }
});

app.use(router);

app.listen(port, () => console.log(`Server is listening in port ${port}`));
