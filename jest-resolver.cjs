module.exports = (path, options) => {
  // Handle MSW and related packages
  if (path === 'msw/node') {
    return options.defaultResolver('msw/lib/node/index.js', options);
  }
  return options.defaultResolver(path, options);
}; 