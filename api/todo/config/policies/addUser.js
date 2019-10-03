module.exports = async (ctx, next) => {
  ctx.request.body.user = ctx.state.user.id;

  return await next();
};
