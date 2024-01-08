const prisma = require('../../config/database');
const fs = require('fs');
const path = require('path');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, page_size, case_id } = req.query;

        if (!page && !page_size) {
            const result = await prisma.tbl_attachment_of_e_doc.findMany({ where: { case_id: Number(case_id) } }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            return res.status(200).json({ data: result });
        }

        if (page && page_size) {
            const [result, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_attachment_of_e_doc.findMany({
                        where: { case_id: Number(case_id) },
                        skip: Number(page),
                        take: Number(page_size)
                    }),
                    prisma.tbl_attachment_of_e_doc.count({ where: { case_id: Number(case_id) } })
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
        const { case_id } = req.query;

        let result;

        if (case_id) {
            result = await prisma.tbl_attachment_of_e_doc
                .findMany({
                    where: {
                        case_id: Number(case_id)
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
    let caseid;

    try {
        if (!req.files.attachment) {
            throw new Error("File can't be empty!");
        }

        if (!req.body) {
            throw new Error("Content can't be empty!");
        }

        if (!fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'cases'))) {
            fs.mkdirSync(path.join(__dirname, '..', '..', '..', 'public', 'cases'));
        }

        const { case_id, description } = req.body;

        if (case_id) {
            caseid = case_id;
            if (!fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'cases', `case${case_id}`))) {
                fs.mkdirSync(path.join(__dirname, '..', '..', '..', 'public', 'cases', `case${case_id}`));
            }
        }

        const attachment = req.files.attachment;
        filename = attachment.name;

        attachment.mv(path.join(__dirname, '..', '..', '..', 'public', 'cases', `case${case_id}`, filename), async error => {
            if (error) {
                throw new Error('File uploading error!');
            }

            await prisma.tbl_attachment_of_e_doc
                .create({
                    data: {
                        case_id: Number(case_id),
                        description,
                        file_name: `case${case_id}/${filename}`,
                        file_type: attachment.mimetype
                    }
                })
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            return res.status(201).json({ message: 'Attachment has been craeted successfully' });
        });
    } catch (error) {
        if (filename !== undefined) {
            if (fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'cases', `case${caseid}`, filename))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'cases', `case${caseid}`, filename));
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

        const attachment = await prisma.tbl_attachment_of_e_doc.findUnique({ where: { attachment_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        if (attachment) {
            if (fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', attachment.file_name))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', attachment.file_name));
            }
        }

        await prisma.tbl_attachment_of_e_doc.delete({ where: { attachment_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'File has been deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
