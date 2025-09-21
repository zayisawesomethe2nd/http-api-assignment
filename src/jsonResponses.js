const respond = (request, response, status, data, type) => {
  let content;
  // defaults to JSON if accept header is not XML (not present)
  if (type === 'text/xml') {
    content = '<response>';
    content += `<message>${data.message}</message>`;
    if (data.id) {
      content += `<id>${data.id}</id>`;
    }
    content += '</response>';
  } else {
    content = JSON.stringify(data);
  }

  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  response.write(content);
  response.end();
};

// For a successful status code
const success = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response.',
  };

  return respond(request, response, 200, responseJSON, request.acceptedTypes[0]);
};

// For a bad request, or a "bad" request with the correct parameter
const badRequest = (request, response) => {
  const responseJSON = {
    message: 'This request has the required parameters.',
  };

  if (!request.query.valid || request.query.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true.';
    responseJSON.id = 'badRequest';
    return respond(request, response, 400, responseJSON, request.acceptedTypes[0]);
  }
  responseJSON.id = 'badRequest';
  return respond(request, response, 200, responseJSON, request.acceptedTypes[0]);
};

// For an unauthorized request, or an "unauthorized" request with the correct parameter
const unauthorized = (request, response) => {
  const responseJSON = {
    message: 'This request has the required parameters.',
  };

  if (!request.query.valid || request.query.valid !== 'true') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes.';
    responseJSON.id = 'unauthorized';
    return respond(request, response, 401, responseJSON, request.acceptedTypes[0]);
  }
  responseJSON.id = 'unauthorized';
  return respond(request, response, 200, responseJSON, request.acceptedTypes[0]);
};

// For a forbidden request
const forbidden = (request, response) => {
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  respond(request, response, 403, responseJSON, request.acceptedTypes[0]);
};

// For an internal server error!!! something is wrong!!!!!!!!!
const internal = (request, response) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  respond(request, response, 500, responseJSON, request.acceptedTypes[0]);
};

// For a page that is not yet implemented.
const notImplemented = (request, response) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  respond(request, response, 501, responseJSON, request.acceptedTypes[0]);
};

// For a 404 Page Not Found.
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respond(request, response, 404, responseJSON, request.acceptedTypes[0]);
};

// all modules being exported...
module.exports = {
  notFound,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
};
