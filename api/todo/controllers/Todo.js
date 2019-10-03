'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/guides/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const {user} = ctx.state;

    const entities = strapi.query('todo').find({user: user.id});

    return entities;
  },
};
