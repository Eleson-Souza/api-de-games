
const Game = require('../models/Games');

/**
 * index: lista todos os games do banco
 * find: exibe game com id especifico
 * create: cria um novo game a partir do bosy da requisição
 * destroy: remove um game do banco a partir de seu id
 * update: edita um game a partir do body da requisicao e do id
 */
class GameController {
    async index(req, res) {
        const games = await Game.findAll();

        if (!games) {
            return res.status(400).json({ err: 'Falha ao buscar games' });
        }

        return res.json({ user: req.loggedUser, games: games });
    }

    async find(req, res) {

        const { id } = req.params.id;

        if (!id || isNaN(id)) {
            return res.status(400).json({ err: 'Id inválido' });
        }

        const base_address = 'http://localhost:45679';

        // lista de links do HATEOAS
        const HATEOAS = [
            {
                href: `${base_address}/game/${id}`,
                method: "DELETE",
                rel: "delete_game"
            },
            {
                href: `${base_address}/game/${id}`,
                method: "PUT",
                rel: "edit_game"
            },
            {
                href: `${base_address}/game/${id}`,
                method: "GET",
                rel: "get_game"
            },
            {
                href: `${base_address}/games`,
                method: "GET",
                rel: "get_all_games"
            },
        ];

        const game = await Games.findByPk(id);

        if (!game) {
            return res.status(404).json({ err: 'Game não encontrado' });
        }

        return res.json({ game, _links: HATEOAS });
    }

    async create(req, res) {
        const { title, year, price } = req.body;

        const isValid = !(
            isNaN(year) ||
            isNaN(price) ||
            year === '' ||
            price === '' ||
            title === ''
        );

        if (!isValid) {
            return res.status(400).json({ err: 'Objeto inválido' });
        }

        const game = await Game.create({
            title,
            year,
            price
        });

        return res.json(game);
    }

    async destroy(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ err: 'Id inválido' });
        }

        const game = await Game.findByPk(id);

        if (!game) {
            return res.status(400).json({ err: 'Game não encontrado' });
        }

        await game.destroy();

        /**
         * Status Code 204: Indica que tudo foi feito com sucesso, porem,
         *                  a rota nao possui conteudo de retorno;
         */
        return res.status(204).send();
    }

    async update(req, res) {
        const { id } = req.params;
        const { title, year, price } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ err: 'Id inválido' });
        }

        const game = await Game.findByPk(id);

        if (!game) {
            return res.status(400).json({ err: 'Game não encontrado' });
        }

        // Se o valor for definido, irá ser realizado o update.
        if (title) {
            await Game.update({ title }, { where: { id } });
            game.title = title;
        }

        if (year) {
            await Game.update({ year }, { where: { id } });
            game.year = year;
        }

        if (price) {
            await Game.update({ price }, { where: { id } });
            game.price = price;
        }

        await game.reload();

        return res.json(game);
    }
}

module.exports = new GameController();
