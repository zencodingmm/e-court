const prisma = require('../../config/database');
const bcrypt = require('bcrypt');

exports.loginHandler = async (req, res) => {
    try {
        if (!req.body) {
            throw new Error("Content can't be empty!");
        }

        const { username, password, user_code } = req.body;

        if (!user_code) {
            const existingUser = await prisma.tbl_user.findFirst({ where: { username: username, locked: false } }).catch(error => {
                console.log(error);
                throw new Error(error);
            });

            if (!existingUser) {
                throw new Error('This username has not been registered');
            }

            const validate = bcrypt.compareSync(password, existingUser.password);

            if (!validate) {
                throw new Error('Incorrect Password');
            }

            return res.status(200).json({ message: 'Login Successful', data: existingUser });
        }

        const existingUser = await prisma.tbl_user.findFirst({ where: { user_code, locked: false } });

        res.status(200).json({ message: 'Login Successful', data: existingUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
