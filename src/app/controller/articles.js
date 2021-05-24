'use strict'
const models = require('../models')

const createArticle = async (req, res) => {
  const { userUuid, judul, tanggal, ringkasan, isi } = req.body
  const foto = req.file.path
  const short = foto.replace('public/','')
  
  try {
    const x = await models.users.findOne({ where: { uuid: userUuid } })
    const article = await models.articles.create({
      user_id: x.id,
      judul,
      tanggal,
      ringkasan,
      isi,
      foto: short
    });
    return res.status(201).json({
      article
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const updateArticle = async (req, res) => {
  const id = req.params.id
  const { userUuid, judul, tanggal, ringkasan, isi } = req.body
  const foto = req.file.path
  const short = foto.replace('public/','')
  
  try {
    const x = await models.users.findOne({ where: { uuid: userUuid } })
    const article = await models.articles.update({
      user_id: x.id,
      judul,
      tanggal,
      ringkasan,
      isi,
      foto: short
    }, {where: {id: id}});

    return res.status(201).json({
      article
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const showArticle = async (req, res) => {
  const id = req.params.id

  try {
    const article = await models.articles.findOne({ where: { id: id } })
    return res.status(201).json({
      article
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const indexArticle = async (req, res) => {

  try {
    const articles = await models.articles.findAll()
    return res.status(201).json({
      articles
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const deleteArticle = async (req, res) => {
  const id = req.params.id
  console.log(id)

  try {
    const article = await models.articles.findOne({ where: { id: id } })
    const dty = await article.destroy();
    if(dty){
      return res.status(201).json({
        message: 'terhapus'
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createArticle,
  indexArticle,
  deleteArticle,
  updateArticle,
  showArticle
}