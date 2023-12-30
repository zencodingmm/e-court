const prisma = require('../../../config/database');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, page_size } = req.query;
        const skip = Number(page) * Number(page_size);

        if (!page && !page_size) {
            const result = await prisma.tbl_user_type.findMany();

            return res.status(200).json({ data: result });
        }

        if (page && page_size) {
            const [result, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_user_type.findMany({
                        skip,
                        take: Number(page_size)
                    }),
                    prisma.tbl_user_type.count()
                ])
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            if (totalRecord === 0) {
                throw new Error('User Type is not found!');
            }

            return res.status(200).json({ data: result, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByHandler = async (req, res) => {
    try {
        const { user_type_id } = req.query;

        const result = await prisma.tbl_user_type
            .findUnique({
                where: {
                    user_type_id: Number(user_type_id)
                }
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        if (!result) {
            throw new Error('User Type is not found!');
        }

        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createHandler = async (req, res) => {
    try {
        if (!req.body) {
            throw new Error("Content can't be empty!");
        }

        await prisma.tbl_user_type
            .create({
                data: req.body
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        res.status(201).json({ message: 'User Type has been created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error('ID cannot be empty!');
        }

        if (!req.body) {
            throw new Error('Content cannot be empty.');
        }

        await prisma.tbl_user_type.update({ where: { user_type_id: Number(id) }, data: req.body }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'User Type has been updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error('ID cannot be empty!');
        }

        await prisma.tbl_user_type.delete({ where: { user_type_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'User Type has been deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
