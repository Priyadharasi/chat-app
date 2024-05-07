/**
 * Common find method to fetch data from the db.
 * @param {*} modelName To store the table name.
 * @param {*} methodName To store the fetch method name (eg: findOne, findAll).
 * @param {*} data To store the details like query conditions, attributes.
 * @returns find query response.
 */
const getData = async (modelName, methodName, data) => {
  try {
    const Model = require('../models/')[modelName];
    let param = {};
    let includeTables = [];
    if (data) {
      if (data.include?.length) {
        data.include.forEach(item => {
          includeTables.push({
            model: require('../models')[item.tableName],
            ...item.attributes ? { attributes: item.attributes } : {},
            ...item.hasOwnProperty('required') ? { required: item.required } : {}
          });
        })
      }
      param = {
        ...{ where: data?.condition },
        ...data.attributes ? { attributes: data.attributes } : {},
        ...data?.include?.length ? { include: includeTables } : {}
      };
      if (methodName === 'findAndCountAll') {
        param = {
          ...param,
          ...{
            limit: data.limit ? data.limit : 10,
            offset: data.offset ? data.offset : 0
          }
        };
      }
    }
    const record = await Model[methodName](param);
    return record;
  } catch (error) {
    throw error;
  }
};

/**
 * Common method used to insert data.
 * @param {*} modelName To store the table name.
 * @param {*} methodName To store the fetch method name (eg: create, bulkCreate).
 * @param {*} data To store data to insert.
 * @param {*} transaction Send transaction if exists.
 * @returns create query response.
 */
const addData = async function (modelName, methodName, data, transaction = null) {
  try {
    const Model = require('../models/')[modelName];
    const record = await Model[methodName](data, { transaction });
    return record;
  } catch (error) {
    console.error(`Error while inserting data in ${modelName}:`, error);
    throw error;
  }
}

/**
 * Common method used to update data.
 * @param {*} modelName To store the table name.
 * @param {*} data To store data to update.
 * @param {*} condition To store where condition.
 * @param {*} individualHooks By default false.
 * @param {*} transaction Send transaction if exists.
 * @returns update query response.
 */
const editData = async function (modelName, data, condition, individualHooks = false, transaction = null) {
  try {
    const Model = require('../models/')[modelName];
    const record = await Model.update(data, {
      where: condition,
      individualHooks,
      transaction
    });
    return record;
  } catch (error) {
    console.error(`Error while inserting data in ${modelName}:`, error);
    throw error;
  }
}

/**
 * Common method used to delete data.
 * @param {*} modelName To store the table name.
 * @param {*} condition To store where condition.
 * @param {*} transaction Send transaction if exists.
 * @returns delete query response.
 */
const removeData = async function (modelName, condition, transaction = null) {
  try {
    const Model = require('../models/')[modelName];
    const record = await Model.destroy({
      where: condition,
      transaction
    });
    return record;
  } catch (error) {
    console.error(`Error while inserting data in ${modelName}:`, error);
    throw error;
  }
}

module.exports = {
  getData,
  addData,
  editData,
  removeData
};
