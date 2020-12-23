var express = require('express');
var router = express.Router();
var pool = require('./database');

function getRelated(id, fResult) {
    // Cor
    var select = 'SELECT '+
    'produtos.id as id, '+
    'produtos.shop9_id as shop9_id, '+
    'produtos.nome as nome, '+
    'imagens.nome as imagem, '+
    'produtos.promocao as promocao FROM produtos '+
    'LEFT JOIN marcas ON produtos.marca_id = marcas.id '+
    'LEFT JOIN subclasses ON produtos.subclasse_id = subclasses.id '+
    'LEFT JOIN classes ON subclasses.classe_id = classes.id '+
    'LEFT JOIN imagens ON imagens.id = (SELECT id FROM imagens i WHERE i.produto_id = produtos.id LIMIT 1) '+
    'LEFT JOIN garantias ON produtos.garantia_id = garantias.id '+
    'WHERE produtos.id != ? AND produtos.id IN (SELECT v1.produto2_id FROM variacoes as v1 WHERE v1.produto_id = (SELECT v2.produto_id FROM variacoes as v2 WHERE v2.produto2_id = ? LIMIT 1)) '+
    'LIMIT 3';
    var arr = [];

    pool.query(select, [id, id], function (error, results, fields) {
        if (error) throw error;
        arr = results;

        // Subclasse
        select = 'SELECT '+
            'produtos.id as id, '+
            'produtos.shop9_id as shop9_id, '+
            'produtos.nome as nome, '+
            'imagens.nome as imagem, '+
            'produtos.promocao as promocao FROM produtos '+
            'LEFT JOIN marcas ON produtos.marca_id = marcas.id '+
            'LEFT JOIN subclasses ON produtos.subclasse_id = subclasses.id '+
            'LEFT JOIN classes ON subclasses.classe_id = classes.id '+
            'LEFT JOIN imagens ON imagens.id = (SELECT id FROM imagens i WHERE i.produto_id = produtos.id LIMIT 1) '+
            'LEFT JOIN garantias ON produtos.garantia_id = garantias.id '+
            'WHERE produtos.id != ? AND produtos.subclasse_id = (SELECT p.subclasse_id FROM produtos AS p WHERE p.id = ? LIMIT 1) ';
        for (var i = 0; i < arr.length; i++) {
            select = select + " AND produtos.id != " + arr[i]["id"];
        }
        select = select + " LIMIT "  + (6 - arr.length);

        pool.query(select, [id, id], function (error, results, fields) {
            if (error) throw error;
            arr = arr.concat(results);

            // Classe
            if (arr.length < 6) {
                select = 'SELECT '+
                'produtos.id as id, '+
                'produtos.shop9_id as shop9_id, '+
                'produtos.nome as nome, '+
                'imagens.nome as imagem, '+
                'produtos.promocao as promocao FROM produtos '+
                'LEFT JOIN marcas ON produtos.marca_id = marcas.id '+
                'LEFT JOIN subclasses ON produtos.subclasse_id = subclasses.id '+
                'LEFT JOIN classes ON subclasses.classe_id = classes.id '+
                'LEFT JOIN imagens ON imagens.id = (SELECT id FROM imagens i WHERE i.produto_id = produtos.id LIMIT 1) '+
                'LEFT JOIN garantias ON produtos.garantia_id = garantias.id '+
                'WHERE produtos.id != ? AND classes.id = (SELECT sb.classe_id FROM subclasses AS sb WHERE sb.id = (SELECT p.subclasse_id FROM produtos as p WHERE p.id = ?))';
                for (var i = 0; i < arr.length; i++) {
                    select = select + " AND produtos.id != " + arr[i]["id"];
                }
                select = select + " LIMIT " + (6 - arr.length);
                pool.query(select, [id, id], function (error, results, fields) {
                    if (error) throw error;
                    arr = arr.concat(results);

                    // Marca
                    if (arr.length < 6) {
                        select = 'SELECT '+
                        'produtos.id as id, '+
                        'produtos.shop9_id as shop9_id, '+
                        'produtos.nome as nome, '+
                        'imagens.nome as imagem, '+
                        'produtos.promocao as promocao FROM produtos '+
                        'LEFT JOIN marcas ON produtos.marca_id = marcas.id '+
                        'LEFT JOIN subclasses ON produtos.subclasse_id = subclasses.id '+
                        'LEFT JOIN classes ON subclasses.classe_id = classes.id '+
                        'LEFT JOIN imagens ON imagens.id = (SELECT id FROM imagens i WHERE i.produto_id = produtos.id LIMIT 1) '+
                        'LEFT JOIN garantias ON produtos.garantia_id = garantias.id '+
                        'WHERE produtos.id != ? AND produtos.classe_id = (SELECT p.classe_id FROM produtos AS p WHERE p.id = ? LIMIT 1)';
                        for (var i = 0; i < arr.length; $i++) {
                            select = select + " AND produtos.id != " + arr[i]["id"];
                        }
                        select = select + " LIMIT " + (6 - arr.length);
                        pool.query(select, [id, id], function (error, results, fields) {
                            arr = arr.concat(results);
                            fResult(arr);
                        });
                    } else {
                        fResult(arr);
                    }
                });
            } else {
                fResult(arr);
            }
        });
    });

}

