const prisma = require('../../config/database');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, page_size } = req.query;

        if (!page && !page_size) {
            const result = await prisma.tbl_setting
                .findFirst({
                    where: {
                        current: true
                    },
                    select: {
                        live_streaming_link: true,
                        e_lib_link: true,
                        case_flow_link: true,
                        other_1: true,
                        other_2: true
                    }
                })
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            return res.status(200).json({ data: result });
        }

        if (page && page_size) {
            const [result, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_setting.findMany({
                        skip: Number(page),
                        take: Number(page_size)
                    }),
                    prisma.tbl_setting.count()
                ])
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            if (result.length === 0 || totalRecord === 0) {
                throw new Error('Link is not found!');
            }

            res.status(200).json({ data: result, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByHandler = async (req, res) => {
    try {
        const { setting_id } = req.query;

        const result = await prisma.tbl_setting
            .findUnique({
                where: {
                    setting_id: Number(setting_id)
                }
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        if (!result) {
            throw new Error('Link are not found!');
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

        const { live_streaming_link, e_lib_link, case_flow_link, other_1, other_2 } = req.body;

        const newData = {
            live_streaming_link: live_streaming_link.length > 0 ? live_streaming_link : null,
            e_lib_link: e_lib_link.length > 0 ? e_lib_link : null,
            case_flow_link: case_flow_link.length > 0 ? case_flow_link : null,
            other_1: other_1.length > 0 ? other_1 : null,
            other_2: other_2.length > 0 ? other_2 : null
        };

        await prisma.tbl_setting.create({ data: newData }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(201).json({ message: 'Link has been created successfully' });
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

        await prisma.tbl_setting.update({ where: { setting_id: Number(id) }, data: req.body }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(201).json({ message: 'Link have been updated successfully.' });
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

        await prisma.tbl_setting.delete({ where: { setting_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'Link has been deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
