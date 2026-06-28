/*==>  
    desc: Fetch all tours from DB
    route: [GET]:   /tours 
    access: public 
 <== */
const getAlltours = (req, res, next) => {
    res.json({
        status: "success",
        message: "All tours fetched successfully"
    })
};


module.exports = { getAlltours }