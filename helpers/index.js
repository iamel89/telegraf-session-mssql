function selectById(id, opts) {
  const req = new opts.db.Request();
  req.input('id', id);
  return req
    .query(`SELECT * FROM [${opts.table_name}] WHERE [id]=@id`)
    .then((response) => response.recordset)
    .catch((err) => err);
}

function updateById(id, session, opts) {
  const req = new opts.db.Request();
  req.input('id', id);
  req.input('session', session);
  return req
    .query(`UPDATE [${opts.table_name}] SET [SESSION] = @session OUTPUT INSERTED.* WHERE [id] = @id`)
    .then((response) => response.recordset)
    .catch((err) => err);
}

function insert(id, session, opts) {
  const req = new opts.db.Request();
  req.input('id', id);
  req.input('session', session);
  return req
    .query(`INSERT INTO [${opts.table_name}] OUTPUT INSERTED.* VALUES(@id, @session)`)
    .then((response) => response.recordset)
    .catch((err) => err);
}

function defSession(ctx, next, session, opts, key, store) {
  Object.defineProperty(ctx, opts.property, {
    get() { return session; },
  });
  return next(ctx).then(() => {
    updateById(key, JSON.stringify(session), opts)
      .then(() => {
        store.set(key, {
          session,
        });
      });
  });
}

module.exports = {
  insert: insert,
  selectById: selectById,
  defSession: defSession
};
