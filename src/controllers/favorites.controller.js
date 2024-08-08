const { prisma } = require("../utils/connection");

const showFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const favorites = await prisma.favorites.findMany({
            where: { userId },
            include: {
                event: true
            }
        })
        res.json({ data: favorites })
    } catch (error) {
        next(error)
    }
}

const removeFavorite = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const findFavorite = await prisma.favorites.findFirst({ where: { id, userId } })
        if (!findFavorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        await prisma.favorites.delete({ where: { id } })
        res.json({ message: "Favorite deleted" })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    showFavorites,
    removeFavorite
}