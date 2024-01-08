const prisma = require('../../../config/database');
const fs = require('fs');
const path = require('path');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, page_size } = req.query;

        if (!page && !page_size) {
            const result = await prisma.tbl_e_vote.findFirst({ where: { current: true } }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });
            return res.status(200).json({ data: result });
        }

        if (page && page_size) {
            const [result, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_e_vote.findMany({
                        skip: Number(page),
                        take: Number(page_size)
                    }),
                    prisma.tbl_e_vote.count()
                ])
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            if (result.length === 0 || totalRecord === 0) {
                throw new Error('E-Vote is not found!');
            }

            res.status(200).json({ data: result, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByHandler = async (req, res) => {
    try {
        const { id, desc } = req.query;

        let result;

        if (id) {
            result = await prisma.tbl_e_vote
                .findUnique({
                    where: {
                        e_vote_id: Number(id)
                    }
                })
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });
        }

        if (desc) {
            result = await prisma.tbl_e_vote
                .findFirst({
                    where: {
                        description: desc
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
    try {
        if (!req.body) {
            new Error("Content can't be empty!");
        }

        await prisma.tbl_e_vote
            .create({
                data: req.body
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        res.status(201).json({ message: 'E-Vote has been created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { force } = req.query;

        if (!id) {
            throw new Error('ID cannot be empty!');
        }

        if (!req.body) {
            throw new Error('Content cannot be empty.');
        }

        const existingCurrentVote = await prisma.tbl_e_vote.findFirst({ where: { current: true } });

        if (req.body.current === true && !Boolean(force)) {
            if (existingCurrentVote) {
                throw new Error(`E-Vote ID ${existingCurrentVote.e_vote_id}  has been currently enabled!`);
            }
        }

        if (Boolean(force)) {
            await prisma.tbl_e_vote.update({ where: { e_vote_id: Number(existingCurrentVote.e_vote_id) }, data: { ...existingCurrentVote, current: false } }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });
        }

        await prisma.tbl_e_vote.update({ where: { e_vote_id: Number(id) }, data: req.body }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(201).json({ message: 'E-Vote has been updated successfully.' });
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

        const attachment = await prisma.tbl_e_vote.findUnique({ where: { e_vote_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        if (attachment) {
            if (fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'evotes', `evote${attachment.e_vote_id}`))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'evotes', `evote${attachment.e_vote_id}`), { recursive: true, force: true });
            }
        }

        await prisma.tbl_e_vote.delete({ where: { e_vote_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'E-Vote has been deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
