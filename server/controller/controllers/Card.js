const response = require("../../response");
const User = require("../../user");
const validator = require("../../validator");
const uuidv4 = require("uuid/v4");

module.exports = {
  createCard: (req, res) => {
    User(req, (user, err) => {
      if (err) {
        response(
          res,
          req.body,
          {},
          500,
          "Error while checking if user is authenticated",
          [errors.New("", errors.code.DatabaseError, err)]
        );
        return;
      }
      if (user) {
        let [success, err] = validator(req.body, {
          text: "string",
          cardpacks: "arrayMax:3 arrayMin:1"
        });

        if (success) {
          req.db.sync(function(err) {
            if (err) {
              response(
                res,
                req.body,
                {},
                500,
                "Unexpected error while synchronizing database.",
                [err]
              );
              return;
            }

            req.body.cardpacks.forEach(cardpack => {
              req.models.cardpack.find({ id: cardpack }, (err, results) => {
                let result = results[0];
                result.cardAmount += 1;
                result.save();
              });
            });

            req.models.card.create(
              {
                uuid: uuidv4(),
                text: req.body.text,
                white: req.body.isWhite,
                cardpack_id: JSON.stringify(req.body.cardpacks)
              },
              (err, result) => {
                if (err) {
                  response(
                    res,
                    req.body,
                    {},
                    500,
                    "Unexpected error while requesting users from database.",
                    [err]
                  );
                  return;
                }

                response(res, req.body, result, 200, "Card created", [err]);
                return;
              }
            );
          });
        } else {
          response(
            res,
            req.body,
            {},
            400,
            "Request did not validate to required parameters and its rules",
            err
          );
        }
      }
    });
  }
};
