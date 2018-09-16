let model: any = null;

const saveModel = (newModel: any) => {
  model = newModel;
};

const getModel = () => {
  return model;
};

export { saveModel, getModel };
