const prisma = require('../../config/database');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, page_size } = req.query;
        const skip = Number(page) * Number(page_size);

        if (page && page_size) {
            const [result, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_e_doc.findMany({
                        skip,
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
        const { case_id } = req.query;

        const result = await prisma.tbl_e_doc
            .findUnique({
                where: {
                    case_id: Number(case_id)
                }
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

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

        const { case_no, date_of_submittion, description_of_submittion, submitting_person, interpretation_of_tribunal, date_of_submission, date_of_decision, decided } = req.body;

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
            decided: decided.length > 0 ? decided : null
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

exports.deleteHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error('ID cannot be empty!');
        }

        await prisma.tbl_e_doc.delete({ where: { case_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'E-Document has been deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
