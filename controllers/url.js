const { body, validationResult } = require('express-validator');
const base62 = require('../utils/base62');

const URL = require("../models/url");
const Counter = require("../models/counter");
const User = require('../models/user');
const path = require('path');

exports.createShortUrl = [
    body('longUrl', "Please enter a valid URL.").isURL(),
    async function(req, res, next){
        try{
            if(req.sessionUser){
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const error = new Error('Validation Error');
                    error.statusCode = 422;
                    error.data = errors.array();
                    throw error;
                }
                const { longUrl } = req.body;
                const user = await User.findOne({email: req.sessionUser.email});
                if(!user){
                    userDataNotFound();
                }

                const existingUrl = await URL.findOne({longUrl: longUrl, user: user._id});
                if(existingUrl){
                    const error = new Error("Short URL already, exists");
                    error.data = {
                        longUrl: existingUrl.longUrl,
                        shortUrl: existingUrl.shortUrl,
                        name: existingUrl.name,
                        clicks: existingUrl.clicks,
                        createdAt: existingUrl.createdAt,
                        updatedAt: existingUrl.updatedAt
                    };
                    error.statusCode = 409;
                    throw error;
                }
//https://stackoverflow.com/questions/50592957/get-title-of-external-page-using-javascript
                const { count }= await Counter.findOneAndUpdate({name: 'URLCounter'}, { $inc: { count: 1}});
                const shortUrlId = base62.encode(count);
                const url = new URL({
                    longUrl: longUrl,
                    shortUrl: shortUrlId,
                    name: req.body.name,
                    user: user._id
                });

                const savedURL = await url.save();
                user.urlCount = user.urlCount + 1;
                await user.save();
                return res.status(201).send({
                    newURL: {
                        longUrl: savedURL.longUrl,
                        shortUrl: savedURL.shortUrl,
                        name: savedURL.name,
                        clicks: savedURL.clicks,
                        createdAt: savedURL.createdAt,
                        updatedAt: savedURL.updatedAt
                    }
                })
            }else{
                userDataNotFound();
            }
        }catch(error){
            console.log(error)
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        }
    }
]

exports.updateClicks = [
    async function(req, res, next) {
        try{
            if(req.sessionUser){
                const user = await User.findOne({email: req.sessionUser.email});
                if(!user){
                    userDataNotFound();
                }
    
                const { shortUrl } = req.body;
                const url = await URL.findOne({ shortUrl: shortUrl });
                if(!url){
                    const error = new Error("No URL details found");
                    error.statusCode = 404;
                    throw error;
                }
                if( url.user.toString() === user._id.toString()){
                    url.clicks.push({ clickedTime: Date.now()});
                    const updatedUrl = await url.save();
                    user.clicksCount = user.clicksCount + 1;
                    await user.save();
                    return res.status(200).send({
                        clicks: user.clicksCount
                    })
                }else{
                    const error = new Error("Not allowed to perform this action");
                    error.statusCode = 401;
                    throw error;
                }
        
            }else{
                userDataNotFound();
            }
        }catch(error){
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        }
    }
]


