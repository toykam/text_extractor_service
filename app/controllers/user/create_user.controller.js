module.exports = (db, newUser, result) => {
    db.collection('users').insert(newUser, (error, dbResult) => {
        if (error) {
            // res.send({error: 'An error occurred registering'})
            result(error, null)
        } else {
            // res.send({message: 'Registration successful', data: result.ops[0]})
            result(null, {message: 'Registration Successful', data: dbResult.ops[0]})
        }
    })
}