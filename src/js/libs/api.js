import URI from 'urijs/src/URI';

const CONFIG = {
  apiPath: `${process.env.apiPath}`,
};

const createUri = (url, params) => {
  const info = {
    url: '',
    meta: {},
  };
  const data = {
    method: params.method || 'get',
    mode: 'cors',
  };

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // path
  const path = (url.match(/^\//)) ? url.replace(/^\//, '') : url;
  let createdUrl = `${CONFIG.apiPath}${path}`;

  // queryがある場合
  if (params.query) {
    createdUrl = new URI(createdUrl).query(params.query);
  }
  // bodyがある場合
  if (params.body) {
    data.body = JSON.stringify(params.body);
  }
  info.url = createdUrl;
  info.meta = data;
  info.meta.headers = new Headers(headers);
  return info;
};

//
// APIリクエスト
//
export const request = (url, params = {}) => new Promise((resolve, reject) => {
  const uri = createUri(url, params);
  fetch(uri.url, uri.meta)
    .then(response => response.json())
    .then((res) => {
      if (res.error) {
        reject(res.error);
      } else {
        resolve(res.data);
      }
    })
    .catch(err => reject(err));
});

export default request;