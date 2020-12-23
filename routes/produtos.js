var express = require('express');
var router = express.Router();
var pool = require('./database');

function getList(texto, tags, min, max, page, limit, fReturn, cReturn) {
    var arr = {};
    arr["assoc"] = {};
    arr["pages"] = 0;

    var temp = texto.replace('_', '\_');
    var tex = temp.replace(/\s+/g, '%') + "%";
    if (tex.substr(0, 1) !== "%") {
        tex = "%" + tex;
    }

    var emptyTex = texto === "";
    var emptyTags = tags === "";
    var offset = page * limit;

    var count = "SELECT count(produtos.id) as num FROM produtos ";

    var select = 'SELECT '+
        'produtos.id as id, '+
        'produtos.shop9_id as shop9_id, '+
        'produtos.nome as nome, '+
        'imagens.nome as imagem, '+
        'produtos.promocao as promocao FROM produtos ';

    var join =
        'LEFT JOIN marcas ON produtos.marca_id = marcas.id '+
        'LEFT JOIN subclasses ON produtos.subclasse_id = subclasses.id '+
        'LEFT JOIN classes ON subclasses.classe_id = classes.id '+
        'LEFT JOIN imagens ON imagens.id = (SELECT id FROM imagens i WHERE i.produto_id = produtos.id LIMIT 1) '+
        'LEFT JOIN garantias ON produtos.garantia_id = garantias.id ' +
        (emptyTex && emptyTags ? "" : "WHERE ") +
        (emptyTex ? '' : '(produtos.nome LIKE ? OR produtos.descricao LIKE ?)') +
        (!emptyTex && !emptyTags ? ' AND ' : '') +
        (emptyTags ? '' : '(INSTR(?, marcas.nome) > 0 OR INSTR(?, classes.nome) > 0 OR INSTR(?, subclasses.nome) > 0)');

    var limitOffset = ' ORDER BY produtos.nome LIMIT ? OFFSET ?';

    var fCount = function () {
        if (!emptyTags) {
            if (!emptyTex) {
                pool.query(count+join, [tex, tex, tags, tags, tags], function (error, results, fields) {
                    cReturn(error, results, fields);
                });
            } else {
                pool.query(count+join, [tags, tags, tags], function (error, results, fields) {
                    cReturn(error, results, fields);
                });
            }
        } else if (!emptyTex) {
            pool.query(count+join, [tex, tex], function (error, results, fields) {
                cReturn(error, results, fields);
            });
        } else {
            pool.query(count+join, function (error, results, fields) {
                cReturn(error, results, fields);
            });
        }
    };

    if (!emptyTex) {
        if (!emptyTags) {
            pool.query(select+join+limitOffset, [tex, tex, tags, tags, tags, limit, offset], function (error, results, fields) {
                fReturn(error, results, fields);
                fCount();
            });
        } else {
            pool.query(select+join+limitOffset, [tex, tex, limit, offset], function (error, results, fields) {
                fReturn(error, results, fields);
                fCount();
            });
        }
    } else {
        if (!emptyTags) {
            pool.query(select+join+limitOffset, [tags, tags, tags, limit, offset], function (error, results, fields) {
                fReturn(error, results, fields);
                fCount();
            });
        } else {
            pool.query(select+join+limitOffset, [limit, offset], function (error, results, fields) {
                fReturn(error, results, fields);
                fCount();
            });
        }
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    const queryMarcas = 'SELECT nome FROM marcas';
    const queryClasses =
        'SELECT classes.nome as classe, subclasses.nome as subclasse ' +
        'FROM classes ' +
        'CROSS JOIN subclasses ON subclasses.classe_id = classes.id';

    pool.query(queryMarcas, function (error, results, fields) {
        if (error) throw error;

        let tags = {};
        tags['marcas'] = {};
        for (let i = 0; i < results.length; i++) {
            tags['marcas'][i] = results[i].nome;
        }


        pool.query(queryClasses, function (error, results, fields) {
            if (error) throw error;

            tags['classes'] = {};
            for (let i = 0; i < results.length; i++) {
                if (!(results[i]['classe'] in tags['classes'])) {
                    tags['classes'][results[i]['classe']] = [];
                }
                tags['classes'][results[i]['classe']].push(results[i]['subclasse']);
            }

            let assoc = [];
            let page = req.query.page? req.query.page : 0;
            page = parseInt(page);
            if (isNaN(page)) page = 0;

            let texto = req.query.texto? req.query.texto : "";
            let ntags = req.query.tags? req.query.tags : "";
            let min = parseInt(req.query.min? req.query.min : "0");
            if (isNaN(min) || min < 0) min = 0;
            let max = parseInt(req.query.max? req.query.max : "99999");
            if (isNaN(max) || max < 0) max = 99999;
            if (max < min) min = max;

            getList(texto, ntags, min, max, page, 20, function (error, results, fields) {
                console.log("here");

                for (let i = 0; i < results.length; i++) {
                    assoc[i] = {};
                    assoc[i]['nome'] = results[i].nome.substr(0, 1) + results[i].nome.substr(1).toLowerCase();
                    assoc[i]['id'] = results[i].id;
                    assoc[i]['shop9_id'] = results[i].shop9_id;
                    assoc[i]['imagem'] = results[i].imagem;
                    assoc[i]['promocao'] = results[i].promocao;
                }
            }, function (error, results, fields) {
                if (error) throw error;
                res.render('produtos', {
                    tags : tags,
                    assoc : assoc,
                    pages : results[0].num / 20,
                    prods : results[0].num,
                    pg : page,
                    name : "produtos",
                    type: 'SEARCH',
                    page : 'PROD',
                    search : {
                        tags : ntags === ""? [] : ntags.split(','),
                        texto : texto,
                        min : min,
                        max : max,
                        page : page
                    }
                });
            });

        });
    });
});

module.exports = router;
