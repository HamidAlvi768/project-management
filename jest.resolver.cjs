module.exports = (request, options) => {
  return options.defaultResolver(request, {
    ...options,
    conditions: request.startsWith('msw') 
      ? ['node', 'require'] 
      : options.conditions
  });
}; 