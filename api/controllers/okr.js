var mongoose = require('mongoose');
var User = mongoose.model('User');
var Okr = mongoose.model('Okr');
var KeyResult = mongoose.model('KeyResult');

module.exports.create = (req, res) => {
    //If no user ID exists in the JWT, return a 401
    if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' });
    } else {
        //Otherwise continue
        User.findById(req.payload._id)
            .exec((err, user) => {
                if (err) {
                    res.status(401).json('User not found');
                } else {
                    var okr = new Okr();
                    if (req.body.okr.objective) {
                        okr.objective = req.body.okr.objective;
                    } else {
                        okr.objective = '';
                    }
                    okr.keyResults = [];
                    for (i = 0; i < req.body.keyResults.length; i++) {
                        if (!req.body.keyResults[i] || !req.body.keyResults[i].keyResult) {

                        } else {
                            var KR = new KeyResult({ okrId: okr._id, keyResult: req.body.keyResults[i].keyResult });
                            if (req.body.keyResults[i].progress) KR.progress = req.body.keyResults[i].progress;
                            KR.save((err) => { });
                            okr.keyResults.push(KR);
                        }
                    }
                    if (req.body.okr.parent) {
                        okr.parent = req.body.okr.parent;
                    }
                    if (req.body.okr.children) okr.children = req.body.okr.children;
                    if (req.body.okr.userId) {
                        okr.userId = mongoose.Types.ObjectId(req.body.okr.userId);
                    }
                    okr.company = user.company;
                    okr.save((err) => {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.status(200).json(okr);
                        }
                    });
                }
            });
    }
}

module.exports.updateOkr = (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' });
    } else {
        User.findById(req.payload._id)
            .exec((err, user) => {
                if (err) {
                    res.status(401).json('User not found');
                } else {
                    Okr.findById(req.body.okr._id, (err, okr) => {
                        if (err) {
                            res.status(400).json('Could not find OKR');
                        } else {
                            if (req.body.okr.objective) {
                                okr.objective = req.body.okr.objective;
                            } else {
                                return res.status(400).json('OKR did not have an objective and could not be saved');
                            }
                            okr.keyResults = [];
                            KeyResult.deleteMany({ okrId: okr._id }, (err, result) => {
                                for (i = 0; i < req.body.keyResults.length; i++) {
                                    if (!req.body.keyResults[i]) {
                                    } else {
                                        var KR = new KeyResult({
                                            okrId: okr._id,
                                            keyResult: req.body.keyResults[i].keyResult,
                                            progress: req.body.keyResults[i].progress
                                        });
                                        KR.save((err) => {
                                        });
                                        okr.keyResults.push(KR._id);
                                    }
                                }
                                if (req.body.okr.parent) {
                                    okr.parent = req.body.okr.parent;
                                }
                                if (req.body.okr.children) okr.children = req.body.okr.children;
                                if (req.body.okr.evaluation) okr.evaluation = req.body.okr.evaluation;
                                if (req.body.okr.userId) {
                                    okr.userId = mongoose.Types.ObjectId(req.body.okr.userId);
                                }
                                okr.company = user.company;

                                okr.save((err) => {
                                    if (err) {
                                        res.status(400).json(err);
                                    } else {
                                        res.status(200).json(okr);
                                    }
                                });
                            });
                        }
                    });
                }
            });
    }
}

module.exports.addChild = (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' });
    } else {
        User.findById(req.payload._id)
            .exec((err, user) => {
                if (err) {
                    res.status(401).json('User not found');
                } else {
                    Okr.findByIdAndUpdate(
                        mongoose.Types.ObjectId(req.body.parentId),
                        { $addToSet: { children: mongoose.Types.ObjectId(req.body.childId) } },
                        { new: true },
                        (err, okr) => {
                            if (err) {
                                res.status(400).json(err);
                            } else {
                                res.status(200).json('Added child to parent');
                            }
                        });
                }
            });
    }
}