/* GET home page. */
router.get('/', function(req, res, next) {
    var querySelect = 'SELECT ' +
        'produtos.id as id, ' +
        'produtos.shop9_id as shop9_id, ' +
        'produtos.nome as nome, ' +
        'produtos.descricao as descricao, ' +
        'produtos.detalhes as detalhes, ' +
        'produtos.video as video, ' +
        'produtos.ctrlestoque as ctrlestoque, ' +
        'produtos.promocao as promocao, ' +
        'marcas.nome as marca, ' +
        'classes.nome as classe, ' +
        'subclasses.nome as subclasse, ' +
        'garantias.nome as garantia ' +
        'FROM produtos ' +
        'LEFT JOIN marcas ON produtos.marca_id = marcas.id ' +
        'LEFT JOIN subclasses ON produtos.subclasse_id = subclasses.id ' +
        'LEFT JOIN classes ON subclasses.classe_id = classes.id ' +
        'LEFT JOIN garantias ON produtos.garantia_id = garantias.id ' +
        'WHERE produtos.id = ?';

    var queryImages = 'SELECT nome FROM imagens WHERE produto_id = ?';

    var queryCores = 'SELECT v1.produto2_id as id, cores.nome as nome, cores.css as css FROM variacoes as v1 ' +
        'LEFT JOIN cores ON cores.id = v1.cor_id ' +
        'WHERE v1.produto_id = (SELECT produto_id FROM variacoes as v2 WHERE v2.produto2_id = ? LIMIT 1) ' +
        'ORDER BY cores.id';

    var id = parseInt(req.query.id ? req.query.id : 0);
    if (isNaN(id)) id = 0;

    pool.query(querySelect, id, function (error, results, fields) {
        if (error) throw error;

        var row = results[0];
        pool.query(queryImages, id, function (error, results, fields) {
            if (error) throw error;
            row['imagens'] = [];
            for (let i = 0; i < results.length; i++) {
                row['imagens'].push(results[i].nome);
            }

            pool.query(queryCores, id, function (error, results, fields) {
                if (error) throw error;
                row['cores'] = [];
                for (let i = 0; i < results.length; i++) {
                    row['cores'][i] = results[i];
                }

                var relateds = [];
                getRelated(id, function (arr) {
                    relateds = arr;
                    res.render('detalhe', {
                        name: "detalhe", type: 'DEFAULT', page: 'DETA', row: row, relateds: relateds
                    });
                });
            });
        });
    });
});

module.exports = router;
