require('dotenv').config();

const { URL } = require('url');

// *** Pagination functions  

module.exports.p = (req) => {
  const page = req.query.page != null ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page != null ? parseInt(req.query.per_page) : 20;
  return {
    page: page,
    per_page: per_page,
    offset: (page - 1) * per_page
  };
};
module.exports.paginate = (obj, p, req) => {

  const host = process.env.APP_HOST ? process.env.APP_HOST : req.get('host');
  
  const total = obj.rows.length, 
    next_page_url = new URL(req.originalUrl, 
      { toString: () => req.protocol + "://" + host}),
    prev_page_url = new URL(req.originalUrl, 
      { toString: () => req.protocol + "://" + host});

  next_page_url.searchParams.set("page", p.page + 1);
  prev_page_url.searchParams.set("page", p.page - 1);
  
  const last_page = Math.ceil(total / p.per_page),
    next_page = (total > (p.page * p.per_page) + p.per_page) ? next_page_url.href : null,
    prev_page = p.page > 1 ? prev_page_url.href : null;

  return {
    total: total,
    per_page: p.per_page,
    page: p.page,
    last_page: last_page,
    next_page_url: next_page,
    prev_page_url: prev_page,
    from: p.offset + 1,
    data: obj.rows
  };
};