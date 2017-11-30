
// Provide a default path to dwr.engine
if (typeof this['dwr'] == 'undefined') this.dwr = {};
if (typeof dwr['engine'] == 'undefined') dwr.engine = {};

if (typeof this['formInfoAjax'] == 'undefined') this.formInfoAjax = {};

formInfoAjax._path = '/ioop-bcs-web/dwr';

formInfoAjax.isExist = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(formInfoAjax._path, 'formInfoAjax', 'isExist', p0, p1, p2, p3, callback);
};

formInfoAjax.getFormInfoListByFormType = function(p0, p1, callback) {
  dwr.engine._execute(formInfoAjax._path, 'formInfoAjax', 'getFormInfoListByFormType', p0, p1, callback);
};

formInfoAjax.getFormFieldListByFormId = function(p0, callback) {
  dwr.engine._execute(formInfoAjax._path, 'formInfoAjax', 'getFormFieldListByFormId', p0, callback);
};

formInfoAjax.getFormElementList = function(p0, callback) {
  dwr.engine._execute(formInfoAjax._path, 'formInfoAjax', 'getFormElementList', p0, callback);
};


