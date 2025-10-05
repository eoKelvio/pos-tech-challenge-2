/**
 * @param {object} object
 * @param {string} object.method
 * @param {object} object.payload
 * @param {import('playwright-core').APIResponse} object.response
 */
async function lazylog({ method = '', payload = '', response } = {}) {
  const url = response.url();
  const status = response.status();

  console.log(`${method ? `${method} ` : ''}${url} - ${status}`);
  if (payload) {
    console.log('Payload:');
    console.dir(payload, { depth: null });
  }
  if (response.ok()) {
    const jsonResponse = await response
      .json()
      .catch((er) => /*no content*/ null);
    console.log('Response Body:');
    console.dir(jsonResponse, { depth: null });
  } else {
    const errorText = await response.text();
    console.error('Error Details:', errorText);
  }
  console.log(`----------------------------------\n`);
}

module.exports = { lazylog };
