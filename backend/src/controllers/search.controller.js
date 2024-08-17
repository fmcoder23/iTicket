const { prisma } = require("../utils/connection");

const searchEvents = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        const events = await prisma.events.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    {
                        place: {
                            name: {
                                contains: query,
                                mode: 'insensitive',
                            }
                        }
                    },
                    {
                        category: {
                            name: {
                                contains: query,
                                mode: 'insensitive',
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                description: true,
                datetime: true,
                phone1: true,
                phone2: true,
                createdAt: true,
                updatedAt: true,
                place: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        res.json({ data: events });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchEvents
};
