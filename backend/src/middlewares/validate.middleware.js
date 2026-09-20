export const validate = (schema, place) => {
  return (req, res, next) => {
    const requireData = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const result = schema.safeParse(requireData[place]);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.issues,
      });
    }
    req[place] = result.data;
    next();
  };
};
