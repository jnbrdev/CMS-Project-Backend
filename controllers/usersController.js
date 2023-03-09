const db = require('../models')

//create main model
const User = db.User
const Unit = db.Unit

//main


//Add Users
const addUser = async (req, res) => {
    let userInfo = {
        email: req.body.email,
        unit_id: req.body.unit_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        contact_no: req.body.contact_no,
        birthdate: req.body.birthdate,
        role: req.body.role,
        status: req.body.status,
    }

    const user = await User.create(userInfo);
    res.status(200).send(user)

}

//Get All Users
const getAllUsers = async (req, res) => {
    let getAllUser = await User.findAll({})
    res.json(getAllUser)
}

//Get One User
const getOneUsers = async (req, res) => {
    let id = req.params.id
    let getOneUser = await User.findOne({where: { id: id } })
    res.json(getOneUser)
}

//Update User
const updateUsers = async (req, res) => {
    let id = req.params.id
    const updateUser = await User.update(req.body, {where: {id: id} })
    res.json(updateUser)
}

//Delete User
const deleteUsers = async (req, res) => {
    let id = req.params.id
    const delUser = await User.destroy({where: {id: id} })
    res.json(delUser)
}


//Get Active User
const getActiveUsers = async (req, res) => {
    let getActiveUser = await User.findAll({where: {status: "Active"}})
    res.json(getActiveUser)
}

module.exports = {
    addUser,
    getAllUsers,
    getOneUsers,
    updateUsers,
    deleteUsers,
    getActiveUsers
}