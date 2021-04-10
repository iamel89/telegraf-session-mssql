const { selectById, insert, defSession } = require('./helpers');

module.exports = function (options) {
  const opts = {
    property: 'session',
    table_name: 'telegraf_session',
    getSessionKey: (ctx) => ctx.from && ctx.chat && `${ctx.from.id}:${ctx.chat.id}`,
    ...options,
  };

  const store = new Map();

  return (ctx, next) => {
    const key = opts.getSessionKey(ctx);
    if (!key) return next(ctx);

    let { session } = store.get(key) || {};
    if (!session) {
      return selectById(key, opts)
        .then((rows) => {
          if (rows.length) {
            session = JSON.parse(rows[0].session);
            return defSession(ctx, next, session, opts, key, store);
          }
          session = {};
          return insert(key, JSON.stringify(session), opts)
            .then(() => defSession(ctx, next, session, opts, key, store));
        });
    }
    return defSession(ctx, next, session, opts, key, store);
  };
}
