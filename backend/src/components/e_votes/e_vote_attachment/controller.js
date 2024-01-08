const prisma = require('../../../config/database');
const fs = require('fs');
const path = require('path');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, page_size, id } = req.query;

        if (!page && !page_size) {
            const result = await prisma.tbl_e_vote_attachment.findMany({ where: { e_vote_id: Number(id) } }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            return res.status(200).json({ data: result });
        }

        if (page && page_size) {
            const [result, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_e_vote_attachment.findMany({
                        where: { e_vote_id: Number(id) },
                        skip: Number(page),
                        take: Number(page_size)
                    }),
                    prisma.tbl_e_vote_attachment.count({ where: { e_vote_id: Number(id) } })
                ])
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            if (result.length === 0) {
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
        const { e_vote_id } = req.query;

        let result;

        if (e_vote_id) {
            result = await prisma.tbl_e_vote_attachment
                .findMany({
                    where: {
                        e_vote_id: Number(e_vote_id)
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
    let evoteid;

    try {
        if (!req.body) {
            throw new Error("Content can't be empty!");
        }

        if (!req.files.file) {
            throw new Error('File cannot be empty!');
        }

        const { e_vote_id } = req.body;

        if (!fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'evotes'))) {
            fs.mkdirSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'evotes'));
        }

        if (e_vote_id) {
            evoteid = e_vote_id;
            if (!fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'evotes', `evote${e_vote_id}`))) {
                fs.mkdirSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'evotes', `evote${e_vote_id}`));
            }
        }

        const attachment = req.files.file;
        filename = attachment.name;

        attachment.mv(path.join(__dirname, '..', '..', '..', '..', 'public', 'evotes', `evote${e_vote_id}`, filename), async error => {
            if (error) {
                throw new Error('File uploading error!');
            }

            await prisma.tbl_e_vote_attachment
                .create({
                    data: {
                        file_name: `evote${evoteid}/${filename}`,
                        e_vote_id: Number(e_vote_id),
                        file_type: attachment.mimetype
                    }
                })
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            return res.status(201).json({ message: 'File has been uploaded successfully.' });
        });
    } catch (error) {
        if (filename !== undefined) {
            if (fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'evotes', `evote${evoteid}`, filename))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'evotes', `evote${evoteid}`, filename));
            }
        }

        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error('ID cannot be empty!');
        }

        const attachment = await prisma.tbl_e_vote_attachment.findUnique({ where: { attachment_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        if (attachment) {
            if (fs.existsSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'evotes', attachment.file_name))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'evotes', attachment.file_name));
            }
        }

        await prisma.tbl_e_vote_attachment.delete({ where: { attachment_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'File has been deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