module.exports.getById = (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' })
    } else {
        User.findById(req.payload._id)
            .exec((err, user) => {
                if (err) {
                    res.status(401).json('User not found');
                } else {
                    Okr.findOne({ _id: req.params.id }, (err, okrs) => {
                        if (err) {
                            res.status(400).json('Could not get okrs');
                        } else {
                            res.status(200).json(okrs);
                        }
                    });
                }
            });
    }
}

module.exports.getOkrs = (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' });
    } else {
        User.findById(req.payload._id)
            .exec((err, user) => {
                if (err) {
                    res.status(401).json('User not found');
                } else {
                    Okr.find({
                        company: user.company
                    }, (err, okrs) => {
                        if (err) {
                            res.status(400).json({ 'Could not get okrs': err });
                        } else {
                            res.status(200).json(okrs);
                        }
                    });
                }
            });
    }
}

module.exports.getCompanyOkrs = (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' })
    } else {
        User.findById(req.payload._id)
            .exec((err, user) => {
                if (err) {
                    res.status(401).json('User not found');
                } else {
                    Okr.find({
                        company: user.company,
                        parent: null
                    }, (err, okrs) => {
                        if (err) {
                            res.status(400).json({ 'Could not get okrs': err });
                        } else {
                            res.status(200).json(okrs);
                        }
                    });
                }
            });
    }
}

module.exports.getOkrsByObjective = (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' })
    } else {
        User.findById(req.payload._id)
            .exec((err, user) => {
                if (err) {
                    res.status(401).json('User not found');
                } else {
                    Okr.find({
                        objective: { "$regex": req.params.term, "$options": "i" },
                        company: decodeURIComponent(req.payload.company)
                    }, (err, okrs) => {
                        if (err) {
                            res.status(400).json('Could not get okrs');
                        } else {
                            res.status(200).json(okrs);
                        }
                    });
                }
            });
    }
}

module.exports.getKeyResults = (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' })
    } else {
        User.findById(req.payload._id)
            .exec((err, user) => {
                if (err) {
                    res.status(401).json('User not found');
                } else {
                    KeyResult.find({ okrId: req.params.okrid }, (err, krs) => {
                        if (err) {
                            res.status(400).json('Could not get key results');
                        } else {
                            res.status(200).json(krs);
                        }
                    });
                }
            });
    }
}

module.exports.getChildren = (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ 'message': 'InputError: No OKR id received by the api.' })
    } else if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' })
    } else {
        User.findById(req.payload._id)
            .exec((err, user) => {
                if (err) {
                    res.status(401).json('User not found');
                } else {
                    Okr.find({
                        company: user.company,
                        parent: req.params.id
                    }, (err, okrs) => {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.status(200).json(okrs);
                        }
                    });
                }
            });
    }
}

module.exports.deleteOkr = (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ 'message': 'No OKR id received by api' });
    } else if (!req.payload._id) {
        res.status(401).json({ 'message': 'UnauthorizedError: User does not seem to be logged in.' })
    } else {
        Okr.findByIdAndRemove(req.params.id, (err, doc) => {
            if (err) {
                res.status(400).json('Could not delete OKR w id', req.params.id);
            } else {
                KeyResult.deleteMany({ okrId: req.params.id }, (err, doc2) => {
                    if (err) {
                        res.status(400).json({ 'message': 'Could not delete key results' });
                    } else {
                        Okr.updateMany(
                            { parent: req.params.id },
                            { $set: { 'parent': undefined } }, (err, doc3) => {
                                if (err) {
                                    res.status(400).json({ 'message': 'Could not delete children references' })
                                } else {
                                    Okr.updateOne(
                                        { children: req.params.id },
                                        { $pull: { children: req.params.id } }, (err, doc4) => {
                                            if (err) {
                                                res.status.json('Could not delete the reference of parent');
                                            } else {
                                                res.status(200).json(doc4);
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                })
            }
        })
    }
}