exports.getURLs = async function(req, res, next) {
    try{
        if(req.sessionUser){
            const user = await User.findOne({ email: req.sessionUser.email });
            if(!user){
                userDataNotFound();
            }
    
            const userUrls = await URL.find({ user: user._id });
    
            return res.status(200).send({
                userUrls: userUrls.map(userUrl => {
                    return {
                        name: userUrl.name,
                        longUrl: userUrl.longUrl,
                        shortUrl: userUrl.shortUrl,
                        clicks: userUrl.clicks,
                        createdAt: userUrl.createdAt,
                        updatedAt: userUrl.updatedAt
                    }
                })
            })
        }else{
            userDataNotFound();
        }
    }catch(error){
        if(!error.statusCode){
            error = new Error("Internal Server Error.");
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getThisDateURLs = async function(req, res, next) {
    try{
        if(req.sessionUser){
            const user = await User.findOne({ email: req.sessionUser.email });
            if(!user){
                userDataNotFound();
            }
            console.log(req.params.date)
            const startDate = new Date(new Date(req.params.date).setHours(0,0,0,0));
            console.log(startDate)
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
            console.log(endDate)
            const userUrls = await URL.find({ 
                user: user._id, 
                createdAt:{ $gte: startDate, $lt: endDate} 
            });
    
            return res.status(200).send({
                userUrls: userUrls.map(userUrl => {
                    return {
                        name: userUrl.name,
                        longUrl: userUrl.longUrl,
                        shortUrl: userUrl.shortUrl,
                        clicks: userUrl.clicks,
                        createdAt: userUrl.createdAt,
                        updatedAt: userUrl.updatedAt
                    }
                })
            })
        }else{
            userDataNotFound();
        }
    }catch(error){
        console.log(error)
        if(!error.statusCode){
            error = new Error("Internal Server Error.");
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getLastWeekURLs = async function(req, res, next) {
    try{
        if(req.sessionUser){
            const user = await User.findOne({ email: req.sessionUser.email });
            if(!user){
                userDataNotFound();
            }
            const userUrls = await URL.find({ 
                user: user._id, 
                createdAt:{ $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))} 
            });
    
            return res.status(200).send({
                userUrls: userUrls.map(userUrl => {
                    return {
                        name: userUrl.name,
                        longUrl: userUrl.longUrl,
                        shortUrl: userUrl.shortUrl,
                        clicks: userUrl.clicks,
                        createdAt: userUrl.createdAt,
                        updatedAt: userUrl.updatedAt
                    }
                })
            })
        }else{
            userDataNotFound();
        }
    }catch(error){
        if(!error.statusCode){
            error = new Error("Internal Server Error.");
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.getLastMonthURLs = async function(req, res, next) {
    try{
        if(req.sessionUser){
            const user = await User.findOne({ email: req.sessionUser.email });
            if(!user){
                userDataNotFound();
            }
            const today = new Date();
            const startDate = new Date();
            startDate.setDate(today.getDate() - 32);
            const userUrls = await URL.find({ user: user._id, createdAt:{ $gte:startDate} });
    
            return res.status(200).send({
                userUrls: userUrls.map(userUrl => {
                    return {
                        name: userUrl.name,
                        longUrl: userUrl.longUrl,
                        shortUrl: userUrl.shortUrl,
                        clicks: userUrl.clicks,
                        createdAt: userUrl.createdAt,
                        updatedAt: userUrl.updatedAt
                    }
                })
            })
        }else{
            userDataNotFound();
        }
    }catch(error){
        if(!error.statusCode){
            error = new Error("Internal Server Error.");
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getURL = async function(req, res, next) {
   try {
        const shortUrl = req.params.shortUrl;

        const url = await URL.findOne({ shortUrl: shortUrl});
        if(!url){
            res.status(404).sendFile(path.join(__dirname, '../views/404.html'));
            return;
        }
        url.clicks.push({ clickedTime: Date.now()});
        await url.save();
        return res.redirect(url.longUrl);
   } catch (error) {    
        if(!error.statusCode){
            error = new Error("Internal Server Error.");
            error.statusCode = 500;
        }
        next(error);
   }
}

exports.updateName = [
    async function(req, res, next) {
        try{
            if(req.sessionUser){
                const user = await User.findOne({ email: req.sessionUser.email });
                if(!user){
                    userDataNotFound();
                }
    
                const { shortUrl, name } = req.body;
        
                const url = await URL.findOne({ shortUrl: shortUrl});
    
                if(!url){
                    const error = new Error("No URL details found");
                    error.statusCode = 404;
                    throw error;
                }
                
                url.name = name;
                await url.save();
                return res.status(200).send({
                            name: url.name,
                            longUrl: url.longUrl,
                            shortUrl: url.shortUrl,
                            clicks: url.clicks,
                            createdAt: url.createdAt,
                            updatedAt: url.updatedAt
                })
            }else{
                userDataNotFound();
            }
        }catch(error){
            if(!error.statusCode){
                error = new Error("Internal Server Error.");
                error.statusCode = 500;
            }
            next(error);
        }
    }
]



const userDataNotFound = () => {
    const error = new Error("User should be logged in to complete this action.");
    error.statusCode = 403;
    throw error;
}