const prisma = require('../../../config/database');

exports.getAllHandler = async (req, res) => {
    try {
        const { id, page, page_size } = req.query;

        if (!page && !page_size && id) {
            const result = await prisma.tbl_e_voting_result.findMany({ where: { e_vote_id: Number(id) } });

            if (!result) {
                throw new Error('E-Vote result not found!');
            }

            return res.status(200).json({ data: result });
        }

        if (page && page_size && id) {
            const [result, totalRecord] = await prisma.$transaction([
                prisma.tbl_e_voting_result.findMany({ where: { e_vote_id: Number(id) }, skip: Number(page), take: Number(page_size) }),
                prisma.tbl_e_voting_result.count({ where: { e_vote_id: Number(id) } })
            ]);

            if (!totalRecord || result.length === 0) {
                throw new Error('E-Vote result not found!');
            }

            return res.status(200).json({ data: result, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByHandler = async (req, res) => {
    try {
        const { e_vote_id, user_code } = req.query;

        if (e_vote_id && user_code) {
            const result = await prisma.tbl_e_voting_result.findFirst({ where: { e_vote_id: Number(e_vote_id), user_code: user_code } }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            if (!result) {
                throw new Error('E-Vote result not found!');
            }

            res.status(200).json({ data: result });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createHandler = async (req, res) => {
    try {
        if (!req.body) {
            throw new Error("Content can't be empty");
        }

        const { e_vote_id, user_id, user_code, username, user_rank, result, comment } = req.body;

        const existingVote = await prisma.tbl_e_voting_result.findFirst({
            where: {
                e_vote_id: e_vote_id,
                user_id: user_id
            }
        });

        if (existingVote) {
            throw new Error('Your has been voted');
        }

        await prisma.tbl_e_voting_result.create({ data: { e_vote: { connect: { e_vote_id } }, user: { connect: { user_id: Number(user_id), user_code, username, user_rank } }, result, comment } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(201).json({ message: 'Your has been voted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body) {
            throw new Error("ID can't be empty");
        }

        if (!req.body) {
            throw new Error("Content can't be empty");
        }

        const existingVote = await prisma.tbl_e_voting_result.findFirst({
            where: {
                e_vote_id: Number(id),
                user_id: req.body.user_id
            }
        });

        if (!existingVote) {
            throw new Error('Your has not been voted');
        }

        await prisma.tbl_e_voting_result.update({ where: { voting_result_id: existingVote.voting_result_id }, data: req.body }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(201).json({ message: 'Your has been comment successfully.' });
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

        await prisma.tbl_e_voting_result.delete({ where: { voting_result_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'Voting result has been deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
