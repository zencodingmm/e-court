const prisma = require('../../../config/database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, page_size } = req.query;
        const skip = Number(page) * Number(page_size);

        if (page && page_size) {
            const [result, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_user.findMany({
                        skip,
                        take: Number(page_size)
                    }),
                    prisma.tbl_user.count()
                ])
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            if (result.length === 0 || totalRecord === 0) {
                throw new Error('E-Document is not found!');
            }

            res.status(200).json({ data: result, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByHandler = async (req, res) => {
    try {
        const { id, user_code } = req.query;

        let result;

        if (id) {
            result = await prisma.tbl_user
                .findUnique({
                    where: {
                        user_id: Number(id)
                    }
                })
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });
        }

        if (user_code) {
            result = await prisma.tbl_user
                .findFirst({
                    where: {
                        user_code: user_code
                    }
                })
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });
        }

        if (!result) {
            throw new Error('E-Document is not found!');
        }

        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createHandler = async (req, res) => {
    let filename;
    try {
        if (!req.body) {
            throw new Error("Content can't be empty!");
        }

        const existingUser = await prisma.tbl_user.findFirst({ where: { user_code: req.body.user_code } });

        if (existingUser) {
            throw new Error(`this user code has been created`);
        }

        let locked = false;

        if (req.body.locked.toLowerCase() === 'true') {
            locked = true;
        }

        const hashPassword = bcrypt.hashSync(req.body.password, 10);

        if (req.files) {
            if (!fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public'))) {
                fs.mkdirSync(path.join(__dirname, '..', '..', '..', '..', 'public'));
            }

            if (!fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users'))) {
                fs.mkdirSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users'));
            }

            if (!fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${req.body.user_code}`))) {
                fs.mkdirSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${req.body.user_code}`));
            }

            const image = req.files.user_image;
            filename = image.name;

            if (image) {
                image.mv(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${req.body.user_code}`, filename), async error => {
                    if (error) {
                        throw new Error('File uploading error!');
                    }
                });

                await prisma.tbl_user.create({ data: { ...req.body, password: hashPassword, locked: locked, user_type_id: Number(req.body.user_type_id), user_image: `user${req.body.user_code}/${filename}` } }).catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

                return res.status(201).json({ message: 'User has been created successfully.' });
            }
        }

        await prisma.tbl_user
            .create({
                data: { ...req.body, password: hashPassword, locked: locked, user_type_id: Number(req.body.user_type_id) }
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        res.status(201).json({ message: 'User has been created successfully.' });
    } catch (error) {
        if (filename) {
            if (fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${req.body.user_code}`, filename))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${req.body.user_code}`, filename), { recursive: true, force: true });
            }
        }

        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    let filename;

    try {
        const { id } = req.params;

        if (!id) {
            throw new Error('Id cannot be empty!');
        }

        const existingUser = await prisma.tbl_user.findUnique({ where: { user_id: Number(id) } });

        let locked = false;

        if (req.body.locked.toLowerCase() === 'true') {
            locked = true;
        }

        const hashPassword = bcrypt.hashSync(req.body.password, 10);

        if (req.files) {
            if (!fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${existingUser.user_code}`))) {
                fs.mkdirSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${existingUser.user_code}`));
            }

            if (fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `${existingUser.user_image}`))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `${existingUser.user_image}`), { recursive: true, force: true });
            }

            const image = req.files.user_image;
            filename = image.name;

            if (image) {
                image.mv(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${req.body.user_code}`, filename), async error => {
                    if (error) {
                        throw new Error('File uploading error!');
                    }
                });

                await prisma.tbl_user
                    .update({
                        where: { user_id: Number(id) },
                        data: { ...req.body, password: hashPassword, user_id: Number(req.body.user_id), locked: locked, user_type_id: Number(req.body.user_type_id), user_image: `user${req.body.user_code}/${filename}` }
                    })
                    .catch(error => {
                        console.log(error);
                        throw new Error('Something Wrong!');
                    });

                return res.status(200).json({ message: 'User has been updated successfully.' });
            }
        }

        await prisma.tbl_user.update({ where: { user_id: Number(id) }, data: { ...req.body, password: hashPassword, user_id: Number(req.body.user_id), locked: locked, user_type_id: Number(req.body.user_type_id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'User has been updated successfully.' });
    } catch (error) {
        if (filename) {
            if (fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${req.body.user_code}`, filename))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${req.body.user_code}`, filename), { recursive: true, force: true });
            }
        }

        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error('Id cannot be empty');
        }

        const existingUser = await prisma.tbl_user.findUnique({ where: { user_id: Number(id) } });

        if (existingUser) {
            if (fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `${existingUser.user_image}`))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'users', `user${existingUser.user_code}`), { recursive: true, force: true });
            }
        }

        await prisma.tbl_user.delete({ where: { user_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'User has been deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
