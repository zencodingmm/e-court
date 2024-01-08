const prisma = require('../../config/database');
const fs = require('fs');
const path = require('path');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, page_size } = req.query;

        if (!page && !page_size) {
            const result = await prisma.tbl_e_doc.findMany({ where: { current: true } }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            return res.status(200).json({ data: result });
        }

        if (page && page_size) {
            const [result, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_e_doc.findMany({
                        skip: Number(page),
                        take: Number(page_size)
                    }),
                    prisma.tbl_e_doc.count()
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
        const { case_id, case_no } = req.query;
        let result;

        if (case_id) {
            result = await prisma.tbl_e_doc
                .findUnique({
                    where: {
                        case_id: Number(case_id)
                    }
                })
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });
        }

        if (case_no) {
            result = await prisma.tbl_e_doc
                .findUnique({
                    where: {
                        case_no: case_no
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

        const { case_no, date_of_submittion, description_of_submittion, submitting_person, interpretation_of_tribunal, date_of_submission, date_of_decision, decided, current } = req.body;

        const submittion_date = new Date(date_of_submittion);
        const submittionFormattedDate = `${submittion_date.getFullYear()}-${submittion_date.getMonth() + 1}-${submittion_date.getDate().toString().padStart(2, '0')}`;

        const submission_date = new Date(date_of_submission);
        const submissioinFormattedDate = `${submission_date.getFullYear()}-${submission_date.getMonth() + 1}-${submission_date.getDate().toString().padStart(2, '0')}`;

        const decision_date = new Date(date_of_decision);
        const decisionFormattedDate = `${decision_date.getFullYear()}-${decision_date.getMonth() + 1}-${decision_date.getDate().toString().padStart(2, '0')}`;

        const newEDoc = {
            case_no: case_no,
            date_of_submittion: new Date(submittionFormattedDate),
            description_of_submittion: description_of_submittion,
            submitting_person: submitting_person.length > 0 ? submitting_person : null,
            interpretation_of_tribunal: interpretation_of_tribunal.length > 0 ? interpretation_of_tribunal : null,
            date_of_submission: date_of_submission ? new Date(submissioinFormattedDate) : null,
            date_of_decision: date_of_decision ? new Date(decisionFormattedDate) : null,
            decided: decided.length > 0 ? decided : null,
            current: current
        };

        await prisma.tbl_e_doc
            .create({
                data: newEDoc
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        res.status(201).json({ message: 'E-Document has been created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error("ID can't be empty!");
        }

        if (!req.body) {
            throw new Error("Content can't be empty!");
        }

        const { case_no, date_of_submittion, description_of_submittion, submitting_person, interpretation_of_tribunal, date_of_submission, date_of_decision, decided, current } = req.body;

        const submittion_date = new Date(date_of_submittion);
        const submittionFormattedDate = `${submittion_date.getFullYear()}-${submittion_date.getMonth() + 1}-${submittion_date.getDate().toString().padStart(2, '0')}`;

        const submission_date = new Date(date_of_submission);
        const submissioinFormattedDate = `${submission_date.getFullYear()}-${submission_date.getMonth() + 1}-${submission_date.getDate().toString().padStart(2, '0')}`;

        const decision_date = new Date(date_of_decision);
        const decisionFormattedDate = `${decision_date.getFullYear()}-${decision_date.getMonth() + 1}-${decision_date.getDate().toString().padStart(2, '0')}`;

        const newEDoc = {
            case_no: case_no,
            date_of_submittion: new Date(submittionFormattedDate),
            description_of_submittion: description_of_submittion,
            submitting_person: submitting_person?.length > 0 ? submitting_person : null,
            interpretation_of_tribunal: interpretation_of_tribunal?.length > 0 ? interpretation_of_tribunal : null,
            date_of_submission: date_of_submission ? new Date(submissioinFormattedDate) : null,
            date_of_decision: date_of_decision ? new Date(decisionFormattedDate) : null,
            decided: decided?.length > 0 ? decided : null,
            current: current
        };

        await prisma.tbl_e_doc
            .update({
                where: { case_id: Number(id) },
                data: newEDoc
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        res.status(201).json({ message: 'E-Document has been updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error('ID cannot be empty!');
        }

        const eDoc = await prisma.tbl_e_doc.findUnique({ where: { case_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        if (eDoc) {
            if (fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', `case${eDoc.case_id}`))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', `case${eDoc.case_id}`), {
                    recursive: true,
                    force: true
                });
            }
        }

        await prisma.tbl_e_doc.delete({ where: { case_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'E-Document has been deleted successfully.' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};
